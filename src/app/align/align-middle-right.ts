import {AlignStrategy} from "./align-strategy";

export class AlignMiddleRight implements AlignStrategy {
    public align(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { x: number, y: number } {
        return {
            x: Math.round(containerWidth - width),
            y: Math.round(containerHeight / 2 - height / 2),
        };
    }
}
