import "fpsmeter";
import * as PIXI from "pixi.js";
import {AlignBottomCenter} from "./align/align-bottom-center";
import {AlignBottomLeft} from "./align/align-bottom-left";
import {AlignBottomRight} from "./align/align-bottom-right";
import {AlignMiddle} from "./align/align-middle";
import {AlignMiddleLeft} from "./align/align-middle-left";
import {AlignMiddleRight} from "./align/align-middle-right";
import {AlignStrategy} from "./align/align-strategy";
import {AlignTopCenter} from "./align/align-top-center";
import {AlignTopLeft} from "./align/align-top-left";
import {AlignTopRight} from "./align/align-top-right";
import {ScaleFullSize} from "./scale/scale-full-size";
import {ScaleKeepAspectRatio} from "./scale/scale-keep-aspect-ratio";
import {ScaleNone} from "./scale/scale-none";
import {ScaleStrategy} from "./scale/scale-strategy";

export interface AppOptions extends PIXI.ApplicationOptions {
    width: number;
    height: number;
    align?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    scale?: "none" | "keep-aspect-ratio" | "full-size";
    showFPS?: boolean;
}

export class App {
    private readonly defaultOptions: AppOptions = {
        width: 800,
        height: 600,
        scale: "none",
        align: "top-left",
        showFPS: false,
    };

    private readonly fpsmeterOpts: FPSMeterOptions = {
        theme: "transparent",
        heat: 1,
        graph: 1,
        history: 20,
        zIndex: 100,
    };

    private app: PIXI.Application;

    private width: number;
    private height: number;

    private alignStrategy: AlignStrategy;
    private scaleStrategy: ScaleStrategy;

    private fpsmeter: FPSMeter;

    constructor(options?: AppOptions) {
        if (!options) {
            options = this.defaultOptions;
        }

        this.app = new PIXI.Application(options);
        this.configure(options);
        this.ticker.add(this.resize.bind(this));
    }

    get initialHeight(): number {
        return this.height;
    }

    get initialWidth(): number {
        return this.width;
    }

    get stage(): PIXI.Container {
        return this.app.stage;
    }

    get ticker(): PIXI.ticker.Ticker {
        return this.app.ticker;
    }

    get renderer(): PIXI.WebGLRenderer | PIXI.CanvasRenderer {
        return this.app.renderer;
    }

    get screen(): PIXI.Rectangle {
        return this.app.screen;
    }

    get view(): HTMLCanvasElement {
        return this.app.view;
    }

    private configure(options: AppOptions): void {
        this.width = options.width;
        this.height = options.height;

        switch (options.align) {
            case "top-center":
                this.alignStrategy = new AlignTopCenter();
                break;

            case "top-right":
                this.alignStrategy = new AlignTopRight();
                break;

            case "middle-left":
                this.alignStrategy = new AlignMiddleLeft();
                break;

            case "middle":
                this.alignStrategy = new AlignMiddle();
                break;

            case "middle-right":
                this.alignStrategy = new AlignMiddleRight();
                break;

            case "bottom-left":
                this.alignStrategy = new AlignBottomLeft();
                break;

            case "bottom-center":
                this.alignStrategy = new AlignBottomCenter();
                break;

            case "bottom-right":
                this.alignStrategy = new AlignBottomRight();
                break;

            default:
                this.alignStrategy = new AlignTopLeft();
                break;
        }

        switch (options.scale) {
            case "keep-aspect-ratio":
                this.scaleStrategy = new ScaleKeepAspectRatio();
                break;

            case "full-size":
                this.scaleStrategy = new ScaleFullSize();
                break;

            default:
                this.scaleStrategy = new ScaleNone();
                break;
        }

        if (options.showFPS) {
            this.fpsmeter = new FPSMeter(document.body, this.fpsmeterOpts);
            this.ticker.add(this.fpsmeter.tick);
            this.fpsmeter.show();
        }

        if (!options.view) {
            document.body.appendChild(this.app.view); // If no container specified, add it to html body
        }
    }

    private resize(): void {
        const multiplier = this.renderer.options.resolution || 1;
        const width = Math.floor(this.app.view.clientWidth * multiplier);
        const height = Math.floor(this.app.view.clientHeight * multiplier);

        if (this.app.view.width !== width || this.app.view.height !== height) {
            // scale
            this.scale();

            // resize
            this.renderer.resize(this.app.view.clientWidth, this.app.view.clientHeight);

            // align
            this.align();
        }
    }

    private scale(): void {
        const {scaleX, scaleY} = this.scaleStrategy.scale(this.initialWidth, this.initialHeight, this.app.view.clientWidth, this.app.view.clientHeight);
        this.stage.scale.set(scaleX, scaleY);
    }

    private align(): void {
        const {x, y} = this.alignStrategy.align(this.stage.width, this.stage.height, this.app.view.clientWidth, this.app.view.clientHeight);
        this.stage.position.set(x, y);
    }
}
