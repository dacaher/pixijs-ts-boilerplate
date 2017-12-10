import {AlignStrategy} from "./align-strategy";

export class AlignBottomCenter implements AlignStrategy {
    public align(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { x: number, y: number } {
        return {
            x: Math.round(containerWidth / 2 - width / 2),
            y: Math.round(containerHeight - height),
        };
    }
}
