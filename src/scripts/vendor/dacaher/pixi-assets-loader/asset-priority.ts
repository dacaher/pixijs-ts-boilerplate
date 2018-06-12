export class AssetPriority {
    public static readonly HIGHEST = 100;
    public static readonly HIGH = 75;
    public static readonly NORMAL = 50;
    public static readonly LOW = 25;
    public static readonly LOWEST = 0;

    public static getPriority(priority: number): number {
        if (priority >= AssetPriority.HIGHEST) {
            return AssetPriority.HIGHEST;
        } else if (priority >= AssetPriority.HIGH) {
            return AssetPriority.HIGH;
        } else if (priority >= AssetPriority.NORMAL) {
            return AssetPriority.NORMAL;
        } else if (priority >= AssetPriority.LOW) {
            return AssetPriority.LOW;
        } else {
            return AssetPriority.LOWEST;
        }
    }
}
