import {AlignStrategy} from "./align-strategy";

export class AlignMiddle implements AlignStrategy {
    public align(width: number, height: number, containerWidth: number, containerHeight: number): { x: number, y: number } {
        return {
            x: Math.round(containerWidth / 2 - width / 2),
            y: Math.round(containerHeight / 2 - height / 2),
        };
    }
}
