import {ScaleStrategy} from "./scale-strategy";

export class ScaleKeepAspectRatio implements ScaleStrategy {
    public scale(initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number): { scaleX: number; scaleY: number; } {
        // Determine which screen dimension is most constrained
        const scale = Math.min(finalWidth / initialWidth, finalHeight / initialHeight);

        return {scaleX: scale, scaleY: scale};
    }

}
