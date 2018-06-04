import {Asset} from "./asset";

export interface LoadAsset {
    asset: Asset;
    loaded: boolean;
    error: Error | null;
}
