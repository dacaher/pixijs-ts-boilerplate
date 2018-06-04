import {EventEmitter} from "eventemitter3";
import PriorityQueue from "../../basarat/typescript-collections/PriorityQueue"; // TODO relative url...
import {Asset} from "./asset";
import {LoadAsset} from "./load-asset";
import {SoundAsset} from "./sound-asset";

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
     * Generic assets load counter.
     */
    private genericAssetsCounter: number;

    /**
     * Generic assets to load.
     */
    private genericAssetsToLoad: number;

    /**
     * Sound assets load counter.
     */
    private soundAssetsCounter: number;

    /**
     * Sound assets to load.
     */
    private soundAssetsToLoad: number;

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
        this.genericAssetsCounter = 0;
        this.genericAssetsToLoad = 0;
        this.soundAssetsCounter = 0;
        this.soundAssetsToLoad = 0;
    }

    private onGenericAssetProgress(loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource): void {
        // Calculate real percentage (including sound assets)
        const realPercent = loader.progress * this.genericAssetsToLoad / Object.keys(this.assetsLoading).length;

        window.console.log(`onGenericAssetProgress: ${resource.name}`);
        window.console.log(`url: ${resource.url}`);
        window.console.log(`progress: ${realPercent}%`);

        if (resource.error) {
            window.console.log(`error: ${resource.error.message}`);
        }

        this.genericAssetsCounter--;

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
        this.loader.reset();

        const loadAssets = Object.keys(this.assetsLoading).map(key => this.assetsLoading[key]);

        loadAssets.forEach(loadAsset => {
            if ((loadAsset.asset as SoundAsset).autoplay) {
                this.loadSoundAsset(loadAsset.asset as SoundAsset);
            } else {
                this.addGenericAsset(loadAsset.asset);
            }
        });

        // Load generic assets through the loader
        this.loadGenericAssets();
    }

    private loadSoundAsset(asset: SoundAsset): void {
        // TODO impl
        // this.soundAssetsCounter++;
        // this.soundAssetsToLoad++;
    }

    private addGenericAsset(asset: Asset): void {
        this.genericAssetsCounter++;
        this.genericAssetsToLoad++;
        this.loader.add(asset.id, asset.url); // Add all assets to the loader
    }

    private loadGenericAssets(): void {
        if (this.genericAssetsCounter > 0) {
            this.loader.load(this.onGenericAssetsLoaded.bind(this));
        }
    }

    private onGenericAssetsLoaded(): void {
        this.checkAllAssetsLoaded();
    }

    private checkAllAssetsLoaded(): void {
        if (this.genericAssetsCounter + this.soundAssetsCounter <= 0) {
            // Notify priority group loaded
            this.emit(PixiAssetsLoader.PRIORITY_GROUP_LOADED, {
                priority: this.currentPriorityLoading,
                assets: this.assetsLoading,
            });

            // Load next priority group
            this.loadNextPriorityGroup();
        }
    }
}
