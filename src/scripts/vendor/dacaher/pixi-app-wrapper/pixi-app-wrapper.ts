import EventEmitter = require("eventemitter3");
import "fpsmeter";
import {Dom, pixiAppWrapperEvent} from "pixi-app-wrapper";
import "pixi-layers";
import * as PIXI from "pixi.js";
import * as screenfull from "screenfull";
import {MediaInfoData, MediaInfoViewer} from "./info/media-info-viewer";
import {AlignBottomCenter} from "./stage/align/align-bottom-center";
import {AlignBottomLeft} from "./stage/align/align-bottom-left";
import {AlignBottomRight} from "./stage/align/align-bottom-right";
import {AlignMiddle} from "./stage/align/align-middle";
import {AlignMiddleLeft} from "./stage/align/align-middle-left";
import {AlignMiddleRight} from "./stage/align/align-middle-right";
import {AlignStrategy} from "./stage/align/align-strategy";
import {AlignTopCenter} from "./stage/align/align-top-center";
import {AlignTopLeft} from "./stage/align/align-top-left";
import {AlignTopRight} from "./stage/align/align-top-right";
import {ScaleFullSize} from "./stage/scale/scale-full-size";
import {ScaleKeepAspectRatio} from "./stage/scale/scale-keep-aspect-ratio";
import {ScaleNone} from "./stage/scale/scale-none";
import {ScaleStrategy} from "./stage/scale/scale-strategy";

export interface PixiAppWrapperOptions extends PIXI.ApplicationOptions {
    width: number;
    height: number;
    align?: "top-left" | "top-center" | "top-right" | "middle-left" | "middle" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right";
    scale?: "none" | "keep-aspect-ratio" | "full-size";
    showFPS?: boolean;
    showMediaInfo?: boolean;
}

/**
 * Wrapper for PIXI.Application class enabling features like scaling, aligning, fps-meter and a media info viewer.
 */
export class PixiAppWrapper extends EventEmitter {

    /**
     * Requests fullscreen for given element or documentElement if not provided.
     * @param {Element} element - Element requesting to go full screen.
     */
    public static toggleFulscreen(element?: Element | null): void {
        const target: Element = element ? element : document.documentElement;

        if (screenfull.enabled) {
            screenfull.toggle(target);
        }
    }

    private readonly defaultScaleMethod = "none";
    private readonly defaultAlignMethod = "top-left";

    private readonly defaultOptions: PixiAppWrapperOptions = {
        width: 800,
        height: 600,
        scale: this.defaultScaleMethod,
        align: this.defaultAlignMethod,
        showFPS: false,
        showMediaInfo: false,
    };

    private readonly fpsmeterOptions: FPSMeterOptions = {
        theme: "transparent",
        heat: 1,
        graph: 1,
        history: 20,
        zIndex: 100,
    };

    private app: PIXI.Application;
    private appOptions: PixiAppWrapperOptions;

    private width: number;
    private height: number;

    private alignStrategy: AlignStrategy;
    private scaleStrategy: ScaleStrategy;

    private fpsmeter: FPSMeter;
    private mediaInfoViewer: MediaInfoViewer;

    private resizing: boolean;

    constructor(options?: PixiAppWrapperOptions) {
        super();

        if (!options) {
            options = this.defaultOptions;
        }

        this.resizing = false;

        this.mediaInfoViewer = new MediaInfoViewer();

        this.app = new PIXI.Application(options);
        this.app.stage = new PIXI.display.Stage();

        this.configure(options);
        this.ticker.add(this.resize.bind(this));

        this.appOptions = options;
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

    /**
     * Returns media info from the application.
     * @returns {MediaInfoData} Media info
     */
    public getMediaInfo(): MediaInfoData {
        return {
            display: {
                screen: {
                    width: this.screen.width,
                    height: this.screen.height,
                },
                view: {
                    width: this.view.clientWidth,
                    height: this.view.clientHeight,
                },
                stage: {
                    x: this.stage.x,
                    y: this.stage.y,
                    initialWidth: this.initialWidth,
                    initialHeight: this.initialHeight,
                    currentWidth: Math.ceil(this.stage.width),
                    currentHeight: Math.ceil(this.stage.height),
                    scaleX: this.stage.scale.x.toFixed(2),
                    scaleY: this.stage.scale.y.toFixed(2),
                    scaling: this.appOptions.scale ? this.appOptions.scale.valueOf() : this.defaultScaleMethod,
                    alignment: this.appOptions.align ? this.appOptions.align.valueOf() : this.defaultAlignMethod,
                },
            },
        };
    }

    private configure(options: PixiAppWrapperOptions): void {
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
            this.createFPSmeter();
        }

        if (!options.showMediaInfo) {
            this.mediaInfoViewer.hide();
        }

        if (!options.view) {
            document.body.appendChild(this.app.view); // If no canvas specified, add it to html body
        }
    }

    private createFPSmeter(): void {
        this.fpsmeter = new FPSMeter(Dom.getElementOrBody("fps-meter"), this.fpsmeterOptions);
        this.ticker.add(this.fpsmeter.tick);
        this.fpsmeter.show();
    }

    private resize(): void {
        const multiplier = this.renderer.options.resolution || 1;
        const width = Math.floor(this.view.clientWidth * multiplier);
        const height = Math.floor(this.view.clientHeight * multiplier);

        if (!this.resizing && (this.view.width !== width || this.view.height !== height)) {
            this.resizing = true;

            // dispatch resize start event
            this.emit(pixiAppWrapperEvent.RESIZE_START);

            // resize
            this.renderer.resize(this.view.clientWidth, this.view.clientHeight);

            // scale
            this.scale();

            // align
            this.align();

            // update media info
            this.mediaInfoViewer.update(this.getMediaInfo());

            this.resizing = false;

            // dispatch resize end event
            this.emit(pixiAppWrapperEvent.RESIZE_END, {
                stage: {
                    position: {
                        x: this.stage.position.x,
                        y: this.stage.position.y,
                    },
                    scale: {
                        x: this.stage.scale.x,
                        y: this.stage.scale.y,
                    },
                    size: {
                        width: this.stage.width,
                        height: this.stage.height,
                    },
                },
                view: {
                    width: this.view.width,
                    height: this.view.height,
                },
            });
        }
    }

    private scale(): void {
        const {scaleX, scaleY} = this.scaleStrategy.scale(this.initialWidth, this.initialHeight, this.view.clientWidth, this.view.clientHeight);
        this.stage.scale.set(scaleX, scaleY);
    }

    private align(): void {
        const {x, y} = this.alignStrategy.align(this.stage.width, this.stage.height, this.view.clientWidth, this.view.clientHeight);
        this.stage.position.set(x, y);
    }
}
