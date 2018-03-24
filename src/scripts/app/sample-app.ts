import {RotatingSprite} from "app/rotating-sprite";
import {TweenLite} from "gsap";
import "howler";
import {
    Dom,
    PixiAppWrapper as Wrapper,
    pixiAppWrapperEvent as WrapperEvent,
    PixiAppWrapperOptions as WrapperOpts,
} from "pixi-app-wrapper";
import {
    AsciiFilter,
    CRTFilter,
    GlowFilter,
    OldFilmFilter,
    OutlineFilter,
    ShockwaveFilter,
} from "pixi-filters";
import "pixi-layers";
import "pixi-particles";
import "pixi-spine";

/**
 * Showcase for PixiAppWrapper class.
 */
export class SampleApp {
    private app: Wrapper;
    private particlesEmitter: PIXI.particles.Emitter;
    private spineBoy: PIXI.spine.Spine;

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
            width: 1280,
            height: 720,
            scale: "keep-aspect-ratio",
            align: "middle",
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x000000,
            view: canvas,
            showFPS: true,
            showMediaInfo: true,
        };

        this.app = new Wrapper(appOptions);
        this.app.on(WrapperEvent.RESIZE_START, this.onResizeStart.bind(this));
        this.app.on(WrapperEvent.RESIZE_END, this.onResizeEnd.bind(this));

        this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);
        this.addFullscreenText(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);

        PIXI.loader
            .add("explorer", "assets/gfx/explorer.png")
            .add("bunny", "assets/gfx/bunny.png")
            .add("bubble", "assets/gfx/Bubbles99.png")
            .add("spineboy", "assets/gfx/spineboy.json")
            .add("play", "assets/gfx/play.png")
            .add("stop", "assets/gfx/stop.png")
            .load(this.onAssetsLoaded.bind(this));
    }

    public drawSquare(x = 0, y = 0, s = 50, r = 10): void {
        this.drawRoundedRectangle(x, y, s, s, r);
    }

    public drawRoundedRectangle(x = 0, y = 0, w = 50, h = 50, r = 10): void {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0xFF00BB, 0.25);
        graphics.drawRoundedRect(x, y, w, h, r);
        graphics.endFill();

        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.on("pointerup", () => {
            // pointerdown does not trigger a user event in chrome-android
            Wrapper.toggleFulscreen(document.getElementById("app-root"));
        });

        this.app.stage.addChild(graphics);
    }

    public drawScreenBorder(width = 4): void {
        const halfWidth = width / 2;

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(width, 0xFF00FF, 1);
        graphics.drawRect(halfWidth, halfWidth, this.app.initialWidth - width, this.app.initialHeight - width);

        this.app.stage.addChild(graphics);
    }

    private onResizeStart(): void {
        window.console.log("RESIZE STARTED!");
        this.stopEmittingParticles();

        if (this.spineBoy) {
            this.spineBoy.visible = false;
        }
    }

    private onResizeEnd(args: any): void {
        window.console.log("RESIZE ENDED!", args);
        this.startEmittingParticles();

        if (this.spineBoy) {
            this.spineBoy.visible = true;
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
        const richText = new PIXI.Text("Click on the square to toggle fullscreen!", this.textStyle);
        richText.anchor.set(0.5, 0.5);
        richText.x = x;
        richText.y = y;

        this.app.stage.addChild(richText);

    }

    private onAssetsLoaded(): void {
        this.drawRotatingExplorer();
        this.drawBunnies();
        this.drawLayeredBunnies();
        this.drawParticles();
        this.drawSpineBoyAnim();
        this.drawPlayMusic();
    }

    private drawRotatingExplorer(): void {
        // This creates a texture from a "explorer.png" image
        const explorer: RotatingSprite = new RotatingSprite(PIXI.loader.resources.explorer.texture);

        // Setup the position of the explorer
        const maxEdge = Math.max(explorer.width, explorer.height);
        explorer.position.set(Math.ceil(maxEdge / 2) + 10, Math.ceil(maxEdge / 2) + 10);

        // Rotate around the center
        explorer.anchor.set(0.5, 0.5);

        explorer.interactive = true;
        explorer.buttonMode = true;
        explorer.rotationVelocity = 0.02;

        explorer.on("pointerdown", () => {
            explorer.rotationVelocity *= -1;
        });

        // Add the explorer to the scene we are building
        this.app.stage.addChild(explorer);

        // Listen for frame updates
        this.app.ticker.add(() => {
            // each frame we spin the explorer around a bit
            explorer.rotation += explorer.rotationVelocity;
        });

        TweenLite.to(explorer, 2, {y: this.app.initialHeight / 2});
    }

    private drawBunnies(): void {
        const container = new PIXI.Container();
        this.app.stage.addChild(container);

        const text = new PIXI.Text("Click us!", this.textStyle);
        text.anchor.set(0.5, 0.5);
        container.addChild(text);

        const bunniesContainer = new PIXI.Container();
        bunniesContainer.position.set(0, text.height + 5);
        bunniesContainer.interactive = true;
        bunniesContainer.buttonMode = true;
        bunniesContainer.on("pointerdown", () => {
            const index = Math.round(Math.random() * (filters.length - 1));
            const randomFilter = filters[index];
            bunniesContainer.filters = [randomFilter];
        });
        container.addChild(bunniesContainer);

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            bunniesContainer.addChild(bunny);
        }

        text.position.set(bunniesContainer.width / 2, 0);

        container.x = this.app.initialWidth - container.width - 10;
        container.y = this.app.initialHeight - container.height;

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

        const container = new PIXI.Container();
        this.app.stage.addChild(container);
        container.parentLayer = layer;

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            bunny.x = (i % 5) * 20;
            bunny.y = Math.floor(i / 5) * 20;
            container.addChild(bunny);

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

        container.x = (this.app.initialWidth - container.width) - 10;
        container.y = 10;
    }

    private drawParticles(): void {
        const particlesContainer = new PIXI.particles.ParticleContainer();
        particlesContainer.position.set(this.app.initialWidth * 0.75, this.app.initialHeight * 0.5);
        this.app.stage.addChild(particlesContainer);

        this.particlesEmitter = new PIXI.particles.Emitter(particlesContainer, PIXI.loader.resources.bubble.texture, {
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

    private drawSpineBoyAnim() {
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

    private drawPlayMusic() {
        const sound = new Howl({
            src: ["assets/sfx/sound1.mp3"],
        });
        sound.on("end", () => {
            playButton.visible = true;
            stopButton.visible = false;
        });

        const container = new PIXI.Container();

        const playButton = new PIXI.Sprite(PIXI.loader.resources.play.texture);
        playButton.scale.set(0.75, 0.75);
        playButton.interactive = true;
        playButton.buttonMode = true;
        playButton.on("pointerup", () => {
            sound.play();
            playButton.visible = false;
            stopButton.visible = true;
        });

        const stopButton = new PIXI.Sprite(PIXI.loader.resources.stop.texture);
        stopButton.scale.set(0.75, 0.75);
        stopButton.interactive = true;
        stopButton.buttonMode = true;
        stopButton.visible = false;

        stopButton.on("pointerup", () => {
            sound.stop();
            stopButton.visible = false;
            playButton.visible = true;
        });

        const text = new PIXI.Text("Click to play music!", this.textStyle);
        text.position.set(playButton.width + 10, playButton.height / 2 - text.height / 2);

        container.addChild(playButton);
        container.addChild(stopButton);
        container.addChild(text);

        container.position.set(this.app.initialWidth / 2 - container.width / 2, this.app.initialHeight * 0.1);

        this.app.stage.addChild(container);
    }
}
