import {ResizeStrategy} from "./resize-strategy";

export class ResizeNone implements ResizeStrategy {
    public resize(width: number, height: number, containerWidth?: number, containerHeight?: number): { scaleX: number; scaleY: number } {
        return {
            scaleX: 1,
            scaleY: 1,
        };
    }

}
