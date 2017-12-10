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
import {ResizeFullSize} from "./resize/resize-full-size";
import {ResizeKeepAspectRatio} from "./resize/resize-keep-aspect-ratio";
import {ResizeNone} from "./resize/resize-none";
import {ResizeStrategy} from "./resize/resize-strategy";

export interface AppOptions extends PIXI.ApplicationOptions {
    width: number;
    height: number;
    align?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    resize?: "none" | "keep-aspect-ratio" | "full-size";
}

export class App {
    private readonly defaultOptions: AppOptions = {
        width: 800,
        height: 600,
        resize: "none",
        align: "top-left",
    };

    private app: PIXI.Application;

    private _width: number;
    private _height: number;

    private alignStrategy: AlignStrategy;
    private resizeStrategy: ResizeStrategy;

    constructor(options?: AppOptions) {
        this.app = new PIXI.Application(options);
        this.configure(options);
        this.ticker.add(this.coolResize.bind(this));
    }

    private configure(options: AppOptions | undefined): void {
        if (!options) {
            options = this.defaultOptions;
        }

        this._width = options.width;
        this._height = options.height;

        switch (options.align) {
            case "top-right":
                this.alignStrategy = new AlignTopRight();
                break;

            case "top-center":
                this.alignStrategy = new AlignTopCenter();
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

        switch (options.resize) {
            case "keep-aspect-ratio":
                this.resizeStrategy = new ResizeKeepAspectRatio();
                break;

            case "full-size":
                this.resizeStrategy = new ResizeFullSize();
                break;

            default:
                this.resizeStrategy = new ResizeNone();
                break;
        }

        if (!options.view) {
            document.body.appendChild(this.app.view);
        }
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
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

    private resize(): void {
        /*
        // Resize
        const {scaleX, scaleY} = this.resizeStrategy.resize(this._width, this._height, this.containerWidth, this.containerHeight);
        this.stage.scale.x = scaleX;
        this.stage.scale.y = scaleY;

        this.renderer.resize(Math.ceil(this._width * scaleX), Math.ceil(this._height * scaleY));

        // Alignment
        const {x, y} = this.alignStrategy.align(this.renderer.width, this.renderer.height, this.containerWidth, this.containerHeight);
        this.renderer.view.style.left = x + "px";
        this.renderer.view.style.top = y + "px";
        */
    }

    private coolResize(): boolean {
        const multiplier = this.renderer.options.resolution || 1;
        const width = Math.floor(this.app.view.clientWidth * multiplier);
        const height = Math.floor(this.app.view.clientHeight * multiplier);

        if (this.app.view.width !== width || this.app.view.height !== height) {
            // Determine which screen dimension is most constrained
            // const ratio = Math.min(width / this._width, height / this._height);

            // Scale the view appropriately to fill that dimension
            this.stage.scale.x = this.app.view.clientWidth / this._width;
            this.stage.scale.y = this.app.view.clientHeight / this._height;

            this.renderer.resize(this.app.view.clientWidth, this.app.view.clientHeight);
            return true;
        }

        return false;
    }
}
