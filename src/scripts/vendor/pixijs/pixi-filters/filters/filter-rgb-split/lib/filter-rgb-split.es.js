/*!
 * @pixi/filter-rgb-split - v2.5.0
 * Compiled Wed, 10 Jan 2018 17:38:59 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
import{Filter}from"pixi.js";var vertex="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",fragment="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",RGBSplitFilter=function(e){function r(r,t,n){void 0===r&&(r=[-10,0]),void 0===t&&(t=[0,10]),void 0===n&&(n=[0,0]),e.call(this,vertex,fragment),this.red=r,this.green=t,this.blue=n}e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r;var t={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return t.red.get=function(){return this.uniforms.red},t.red.set=function(e){this.uniforms.red=e},t.green.get=function(){return this.uniforms.green},t.green.set=function(e){this.uniforms.green=e},t.blue.get=function(){return this.uniforms.blue},t.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(r.prototype,t),r}(Filter);export{RGBSplitFilter};
//# sourceMappingURL=filter-rgb-split.es.js.map
