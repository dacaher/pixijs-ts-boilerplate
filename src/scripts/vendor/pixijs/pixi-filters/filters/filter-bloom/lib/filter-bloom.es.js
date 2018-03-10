/*!
 * @pixi/filter-bloom - v2.5.0
 * Compiled Wed, 10 Jan 2018 17:38:59 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import{BLEND_MODES,Filter,Point,filters,settings}from"pixi.js";var ref=filters,BlurXFilter=ref.BlurXFilter,BlurYFilter=ref.BlurYFilter,AlphaFilter=ref.AlphaFilter,BloomFilter=function(r){function t(t,e,l,i){var u,o;void 0===t&&(t=2),void 0===e&&(e=4),void 0===l&&(l=settings.RESOLUTION),void 0===i&&(i=5),r.call(this),"number"==typeof t?(u=t,o=t):t instanceof Point?(u=t.x,o=t.y):Array.isArray(t)&&(u=t[0],o=t[1]),this.blurXFilter=new BlurXFilter(u,e,l,i),this.blurYFilter=new BlurYFilter(o,e,l,i),this.blurYFilter.blendMode=BLEND_MODES.SCREEN,this.defaultFilter=new AlphaFilter}r&&(t.__proto__=r),t.prototype=Object.create(r&&r.prototype),t.prototype.constructor=t;var e={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return t.prototype.apply=function(r,t,e){var l=r.getRenderTarget(!0);this.defaultFilter.apply(r,t,e),this.blurXFilter.apply(r,t,l),this.blurYFilter.apply(r,l,e),r.returnRenderTarget(l)},e.blur.get=function(){return this.blurXFilter.blur},e.blur.set=function(r){this.blurXFilter.blur=this.blurYFilter.blur=r},e.blurX.get=function(){return this.blurXFilter.blur},e.blurX.set=function(r){this.blurXFilter.blur=r},e.blurY.get=function(){return this.blurYFilter.blur},e.blurY.set=function(r){this.blurYFilter.blur=r},Object.defineProperties(t.prototype,e),t}(Filter);export{BloomFilter};
//# sourceMappingURL=filter-bloom.es.js.map
