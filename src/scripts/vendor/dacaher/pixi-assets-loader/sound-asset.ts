import {Asset} from "./asset";

export interface SoundAsset extends Asset {
    autoplay: boolean;
    loop: boolean;
    volume?: number;
    rate?: number;
}
