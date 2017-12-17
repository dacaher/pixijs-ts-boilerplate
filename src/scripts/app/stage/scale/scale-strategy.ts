export interface ScaleStrategy {
    scale(initialWidth: number, initialHeight: number, finalWidth: number, finalHeight: number): { scaleX: number, scaleY: number };
}
