/*!
 * @pixi/filter-bloom - v2.5.0
 * Compiled Wed, 10 Jan 2018 17:38:59 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("pixi.js")):"function"==typeof define&&define.amd?define(["exports","pixi.js"],r):r(t.__filters={},t.PIXI)}(this,function(t,r){"use strict";var e=r.filters,i=e.BlurXFilter,l=e.BlurYFilter,u=e.AlphaFilter,n=function(t){function e(e,n,o,s){var b,f;void 0===e&&(e=2),void 0===n&&(n=4),void 0===o&&(o=r.settings.RESOLUTION),void 0===s&&(s=5),t.call(this),"number"==typeof e?(b=e,f=e):e instanceof r.Point?(b=e.x,f=e.y):Array.isArray(e)&&(b=e[0],f=e[1]),this.blurXFilter=new i(b,n,o,s),this.blurYFilter=new l(f,n,o,s),this.blurYFilter.blendMode=r.BLEND_MODES.SCREEN,this.defaultFilter=new u}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var n={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return e.prototype.apply=function(t,r,e){var i=t.getRenderTarget(!0);this.defaultFilter.apply(t,r,e),this.blurXFilter.apply(t,r,i),this.blurYFilter.apply(t,i,e),t.returnRenderTarget(i)},n.blur.get=function(){return this.blurXFilter.blur},n.blur.set=function(t){this.blurXFilter.blur=this.blurYFilter.blur=t},n.blurX.get=function(){return this.blurXFilter.blur},n.blurX.set=function(t){this.blurXFilter.blur=t},n.blurY.get=function(){return this.blurYFilter.blur},n.blurY.set=function(t){this.blurYFilter.blur=t},Object.defineProperties(e.prototype,n),e}(r.Filter);t.BloomFilter=n,Object.defineProperty(t,"__esModule",{value:!0})}),Object.assign(PIXI.filters,this.__filters);
//# sourceMappingURL=filter-bloom.js.map
