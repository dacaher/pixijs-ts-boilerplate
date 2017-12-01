import {ResizeStrategy} from "./resize-strategy";

export class ResizeFullSize implements ResizeStrategy {
    public resize(width: number, height: number, containerWidth = window.innerWidth, containerHeight = window.innerHeight): { scaleX: number; scaleY: number } {
        return {
            scaleX: containerWidth / width,
            scaleY: containerHeight / height,
        };
    }
}
