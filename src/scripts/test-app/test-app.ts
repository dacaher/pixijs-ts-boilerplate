import {App, AppOptions} from "../app/app";

export class TestApp {
    private app: App;

    constructor() {
        const appOptions: AppOptions = {
            width: 1920,
            height: 1080,
            align: "top-left",
            resize: "none",
            autoResize: false,
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x222222,
        };

        // const container = document.getElementById("canvasContainer");
        // this.app = new App(appOptions, container);

        this.app = new App(appOptions);

        this.drawSquare(this.app.width / 2 - 25, this.app.height / 2 - 25);
        this.drawDebugInfo();

        PIXI.loader
            .add("explorer", "assets/gfx/explorer.png")
            .add("bunny", "assets/gfx/bunny.png")
            .load(this.onAssetsLoaded.bind(this));
    }

    public drawSquare(x = 0, y = 0, s = 50, r = 10): void {
        this.drawRectangle(x, y, s, s, r);
    }

    public drawRectangle(x = 0, y = 0, w = 50, h = 50, r = 10): void {
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
        // graphics.beginFill(0xFF00BB, 0.25);
        graphics.drawRect(halfWidth, halfWidth, this.app.width - width, this.app.height - width);
        // graphics.endFill();

        this.app.stage.addChild(graphics);
    }

    private getDimensionsText(): string {
        return `
        app original w:${this.app.width} h:${this.app.height}
        app.view w:${this.app.view.width} h:${this.app.view.height} (real px)
        clientW:${this.app.view.clientWidth} clientH:${this.app.view.clientHeight} (css px)
        app.screen w:${this.app.screen.width} h:${this.app.screen.height} (css px)
        window innerW:${window.innerWidth} innerH:${window.innerHeight} (css px)
        stage pos(${this.app.stage.x}, ${this.app.stage.y}) size(${this.app.stage.width}, ${this.app.stage.height}) scale(${this.app.stage.scale.x}, ${this.app.stage.scale.y}) (css px)
        `;
    }

    private drawDebugInfo(): void {
        const container = new PIXI.Container();
        container.x = 10;
        container.y = 10;
        this.app.stage.addChild(container);

        const style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 12,
            fontWeight: "bold",
            fill: 0xFFFFFF,
        });

        const pixiText = new PIXI.Text(this.getDimensionsText(), style);
        container.addChild(pixiText);

        this.app.ticker.add(() => {
            pixiText.text = this.getDimensionsText();
        });
    }

    private onAssetsLoaded(): void {
        this.drawRotatingExplorer();
        this.drawBunnies();
    }

    private drawRotatingExplorer(): void {
        // This creates a texture from a "explorer.png" image
        const explorer: PIXI.Sprite = new PIXI.Sprite(PIXI.loader.resources.explorer.texture);

        // Setup the position of the explorer
        const maxEdge = Math.max(explorer.width, explorer.height);
        explorer.position.set(Math.ceil(maxEdge / 2) + 5, Math.ceil(maxEdge / 2) + 5);

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

    private drawBunnies(): void {
        const container = new PIXI.Container();
        this.app.stage.addChild(container);

        // Create a 4x4 grid of bunnies
        for (let i = 0; i < 16; i++) {
            const bunny = new PIXI.Sprite(PIXI.loader.resources.bunny.texture);
            // bunny.anchor.set(0.5);
            bunny.x = (i % 4) * 40;
            bunny.y = Math.floor(i / 4) * 40;
            container.addChild(bunny);
        }

        // Center on the screen
        container.x = (this.app.width - container.width) / 2;
        container.y = (this.app.height - container.height) / 2;

        window.console.log(`container x:${container.x} y:${container.y} w:${container.width} h:${container.height}`);
    }
}
