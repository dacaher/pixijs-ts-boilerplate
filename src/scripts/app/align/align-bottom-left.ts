import {AlignStrategy} from "./align-strategy";

export class AlignBottomLeft implements AlignStrategy {
    public align(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { x: number, y: number } {
        return {
            x: 0,
            y: Math.round(containerHeight - height),
        };
    }
}
