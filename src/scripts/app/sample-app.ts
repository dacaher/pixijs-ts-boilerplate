import {RotatingSprite} from "app/rotating-sprite";
import {TweenLite} from "gsap";
import "howler";
import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import {PixiAssetsLoader} from "pixi-assets-loader";
import {
    AsciiFilter,
    CRTFilter,
    GlowFilter,
    OldFilmFilter,
    OutlineFilter,
    ShockwaveFilter,
} from "pixi-filters";
import "pixi-particles";
import "pixi-spine";
import {AssetPriority} from "vendor/dacaher/pixi-assets-loader/asset-priority";

/**
 * Showcase for PixiAppWrapper class.
 */
export class SampleApp {
    private app: Wrapper;

    private screenBorder: PIXI.Graphics;
    private fullScreenButton: PIXI.Container;
    private fullScreenText: PIXI.Text;
    private explorer: RotatingSprite;
    private filteredBunnies: PIXI.Container;
    private layeredBunnies: PIXI.Container;
    private particlesContainer: PIXI.particles.ParticleContainer;
    private playMusicContainer: PIXI.Container;
    private spineBoy: PIXI.spine.Spine;

    private particlesEmitter: PIXI.particles.Emitter;
    private sound: Howl;

    private assetsLoaded: boolean;

    private loader: PixiAssetsLoader;

    private textStyle = new PIXI.TextStyle({
        fontFamily: "Verdana",
        fontSize: 18,
        fill: "#FFFFFF",
        wordWrap: true,
        wordWrapWidth: 440,
    });

    constructor() {
        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>("app-canvas", "canvas", document.getElementById("app-root"));

        // if no view is specified, it appends canvas to body
        const appOptions: WrapperOpts = {
            width: 1920,
            height: 1080,
            scale: "keep-aspect-ratio",
            align: "middle",
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x000000,
            view: canvas,
            showFPS: true,
            showMediaInfo: true,
            changeOrientation: true,
        };

        this.app = new Wrapper(appOptions);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        this.createViews(); // Draw views that can be already drawn

        this.assetsLoaded = false;

        this.loader = new PixiAssetsLoader();
        this.loader.on(PixiAssetsLoader.PRIORITY_GROUP_LOADED, this.onAssetsLoaded.bind(this));
        this.loader.on(PixiAssetsLoader.PRIORITY_GROUP_PROGRESS, this.onAssetsProgress.bind(this));
        this.loader.on(PixiAssetsLoader.ASSET_ERROR, this.onAssetsError.bind(this));

        this.loader.addAssets([
            {id: "stop", url: "assets/gfx/stop.png", priority: AssetPriority.LOW},
            {id: "explorer", url: "assets/gfx/explorer.png", priority: AssetPriority.LOWEST},
            {id: "bunny", url: "assets/gfx/bunnyy.png", priority: AssetPriority.HIGH},
            {id: "spineboy", url: "assets/gfx/spineboy.atlas", priority: AssetPriority.HIGHEST},
            {id: "spineboy", url: "assets/gfx/spineboy.json", priority: AssetPriority.HIGHEST},
            {id: "bubble", url: "assets/gfx/Bubbles99.png", priority: AssetPriority.NORMAL},
            {id: "play", url: "assets/gfx/play.png", priority: AssetPriority.LOW},
        ]);

        this.loader.load();

        /*
        PIXI.loader
            .add("explorer", "assets/gfx/explorer.png")
            .add("bunny", "assets/gfx/bunny.png")
            .add("bubble", "assets/gfx/Bubbles99.png")
            .add("spineboy", "assets/gfx/spineboy.json")
            .add("play", "assets/gfx/play.png")
            .add("stop", "assets/gfx/stop.png")
            .load(this.onAssetsLoaded.bind(this));
        */
    }

    public drawSquare(x = 0, y = 0, s = 50, r = 10): void {
        this.drawRoundedRectangle(x, y, s, s, r);
    }

