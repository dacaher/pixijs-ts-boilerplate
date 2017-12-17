import {App, AppOptions} from "../app/app";
import {RotatingSprite} from "./rotating-sprite";

export class TestApp {
    private app: App;

    constructor() {

        /* if no view is specified, it appends canvas to body */
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "myCanvas");

        const div = document.createElement("div");
        div.appendChild(canvas);

        document.body.appendChild(div);

        const appOptions: AppOptions = {
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

        this.app = new App(appOptions);

        this.drawSquare(this.app.initialWidth / 2 - 25, this.app.initialHeight / 2 - 25);

        PIXI.loader
            .add("explorer", "assets/gfx/explorer.png")
            .add("bunny", "assets/gfx/bunny.png")
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

        this.app.stage.addChild(graphics);
    }

    public drawScreenBorder(width = 4): void {
        const halfWidth = width / 2;

        const graphics = new PIXI.Graphics();
        graphics.lineStyle(width, 0xFF00FF, 1);
        graphics.drawRect(halfWidth, halfWidth, this.app.initialWidth - width, this.app.initialHeight - width);

        this.app.stage.addChild(graphics);
    }

    private onAssetsLoaded(): void {
        this.drawRotatingExplorer();
        this.drawBunnies();
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
            // bunny.anchor.set(0.5);
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }

        // Center on the screen
        container.x = (this.app.initialWidth - container.width) - 10;
        container.y = (this.app.initialHeight - container.height) - 10;
    }
}
