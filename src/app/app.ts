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
    stylePosition?: "static" | "absolute" | "relative" | "fixed" | "sticky" | "initial" | "inherit";
    align?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    resize?: "none" | "keep-aspect-ratio" | "full-size";
}

export class App {
    private app: PIXI.Application;

    private _width: number;
    private _height: number;

    private alignStrategy: AlignStrategy;
    private resizeStrategy: ResizeStrategy;

    private _container: HTMLDivElement | HTMLSpanElement | undefined | null;

    constructor(options?: AppOptions,
                container?: HTMLDivElement | HTMLSpanElement | null) {
        this.app = new PIXI.Application(options);

        // Configure with opts
        if (options !== undefined) {
            this.configure(options);
        } else {
            this.alignStrategy = new AlignTopLeft();
            this.resizeStrategy = new ResizeNone();
        }

        // App size
        this._width = this.app.renderer.width;
        this._height = this.app.renderer.height;

        // Set app container and its size
        this.setContainer(container);

        this.resize();

        window.onresize = this.resize.bind(this);
    }

    private configure(options: AppOptions) {
        if (options.stylePosition !== undefined) {
            this.app.renderer.view.style.position = options.stylePosition;
        }

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
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    get currentHeight(): number {
        return this.renderer.height;
    }

    get currentWidth(): number {
        return this.renderer.width;
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

    private get containerWidth(): number {
        let w;

        if (this._container && this._container !== null) {
            w = this._container.clientWidth;
        } else {
            w = window.innerWidth;
        }

        return w;
    }

    private get containerHeight(): number {
        let h;

        if (this._container && this._container !== null) {
            h = this._container.clientHeight;
        } else {
            h = window.innerHeight;
        }

        return h;
    }

    private resize(): void {
        // Resize
        const {scaleX, scaleY} = this.resizeStrategy.resize(this._width, this._height, this.containerWidth, this.containerHeight);
        this.stage.scale.x = scaleX;
        this.stage.scale.y = scaleY;

        this.renderer.resize(Math.ceil(this._width * scaleX), Math.ceil(this._height * scaleY));

        // Alignment
        const {x, y} = this.alignStrategy.align(this.renderer.width, this.renderer.height, this.containerWidth, this.containerHeight);
        this.renderer.view.style.left = x + "px";
        this.renderer.view.style.top = y + "px";

        window.console.log(`orig:${this.width},${this.height} current:${this.currentWidth},${this.currentHeight} scale:${this.stage.scale.x},${this.stage.scale.y}`);
    }

    private setContainer(container: HTMLDivElement | HTMLSpanElement | any) {
        if (container && container !== null && container.nodeName && (container.nodeName === "DIV" || container.nodeName === "SPAN")) {
            this._container = container;
            container.appendChild(this.app.view);
        } else {
            document.body.appendChild(this.app.view);
        }
    }
}
