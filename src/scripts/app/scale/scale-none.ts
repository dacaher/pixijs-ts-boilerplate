import {ScaleStrategy} from "./scale-strategy";

export class ScaleNone implements ScaleStrategy {
    public scale(initialWidth?: number, initialHeight?: number, finalWidth?: number, finalHeight?: number): { scaleX: number; scaleY: number } {
        return {
            scaleX: 1,
            scaleY: 1,
        };
    }
}
