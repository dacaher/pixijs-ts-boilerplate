/**
 * Sprite class with a rotation velocity.
 */
export class RotatingSprite extends PIXI.Sprite {
    private _rotationVelocity = 0;

    constructor(texture?: PIXI.Texture) {
        super(texture);
    }

    get rotationVelocity(): number {
        return this._rotationVelocity;
    }

    set rotationVelocity(value: number) {
        this._rotationVelocity = value;
    }
}
