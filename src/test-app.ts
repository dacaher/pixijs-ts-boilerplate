import {App, AppOptions} from "./app/app";

export class TestApp {
    private app: App;

    constructor() {
        const appOptions: AppOptions = {
            stylePosition: "absolute",
            align: "top-left",
            resize: "none",
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x222222,
        };

        // const container = document.getElementById("canvasContainer");
        // this.app = new App(appOptions, container);

        this.app = new App(appOptions);

        PIXI.loader.add("explorer", "assets/gfx/explorer.png").load(this.drawExplorer.bind(this));
    }

    public drawSquare() {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF00FF, 1);
        graphics.beginFill(0xFF00BB, 0.25);
        graphics.drawRoundedRect(this.app.width / 2 - 25, this.app.height / 2 - 25, 50, 50, 10);
        graphics.endFill();

        this.app.stage.addChild(graphics);
    }

    private drawExplorer() {
        // This creates a texture from a "explorer.png" image
        const explorer: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources.explorer.texture);

        // Setup the position of the explorer
        const maxEdge = Math.max(explorer.width, explorer.height);
        explorer.position.set(Math.ceil(maxEdge / 2), Math.ceil(maxEdge / 2));

        // Rotate around the center
        explorer.anchor.set(0.5, 0.5);

        // Add the explorer to the scene we are building
        this.app.stage.addChild(explorer);

        window.console.log(`pos(${explorer.x}, ${explorer.y}) size(${explorer.width}, ${explorer.height}) scale(${explorer.scale.x}, ${explorer.scale.y})`);

        // Listen for frame updates
        this.app.ticker.add(() => {
            // each frame we spin the explorer around a bit
            explorer.rotation += 0.02;
        });
    }
}