    public drawRoundedRectangle(x = 0, y = 0, w = 50, h = 50, r = 10): void {
        this.fullScreenButton = new PIXI.Container();

        const button = new PIXI.Graphics();
        button.lineStyle(2, 0xFF00FF, 1);
        button.beginFill(0xFF00BB, 0.25);
        button.drawRoundedRect(0, 0, w, h, r);
        button.endFill();

        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerup", () => {
            // pointerdown does not trigger a user event in chrome-android
            Wrapper.toggleFulscreen(document.getElementById("app-root"));
        });

        this.fullScreenButton.addChild(button);
        this.fullScreenButton.position.set(x, y);

        this.app.stage.addChild(this.fullScreenButton);
    }

    private onAssetsLoaded(args: any): void {
        window.console.log(`[SAMPLE APP] onAssetsLoaded ${JSON.stringify(args)}`);
        this.assetsLoaded = true;
        this.createViewsByPriority(args.priority);
    }

    private onAssetsProgress(args: any): void {
        window.console.log(`[SAMPLE APP] onAssetsProgress ${JSON.stringify(args)}`);
    }

    private onAssetsError(args: any): void {
        window.console.log(`[SAMPLE APP] onAssetsError ${JSON.stringify(args)}`);
        window.console.log(`[SAMPLE APP] onAssetsError ${args.error.message}`);
    }

    private drawScreenBorder(width = 4): void {
        const halfWidth = width / 2;

        this.screenBorder = new PIXI.Graphics();
        this.screenBorder.lineStyle(width, 0xFF00FF, 1);
        this.screenBorder.drawRect(halfWidth, halfWidth, this.app.initialWidth - width, this.app.initialHeight - width);

        this.app.stage.addChild(this.screenBorder);

        window.console.log(this.screenBorder.width, this.screenBorder.height);
    }

    private onResizeStart(): void {
        window.console.log("RESIZE STARTED!");
    }

    private onResizeEnd(args: any): void {
        window.console.log("RESIZE ENDED!", args);

        if (args.stage.orientation.changed && this.assetsLoaded) {
            this.relocateViews();
        }
    }

    private stopEmittingParticles(): void {
        if (this.particlesEmitter) {
            this.particlesEmitter.emit = false;
            this.particlesEmitter.cleanup();
        }
    }

    private startEmittingParticles(): void {
        if (this.particlesEmitter) {
            this.particlesEmitter.emit = true;
        }
    }

    private addFullscreenText(x: number, y: number): void {
        this.fullScreenText = new PIXI.Text("Click on the square to toggle fullscreen!", this.textStyle);
        this.fullScreenText.anchor.set(0.5, 0.5);
        this.fullScreenText.x = x;
        this.fullScreenText.y = y;

        this.app.stage.addChild(this.fullScreenText);
    }

    private createViews(): void {
        this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);
        this.addFullscreenText(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);
        this.drawScreenBorder();

        /*
        this.drawRotatingExplorer();
        this.drawBunnies();
        this.drawLayeredBunnies();
        this.drawParticles();
        this.drawSpineBoyAnim();
        this.drawPlayMusic();
        */
    }

    private createViewsByPriority(priority: number): void {
        switch (priority) {
            case AssetPriority.HIGHEST:
                this.drawSpineBoyAnim();
                break;

            case AssetPriority.HIGH:
                this.drawBunnies();
                this.drawLayeredBunnies();
                break;

            case AssetPriority.NORMAL:
                this.drawParticles();
                break;

            case AssetPriority.LOW:
                this.drawPlayMusic();
                break;

            case AssetPriority.LOWEST:
                this.drawRotatingExplorer();
                break;

            default:
                break;
        }
    }

    private removeViews(): void {
        this.app.stage.removeChildren();
    }

    private drawRotatingExplorer(): void {
        // This creates a texture from a "explorer.png" image
        this.explorer = new RotatingSprite(PIXI.loader.resources.explorer.texture);

        // Setup the position of the explorer
        const maxEdge = Math.max(this.explorer.width, this.explorer.height);
        this.explorer.position.set(Math.ceil(maxEdge / 2) + 10, Math.ceil(maxEdge / 2) + 10);

        // Rotate around the center
        this.explorer.anchor.set(0.5, 0.5);

        this.explorer.interactive = true;
        this.explorer.buttonMode = true;
        this.explorer.rotationVelocity = 0.02;

        this.explorer.on("pointerdown", () => {
            this.explorer.rotationVelocity *= -1;
        });

        // Add the explorer to the scene we are building
        this.app.stage.addChild(this.explorer);

        // Listen for frame updates
        this.app.ticker.add(() => {
            // each frame we spin the explorer around a bit
            this.explorer.rotation += this.explorer.rotationVelocity;
        });

        TweenLite.to(this.explorer, 2, {y: this.app.initialHeight / 2});
    }

    private drawBunnies(): void {
        this.filteredBunnies = new PIXI.Container();
        this.app.stage.addChild(this.filteredBunnies);

        const text = new PIXI.Text("Click us!", this.textStyle);
        text.anchor.set(0.5, 0.5);
        this.filteredBunnies.addChild(text);

        const bunniesContainer = new PIXI.Container();
        bunniesContainer.position.set(0, text.height + 5);
        bunniesContainer.interactive = true;
        bunniesContainer.buttonMode = true;
        bunniesContainer.on("pointerdown", () => {
            const index = Math.round(Math.random() * (filters.length - 1));
            const randomFilter = filters[index];
            bunniesContainer.filters = [randomFilter];
        });
        this.filteredBunnies.addChild(bunniesContainer);

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            bunniesContainer.addChild(bunny);
        }

        text.position.set(bunniesContainer.width / 2, 0);

        this.filteredBunnies.x = this.app.initialWidth - this.filteredBunnies.width - 10;
        this.filteredBunnies.y = this.app.initialHeight - this.filteredBunnies.height;

        // Filters
        const filters = [
            new AsciiFilter(),
            new CRTFilter(),
            new GlowFilter(),
            new OldFilmFilter(),
            new ShockwaveFilter(new PIXI.Point(bunniesContainer.width / 2, bunniesContainer.height / 2)),
            new OutlineFilter(1, 0xFF0000),
        ];
    }

    private drawLayeredBunnies(): void {
        const layer = new PIXI.display.Layer();
        layer.group.enableSort = true;
        this.app.stage.addChild(layer);

        this.layeredBunnies = new PIXI.Container();
        this.app.stage.addChild(this.layeredBunnies);
        this.layeredBunnies.parentLayer = layer;

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            bunny.x = (i % 5) * 20;
            bunny.y = Math.floor(i / 5) * 20;
            this.layeredBunnies.addChild(bunny);

            bunny.parentLayer = layer;

            if (i % 2 === 0) {
                bunny.tint = 0x999999;
                bunny.zIndex = 0;
                // bunny.zOrder = 1;
            } else {
                bunny.zIndex = 1;
                // bunny.zOrder = 0;
            }
        }

        this.layeredBunnies.x = (this.app.initialWidth - this.layeredBunnies.width) - 10;
        this.layeredBunnies.y = 10;
    }

    private drawParticles(): void {
        this.particlesContainer = new PIXI.particles.ParticleContainer();
        this.particlesContainer.position.set(this.app.initialWidth * 0.75, this.app.initialHeight * 0.5);
        this.app.stage.addChild(this.particlesContainer);

        this.particlesEmitter = new PIXI.particles.Emitter(this.particlesContainer, PIXI.loader.resources.bubble.texture, {
            alpha: {
                start: 0.8,
                end: 0.1,
            },
            scale: {
                start: 1,
                end: 0.3,
            },
            color: {
                start: "ffffff",
                end: "0000ff",
            },
            speed: {
                start: 200,
                end: 100,
            },
            startRotation: {
                min: 0,
                max: 360,
            },
            rotationSpeed: {
                min: 0,
                max: 0,
            },
            lifetime: {
                min: 0.5,
                max: 2,
            },
            frequency: 0.1,
            emitterLifetime: -1,
            maxParticles: 1000,
            pos: {
                x: 0,
                y: 0,
            },
            addAtBack: false,
            spawnType: "circle",
            spawnCircle: {
                x: 0,
                y: 0,
                r: 10,
            },
            emit: false,
            autoUpdate: true,
        });

        // Calculate the current time
        let elapsed = Date.now();

        // Update function every frame
        const update = () => {

            // Update the next frame
            // requestAnimationFrame(update);

            const now = Date.now();

            // The emitter requires the elapsed
            // number of seconds since the last update
            this.particlesEmitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };

        // Start emitting
        this.startEmittingParticles();

        // Start the update
        // update();
        this.app.ticker.add(update);
    }

    private drawSpineBoyAnim(): void {
        // create a spine boy
        this.spineBoy = new PIXI.spine.Spine(PIXI.loader.resources.spineboy.spineData);

        this.spineBoy.scale.set(0.5);

        // set the position
        this.spineBoy.x = this.app.initialWidth * 0.5;
        this.spineBoy.y = this.app.initialHeight;

        // set up the mixes!
        this.spineBoy.stateData.setMix("walk", "jump", 0.2);
        this.spineBoy.stateData.setMix("jump", "walk", 0.4);

        // play animation
        this.spineBoy.state.setAnimation(0, "walk", true);

        this.spineBoy.interactive = true;
        this.spineBoy.buttonMode = true;

        this.spineBoy.on("pointerdown", () => {
            this.spineBoy.state.setAnimation(0, "jump", false);
            this.spineBoy.state.addAnimation(0, "walk", true, 0);
        });

        this.app.stage.addChild(this.spineBoy);
    }

    private drawPlayMusic(): void {
        if (!this.sound) {
            this.sound = new Howl({
                src: ["assets/sfx/sound1.mp3"],
            });
        }

        this.sound.on("end", () => {
            playButton.visible = true;
            stopButton.visible = false;
        });

        this.playMusicContainer = new PIXI.Container();

        const playButton = new PIXI.Sprite(PIXI.loader.resources.play.texture);
        playButton.scale.set(0.75, 0.75);
        playButton.interactive = true;
        playButton.buttonMode = true;
        playButton.on("pointerup", () => {
            this.sound.play();
            playButton.visible = false;
            stopButton.visible = true;
        });

        const stopButton = new PIXI.Sprite(PIXI.loader.resources.stop.texture);
        stopButton.scale.set(0.75, 0.75);
        stopButton.interactive = true;
        stopButton.buttonMode = true;
        stopButton.visible = false;

        stopButton.on("pointerup", () => {
            this.sound.stop();
            stopButton.visible = false;
            playButton.visible = true;
        });

        const text = new PIXI.Text("Click to play music!", this.textStyle);
        text.position.set(playButton.width + 10, playButton.height / 2 - text.height / 2);

        this.playMusicContainer.addChild(playButton);
        this.playMusicContainer.addChild(stopButton);
        this.playMusicContainer.addChild(text);

        this.playMusicContainer.position.set(this.app.initialWidth / 2 - this.playMusicContainer.width / 2, this.app.initialHeight * 0.1);

        this.app.stage.addChild(this.playMusicContainer);
    }

    private relocateViews(): void {
        /*
        this.screenBorder.width = this.app.initialWidth - 2;
        this.screenBorder.height = this.app.initialHeight - 2;
        window.console.log(this.screenBorder.width, this.screenBorder.height);
        */
        this.app.stage.removeChild(this.screenBorder);
        this.drawScreenBorder();

        this.fullScreenButton.position.set(this.app.initialWidth / 2 - this.fullScreenButton.width / 2, this.app.initialHeight / 2 - this.fullScreenButton.height / 2);
        this.fullScreenText.position.set(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);
        this.filteredBunnies.position.set(this.app.initialWidth - this.filteredBunnies.width - 10, this.app.initialHeight - this.filteredBunnies.height);
        this.layeredBunnies.position.set((this.app.initialWidth - this.layeredBunnies.width) - 10, 10);
        this.particlesContainer.position.set(this.app.initialWidth * 0.75, this.app.initialHeight * 0.5);
        this.spineBoy.position.set(this.app.initialWidth * 0.5, this.app.initialHeight);
        this.playMusicContainer.position.set(this.app.initialWidth / 2 - this.playMusicContainer.width / 2, this.app.initialHeight * 0.1);

        TweenLite.killTweensOf(this.explorer, true);
        const maxEdge = Math.max(this.explorer.width, this.explorer.height);
        this.explorer.position.set(Math.ceil(maxEdge / 2) + 10, Math.ceil(maxEdge / 2) + 10);
        TweenLite.to(this.explorer, 2, {y: this.app.initialHeight / 2});
    }
}
