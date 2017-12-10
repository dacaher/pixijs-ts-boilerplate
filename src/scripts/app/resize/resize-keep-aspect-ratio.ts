import {ResizeStrategy} from "./resize-strategy";

export class ResizeKeepAspectRatio implements ResizeStrategy {
    public resize(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { scaleX: number; scaleY: number } {
        // Determine which screen dimension is most constrained
        const scale = Math.min(containerWidth / width, containerHeight / height);

        return {scaleX: scale, scaleY: scale};
    }
}
