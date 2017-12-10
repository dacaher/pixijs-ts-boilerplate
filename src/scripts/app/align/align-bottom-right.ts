import {AlignStrategy} from "./align-strategy";

export class AlignBottomRight implements AlignStrategy {
    public align(width: number, height: number, containerWidth: number, containerHeight: number): { x: number, y: number } {
        return {
            x: Math.round(containerWidth - width),
            y: Math.round(containerHeight - height),
        };
    }
}
