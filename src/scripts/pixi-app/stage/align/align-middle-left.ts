import {AlignStrategy} from "./align-strategy";

export class AlignMiddleLeft implements AlignStrategy {
    public align(width: number, height: number, containerWidth: number, containerHeight: number): { x: number, y: number } {
        return {
            x: 0,
            y: Math.round(containerHeight / 2 - height / 2),
        };
    }
}
