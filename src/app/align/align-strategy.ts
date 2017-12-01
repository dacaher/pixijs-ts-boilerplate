export interface AlignStrategy {
    align(width: number, height: number, containerWidth: number, containerHeight: number): { x: number, y: number };
}
