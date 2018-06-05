import {EventEmitter} from "eventemitter3";
import PriorityQueue from "../../basarat/typescript-collections/PriorityQueue"; // TODO relative url and avoid merging all collections!? ...

export interface Asset {
    id: string;
    url: string;
    priority: number;
    type?: any;
}

export interface SoundAsset extends Asset {
    autoplay: boolean;
    loop?: boolean;
    volume?: number;
    mute?: boolean;
    rate?: number;
    html5?: boolean;
    howl?: Howl;
}

export interface LoadAsset {
    asset: Asset;
    loaded: boolean;
    error: Error | null;
}

export class PixiAssetsLoader extends EventEmitter {

    /**
     * Event fired when an asset has been loaded.
     * @type {string}
     */
    public static readonly ASSET_LOADED: string = "AssetsLoader.ASSET_LOADED";

    /**
     * Event fired when an assets throws an error on load.
     * @type {string}
     */
    public static readonly ASSET_ERROR: string = "AssetsLoader.ASSET_ERROR";

    /**
     * Event fired when a group of assets of same priority have been loaded (with or without errors).
     * @type {string}
     */
    public static readonly PRIORITY_GROUP_LOADED: string = "AssetsLoader.PRIORITY_GROUP_LOADED";

    /**
     * Event fired with the progress on a group of assets of same priority.
     * @type {string}
     */
    public static readonly PRIORITY_GROUP_PROGRESS: string = "AssetsLoader.PRIORITY_GROUP_PROGRESS";

    /**
     * Event fired when all queued assets have been loaded (with or without errors).
     * @type {string}
     */
    public static readonly ALL_ASSETS_LOADED: string = "AssetsLoader.ALL_ASSETS_LOADED";

    /**
     * Multi-purpose loader used to load everything except sounds.
     */
    private loader: PIXI.loaders.Loader;

    /**
     * Prioritized assets queue to be loaded.
     */
    private assetsQueue: PriorityQueue<Asset>;

    /**
     * Next group of assets to load.
     */
    private assetsLoading: { [key: string]: LoadAsset };

    /**
     * Current priority of the assets being loaded.
     */
    private currentPriorityLoading: number | null;

    /**
     * Generic assets to load.
     */
    private genericAssetsToLoad: number;

    /**
     * Generic assets to load remaining.
     */
    private genericAssetsRemaining: number;

    /**
     * Sound assets to load.
     */
    private soundAssetsToLoad: number;

    /**
     * Sound assets to load remaining.
     */
    private soundAssetsRemaining: number;

    /**
     * Total progress percentage.
     */
    private loadPercent: number;

    constructor() {
        super();

        this.loader = PIXI.loader;
        this.loader.onProgress.add(this.onGenericAssetProgress.bind(this)); // called once per loaded/errored file
        this.loader.onError.add(this.onGenericAssetError.bind(this)); // called once per errored file
        this.loader.onLoad.add(this.onGenericAssetLoad.bind(this)); // called once per loaded file

        this.assetsQueue = new PriorityQueue<Asset>((a, b) => a.priority - b.priority);

        this.initLoadingQueue();
    }

    /**
     * Determines if there is sth loading right now.
     * @returns {boolean}
     */
    public isLoading(): boolean {
        return Object.keys(this.assetsLoading).length > 0;
    }

    /**
     * Add provided asset to the asset queue.
     * @param {Asset} asset
     */
    public addAsset(asset: Asset): void {
        this.assetsQueue.enqueue(asset);
    }

    /**
     * Adds provided assets to the asset queue.
     * @param {[Asset]} assets
     */
    public addAssets(assets: Asset[]): void {
        assets.forEach(asset => this.addAsset(asset));
    }

    /**
     * Loads all assets on the asset queue batching them by priority.
     */
    public load(): void {
        if (!this.isLoading()) {
            this.loadNextPriorityGroup();
        }
    }

    private initLoadingQueue(): void {
        this.assetsLoading = {};
        this.currentPriorityLoading = null;
        this.genericAssetsRemaining = 0;
        this.genericAssetsToLoad = 0;
        this.soundAssetsRemaining = 0;
        this.soundAssetsToLoad = 0;
        this.loadPercent = 0;
    }

    private onGenericAssetProgress(loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource): void {
        this.genericAssetsRemaining--;

        // Calculate real percentage (including sound assets)
        const realPercent = loader.progress * this.genericAssetsToLoad / Object.keys(this.assetsLoading).length;
        this.loadPercent += realPercent;

        window.console.log(`onGenericAssetProgress: ${resource.name}`);
        window.console.log(`url: ${resource.url}`);
        window.console.log(`inner progress: ${loader.progress}%`);
        window.console.log(`real progress: ${this.loadPercent}%`);

        if (resource.error) {
            window.console.log(`error: ${resource.error.message}`);
        }

        this.emit(PixiAssetsLoader.PRIORITY_GROUP_PROGRESS, {
            priority: this.currentPriorityLoading,
            progress: realPercent,
        });
    }

    private onGenericAssetError(error: Error, loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource): void {
        window.console.log(`onGenericAssetError: ${resource.name}`);
        window.console.log(`error: ${error.message}`);

        const loadAsset = this.assetsLoading[resource.name];

        // Some generic resources add other resources to load we don't know about
        if (loadAsset) {
            loadAsset.loaded = false;
            loadAsset.error = error; // resource.error holds the error too

            this.emit(PixiAssetsLoader.ASSET_ERROR, loadAsset);
        }
    }

