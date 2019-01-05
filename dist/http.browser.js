var http=function(t){var r={};function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var o in t)e.d(n,o,function(r){return t[r]}.bind(null,o));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=12)}([function(t,r){t.exports=function(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}},function(t,r,e){var n=e(0);t.exports=function(t){for(var r=1;r<arguments.length;r++){var e=null!=arguments[r]?arguments[r]:{},o=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.forEach(function(r){n(t,r,e[r])})}return t}},function(t,r,e){var n=e(4),o=e(5),i=e(6);t.exports=function(t,r){return n(t)||o(t,r)||i()}},function(t,r,e){"use strict";(function(t){function n(r){var e,n=r.auth,o=n.username,i=n.password;return(o||i)&&(r.headers.authorization="Basic "+(e="".concat(o,":").concat(i),"function"==typeof atob?atob(e):t.from(e).toString("base64"))),r}e.d(r,"a",function(){return n})}).call(this,e(7).Buffer)},function(t,r){t.exports=function(t){if(Array.isArray(t))return t}},function(t,r){t.exports=function(t,r){var e=[],n=!0,o=!1,i=void 0;try{for(var u,f=t[Symbol.iterator]();!(n=(u=f.next()).done)&&(e.push(u.value),!r||e.length!==r);n=!0);}catch(t){o=!0,i=t}finally{try{n||null==f.return||f.return()}finally{if(o)throw i}}return e}},function(t,r){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}},function(t,r,e){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=e(9),o=e(10),i=e(11);function u(){return s.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function f(t,r){if(u()<r)throw new RangeError("Invalid typed array length");return s.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r)).__proto__=s.prototype:(null===t&&(t=new s(r)),t.length=r),t}function s(t,r,e){if(!(s.TYPED_ARRAY_SUPPORT||this instanceof s))return new s(t,r,e);if("number"==typeof t){if("string"==typeof r)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return a(this,t,r,e)}function a(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?function(t,r,e,n){if(r.byteLength,e<0||r.byteLength<e)throw new RangeError("'offset' is out of bounds");if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds");r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n);s.TYPED_ARRAY_SUPPORT?(t=r).__proto__=s.prototype:t=l(t,r);return t}(t,r,e,n):"string"==typeof r?function(t,r,e){"string"==typeof e&&""!==e||(e="utf8");if(!s.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding');var n=0|y(r,e),o=(t=f(t,n)).write(r,e);o!==n&&(t=t.slice(0,o));return t}(t,r,e):function(t,r){if(s.isBuffer(r)){var e=0|p(r.length);return 0===(t=f(t,e)).length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||(n=r.length)!=n?f(t,0):l(t,r);if("Buffer"===r.type&&i(r.data))return l(t,r.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,r)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function c(t,r){if(h(r),t=f(t,r<0?0:0|p(r)),!s.TYPED_ARRAY_SUPPORT)for(var e=0;e<r;++e)t[e]=0;return t}function l(t,r){var e=r.length<0?0:0|p(r.length);t=f(t,e);for(var n=0;n<e;n+=1)t[n]=255&r[n];return t}function p(t){if(t>=u())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+u().toString(16)+" bytes");return 0|t}function y(t,r){if(s.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var e=t.length;if(0===e)return 0;for(var n=!1;;)switch(r){case"ascii":case"latin1":case"binary":return e;case"utf8":case"utf-8":case void 0:return k(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e;case"hex":return e>>>1;case"base64":return N(t).length;default:if(n)return k(t).length;r=(""+r).toLowerCase(),n=!0}}function g(t,r,e){var n=t[r];t[r]=t[e],t[e]=n}function d(t,r,e,n,o){if(0===t.length)return-1;if("string"==typeof e?(n=e,e=0):e>2147483647?e=2147483647:e<-2147483648&&(e=-2147483648),e=+e,isNaN(e)&&(e=o?0:t.length-1),e<0&&(e=t.length+e),e>=t.length){if(o)return-1;e=t.length-1}else if(e<0){if(!o)return-1;e=0}if("string"==typeof r&&(r=s.from(r,n)),s.isBuffer(r))return 0===r.length?-1:w(t,r,e,n,o);if("number"==typeof r)return r&=255,s.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,r,e):Uint8Array.prototype.lastIndexOf.call(t,r,e):w(t,[r],e,n,o);throw new TypeError("val must be string, number or Buffer")}function w(t,r,e,n,o){var i,u=1,f=t.length,s=r.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1;u=2,f/=2,s/=2,e/=2}function a(t,r){return 1===u?t[r]:t.readUInt16BE(r*u)}if(o){var h=-1;for(i=e;i<f;i++)if(a(t,i)===a(r,-1===h?0:i-h)){if(-1===h&&(h=i),i-h+1===s)return h*u}else-1!==h&&(i-=i-h),h=-1}else for(e+s>f&&(e=f-s),i=e;i>=0;i--){for(var c=!0,l=0;l<s;l++)if(a(t,i+l)!==a(r,l)){c=!1;break}if(c)return i}return-1}function v(t,r,e,n){e=Number(e)||0;var o=t.length-e;n?(n=Number(n))>o&&(n=o):n=o;var i=r.length;if(i%2!=0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var u=0;u<n;++u){var f=parseInt(r.substr(2*u,2),16);if(isNaN(f))return u;t[e+u]=f}return u}function b(t,r,e,n){return F(k(r,t.length-e),t,e,n)}function m(t,r,e,n){return F(function(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e));return r}(r),t,e,n)}function A(t,r,e,n){return m(t,r,e,n)}function E(t,r,e,n){return F(N(r),t,e,n)}function R(t,r,e,n){return F(function(t,r){for(var e,n,o,i=[],u=0;u<t.length&&!((r-=2)<0);++u)e=t.charCodeAt(u),n=e>>8,o=e%256,i.push(o),i.push(n);return i}(r,t.length-e),t,e,n)}function _(t,r,e){return 0===r&&e===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(r,e))}function P(t,r,e){e=Math.min(t.length,e);for(var n=[],o=r;o<e;){var i,u,f,s,a=t[o],h=null,c=a>239?4:a>223?3:a>191?2:1;if(o+c<=e)switch(c){case 1:a<128&&(h=a);break;case 2:128==(192&(i=t[o+1]))&&(s=(31&a)<<6|63&i)>127&&(h=s);break;case 3:i=t[o+1],u=t[o+2],128==(192&i)&&128==(192&u)&&(s=(15&a)<<12|(63&i)<<6|63&u)>2047&&(s<55296||s>57343)&&(h=s);break;case 4:i=t[o+1],u=t[o+2],f=t[o+3],128==(192&i)&&128==(192&u)&&128==(192&f)&&(s=(15&a)<<18|(63&i)<<12|(63&u)<<6|63&f)>65535&&s<1114112&&(h=s)}null===h?(h=65533,c=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),o+=c}return function(t){var r=t.length;if(r<=T)return String.fromCharCode.apply(String,t);var e="",n=0;for(;n<r;)e+=String.fromCharCode.apply(String,t.slice(n,n+=T));return e}(n)}r.Buffer=s,r.SlowBuffer=function(t){+t!=t&&(t=0);return s.alloc(+t)},r.INSPECT_MAX_BYTES=50,s.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),r.kMaxLength=u(),s.poolSize=8192,s._augment=function(t){return t.__proto__=s.prototype,t},s.from=function(t,r,e){return a(null,t,r,e)},s.TYPED_ARRAY_SUPPORT&&(s.prototype.__proto__=Uint8Array.prototype,s.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&s[Symbol.species]===s&&Object.defineProperty(s,Symbol.species,{value:null,configurable:!0})),s.alloc=function(t,r,e){return function(t,r,e,n){return h(r),r<=0?f(t,r):void 0!==e?"string"==typeof n?f(t,r).fill(e,n):f(t,r).fill(e):f(t,r)}(null,t,r,e)},s.allocUnsafe=function(t){return c(null,t)},s.allocUnsafeSlow=function(t){return c(null,t)},s.isBuffer=function(t){return!(null==t||!t._isBuffer)},s.compare=function(t,r){if(!s.isBuffer(t)||!s.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(t===r)return 0;for(var e=t.length,n=r.length,o=0,i=Math.min(e,n);o<i;++o)if(t[o]!==r[o]){e=t[o],n=r[o];break}return e<n?-1:n<e?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(t,r){if(!i(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);var e;if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length;var n=s.allocUnsafe(r),o=0;for(e=0;e<t.length;++e){var u=t[e];if(!s.isBuffer(u))throw new TypeError('"list" argument must be an Array of Buffers');u.copy(n,o),o+=u.length}return n},s.byteLength=y,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var r=0;r<t;r+=2)g(this,r,r+1);return this},s.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var r=0;r<t;r+=4)g(this,r,r+3),g(this,r+1,r+2);return this},s.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var r=0;r<t;r+=8)g(this,r,r+7),g(this,r+1,r+6),g(this,r+2,r+5),g(this,r+3,r+4);return this},s.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?P(this,0,t):function(t,r,e){var n=!1;if((void 0===r||r<0)&&(r=0),r>this.length)return"";if((void 0===e||e>this.length)&&(e=this.length),e<=0)return"";if((e>>>=0)<=(r>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return U(this,r,e);case"utf8":case"utf-8":return P(this,r,e);case"ascii":return B(this,r,e);case"latin1":case"binary":return S(this,r,e);case"base64":return _(this,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return O(this,r,e);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}.apply(this,arguments)},s.prototype.equals=function(t){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){var t="",e=r.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},s.prototype.compare=function(t,r,e,n,o){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),r<0||e>t.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&r>=e)return 0;if(n>=o)return-1;if(r>=e)return 1;if(this===t)return 0;for(var i=(o>>>=0)-(n>>>=0),u=(e>>>=0)-(r>>>=0),f=Math.min(i,u),a=this.slice(n,o),h=t.slice(r,e),c=0;c<f;++c)if(a[c]!==h[c]){i=a[c],u=h[c];break}return i<u?-1:u<i?1:0},s.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},s.prototype.indexOf=function(t,r,e){return d(this,t,r,e,!0)},s.prototype.lastIndexOf=function(t,r,e){return d(this,t,r,e,!1)},s.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0;else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0;else{if(!isFinite(r))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");r|=0,isFinite(e)?(e|=0,void 0===n&&(n="utf8")):(n=e,e=void 0)}var o=this.length-r;if((void 0===e||e>o)&&(e=o),t.length>0&&(e<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return v(this,t,r,e);case"utf8":case"utf-8":return b(this,t,r,e);case"ascii":return m(this,t,r,e);case"latin1":case"binary":return A(this,t,r,e);case"base64":return E(this,t,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,t,r,e);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var T=4096;function B(t,r,e){var n="";e=Math.min(t.length,e);for(var o=r;o<e;++o)n+=String.fromCharCode(127&t[o]);return n}function S(t,r,e){var n="";e=Math.min(t.length,e);for(var o=r;o<e;++o)n+=String.fromCharCode(t[o]);return n}function U(t,r,e){var n=t.length;(!r||r<0)&&(r=0),(!e||e<0||e>n)&&(e=n);for(var o="",i=r;i<e;++i)o+=q(t[i]);return o}function O(t,r,e){for(var n=t.slice(r,e),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}function Y(t,r,e){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function I(t,r,e,n,o,i){if(!s.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>o||r<i)throw new RangeError('"value" argument is out of bounds');if(e+n>t.length)throw new RangeError("Index out of range")}function C(t,r,e,n){r<0&&(r=65535+r+1);for(var o=0,i=Math.min(t.length-e,2);o<i;++o)t[e+o]=(r&255<<8*(n?o:1-o))>>>8*(n?o:1-o)}function x(t,r,e,n){r<0&&(r=4294967295+r+1);for(var o=0,i=Math.min(t.length-e,4);o<i;++o)t[e+o]=r>>>8*(n?o:3-o)&255}function M(t,r,e,n,o,i){if(e+n>t.length)throw new RangeError("Index out of range");if(e<0)throw new RangeError("Index out of range")}function L(t,r,e,n,i){return i||M(t,0,e,4),o.write(t,r,e,n,23,4),e+4}function j(t,r,e,n,i){return i||M(t,0,e,8),o.write(t,r,e,n,52,8),e+8}s.prototype.slice=function(t,r){var e,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(r=void 0===r?n:~~r)<0?(r+=n)<0&&(r=0):r>n&&(r=n),r<t&&(r=t),s.TYPED_ARRAY_SUPPORT)(e=this.subarray(t,r)).__proto__=s.prototype;else{var o=r-t;e=new s(o,void 0);for(var i=0;i<o;++i)e[i]=this[i+t]}return e},s.prototype.readUIntLE=function(t,r,e){t|=0,r|=0,e||Y(t,r,this.length);for(var n=this[t],o=1,i=0;++i<r&&(o*=256);)n+=this[t+i]*o;return n},s.prototype.readUIntBE=function(t,r,e){t|=0,r|=0,e||Y(t,r,this.length);for(var n=this[t+--r],o=1;r>0&&(o*=256);)n+=this[t+--r]*o;return n},s.prototype.readUInt8=function(t,r){return r||Y(t,1,this.length),this[t]},s.prototype.readUInt16LE=function(t,r){return r||Y(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUInt16BE=function(t,r){return r||Y(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUInt32LE=function(t,r){return r||Y(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUInt32BE=function(t,r){return r||Y(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readIntLE=function(t,r,e){t|=0,r|=0,e||Y(t,r,this.length);for(var n=this[t],o=1,i=0;++i<r&&(o*=256);)n+=this[t+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*r)),n},s.prototype.readIntBE=function(t,r,e){t|=0,r|=0,e||Y(t,r,this.length);for(var n=r,o=1,i=this[t+--n];n>0&&(o*=256);)i+=this[t+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*r)),i},s.prototype.readInt8=function(t,r){return r||Y(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},s.prototype.readInt16LE=function(t,r){r||Y(t,2,this.length);var e=this[t]|this[t+1]<<8;return 32768&e?4294901760|e:e},s.prototype.readInt16BE=function(t,r){r||Y(t,2,this.length);var e=this[t+1]|this[t]<<8;return 32768&e?4294901760|e:e},s.prototype.readInt32LE=function(t,r){return r||Y(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,r){return r||Y(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readFloatLE=function(t,r){return r||Y(t,4,this.length),o.read(this,t,!0,23,4)},s.prototype.readFloatBE=function(t,r){return r||Y(t,4,this.length),o.read(this,t,!1,23,4)},s.prototype.readDoubleLE=function(t,r){return r||Y(t,8,this.length),o.read(this,t,!0,52,8)},s.prototype.readDoubleBE=function(t,r){return r||Y(t,8,this.length),o.read(this,t,!1,52,8)},s.prototype.writeUIntLE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||I(this,t,r,e,Math.pow(2,8*e)-1,0);var o=1,i=0;for(this[r]=255&t;++i<e&&(o*=256);)this[r+i]=t/o&255;return r+e},s.prototype.writeUIntBE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||I(this,t,r,e,Math.pow(2,8*e)-1,0);var o=e-1,i=1;for(this[r+o]=255&t;--o>=0&&(i*=256);)this[r+o]=t/i&255;return r+e},s.prototype.writeUInt8=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,1,255,0),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},s.prototype.writeUInt16LE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):C(this,t,r,!0),r+2},s.prototype.writeUInt16BE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):C(this,t,r,!1),r+2},s.prototype.writeUInt32LE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):x(this,t,r,!0),r+4},s.prototype.writeUInt32BE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):x(this,t,r,!1),r+4},s.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r|=0,!n){var o=Math.pow(2,8*e-1);I(this,t,r,e,o-1,-o)}var i=0,u=1,f=0;for(this[r]=255&t;++i<e&&(u*=256);)t<0&&0===f&&0!==this[r+i-1]&&(f=1),this[r+i]=(t/u>>0)-f&255;return r+e},s.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r|=0,!n){var o=Math.pow(2,8*e-1);I(this,t,r,e,o-1,-o)}var i=e-1,u=1,f=0;for(this[r+i]=255&t;--i>=0&&(u*=256);)t<0&&0===f&&0!==this[r+i+1]&&(f=1),this[r+i]=(t/u>>0)-f&255;return r+e},s.prototype.writeInt8=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,1,127,-128),s.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[r]=255&t,r+1},s.prototype.writeInt16LE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):C(this,t,r,!0),r+2},s.prototype.writeInt16BE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):C(this,t,r,!1),r+2},s.prototype.writeInt32LE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,4,2147483647,-2147483648),s.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):x(this,t,r,!0),r+4},s.prototype.writeInt32BE=function(t,r,e){return t=+t,r|=0,e||I(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),s.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):x(this,t,r,!1),r+4},s.prototype.writeFloatLE=function(t,r,e){return L(this,t,r,!0,e)},s.prototype.writeFloatBE=function(t,r,e){return L(this,t,r,!1,e)},s.prototype.writeDoubleLE=function(t,r,e){return j(this,t,r,!0,e)},s.prototype.writeDoubleBE=function(t,r,e){return j(this,t,r,!1,e)},s.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<e&&(n=e),n===e)return 0;if(0===t.length||0===this.length)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e);var o,i=n-e;if(this===t&&e<r&&r<n)for(o=i-1;o>=0;--o)t[o+r]=this[o+e];else if(i<1e3||!s.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)t[o+r]=this[o+e];else Uint8Array.prototype.set.call(t,this.subarray(e,e+i),r);return i},s.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var o=t.charCodeAt(0);o<256&&(t=o)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(r<0||this.length<r||this.length<e)throw new RangeError("Out of range index");if(e<=r)return this;var i;if(r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0),"number"==typeof t)for(i=r;i<e;++i)this[i]=t;else{var u=s.isBuffer(t)?t:k(new s(t,n).toString()),f=u.length;for(i=0;i<e-r;++i)this[i+r]=u[i%f]}return this};var D=/[^+\/0-9A-Za-z-_]/g;function q(t){return t<16?"0"+t.toString(16):t.toString(16)}function k(t,r){var e;r=r||1/0;for(var n=t.length,o=null,i=[],u=0;u<n;++u){if((e=t.charCodeAt(u))>55295&&e<57344){if(!o){if(e>56319){(r-=3)>-1&&i.push(239,191,189);continue}if(u+1===n){(r-=3)>-1&&i.push(239,191,189);continue}o=e;continue}if(e<56320){(r-=3)>-1&&i.push(239,191,189),o=e;continue}e=65536+(o-55296<<10|e-56320)}else o&&(r-=3)>-1&&i.push(239,191,189);if(o=null,e<128){if((r-=1)<0)break;i.push(e)}else if(e<2048){if((r-=2)<0)break;i.push(e>>6|192,63&e|128)}else if(e<65536){if((r-=3)<0)break;i.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(e<1114112))throw new Error("Invalid code point");if((r-=4)<0)break;i.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return i}function N(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(D,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function F(t,r,e,n){for(var o=0;o<n&&!(o+e>=r.length||o>=t.length);++o)r[o+e]=t[o];return o}}).call(this,e(8))},function(t,r){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,r,e){"use strict";r.byteLength=function(t){var r=a(t),e=r[0],n=r[1];return 3*(e+n)/4-n},r.toByteArray=function(t){for(var r,e=a(t),n=e[0],u=e[1],f=new i(function(t,r,e){return 3*(r+e)/4-e}(0,n,u)),s=0,h=u>0?n-4:n,c=0;c<h;c+=4)r=o[t.charCodeAt(c)]<<18|o[t.charCodeAt(c+1)]<<12|o[t.charCodeAt(c+2)]<<6|o[t.charCodeAt(c+3)],f[s++]=r>>16&255,f[s++]=r>>8&255,f[s++]=255&r;2===u&&(r=o[t.charCodeAt(c)]<<2|o[t.charCodeAt(c+1)]>>4,f[s++]=255&r);1===u&&(r=o[t.charCodeAt(c)]<<10|o[t.charCodeAt(c+1)]<<4|o[t.charCodeAt(c+2)]>>2,f[s++]=r>>8&255,f[s++]=255&r);return f},r.fromByteArray=function(t){for(var r,e=t.length,o=e%3,i=[],u=0,f=e-o;u<f;u+=16383)i.push(h(t,u,u+16383>f?f:u+16383));1===o?(r=t[e-1],i.push(n[r>>2]+n[r<<4&63]+"==")):2===o&&(r=(t[e-2]<<8)+t[e-1],i.push(n[r>>10]+n[r>>4&63]+n[r<<2&63]+"="));return i.join("")};for(var n=[],o=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0,s=u.length;f<s;++f)n[f]=u[f],o[u.charCodeAt(f)]=f;function a(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=t.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function h(t,r,e){for(var o,i,u=[],f=r;f<e;f+=3)o=(t[f]<<16&16711680)+(t[f+1]<<8&65280)+(255&t[f+2]),u.push(n[(i=o)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return u.join("")}o["-".charCodeAt(0)]=62,o["_".charCodeAt(0)]=63},function(t,r){r.read=function(t,r,e,n,o){var i,u,f=8*o-n-1,s=(1<<f)-1,a=s>>1,h=-7,c=e?o-1:0,l=e?-1:1,p=t[r+c];for(c+=l,i=p&(1<<-h)-1,p>>=-h,h+=f;h>0;i=256*i+t[r+c],c+=l,h-=8);for(u=i&(1<<-h)-1,i>>=-h,h+=n;h>0;u=256*u+t[r+c],c+=l,h-=8);if(0===i)i=1-a;else{if(i===s)return u?NaN:1/0*(p?-1:1);u+=Math.pow(2,n),i-=a}return(p?-1:1)*u*Math.pow(2,i-n)},r.write=function(t,r,e,n,o,i){var u,f,s,a=8*i-o-1,h=(1<<a)-1,c=h>>1,l=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:i-1,y=n?1:-1,g=r<0||0===r&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===1/0?(f=isNaN(r)?1:0,u=h):(u=Math.floor(Math.log(r)/Math.LN2),r*(s=Math.pow(2,-u))<1&&(u--,s*=2),(r+=u+c>=1?l/s:l*Math.pow(2,1-c))*s>=2&&(u++,s/=2),u+c>=h?(f=0,u=h):u+c>=1?(f=(r*s-1)*Math.pow(2,o),u+=c):(f=r*Math.pow(2,c-1)*Math.pow(2,o),u=0));o>=8;t[e+p]=255&f,p+=y,f/=256,o-=8);for(u=u<<o|f,a+=o;a>0;t[e+p]=255&u,p+=y,u/=256,a-=8);t[e+p-y]|=128*g}},function(t,r){var e={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==e.call(t)}},function(t,r,e){"use strict";function n(t){if(!t)throw new Error("Adapter is required");var r={request:[],response:[],error:[]},e=function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["delete",r].concat(n))},n={get:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["get",r].concat(n))},post:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["post",r].concat(n))},put:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["put",r].concat(n))},patch:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["patch",r].concat(n))},head:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["head",r].concat(n))},options:function(){for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.apply(void 0,["options",r].concat(n))},del:e,delete:e,middleware:function(t,e){return e&&r[t].push(e),r}};return t.setup(n),n}e.r(r);var o=e(1),i=e.n(o),u=e(2),f=e.n(u),s=e(0),a=e.n(s);function h(t,r){return t.reduce(function(t,r){return r(t)},r)}function c(t,r,e,n){t.request=e,n(t=h(r,t))}var l={delete:{request:!1,response:!0},get:{request:!1,response:!0},head:{request:!1,response:!1},options:{request:!1,response:!0},patch:{request:!0,response:!0},post:{request:!0,response:!0},put:{request:!0,response:!0}},p=e(3);function y(t,r){return l[r.method].request?r.body?r:(r.params.constructor===Object?r.body=t(r.params):r.body=r.params,r.headers["content-type"]||(e=r.body,"function"==typeof FormData&&e instanceof FormData)||(r.headers["content-type"]="application/x-www-form-urlencoded"),r):(delete r.body,r);var e}function g(t){if(!l[t.method].request)return delete t.body,t;if(t.body)return t;var r=t.headers["content-type"];return r&&r.includes("application/json")?(t.body=JSON.stringify(t.params),t):t}function d(t){if(!t.headers["content-type"].includes("application/json"))return t;try{t.data=JSON.parse(t.body)}catch(t){}return t}function w(t){var r=String(t.status);return t.success=!!r[0].match(/^[2-3]/),t.redirect="3"===r[0],t.redirect&&(t.location=t.headers.location),t}function v(t){return Object.keys(t).map(function(r){return encodeURIComponent(r)+"="+encodeURIComponent(t[r])}).join("&")}function b(t,r,e,n,o){n=n||{},o=function(t){return Object.assign({headers:{},auth:{},body:null,method:null,timeout:0},t||{})}(o);var u=new XMLHttpRequest,s=new Promise(function(s,p){var y;(o=h(r.request,i()({},o,{params:n,method:t,url:e}))).headers=(y=o.headers,Object.keys(y).reduce(function(t,r){return Object.assign(t,a()({},r.toLowerCase(),y[r]))},{})),o.url=function(t,r,e,n){return!e&&Object.keys(r).length>0&&(t+=t.includes("?")?"&":"?",t+=n(r)),t}(o.url,o.params,l[o.method].request,v),u.open(o.method,o.url,!0),Object.keys(o.headers).forEach(function(t){u.setRequestHeader(t,o.headers[t])}),u.withCredentials=!0,u.timeout=o.timeout,u.send(o.body),u.onload=function(t,r,e,n){var o,i={body:r.responseText,status:r.status,request:r,response:r,method:t,headers:(o=r.getAllResponseHeaders(),o.split(/\r?\n/).filter(function(t){return!!t}).reduce(function(t,r){var e=r.match(/^(.*?):\s*(.*?)$/),n=f()(e,3),o=(n[0],n[1]),i=n[2];return t[o.toLowerCase()]=i,t},{}))};n(i=h(e,i))}.bind(null,o.method,u,r.response,s),u.ontimeout=function(t,r,e){var n=new Error("Request timed out");n.timeout=!0,c(n,r,t,e)}.bind(null,u,r.error,p),u.onerror=function(t,r,e){c(new Error("Request errored out"),r,t,e)}.bind(null,u,r.error,p),u.onabort=function(t,r,e){var n=new Error("Aborted request");n.aborted=!0,c(n,r,t,e)}.bind(null,u,r.error,p)});return s.abort=function(){u.abort()},s}b.setup=function(t){t.middleware("request",p.a),t.middleware("request",g),t.middleware("request",y.bind(null,v)),t.middleware("response",d),t.middleware("response",w)},e.d(r,"client",function(){return n}),e.d(r,"adapter",function(){return b})}]);
//# sourceMappingURL=http.browser.js.map