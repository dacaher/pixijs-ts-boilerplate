import {RotatingSprite} from "app/rotating-sprite";
import {PixiApp, PixiAppOptions} from "vendor/dacaher/pixi-app/pixi-app";
import {Dom} from "vendor/dacaher/pixi-app/util/dom";
import "vendor/pixijs/pixi-layers/pixi-layers";
import "vendor/pixijs/pixi-particles/pixi-particles";
import "vendor/pixijs/pixi-spine/pixi-spine";

/**
 * Showcase for PixiApp class.
 */
export class SampleApp {
    private app: PixiApp;

    constructor() {

        const canvas = Dom.getElementOrCreateNew<HTMLCanvasElement>("app-canvas", "canvas", document.getElementById("app-root"));

        // if no view is specified, it appends canvas to body
        const appOptions: PixiAppOptions = {
            width: 1280,
            height: 720,
            scale: "full-size",
            align: "top-left",
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x000000,
            view: canvas,
            showFPS: true,
            showMediaInfo: true,
        };

        this.app = new PixiApp(appOptions);

        this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);
        this.addFullscreenText(this.app.initialWidth / 2, this.app.initialHeight / 2 - 50);

        PIXI.loader
            .add("explorer", "assets/gfx/explorer.png")
            .add("bunny", "assets/gfx/bunny.png")
            .add("bubble", "assets/gfx/Bubbles99.png")
            .add("spineboy", "assets/gfx/spineboy.json")
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
            PixiApp.toggleFulscreen(document.getElementById("app-root"));
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

    private addFullscreenText(x: number, y: number): void {
        const style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 18,
            fill: "#FFFFFF",
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const richText = new PIXI.Text("Click on the square to toggle fullscreen!", style);
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
    }

    private drawBunnies(): void {
        const container = new PIXI.Container();
        this.app.stage.addChild(container);

        // Create a 5x5 grid of bunnies
        for (let i = 0; i < 25; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }

        container.x = (this.app.initialWidth - container.width) - 10;
        container.y = (this.app.initialHeight - container.height) - 10;
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

        const emitter = new PIXI.particles.Emitter(particlesContainer, PIXI.loader.resources.bubble.texture, {
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
            emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };

        // Start emitting
        emitter.emit = true;

        // Start the update
        // update();
        this.app.ticker.add(update);
    }

    private drawSpineBoyAnim() {
        // create a spine boy
        const spineBoy = new PIXI.spine.Spine(PIXI.loader.resources.spineboy.spineData);

        spineBoy.scale.set(0.5);

        // set the position
        spineBoy.x = this.app.initialWidth * 0.5;
        spineBoy.y = this.app.initialHeight;

        // set up the mixes!
        spineBoy.stateData.setMix("walk", "jump", 0.2);
        spineBoy.stateData.setMix("jump", "walk", 0.4);

        // play animation
        spineBoy.state.setAnimation(0, "walk", true);

        spineBoy.interactive = true;

        spineBoy.on("pointerdown", () => {
            spineBoy.state.setAnimation(0, "jump", false);
            spineBoy.state.addAnimation(0, "walk", true, 0);
        });

        this.app.stage.addChild(spineBoy);
    }
}
