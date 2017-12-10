import {AlignStrategy} from "./align-strategy";

export class AlignTopRight implements AlignStrategy {
    public align(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { x: number, y: number } {
        return {
            x: Math.round(containerWidth - width),
            y: 0,
        };
    }

}
