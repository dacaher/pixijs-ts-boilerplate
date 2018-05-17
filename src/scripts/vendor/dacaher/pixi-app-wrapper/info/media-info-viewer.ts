import {Dom} from "pixi-app-wrapper";
import "../util/math";

export interface DisplayData {
    screen: { width: number, height: number };
    view: { width: number, height: number };
    stage: {
        x: number,
        y: number,
        initialWidth: number,
        initialHeight: number,
        currentWidth: number,
        currentHeight: number,
        scaleX: string,
        scaleY: string,
        scaling: string;
        alignment: string;
        orientation: "landscape" | "portrait";
    };
}

export interface MediaInfoData {
    display: DisplayData;
}

export class MediaInfoViewer {
    private rootContainer: HTMLElement;
    private textContainer: HTMLDivElement;
    private data: MediaInfoData;

    constructor() {
        this.createContainer();
    }

    public update(newData: MediaInfoData): void {
        this.data = newData;
        this.textContainer.innerHTML = this.getText();
    }

    public show(): void {
        this.rootContainer.className = this.rootContainer.className.replace("hidden", "").trim();
    }

    public hide(): void {
        this.show(); // to ensure we do not duplicate the style class
        this.rootContainer.className += " hidden";
    }

    private createContainer(): void {
        // root container
        this.rootContainer = Dom.getElementOrCreateNew("media-info", "div");
        this.rootContainer.className = "media-info";

        // close button
        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "[x]";
        closeBtn.className = "media-info-close-button button";
        closeBtn.title = "close";
        closeBtn.onclick = this.hide.bind(this);
        this.rootContainer.appendChild(closeBtn);

        // info text
        this.textContainer = document.createElement("div");
        this.rootContainer.appendChild(this.textContainer);
    }

    private getText(): string {
        const stageInitialGCD = Math.gcd(this.data.display.stage.initialWidth, this.data.display.stage.initialHeight);

        return `` +
            `<div>[devicePixelRatio]</div>` +
            `<div>${window.devicePixelRatio}</div>` +
            `<div>[window.inner]</div>` +
            `<div>${window.innerWidth}x${window.innerHeight}</div>` +
            `<div>[app.screen]</div>` +
            `<div>${this.data.display.screen.width}x${this.data.display.screen.height}</div>` +
            `<div>[app.view]</div>` +
            `<div>${this.data.display.view.width}x${this.data.display.view.height}</div>` +
            `<div>[app.stage]</div>` +
            `<div>position (${this.data.display.stage.x}, ${this.data.display.stage.y})</div>` +
            `<div>initial ${this.data.display.stage.initialWidth}x${this.data.display.stage.initialHeight} ${this.data.display.stage.initialWidth / stageInitialGCD}:${this.data.display.stage.initialHeight / stageInitialGCD}</div>` +
            `<div>current ${this.data.display.stage.currentWidth}x${this.data.display.stage.currentHeight}</div>` +
            `<div>scale (${this.data.display.stage.scaleX}, ${this.data.display.stage.scaleY})</div>` +
            `<div>scaling ${this.data.display.stage.scaling}</div>` +
            `<div>alignment ${this.data.display.stage.alignment}</div>` +
            `<div>orientation ${this.data.display.stage.orientation}</div>`
            ;
    }
}