    private onGenericAssetLoad(loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource): void {
        window.console.log(`onGenericAssetLoad: ${resource.name}`);

        const loadAsset = this.assetsLoading[resource.name];

        // Some generic resources add other resources to load we don't know about
        if (loadAsset) {
            loadAsset.loaded = true;
            loadAsset.error = null;

            this.emit(PixiAssetsLoader.ASSET_LOADED, loadAsset);
        }
    }

    private onSoundAssetProgress(): void {
        this.soundAssetsRemaining--;

        // Calculate real percentage (including generic assets)
        const innerPercent = (this.soundAssetsToLoad - this.soundAssetsRemaining) * 100 / this.soundAssetsToLoad;
        const realPercent =  innerPercent * this.soundAssetsToLoad / Object.keys(this.assetsLoading).length;

        this.loadPercent += realPercent;

        window.console.log(`onSoundAssetProgress: progress ${innerPercent}% - real progress: ${this.loadPercent}%`);

        this.emit(PixiAssetsLoader.PRIORITY_GROUP_PROGRESS, {
            priority: this.currentPriorityLoading,
            progress: realPercent,
        });
    }

    private onSoundAssetError(asset: Asset, error: Error): void {
        window.console.log(`onSoundAssetError: ${asset.id} error: ${error.message}`);

        this.onSoundAssetProgress();

        const loadAsset = this.assetsLoading[asset.id];
        if (loadAsset) {
            loadAsset.loaded = false;
            loadAsset.error = error instanceof Error ? error : new Error(`Error loading sound ${asset.id}`);

            this.emit(PixiAssetsLoader.ASSET_ERROR, loadAsset);
        }
    }

    private onSoundAssetLoad(asset: Asset): void {
        window.console.log(`onSoundAssetLoad: ${asset.id}`);

        this.onSoundAssetProgress();

        const loadAsset = this.assetsLoading[asset.id];
        if (loadAsset) {
            loadAsset.loaded = true;
            loadAsset.error = null;

            this.emit(PixiAssetsLoader.ASSET_LOADED, loadAsset);
        }
    }

    /**
     * Loads all assets with next prioriy on the queue.
     */
    private loadNextPriorityGroup(): void {
        this.initLoadingQueue();

        const asset = this.assetsQueue.peek();

        if (asset) {
            this.currentPriorityLoading = asset.priority;
            this.loadPriorityGroup();
        } else {
            // No more assets in the queue, we are done.
            this.emit(PixiAssetsLoader.ALL_ASSETS_LOADED);
        }
    }

    /**
     * Add all assets with same priority to the loading list and start loading them.
     */
    private loadPriorityGroup(): void {
        while (this.assetsQueue.peek() && this.assetsQueue.peek()!.priority === this.currentPriorityLoading) {
            const asset = this.assetsQueue.dequeue()!;

            this.assetsLoading[asset.id] = {
                asset,
                loaded: false,
                error: null,
            };
        }

        this.startLoadingAssets();
    }

    private startLoadingAssets(): void {
        // this.loader.reset();

        const loadAssets = Object.keys(this.assetsLoading).map(key => this.assetsLoading[key]);

        loadAssets.forEach(loadAsset => {
            if ((loadAsset.asset as SoundAsset).autoplay !== undefined) {
                this.loadSoundAsset(loadAsset.asset as SoundAsset);
            } else {
                this.addGenericAsset(loadAsset.asset);
            }
        });

        // Load generic assets through the loader
        this.loadGenericAssets();
    }

    private loadSoundAsset(asset: SoundAsset): void {
        this.soundAssetsRemaining++;
        this.soundAssetsToLoad++;

        asset.howl = new Howl({
            src: [asset.url],
            autoplay: asset.autoplay,
            loop: asset.loop || false,
            volume: asset.volume || 1,
            mute: asset.mute || false,
            rate: asset.rate || 1,
            html5: asset.html5 || false,
            onload: this.onSoundAssetLoad.bind(this, asset),
            onloaderror: (soundId: number, error: any) => {
                const loadError = error instanceof Error ? error : new Error(`Error loading sound ${asset.id}`);
                this.onSoundAssetError(asset, loadError);
            },

        });
    }

    private addGenericAsset(asset: Asset): void {
        this.genericAssetsRemaining++;
        this.genericAssetsToLoad++;
        this.loader.add(asset.id, asset.url); // Add all assets to the loader
    }

    private loadGenericAssets(): void {
        if (this.genericAssetsRemaining > 0) {
            this.loader.load(this.checkAllAssetsLoaded.bind(this));
        }
    }

    private checkAllAssetsLoaded(): void {
        if (this.genericAssetsRemaining + this.soundAssetsRemaining <= 0) {
            // Notify priority group loaded
            this.emit(PixiAssetsLoader.PRIORITY_GROUP_LOADED, {
                priority: this.currentPriorityLoading,
                assets: Object.keys(this.assetsLoading).map(key => this.assetsLoading[key]),
            });

            // Load next priority group
            this.loadNextPriorityGroup();
        }
    }
}
