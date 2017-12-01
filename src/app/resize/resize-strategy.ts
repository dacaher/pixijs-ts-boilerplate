export interface ResizeStrategy {
    resize(width: number, height: number, containerWidth: number, containerHeight: number): { scaleX: number, scaleY: number };
}
