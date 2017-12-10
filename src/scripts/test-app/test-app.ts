import {App, AppOptions} from "../app/app";

export class TestApp {
    private app: App;
    private screenInfo: PIXI.Container;

    constructor() {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("id", "myCanvas");

        const div = document.createElement("div");
        div.appendChild(canvas);

        document.body.appendChild(div);

        const appOptions: AppOptions = {
            width: 412,
            height: 604,
            autoResize: false,
            resolution: window.devicePixelRatio,
            roundPixels: true,
            transparent: false,
            backgroundColor: 0x222222,
            view: canvas,
        };

        this.app = new App(appOptions);

        this.drawSquare(this.app.width / 2 - 25, this.app.height / 2 - 25);
        this.drawDebugInfo();

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
        graphics.drawRect(halfWidth, halfWidth, this.app.width - width, this.app.height - width);

        this.app.stage.addChild(graphics);
    }

    private getDimensionsText(): string {
        return `app original w:${this.app.width} h:${this.app.height} (css px)\n` +
        `app.view w:${this.app.view.width} h:${this.app.view.height} (real px)\n` +
        `clientW:${this.app.view.clientWidth} clientH:${this.app.view.clientHeight} (css px)\n` +
        `app.screen w:${this.app.screen.width} h:${this.app.screen.height} (css px)\n` +
        `window innerW:${window.innerWidth} innerH:${window.innerHeight} (css px)\n` +
        `stage pos(${this.app.stage.x}, ${this.app.stage.y}) size(${Math.ceil(this.app.stage.width)}, ${Math.ceil(this.app.stage.height)}) scale(${this.app.stage.scale.x.toFixed(2)}, ${this.app.stage.scale.y.toFixed(2)}) (css px)`
        ;
    }

    private drawDebugInfo(): void {
        this.screenInfo = new PIXI.Container();
        this.screenInfo.x = 10;
        this.screenInfo.y = 10;
        this.app.stage.addChild(this.screenInfo);

        const style = new PIXI.TextStyle({
            fontFamily: "Verdana",
            fontSize: 12,
            fontWeight: "bold",
            fill: 0xFFFFFF,
        });

        const pixiText = new PIXI.Text(this.getDimensionsText(), style);
        this.screenInfo.addChild(pixiText);

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
        explorer.position.set(this.screenInfo.x + Math.ceil(maxEdge / 2), this.screenInfo.y + this.screenInfo.height + Math.ceil(maxEdge / 2) + 6);

        // Rotate around the center
        explorer.anchor.set(0.5, 0.5);

        // Add the explorer to the scene we are building
        this.app.stage.addChild(explorer);

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
