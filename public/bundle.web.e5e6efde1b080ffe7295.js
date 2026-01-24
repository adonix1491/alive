(self["webpackChunkAliveApp"] = self["webpackChunkAliveApp"] || []).push([[71],{

/***/ 1913
(__unused_webpack_module, exports, __webpack_require__) {

'use client';Object.defineProperty(exports, "__esModule", ({value:true}));var _SafeAreaContext=__webpack_require__(96910);Object.keys(_SafeAreaContext).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_SafeAreaContext[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _SafeAreaContext[key];}});});var _SafeAreaView=__webpack_require__(85884);Object.keys(_SafeAreaView).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_SafeAreaView[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _SafeAreaView[key];}});});var _InitialWindow=__webpack_require__(37813);Object.keys(_InitialWindow).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_InitialWindow[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _InitialWindow[key];}});});var _SafeArea=__webpack_require__(83062);Object.keys(_SafeArea).forEach(function(key){if(key==="default"||key==="__esModule")return;if(key in exports&&exports[key]===_SafeArea[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _SafeArea[key];}});});

/***/ },

/***/ 1995
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var ScreenContainer=_View.default;var _default=exports["default"]=ScreenContainer;

/***/ },

/***/ 2520
(module, __unused_webpack_exports, __webpack_require__) {

const colorString = __webpack_require__(28854);
const convert = __webpack_require__(10734);

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[[...convert[model].labels].sort().join('')] = model;
}

const limiters = {};

function Color(object, model) {
	if (!(this instanceof Color)) {
		return new Color(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		this.model = object.model;
		this.color = [...object.color];
		this.valpha = object.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (object.length > 0) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = Array.prototype.slice.call(object, 0, channels);
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		const keys = Object.keys(object);
		if ('alpha' in object) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
		}

		this.model = hashedModelKeys[hashedKeys];

		const {labels} = convert[this.model];
		const color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(object[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString() {
		return this.string();
	},

	toJSON() {
		return this[this.model]();
	},

	string(places) {
		let self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to[self.model](args);
	},

	percentString(places) {
		const self = this.rgb().round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to.rgb.percent(args);
	},

	array() {
		return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
	},

	object() {
		const result = {};
		const {channels} = convert[this.model];
		const {labels} = convert[this.model];

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray() {
		const rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject() {
		const rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(places) {
		places = Math.max(places || 0, 0);
		return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
	},

	alpha(value) {
		if (value !== undefined) {
			return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(95.047)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(108.833)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	hexa(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		const rgbArray = this.rgb().round().color;

		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
		if (alphaHex.length === 1) {
			alphaHex = '0' + alphaHex;
		}

		return colorString.to.hex(rgbArray) + alphaHex;
	},

	rgbNumber() {
		const rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity() {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = this.rgb().color;

		const lum = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(color2) {
		// https://www.w3.org/TR/WCAG/#contrast-enhanced
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark() {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = this.rgb().color;
		const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
		return yiq < 128;
	},

	isLight() {
		return !this.isDark();
	},

	negate() {
		const rgb = this.rgb();
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(ratio) {
		const hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(ratio) {
		const hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(ratio) {
		const hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(ratio) {
		const hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale() {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const rgb = this.rgb().color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(value, value, value);
	},

	fade(ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(degrees) {
		const hsl = this.hsl();
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(mixinColor, weight) {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return Color.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const {channels} = convert[model];

	// Conversion methods
	Color.prototype[model] = function (...args) {
		if (this.model === model) {
			return new Color(this);
		}

		if (args.length > 0) {
			return new Color(args, model);
		}

		return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
	};

	// 'static' construction methods
	Color[model] = function (...args) {
		let color = args[0];
		if (typeof color === 'number') {
			color = zeroArray(args, channels);
		}

		return new Color(color, model);
	};
}

function roundTo(number, places) {
	return Number(number.toFixed(places));
}

function roundToPlace(places) {
	return function (number) {
		return roundTo(number, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	for (const m of model) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	}

	model = model[0];

	return function (value) {
		let result;

		if (value !== undefined) {
			if (modifier) {
				value = modifier(value);
			}

			result = this[model]();
			result.color[channel] = value;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value) {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array, length) {
	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

module.exports = Color;


/***/ },

/***/ 2868
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object.defineProperty(exports,"__esModule",{value:true});Object.defineProperty(exports,"BottomTabBar",{enumerable:true,get:function get(){return _BottomTabBar.BottomTabBar;}});Object.defineProperty(exports,"BottomTabBarHeightCallbackContext",{enumerable:true,get:function get(){return _BottomTabBarHeightCallbackContext.BottomTabBarHeightCallbackContext;}});Object.defineProperty(exports,"BottomTabBarHeightContext",{enumerable:true,get:function get(){return _BottomTabBarHeightContext.BottomTabBarHeightContext;}});Object.defineProperty(exports,"BottomTabView",{enumerable:true,get:function get(){return _BottomTabView.BottomTabView;}});exports.TransitionSpecs=exports.TransitionPresets=exports.SceneStyleInterpolators=void 0;Object.defineProperty(exports,"createBottomTabNavigator",{enumerable:true,get:function get(){return _createBottomTabNavigator.createBottomTabNavigator;}});Object.defineProperty(exports,"useBottomTabBarHeight",{enumerable:true,get:function get(){return _useBottomTabBarHeight.useBottomTabBarHeight;}});var SceneStyleInterpolators=_interopRequireWildcard(require("./TransitionConfigs/SceneStyleInterpolators.js"));exports.SceneStyleInterpolators=SceneStyleInterpolators;var TransitionPresets=_interopRequireWildcard(require("./TransitionConfigs/TransitionPresets.js"));exports.TransitionPresets=TransitionPresets;var TransitionSpecs=_interopRequireWildcard(require("./TransitionConfigs/TransitionSpecs.js"));exports.TransitionSpecs=TransitionSpecs;var _createBottomTabNavigator=require("./navigators/createBottomTabNavigator.js");var _BottomTabBar=require("./views/BottomTabBar.js");var _BottomTabView=require("./views/BottomTabView.js");var _BottomTabBarHeightCallbackContext=require("./utils/BottomTabBarHeightCallbackContext.js");var _BottomTabBarHeightContext=require("./utils/BottomTabBarHeightContext.js");var _useBottomTabBarHeight=require("./utils/useBottomTabBarHeight.js");function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

/***/ },

/***/ 4909
(module) {

const DEV = "production" !== "production";

const warnings = new Set();

function warnOnce(condition, ...rest) {
  if (DEV && condition) {
    const key = rest.join(" ");

    if (warnings.has(key)) {
      return;
    }

    warnings.add(key);
    console.warn(...rest);
  }
}

module.exports = warnOnce;


/***/ },

/***/ 5414
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.GestureHandlerRefContext=void 0;var React=_interopRequireWildcard(__webpack_require__(96540));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var GestureHandlerRefContext=exports.GestureHandlerRefContext=React.createContext(null);

/***/ },

/***/ 5588
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.CardAnimationContext=void 0;var React=_interopRequireWildcard(__webpack_require__(96540));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var CardAnimationContext=exports.CardAnimationContext=React.createContext(undefined);

/***/ },

/***/ 5626
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.HeaderSegment=HeaderSegment;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var _slicedToArray2=_interopRequireDefault(__webpack_require__(85715));var _elements=__webpack_require__(31755);var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Header\\HeaderSegment.tsx";var _excluded=["progress","layout","modal","onGoBack","backHref","headerTitle","headerLeft","headerRight","headerBackImage","headerBackTitle","headerBackButtonDisplayMode","headerBackTruncatedTitle","headerBackAccessibilityLabel","headerBackTestID","headerBackAllowFontScaling","headerBackTitleStyle","headerTitleContainerStyle","headerLeftContainerStyle","headerRightContainerStyle","headerBackgroundContainerStyle","headerStyle","headerStatusBarHeight","styleInterpolator"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function HeaderSegment(props){var _this=this;var _useLocale=(0,_native.useLocale)(),direction=_useLocale.direction;var _React$useState=React.useState(undefined),_React$useState2=(0,_slicedToArray2.default)(_React$useState,2),leftLabelLayout=_React$useState2[0],setLeftLabelLayout=_React$useState2[1];var _React$useState3=React.useState(undefined),_React$useState4=(0,_slicedToArray2.default)(_React$useState3,2),titleLayout=_React$useState4[0],setTitleLayout=_React$useState4[1];var handleTitleLayout=function handleTitleLayout(e){var _e$nativeEvent$layout=e.nativeEvent.layout,height=_e$nativeEvent$layout.height,width=_e$nativeEvent$layout.width;setTitleLayout(function(titleLayout){if(titleLayout&&height===titleLayout.height&&width===titleLayout.width){return titleLayout;}return{height:height,width:width};});};var handleLeftLabelLayout=function handleLeftLabelLayout(e){var _e$nativeEvent$layout2=e.nativeEvent.layout,height=_e$nativeEvent$layout2.height,width=_e$nativeEvent$layout2.width;if(leftLabelLayout&&height===leftLabelLayout.height&&width===leftLabelLayout.width){return;}setLeftLabelLayout({height:height,width:width});};var progress=props.progress,layout=props.layout,modal=props.modal,onGoBack=props.onGoBack,backHref=props.backHref,title=props.headerTitle,_props$headerLeft=props.headerLeft,left=_props$headerLeft===void 0?onGoBack?function(props){return(0,_jsxRuntime.jsx)(_elements.HeaderBackButton,Object.assign({},props));}:undefined:_props$headerLeft,right=props.headerRight,headerBackImage=props.headerBackImage,headerBackTitle=props.headerBackTitle,_props$headerBackButt=props.headerBackButtonDisplayMode,headerBackButtonDisplayMode=_props$headerBackButt===void 0?_Platform.default.OS==='ios'?'default':'minimal':_props$headerBackButt,headerBackTruncatedTitle=props.headerBackTruncatedTitle,headerBackAccessibilityLabel=props.headerBackAccessibilityLabel,headerBackTestID=props.headerBackTestID,headerBackAllowFontScaling=props.headerBackAllowFontScaling,headerBackTitleStyle=props.headerBackTitleStyle,headerTitleContainerStyle=props.headerTitleContainerStyle,headerLeftContainerStyle=props.headerLeftContainerStyle,headerRightContainerStyle=props.headerRightContainerStyle,headerBackgroundContainerStyle=props.headerBackgroundContainerStyle,customHeaderStyle=props.headerStyle,headerStatusBarHeight=props.headerStatusBarHeight,styleInterpolator=props.styleInterpolator,rest=(0,_objectWithoutProperties2.default)(props,_excluded);var defaultHeight=(0,_elements.getDefaultHeaderHeight)(layout,modal,headerStatusBarHeight);var _ref=_StyleSheet.default.flatten(customHeaderStyle||{}),_ref$height=_ref.height,height=_ref$height===void 0?defaultHeight:_ref$height;var headerHeight=typeof height==='number'?height:defaultHeight;var _React$useMemo=React.useMemo(function(){return styleInterpolator({current:{progress:progress.current},next:progress.next&&{progress:progress.next},direction:direction,layouts:{header:{height:headerHeight,width:layout.width},screen:layout,title:titleLayout,leftLabel:leftLabelLayout}});},[styleInterpolator,progress,direction,headerHeight,layout,titleLayout,leftLabelLayout]),titleStyle=_React$useMemo.titleStyle,leftButtonStyle=_React$useMemo.leftButtonStyle,leftLabelStyle=_React$useMemo.leftLabelStyle,rightButtonStyle=_React$useMemo.rightButtonStyle,backgroundStyle=_React$useMemo.backgroundStyle;var headerLeft=left?function(props){return left(Object.assign({},props,{href:backHref,backImage:headerBackImage,accessibilityLabel:headerBackAccessibilityLabel,testID:headerBackTestID,allowFontScaling:headerBackAllowFontScaling,onPress:onGoBack,label:headerBackTitle,truncatedLabel:headerBackTruncatedTitle,labelStyle:[leftLabelStyle,headerBackTitleStyle],onLabelLayout:handleLeftLabelLayout,screenLayout:layout,titleLayout:titleLayout,canGoBack:Boolean(onGoBack)}));}:undefined;var headerRight=right?function(props){return right(Object.assign({},props,{canGoBack:Boolean(onGoBack)}));}:undefined;var headerTitle=typeof title!=='function'?function(props){return(0,_jsxRuntime.jsx)(_elements.HeaderTitle,Object.assign({},props,{onLayout:handleTitleLayout}));}:function(props){return title(Object.assign({},props,{onLayout:handleTitleLayout}));};return(0,_jsxRuntime.jsx)(_elements.Header,Object.assign({modal:modal,layout:layout,headerTitle:headerTitle,headerLeft:headerLeft,headerRight:headerRight,headerTitleContainerStyle:[titleStyle,headerTitleContainerStyle],headerLeftContainerStyle:[leftButtonStyle,headerLeftContainerStyle],headerRightContainerStyle:[rightButtonStyle,headerRightContainerStyle],headerBackButtonDisplayMode:headerBackButtonDisplayMode,headerBackgroundContainerStyle:[backgroundStyle,headerBackgroundContainerStyle],headerStyle:customHeaderStyle,headerStatusBarHeight:headerStatusBarHeight},rest));}

/***/ },

/***/ 5629
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=exports.FooterComponent=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var ScreenFooter=_View.default;var FooterComponent=exports.FooterComponent=_View.default;var _default=exports["default"]=ScreenFooter;

/***/ },

/***/ 6864
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const isOptionObject = __webpack_require__(16368);

const {hasOwnProperty} = Object.prototype;
const {propertyIsEnumerable} = Object;
const defineProperty = (object, name, value) => Object.defineProperty(object, name, {
	value,
	writable: true,
	enumerable: true,
	configurable: true
});

const globalThis = this;
const defaultMergeOptions = {
	concatArrays: false,
	ignoreUndefined: false
};

const getEnumerableOwnPropertyKeys = value => {
	const keys = [];

	for (const key in value) {
		if (hasOwnProperty.call(value, key)) {
			keys.push(key);
		}
	}

	/* istanbul ignore else  */
	if (Object.getOwnPropertySymbols) {
		const symbols = Object.getOwnPropertySymbols(value);

		for (const symbol of symbols) {
			if (propertyIsEnumerable.call(value, symbol)) {
				keys.push(symbol);
			}
		}
	}

	return keys;
};

function clone(value) {
	if (Array.isArray(value)) {
		return cloneArray(value);
	}

	if (isOptionObject(value)) {
		return cloneOptionObject(value);
	}

	return value;
}

function cloneArray(array) {
	const result = array.slice(0, 0);

	getEnumerableOwnPropertyKeys(array).forEach(key => {
		defineProperty(result, key, clone(array[key]));
	});

	return result;
}

function cloneOptionObject(object) {
	const result = Object.getPrototypeOf(object) === null ? Object.create(null) : {};

	getEnumerableOwnPropertyKeys(object).forEach(key => {
		defineProperty(result, key, clone(object[key]));
	});

	return result;
}

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {string[]} keys keys to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
const mergeKeys = (merged, source, keys, config) => {
	keys.forEach(key => {
		if (typeof source[key] === 'undefined' && config.ignoreUndefined) {
			return;
		}

		// Do not recurse into prototype chain of merged
		if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
			defineProperty(merged, key, merge(merged[key], source[key], config));
		} else {
			defineProperty(merged, key, clone(source[key]));
		}
	});

	return merged;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 *
 * see [Array.prototype.concat ( ...arguments )](http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.concat)
 */
const concatArrays = (merged, source, config) => {
	let result = merged.slice(0, 0);
	let resultIndex = 0;

	[merged, source].forEach(array => {
		const indices = [];

		// `result.concat(array)` with cloning
		for (let k = 0; k < array.length; k++) {
			if (!hasOwnProperty.call(array, k)) {
				continue;
			}

			indices.push(String(k));

			if (array === merged) {
				// Already cloned
				defineProperty(result, resultIndex++, array[k]);
			} else {
				defineProperty(result, resultIndex++, clone(array[k]));
			}
		}

		// Merge non-index keys
		result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter(key => !indices.includes(key)), config);
	});

	return result;
};

/**
 * @param {*} merged already cloned
 * @param {*} source something to merge
 * @param {Object} config Config Object
 * @returns {*} cloned Object
 */
function merge(merged, source, config) {
	if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
		return concatArrays(merged, source, config);
	}

	if (!isOptionObject(source) || !isOptionObject(merged)) {
		return clone(source);
	}

	return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
}

module.exports = function (...options) {
	const config = merge(clone(defaultMergeOptions), (this !== globalThis && this) || {}, defaultMergeOptions);
	let merged = {_: {}};

	for (const option of options) {
		if (option === undefined) {
			continue;
		}

		if (!isOptionObject(option)) {
			throw new TypeError('`' + option + '` is not an Option Object');
		}

		merged = merge(merged, {_: option}, config);
	}

	return merged._;
};


/***/ },

/***/ 7406
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.useCardAnimation=useCardAnimation;var React=_interopRequireWildcard(__webpack_require__(96540));var _CardAnimationContext=__webpack_require__(5588);function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function useCardAnimation(){var animation=React.useContext(_CardAnimationContext.CardAnimationContext);if(animation===undefined){throw new Error("Couldn't find values for card animation. Are you inside a screen in Stack?");}return animation;}

/***/ },

/***/ 8156
(module) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ },

/***/ 8507
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(15659);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ },

/***/ 8727
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.Card=Card;var _slicedToArray2=_interopRequireDefault(__webpack_require__(85715));var _color=_interopRequireDefault(__webpack_require__(2520));var React=_interopRequireWildcard(__webpack_require__(96540));var _Animated=_interopRequireDefault(__webpack_require__(48831));var _InteractionManager=_interopRequireDefault(__webpack_require__(59819));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _useLatestCallback=_interopRequireDefault(__webpack_require__(76976));var _CardAnimationContext=__webpack_require__(5588);var _gestureActivationCriteria=__webpack_require__(21979);var _getDistanceForDirection=__webpack_require__(62596);var _getInvertedMultiplier=__webpack_require__(22539);var _getShadowStyle=__webpack_require__(13354);var _GestureHandler=__webpack_require__(22713);var _CardContent=__webpack_require__(51888);var _jsxRuntime=__webpack_require__(74848);var _this=(/* unused pure expression or super */ null && (this)),_jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\Card.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var GESTURE_VELOCITY_IMPACT=0.3;var TRUE=1;var FALSE=0;var useNativeDriver=_Platform.default.OS!=='web';var hasOpacityStyle=function hasOpacityStyle(style){if(style){var flattenedStyle=_StyleSheet.default.flatten(style);return'opacity'in flattenedStyle&&flattenedStyle.opacity!=null;}return false;};var getAnimateToValue=function getAnimateToValue(_ref){var isClosing=_ref.closing,currentLayout=_ref.layout,currentGestureDirection=_ref.gestureDirection,currentDirection=_ref.direction,isPreloaded=_ref.preloaded;if(!isClosing&&!isPreloaded){return 0;}return(0,_getDistanceForDirection.getDistanceForDirection)(currentLayout,currentGestureDirection,currentDirection==='rtl');};var defaultOverlay=function defaultOverlay(_ref2){var style=_ref2.style;return style?(0,_jsxRuntime.jsx)(_Animated.default.View,{pointerEvents:"none",style:[styles.overlay,style]}):null;};function Card(_ref3){var _ref3$shadowEnabled=_ref3.shadowEnabled,shadowEnabled=_ref3$shadowEnabled===void 0?false:_ref3$shadowEnabled,_ref3$gestureEnabled=_ref3.gestureEnabled,gestureEnabled=_ref3$gestureEnabled===void 0?true:_ref3$gestureEnabled,_ref3$gestureVelocity=_ref3.gestureVelocityImpact,gestureVelocityImpact=_ref3$gestureVelocity===void 0?GESTURE_VELOCITY_IMPACT:_ref3$gestureVelocity,_ref3$overlay=_ref3.overlay,overlay=_ref3$overlay===void 0?defaultOverlay:_ref3$overlay,animated=_ref3.animated,interpolationIndex=_ref3.interpolationIndex,opening=_ref3.opening,closing=_ref3.closing,next=_ref3.next,current=_ref3.current,gesture=_ref3.gesture,layout=_ref3.layout,insets=_ref3.insets,direction=_ref3.direction,pageOverflowEnabled=_ref3.pageOverflowEnabled,gestureDirection=_ref3.gestureDirection,onOpen=_ref3.onOpen,onClose=_ref3.onClose,onTransition=_ref3.onTransition,onGestureBegin=_ref3.onGestureBegin,onGestureCanceled=_ref3.onGestureCanceled,onGestureEnd=_ref3.onGestureEnd,children=_ref3.children,overlayEnabled=_ref3.overlayEnabled,gestureResponseDistance=_ref3.gestureResponseDistance,transitionSpec=_ref3.transitionSpec,preloaded=_ref3.preloaded,styleInterpolator=_ref3.styleInterpolator,customContainerStyle=_ref3.containerStyle,contentStyle=_ref3.contentStyle;var _React$useReducer=React.useReducer(function(x){return x+1;},0),_React$useReducer2=(0,_slicedToArray2.default)(_React$useReducer,2),forceUpdate=_React$useReducer2[1];var didInitiallyAnimate=React.useRef(false);var lastToValueRef=React.useRef(undefined);var interactionHandleRef=React.useRef(undefined);var animationHandleRef=React.useRef(undefined);var pendingGestureCallbackRef=React.useRef(undefined);var _React$useState=React.useState(function(){return new _Animated.default.Value(FALSE);}),_React$useState2=(0,_slicedToArray2.default)(_React$useState,1),isClosing=_React$useState2[0];var _React$useState3=React.useState(function(){return new _Animated.default.Value((0,_getInvertedMultiplier.getInvertedMultiplier)(gestureDirection,direction==='rtl'));}),_React$useState4=(0,_slicedToArray2.default)(_React$useState3,1),inverted=_React$useState4[0];var _React$useState5=React.useState(function(){return{width:new _Animated.default.Value(layout.width),height:new _Animated.default.Value(layout.height)};}),_React$useState6=(0,_slicedToArray2.default)(_React$useState5,1),layoutAnim=_React$useState6[0];var _React$useState7=React.useState(function(){return new _Animated.default.Value(FALSE);}),_React$useState8=(0,_slicedToArray2.default)(_React$useState7,1),isSwiping=_React$useState8[0];var onStartInteraction=(0,_useLatestCallback.default)(function(){if(interactionHandleRef.current===undefined){interactionHandleRef.current=_InteractionManager.default.createInteractionHandle();}});var onEndInteraction=(0,_useLatestCallback.default)(function(){if(interactionHandleRef.current!==undefined){_InteractionManager.default.clearInteractionHandle(interactionHandleRef.current);interactionHandleRef.current=undefined;}});var animate=(0,_useLatestCallback.default)(function(_ref4){var isClosingParam=_ref4.closing,velocity=_ref4.velocity;var toValue=getAnimateToValue({closing:isClosingParam,layout:layout,gestureDirection:gestureDirection,direction:direction,preloaded:preloaded});lastToValueRef.current=toValue;isClosing.setValue(isClosingParam?TRUE:FALSE);var spec=isClosingParam?transitionSpec.close:transitionSpec.open;var animation=spec.animation==='spring'?_Animated.default.spring:_Animated.default.timing;clearTimeout(pendingGestureCallbackRef.current);if(animationHandleRef.current!==undefined){cancelAnimationFrame(animationHandleRef.current);}onTransition==null||onTransition({closing:isClosingParam,gesture:velocity!==undefined});var onFinish=function onFinish(){if(isClosingParam){onClose();}else{onOpen();}animationHandleRef.current=requestAnimationFrame(function(){if(didInitiallyAnimate.current){forceUpdate();}});};if(animated){onStartInteraction();animation(gesture,Object.assign({},spec.config,{velocity:velocity,toValue:toValue,useNativeDriver:useNativeDriver,isInteraction:false})).start(function(_ref5){var finished=_ref5.finished;onEndInteraction();clearTimeout(pendingGestureCallbackRef.current);if(finished){onFinish();}});}else{onFinish();}});var onGestureStateChange=(0,_useLatestCallback.default)(function(_ref6){var nativeEvent=_ref6.nativeEvent;switch(nativeEvent.state){case _GestureHandler.GestureState.ACTIVE:isSwiping.setValue(TRUE);onStartInteraction();onGestureBegin==null||onGestureBegin();break;case _GestureHandler.GestureState.CANCELLED:case _GestureHandler.GestureState.FAILED:{isSwiping.setValue(FALSE);onEndInteraction();var velocity=gestureDirection==='vertical'||gestureDirection==='vertical-inverted'?nativeEvent.velocityY:nativeEvent.velocityX;animate({closing:closing,velocity:velocity});onGestureCanceled==null||onGestureCanceled();break;}case _GestureHandler.GestureState.END:{isSwiping.setValue(FALSE);var distance;var translation;var _velocity;if(gestureDirection==='vertical'||gestureDirection==='vertical-inverted'){distance=layout.height;translation=nativeEvent.translationY;_velocity=nativeEvent.velocityY;}else{distance=layout.width;translation=nativeEvent.translationX;_velocity=nativeEvent.velocityX;}var shouldClose=(translation+_velocity*gestureVelocityImpact)*(0,_getInvertedMultiplier.getInvertedMultiplier)(gestureDirection,direction==='rtl')>distance/2?_velocity!==0||translation!==0:closing;animate({closing:shouldClose,velocity:_velocity});if(shouldClose){pendingGestureCallbackRef.current=setTimeout(function(){onClose();forceUpdate();},32);}onGestureEnd==null||onGestureEnd();break;}}});React.useLayoutEffect(function(){layoutAnim.width.setValue(layout.width);layoutAnim.height.setValue(layout.height);inverted.setValue((0,_getInvertedMultiplier.getInvertedMultiplier)(gestureDirection,direction==='rtl'));},[gestureDirection,direction,inverted,layoutAnim.width,layoutAnim.height,layout.width,layout.height]);var previousPropsRef=React.useRef(null);React.useEffect(function(){return function(){onEndInteraction();if(animationHandleRef.current){cancelAnimationFrame(animationHandleRef.current);}clearTimeout(pendingGestureCallbackRef.current);};},[]);var timeoutRef=React.useRef(null);React.useEffect(function(){if(preloaded){return;}if(!didInitiallyAnimate.current){if(timeoutRef.current){clearTimeout(timeoutRef.current);}timeoutRef.current=setTimeout(function(){didInitiallyAnimate.current=true;animate({closing:closing});},0);}else{var _previousPropsRef$cur;var previousOpening=(_previousPropsRef$cur=previousPropsRef.current)==null?void 0:_previousPropsRef$cur.opening;var previousToValue=previousPropsRef.current?getAnimateToValue(previousPropsRef.current):null;var toValue=getAnimateToValue({closing:closing,layout:layout,gestureDirection:gestureDirection,direction:direction,preloaded:preloaded});if(previousToValue!==toValue||lastToValueRef.current!==toValue){animate({closing:closing});}else if(typeof previousOpening==='boolean'&&opening&&!previousOpening){gesture.setValue((0,_getDistanceForDirection.getDistanceForDirection)(layout,gestureDirection,direction==='rtl'));animate({closing:closing});}}previousPropsRef.current={opening:opening,closing:closing,layout:layout,gestureDirection:gestureDirection,direction:direction,preloaded:preloaded};},[animate,closing,direction,gesture,gestureDirection,layout,opening,preloaded]);var interpolationProps=React.useMemo(function(){return{index:interpolationIndex,current:{progress:current},next:next&&{progress:next},closing:isClosing,swiping:isSwiping,inverted:inverted,layouts:{screen:layout},insets:{top:insets.top,right:insets.right,bottom:insets.bottom,left:insets.left}};},[interpolationIndex,current,next,isClosing,isSwiping,inverted,layout,insets.top,insets.right,insets.bottom,insets.left]);var _React$useMemo=React.useMemo(function(){return styleInterpolator(interpolationProps);},[styleInterpolator,interpolationProps]),containerStyle=_React$useMemo.containerStyle,cardStyle=_React$useMemo.cardStyle,overlayStyle=_React$useMemo.overlayStyle,shadowStyle=_React$useMemo.shadowStyle;var onGestureEvent=React.useMemo(function(){return gestureEnabled?_Animated.default.event([{nativeEvent:gestureDirection==='vertical'||gestureDirection==='vertical-inverted'?{translationY:gesture}:{translationX:gesture}}],{useNativeDriver:useNativeDriver}):undefined;},[gesture,gestureDirection,gestureEnabled]);var _StyleSheet$flatten=_StyleSheet.default.flatten(contentStyle||{}),backgroundColor=_StyleSheet$flatten.backgroundColor;var isTransparent=typeof backgroundColor==='string'?(0,_color.default)(backgroundColor).alpha()===0:false;return(0,_jsxRuntime.jsxs)(_CardAnimationContext.CardAnimationContext.Provider,{value:interpolationProps,children:[_Platform.default.OS!=='web'?(0,_jsxRuntime.jsx)(_Animated.default.View,{style:{opacity:current},collapsable:false}):null,overlayEnabled?(0,_jsxRuntime.jsx)(_View.default,{pointerEvents:"box-none",style:_StyleSheet.default.absoluteFill,children:overlay({style:overlayStyle})}):null,(0,_jsxRuntime.jsx)(_Animated.default.View,{pointerEvents:"box-none",style:[styles.container,containerStyle,customContainerStyle],children:(0,_jsxRuntime.jsx)(_GestureHandler.PanGestureHandler,Object.assign({enabled:layout.width!==0&&gestureEnabled,onGestureEvent:onGestureEvent,onHandlerStateChange:onGestureStateChange},(0,_gestureActivationCriteria.gestureActivationCriteria)({layout:layout,direction:direction,gestureDirection:gestureDirection,gestureResponseDistance:gestureResponseDistance}),{children:(0,_jsxRuntime.jsxs)(_Animated.default.View,{pointerEvents:"box-none",needsOffscreenAlphaCompositing:hasOpacityStyle(cardStyle),style:[styles.container,cardStyle],children:[shadowEnabled&&shadowStyle&&!isTransparent?(0,_jsxRuntime.jsx)(_Animated.default.View,{pointerEvents:"none",style:[styles.shadow,gestureDirection==='horizontal'?[styles.shadowHorizontal,styles.shadowStart]:gestureDirection==='horizontal-inverted'?[styles.shadowHorizontal,styles.shadowEnd]:gestureDirection==='vertical'?[styles.shadowVertical,styles.shadowTop]:[styles.shadowVertical,styles.shadowBottom],{backgroundColor:backgroundColor},shadowStyle]}):null,(0,_jsxRuntime.jsx)(_CardContent.CardContent,{enabled:pageOverflowEnabled,layout:layout,style:contentStyle,children:children})]})}))})]});}var styles=_StyleSheet.default.create({container:{flex:1},overlay:{flex:1,backgroundColor:'#000'},shadow:{position:'absolute'},shadowHorizontal:Object.assign({top:0,bottom:0,width:3},(0,_getShadowStyle.getShadowStyle)({offset:{width:-1,height:1},radius:5,opacity:0.3})),shadowStart:{start:0},shadowEnd:{end:0},shadowVertical:Object.assign({start:0,end:0,height:3},(0,_getShadowStyle.getShadowStyle)({offset:{width:1,height:-1},radius:5,opacity:0.3})),shadowTop:{top:0},shadowBottom:{bottom:0}});

/***/ },

/***/ 10399
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));Object.defineProperty(exports, "CardAnimationContext", ({enumerable:true,get:function get(){return _CardAnimationContext.CardAnimationContext;}}));exports.CardStyleInterpolators=void 0;Object.defineProperty(exports, "GestureHandlerRefContext", ({enumerable:true,get:function get(){return _GestureHandlerRefContext.GestureHandlerRefContext;}}));Object.defineProperty(exports, "Header", ({enumerable:true,get:function get(){return _Header.Header;}}));exports.HeaderStyleInterpolators=void 0;Object.defineProperty(exports, "StackView", ({enumerable:true,get:function get(){return _StackView.StackView;}}));exports.TransitionSpecs=exports.TransitionPresets=void 0;Object.defineProperty(exports, "createStackNavigator", ({enumerable:true,get:function get(){return _createStackNavigator.createStackNavigator;}}));Object.defineProperty(exports, "useCardAnimation", ({enumerable:true,get:function get(){return _useCardAnimation.useCardAnimation;}}));Object.defineProperty(exports, "useGestureHandlerRef", ({enumerable:true,get:function get(){return _useGestureHandlerRef.useGestureHandlerRef;}}));var CardStyleInterpolators=_interopRequireWildcard(__webpack_require__(16511));exports.CardStyleInterpolators=CardStyleInterpolators;var HeaderStyleInterpolators=_interopRequireWildcard(__webpack_require__(94934));exports.HeaderStyleInterpolators=HeaderStyleInterpolators;var TransitionPresets=_interopRequireWildcard(__webpack_require__(34819));exports.TransitionPresets=TransitionPresets;var TransitionSpecs=_interopRequireWildcard(__webpack_require__(98591));exports.TransitionSpecs=TransitionSpecs;var _createStackNavigator=__webpack_require__(28989);var _Header=__webpack_require__(22357);var _StackView=__webpack_require__(70258);var _CardAnimationContext=__webpack_require__(5588);var _GestureHandlerRefContext=__webpack_require__(5414);var _useCardAnimation=__webpack_require__(7406);var _useGestureHandlerRef=__webpack_require__(91568);function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

/***/ },

/***/ 10734
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(15659);
const route = __webpack_require__(8507);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ },

/***/ 11459
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var TabsHost=_View.default;var _default=exports["default"]=TabsHost;

/***/ },

/***/ 12536
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.getModalRouteKeys=void 0;var getModalRouteKeys=exports.getModalRouteKeys=function getModalRouteKeys(routes,descriptors){return routes.reduce(function(acc,route){var _descriptors$route$ke,_descriptors$route$ke2;var _ref=(_descriptors$route$ke=(_descriptors$route$ke2=descriptors[route.key])==null?void 0:_descriptors$route$ke2.options)!=null?_descriptors$route$ke:{},presentation=_ref.presentation;if(acc.length&&!presentation||presentation==='modal'||presentation==='transparentModal'){acc.push(route.key);}return acc;},[]);};

/***/ },

/***/ 13354
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.getShadowStyle=getShadowStyle;var _color=_interopRequireDefault(__webpack_require__(2520));var _Platform=_interopRequireDefault(__webpack_require__(67862));function getShadowStyle(_ref){var offset=_ref.offset,radius=_ref.radius,opacity=_ref.opacity,_ref$color=_ref.color,color=_ref$color===void 0?'#000':_ref$color;var result=_Platform.default.select({web:{boxShadow:`${offset.width}px ${offset.height}px ${radius}px ${(0,_color.default)(color).alpha(opacity).toString()}`},default:{shadowOffset:offset,shadowRadius:radius,shadowColor:color,shadowOpacity:opacity}});return result;}

/***/ },

/***/ 15659
(module, __unused_webpack_exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(8156);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ },

/***/ 16107
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.ScreenStackHeaderSubview=exports.ScreenStackHeaderSearchBarView=exports.ScreenStackHeaderRightView=exports.ScreenStackHeaderLeftView=exports.ScreenStackHeaderConfig=exports.ScreenStackHeaderCenterView=exports.ScreenStackHeaderBackButtonImage=void 0;var _Image=_interopRequireDefault(__webpack_require__(50728));var _View=_interopRequireDefault(__webpack_require__(9176));var _react=_interopRequireDefault(__webpack_require__(96540));function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r]);}return n;},_extends.apply(null,arguments);}var ScreenStackHeaderBackButtonImage=exports.ScreenStackHeaderBackButtonImage=function ScreenStackHeaderBackButtonImage(props){return _react.default.createElement(_View.default,null,_react.default.createElement(_Image.default,_extends({resizeMode:"center",fadeDuration:0},props)));};var ScreenStackHeaderRightView=exports.ScreenStackHeaderRightView=function ScreenStackHeaderRightView(props){return _react.default.createElement(_View.default,props);};var ScreenStackHeaderLeftView=exports.ScreenStackHeaderLeftView=function ScreenStackHeaderLeftView(props){return _react.default.createElement(_View.default,props);};var ScreenStackHeaderCenterView=exports.ScreenStackHeaderCenterView=function ScreenStackHeaderCenterView(props){return _react.default.createElement(_View.default,props);};var ScreenStackHeaderSearchBarView=exports.ScreenStackHeaderSearchBarView=function ScreenStackHeaderSearchBarView(props){return _react.default.createElement(_View.default,props);};var ScreenStackHeaderConfig=exports.ScreenStackHeaderConfig=function ScreenStackHeaderConfig(props){return _react.default.createElement(_View.default,props);};var ScreenStackHeaderSubview=exports.ScreenStackHeaderSubview=_View.default;

/***/ },

/***/ 16368
(module) {

"use strict";


module.exports = value => {
	if (Object.prototype.toString.call(value) !== '[object Object]') {
		return false;
	}

	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
};


/***/ },

/***/ 16511
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.forBottomSheetAndroid=forBottomSheetAndroid;exports.forFadeFromBottomAndroid=forFadeFromBottomAndroid;exports.forFadeFromCenter=forFadeFromCenter;exports.forFadeFromRightAndroid=forFadeFromRightAndroid;exports.forHorizontalIOS=forHorizontalIOS;exports.forHorizontalIOSInverted=forHorizontalIOSInverted;exports.forModalPresentationIOS=forModalPresentationIOS;exports.forNoAnimation=forNoAnimation;exports.forRevealFromBottomAndroid=forRevealFromBottomAndroid;exports.forScaleFromCenterAndroid=forScaleFromCenterAndroid;exports.forVerticalIOS=forVerticalIOS;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var _Animated=_interopRequireDefault(__webpack_require__(48831));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _conditional=__webpack_require__(58269);var _excluded=["inverted"];var add=_Animated.default.add,multiply=_Animated.default.multiply;function forHorizontalIOS(_ref){var current=_ref.current,next=_ref.next,inverted=_ref.inverted,screen=_ref.layouts.screen;var translateFocused=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.width,0],extrapolate:'clamp'}),inverted);var translateUnfocused=next?multiply(next.progress.interpolate({inputRange:[0,1],outputRange:[0,screen.width*-0.3],extrapolate:'clamp'}),inverted):0;var overlayOpacity=current.progress.interpolate({inputRange:[0,1],outputRange:[0,0.07],extrapolate:'clamp'});var shadowOpacity=current.progress.interpolate({inputRange:[0,1],outputRange:[0,0.3],extrapolate:'clamp'});return{cardStyle:{transform:[{translateX:translateFocused},{translateX:translateUnfocused}]},overlayStyle:{opacity:overlayOpacity},shadowStyle:{shadowOpacity:shadowOpacity}};}function forHorizontalIOSInverted(_ref2){var inverted=_ref2.inverted,rest=(0,_objectWithoutProperties2.default)(_ref2,_excluded);return forHorizontalIOS(Object.assign({},rest,{inverted:_Animated.default.multiply(inverted,-1)}));}function forVerticalIOS(_ref3){var current=_ref3.current,inverted=_ref3.inverted,screen=_ref3.layouts.screen;var translateY=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.height,0],extrapolate:'clamp'}),inverted);return{cardStyle:{transform:[{translateY:translateY}]}};}function forModalPresentationIOS(_ref4){var index=_ref4.index,current=_ref4.current,next=_ref4.next,inverted=_ref4.inverted,screen=_ref4.layouts.screen,insets=_ref4.insets;var hasNotchIos=_Platform.default.OS==='ios'&&!_Platform.default.isPad&&!_Platform.default.isTV&&insets.top>20;var isLandscape=screen.width>screen.height;var topOffset=isLandscape?0:10;var statusBarHeight=insets.top;var aspectRatio=screen.height/screen.width;var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var isFirst=index===0;var translateY=multiply(progress.interpolate({inputRange:[0,1,2],outputRange:[screen.height,isFirst?0:topOffset,(isFirst?statusBarHeight:0)-topOffset*aspectRatio]}),inverted);var overlayOpacity=progress.interpolate({inputRange:[0,1,1.0001,2],outputRange:[0,0.3,1,1]});var scale=isLandscape?1:progress.interpolate({inputRange:[0,1,2],outputRange:[1,1,screen.width?1-topOffset*2/screen.width:1]});var borderRadius=isLandscape?0:isFirst?progress.interpolate({inputRange:[0,1,1.0001,2],outputRange:[0,0,hasNotchIos?38:0,10]}):10;return{cardStyle:{overflow:'hidden',borderCurve:'continuous',borderTopLeftRadius:borderRadius,borderTopRightRadius:borderRadius,borderBottomLeftRadius:hasNotchIos?borderRadius:0,borderBottomRightRadius:hasNotchIos?borderRadius:0,marginTop:isFirst?0:statusBarHeight,marginBottom:isFirst?0:topOffset,transform:[{translateY:translateY},{scale:scale}]},overlayStyle:{opacity:overlayOpacity}};}function forFadeFromBottomAndroid(_ref5){var current=_ref5.current,inverted=_ref5.inverted,screen=_ref5.layouts.screen,closing=_ref5.closing;var translateY=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.height*0.08,0],extrapolate:'clamp'}),inverted);var opacity=(0,_conditional.conditional)(closing,current.progress,current.progress.interpolate({inputRange:[0,0.5,0.9,1],outputRange:[0,0.25,0.7,1],extrapolate:'clamp'}));return{cardStyle:{opacity:opacity,transform:[{translateY:translateY}]}};}function forRevealFromBottomAndroid(_ref6){var current=_ref6.current,next=_ref6.next,inverted=_ref6.inverted,screen=_ref6.layouts.screen;var containerTranslateY=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.height,0],extrapolate:'clamp'}),inverted);var cardTranslateYFocused=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.height*(95.9/100)*-1,0],extrapolate:'clamp'}),inverted);var cardTranslateYUnfocused=next?multiply(next.progress.interpolate({inputRange:[0,1],outputRange:[0,screen.height*(2/100)*-1],extrapolate:'clamp'}),inverted):0;var overlayOpacity=current.progress.interpolate({inputRange:[0,0.36,1],outputRange:[0,0.1,0.1],extrapolate:'clamp'});return{containerStyle:{overflow:'hidden',transform:[{translateY:containerTranslateY}]},cardStyle:{transform:[{translateY:cardTranslateYFocused},{translateY:cardTranslateYUnfocused}]},overlayStyle:{opacity:overlayOpacity}};}function forScaleFromCenterAndroid(_ref7){var current=_ref7.current,next=_ref7.next,closing=_ref7.closing;var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var opacity=progress.interpolate({inputRange:[0,0.75,0.875,1,1.0825,1.2075,2],outputRange:[0,0,1,1,1,1,0]});var scale=(0,_conditional.conditional)(closing,current.progress.interpolate({inputRange:[0,1],outputRange:[0.925,1],extrapolate:'clamp'}),progress.interpolate({inputRange:[0,1,2],outputRange:[0.85,1,1.075]}));return{cardStyle:{opacity:opacity,transform:[{scale:scale}]}};}function forFadeFromRightAndroid(_ref8){var current=_ref8.current,next=_ref8.next,inverted=_ref8.inverted,closing=_ref8.closing;var translateFocused=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[96,0],extrapolate:'clamp'}),inverted);var translateUnfocused=next?multiply(next.progress.interpolate({inputRange:[0,1],outputRange:[0,-96],extrapolate:'clamp'}),inverted):0;var opacity=(0,_conditional.conditional)(closing,current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),current.progress);return{cardStyle:{opacity:opacity,transform:[{translateX:translateFocused},{translateX:translateUnfocused}]}};}function forBottomSheetAndroid(_ref9){var current=_ref9.current,inverted=_ref9.inverted,screen=_ref9.layouts.screen,closing=_ref9.closing;var translateY=multiply(current.progress.interpolate({inputRange:[0,1],outputRange:[screen.height*0.8,0],extrapolate:'clamp'}),inverted);var opacity=(0,_conditional.conditional)(closing,current.progress,current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}));var overlayOpacity=current.progress.interpolate({inputRange:[0,1],outputRange:[0,0.3],extrapolate:'clamp'});return{cardStyle:{opacity:opacity,transform:[{translateY:translateY}]},overlayStyle:{opacity:overlayOpacity}};}function forFadeFromCenter(_ref0){var progress=_ref0.current.progress;return{cardStyle:{opacity:progress.interpolate({inputRange:[0,0.5,0.9,1],outputRange:[0,0.25,0.7,1]})},overlayStyle:{opacity:progress.interpolate({inputRange:[0,1],outputRange:[0,0.5],extrapolate:'clamp'})}};}function forNoAnimation(){return{};}

/***/ },

/***/ 19872
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(83496);

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle = module.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle.wrap = function (fn) {
	return function () {
		return fn(swizzle(arguments));
	};
};


/***/ },

/***/ 19989
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.ModalPresentationContext=void 0;var React=_interopRequireWildcard(__webpack_require__(96540));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var ModalPresentationContext=exports.ModalPresentationContext=React.createContext(false);

/***/ },

/***/ 20239
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.MaybeScreenContainer=exports.MaybeScreen=void 0;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var React=_interopRequireWildcard(__webpack_require__(96540));var _View=_interopRequireDefault(__webpack_require__(9176));var _jsxRuntime=__webpack_require__(74848);var _excluded=["enabled"],_excluded2=["enabled","active"];var _this=(/* unused pure expression or super */ null && (this)),_jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Screens.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var Screens;try{Screens=__webpack_require__(21547);}catch(e){}var MaybeScreenContainer=exports.MaybeScreenContainer=function MaybeScreenContainer(_ref){var enabled=_ref.enabled,rest=(0,_objectWithoutProperties2.default)(_ref,_excluded);if(Screens!=null){return(0,_jsxRuntime.jsx)(Screens.ScreenContainer,Object.assign({enabled:enabled},rest));}return(0,_jsxRuntime.jsx)(_View.default,Object.assign({},rest));};var MaybeScreen=exports.MaybeScreen=function MaybeScreen(_ref2){var enabled=_ref2.enabled,active=_ref2.active,rest=(0,_objectWithoutProperties2.default)(_ref2,_excluded2);if(Screens!=null){return(0,_jsxRuntime.jsx)(Screens.Screen,Object.assign({enabled:enabled,activityState:active},rest));}return(0,_jsxRuntime.jsx)(_View.default,Object.assign({},rest));};

/***/ },

/***/ 21547
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));var _exportNames={enableScreens:true,enableFreeze:true,screensEnabled:true,freezeEnabled:true,Screen:true,InnerScreen:true,ScreenContext:true,ScreenStackHeaderConfig:true,ScreenStackHeaderSubview:true,ScreenStackHeaderLeftView:true,ScreenStackHeaderCenterView:true,ScreenStackHeaderRightView:true,ScreenStackHeaderBackButtonImage:true,ScreenStackHeaderSearchBarView:true,SearchBar:true,ScreenContainer:true,ScreenStack:true,ScreenStackItem:true,FullWindowOverlay:true,ScreenFooter:true,ScreenContentWrapper:true,isSearchBarAvailableForCurrentPlatform:true,executeNativeBackPress:true,compatibilityFlags:true,featureFlags:true,useTransitionProgress:true,Tabs:true};Object.defineProperty(exports, "FullWindowOverlay", ({enumerable:true,get:function get(){return _FullWindowOverlay.default;}}));Object.defineProperty(exports, "InnerScreen", ({enumerable:true,get:function get(){return _Screen.InnerScreen;}}));Object.defineProperty(exports, "Screen", ({enumerable:true,get:function get(){return _Screen.default;}}));Object.defineProperty(exports, "ScreenContainer", ({enumerable:true,get:function get(){return _ScreenContainer.default;}}));Object.defineProperty(exports, "ScreenContentWrapper", ({enumerable:true,get:function get(){return _ScreenContentWrapper.default;}}));Object.defineProperty(exports, "ScreenContext", ({enumerable:true,get:function get(){return _Screen.ScreenContext;}}));Object.defineProperty(exports, "ScreenFooter", ({enumerable:true,get:function get(){return _ScreenFooter.default;}}));Object.defineProperty(exports, "ScreenStack", ({enumerable:true,get:function get(){return _ScreenStack.default;}}));Object.defineProperty(exports, "ScreenStackHeaderBackButtonImage", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderBackButtonImage;}}));Object.defineProperty(exports, "ScreenStackHeaderCenterView", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderCenterView;}}));Object.defineProperty(exports, "ScreenStackHeaderConfig", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderConfig;}}));Object.defineProperty(exports, "ScreenStackHeaderLeftView", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderLeftView;}}));Object.defineProperty(exports, "ScreenStackHeaderRightView", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderRightView;}}));Object.defineProperty(exports, "ScreenStackHeaderSearchBarView", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderSearchBarView;}}));Object.defineProperty(exports, "ScreenStackHeaderSubview", ({enumerable:true,get:function get(){return _ScreenStackHeaderConfig.ScreenStackHeaderSubview;}}));Object.defineProperty(exports, "ScreenStackItem", ({enumerable:true,get:function get(){return _ScreenStackItem.default;}}));Object.defineProperty(exports, "SearchBar", ({enumerable:true,get:function get(){return _SearchBar.default;}}));Object.defineProperty(exports, "Tabs", ({enumerable:true,get:function get(){return _tabs.default;}}));Object.defineProperty(exports, "compatibilityFlags", ({enumerable:true,get:function get(){return _flags.compatibilityFlags;}}));Object.defineProperty(exports, "enableFreeze", ({enumerable:true,get:function get(){return _core.enableFreeze;}}));Object.defineProperty(exports, "enableScreens", ({enumerable:true,get:function get(){return _core.enableScreens;}}));Object.defineProperty(exports, "executeNativeBackPress", ({enumerable:true,get:function get(){return _utils.executeNativeBackPress;}}));Object.defineProperty(exports, "featureFlags", ({enumerable:true,get:function get(){return _flags.featureFlags;}}));Object.defineProperty(exports, "freezeEnabled", ({enumerable:true,get:function get(){return _core.freezeEnabled;}}));Object.defineProperty(exports, "isSearchBarAvailableForCurrentPlatform", ({enumerable:true,get:function get(){return _utils.isSearchBarAvailableForCurrentPlatform;}}));Object.defineProperty(exports, "screensEnabled", ({enumerable:true,get:function get(){return _core.screensEnabled;}}));Object.defineProperty(exports, "useTransitionProgress", ({enumerable:true,get:function get(){return _useTransitionProgress.default;}}));__webpack_require__(82949);var _types=__webpack_require__(64778);Object.keys(_types).forEach(function(key){if(key==="default"||key==="__esModule")return;if(Object.prototype.hasOwnProperty.call(_exportNames,key))return;if(key in exports&&exports[key]===_types[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _types[key];}});});var _core=__webpack_require__(84644);var _Screen=_interopRequireWildcard(__webpack_require__(93126));var _ScreenStackHeaderConfig=__webpack_require__(16107);var _SearchBar=_interopRequireDefault(__webpack_require__(53853));var _ScreenContainer=_interopRequireDefault(__webpack_require__(1995));var _ScreenStack=_interopRequireDefault(__webpack_require__(68384));var _ScreenStackItem=_interopRequireDefault(__webpack_require__(42599));var _FullWindowOverlay=_interopRequireDefault(__webpack_require__(99303));var _ScreenFooter=_interopRequireDefault(__webpack_require__(5629));var _ScreenContentWrapper=_interopRequireDefault(__webpack_require__(46582));var _utils=__webpack_require__(27670);var _flags=__webpack_require__(30064);var _useTransitionProgress=_interopRequireDefault(__webpack_require__(67316));var _tabs=_interopRequireDefault(__webpack_require__(59121));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}

/***/ },

/***/ 21979
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.gestureActivationCriteria=void 0;var _getInvertedMultiplier=__webpack_require__(22539);var GESTURE_RESPONSE_DISTANCE_HORIZONTAL=50;var GESTURE_RESPONSE_DISTANCE_VERTICAL=135;var gestureActivationCriteria=exports.gestureActivationCriteria=function gestureActivationCriteria(_ref){var direction=_ref.direction,gestureDirection=_ref.gestureDirection,gestureResponseDistance=_ref.gestureResponseDistance,layout=_ref.layout;var enableTrackpadTwoFingerGesture=true;var distance=gestureResponseDistance!==undefined?gestureResponseDistance:gestureDirection==='vertical'||gestureDirection==='vertical-inverted'?GESTURE_RESPONSE_DISTANCE_VERTICAL:GESTURE_RESPONSE_DISTANCE_HORIZONTAL;if(gestureDirection==='vertical'){return{maxDeltaX:15,minOffsetY:5,hitSlop:{bottom:-layout.height+distance},enableTrackpadTwoFingerGesture:enableTrackpadTwoFingerGesture};}else if(gestureDirection==='vertical-inverted'){return{maxDeltaX:15,minOffsetY:-5,hitSlop:{top:-layout.height+distance},enableTrackpadTwoFingerGesture:enableTrackpadTwoFingerGesture};}else{var hitSlop=-layout.width+distance;var invertedMultiplier=(0,_getInvertedMultiplier.getInvertedMultiplier)(gestureDirection,direction==='rtl');if(invertedMultiplier===1){return{minOffsetX:5,maxDeltaY:20,hitSlop:{right:hitSlop},enableTrackpadTwoFingerGesture:enableTrackpadTwoFingerGesture};}else{return{minOffsetX:-5,maxDeltaY:20,hitSlop:{left:hitSlop},enableTrackpadTwoFingerGesture:enableTrackpadTwoFingerGesture};}}};

/***/ },

/***/ 22357
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.Header=void 0;var _elements=__webpack_require__(31755);var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _reactNativeSafeAreaContext=__webpack_require__(1913);var _ModalPresentationContext=__webpack_require__(19989);var _throttle=__webpack_require__(72833);var _HeaderSegment=__webpack_require__(5626);var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Header\\Header.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var Header=exports.Header=React.memo(function Header(_ref){var back=_ref.back,layout=_ref.layout,progress=_ref.progress,options=_ref.options,route=_ref.route,navigation=_ref.navigation,styleInterpolator=_ref.styleInterpolator;var insets=(0,_reactNativeSafeAreaContext.useSafeAreaInsets)();var previousTitle;if(options.headerBackTitle!==undefined){previousTitle=options.headerBackTitle;}else if(back){previousTitle=back.title;}var goBack=React.useCallback((0,_throttle.throttle)(function(){if(navigation.isFocused()&&navigation.canGoBack()){navigation.dispatch(Object.assign({},_native.StackActions.pop(),{source:route.key}));}},50),[navigation,route.key]);var isModal=React.useContext(_ModalPresentationContext.ModalPresentationContext);var isParentHeaderShown=React.useContext(_elements.HeaderShownContext);var statusBarHeight=options.headerStatusBarHeight!==undefined?options.headerStatusBarHeight:isModal||isParentHeaderShown?0:insets.top;return(0,_jsxRuntime.jsx)(_HeaderSegment.HeaderSegment,Object.assign({},options,{title:(0,_elements.getHeaderTitle)(options,route.name),progress:progress,layout:layout,modal:isModal,headerBackTitle:options.headerBackTitle!==undefined?options.headerBackTitle:previousTitle,headerStatusBarHeight:statusBarHeight,onGoBack:back?goBack:undefined,backHref:back?back.href:undefined,styleInterpolator:styleInterpolator}));});

/***/ },

/***/ 22539
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.getInvertedMultiplier=getInvertedMultiplier;function getInvertedMultiplier(gestureDirection,isRTL){switch(gestureDirection){case'vertical':return 1;case'vertical-inverted':return-1;case'horizontal':return isRTL?-1:1;case'horizontal-inverted':return isRTL?1:-1;}}

/***/ },

/***/ 22713
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.PanGestureHandler=exports.GestureState=exports.GestureHandlerRootView=void 0;var React=_interopRequireWildcard(__webpack_require__(96540));var _View=_interopRequireDefault(__webpack_require__(9176));var _jsxRuntime=__webpack_require__(74848);function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var Dummy=function Dummy(_ref){var children=_ref.children;return(0,_jsxRuntime.jsx)(_jsxRuntime.Fragment,{children:children});};var PanGestureHandler=exports.PanGestureHandler=Dummy;var GestureHandlerRootView=exports.GestureHandlerRootView=_View.default;var GestureState=exports.GestureState={UNDETERMINED:0,FAILED:1,BEGAN:2,CANCELLED:3,ACTIVE:4,END:5};

/***/ },

/***/ 25470
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58168);
/* harmony import */ var _babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98587);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96540);
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9176);
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use client';



var _excluded = ["behavior", "contentContainerStyle", "keyboardVerticalOffset"];


class KeyboardAvoidingView extends react__WEBPACK_IMPORTED_MODULE_2__.Component {
  constructor() {
    super(...arguments);
    this.frame = null;
    this.onLayout = event => {
      this.frame = event.nativeEvent.layout;
    };
  }
  relativeKeyboardHeight(keyboardFrame) {
    var frame = this.frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }
    var keyboardY = keyboardFrame.screenY - (this.props.keyboardVerticalOffset || 0);
    return Math.max(frame.y + frame.height - keyboardY, 0);
  }
  onKeyboardChange(event) {}
  render() {
    var _this$props = this.props,
      behavior = _this$props.behavior,
      contentContainerStyle = _this$props.contentContainerStyle,
      keyboardVerticalOffset = _this$props.keyboardVerticalOffset,
      rest = (0,_babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(_this$props, _excluded);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_View__WEBPACK_IMPORTED_MODULE_3__["default"], (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)({
      onLayout: this.onLayout
    }, rest));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KeyboardAvoidingView);

/***/ },

/***/ 27670
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.executeNativeBackPress=executeNativeBackPress;exports.isSearchBarAvailableForCurrentPlatform=exports.isHeaderBarButtonsAvailableForCurrentPlatform=void 0;exports.parseBooleanToOptionalBooleanNativeProp=parseBooleanToOptionalBooleanNativeProp;var _BackHandler=_interopRequireDefault(__webpack_require__(89742));var _Platform=_interopRequireDefault(__webpack_require__(67862));var isSearchBarAvailableForCurrentPlatform=exports.isSearchBarAvailableForCurrentPlatform=['ios','android'].includes(_Platform.default.OS);var isHeaderBarButtonsAvailableForCurrentPlatform=exports.isHeaderBarButtonsAvailableForCurrentPlatform=_Platform.default.OS==='ios';function executeNativeBackPress(){_BackHandler.default.exitApp();return true;}function parseBooleanToOptionalBooleanNativeProp(prop){switch(prop){case undefined:return'undefined';case true:return'true';case false:return'false';}}

/***/ },

/***/ 28854
(module, __unused_webpack_exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(8156);
var swizzle = __webpack_require__(19872);
var hasOwnProperty = Object.hasOwnProperty;

var reverseNames = Object.create(null);

// create a list of reverse color names
for (var name in colorNames) {
	if (hasOwnProperty.call(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = module.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var keyword = /^(\w+)$/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!hasOwnProperty.call(colorNames, match[1])) {
			return null;
		}

		rgb = colorNames[match[1]];
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = Math.round(num).toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}


/***/ },

/***/ 28989
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.createStackNavigator=createStackNavigator;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _StackView=__webpack_require__(70258);var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\navigators\\createStackNavigator.tsx";var _excluded=["id","initialRouteName","UNSTABLE_routeNamesChangeBehavior","children","layout","screenListeners","screenOptions","screenLayout","UNSTABLE_router"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function StackNavigator(_ref){var id=_ref.id,initialRouteName=_ref.initialRouteName,UNSTABLE_routeNamesChangeBehavior=_ref.UNSTABLE_routeNamesChangeBehavior,children=_ref.children,layout=_ref.layout,screenListeners=_ref.screenListeners,screenOptions=_ref.screenOptions,screenLayout=_ref.screenLayout,UNSTABLE_router=_ref.UNSTABLE_router,rest=(0,_objectWithoutProperties2.default)(_ref,_excluded);var _useLocale=(0,_native.useLocale)(),direction=_useLocale.direction;var _useNavigationBuilder=(0,_native.useNavigationBuilder)(_native.StackRouter,{id:id,initialRouteName:initialRouteName,UNSTABLE_routeNamesChangeBehavior:UNSTABLE_routeNamesChangeBehavior,children:children,layout:layout,screenListeners:screenListeners,screenOptions:screenOptions,screenLayout:screenLayout,UNSTABLE_router:UNSTABLE_router}),state=_useNavigationBuilder.state,describe=_useNavigationBuilder.describe,descriptors=_useNavigationBuilder.descriptors,navigation=_useNavigationBuilder.navigation,NavigationContent=_useNavigationBuilder.NavigationContent;React.useEffect(function(){return(navigation.addListener==null?void 0:navigation.addListener('tabPress',function(e){var isFocused=navigation.isFocused();requestAnimationFrame(function(){if(state.index>0&&isFocused&&!e.defaultPrevented){navigation.dispatch(Object.assign({},_native.StackActions.popToTop(),{target:state.key}));}});}));},[navigation,state.index,state.key]);return(0,_jsxRuntime.jsx)(NavigationContent,{children:(0,_jsxRuntime.jsx)(_StackView.StackView,Object.assign({},rest,{direction:direction,state:state,describe:describe,descriptors:descriptors,navigation:navigation}))});}function createStackNavigator(config){return(0,_native.createNavigatorFactory)(StackNavigator)(config);}

/***/ },

/***/ 29716
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=DebugContainer;var React=_interopRequireWildcard(__webpack_require__(96540));var _ScreenContentWrapper=_interopRequireDefault(__webpack_require__(46582));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function DebugContainer(props){return React.createElement(_ScreenContentWrapper.default,props);}

/***/ },

/***/ 30064
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.featureFlags=exports["default"]=exports.compatibilityFlags=void 0;var RNS_CONTROLLED_BOTTOM_TABS_DEFAULT=false;var RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT=false;var RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT=false;var RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT=false;var RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT=true;var compatibilityFlags=exports.compatibilityFlags={isNewBackTitleImplementation:true,usesHeaderFlexboxImplementation:true,usesNewAndroidHeaderHeightImplementation:true};var _featureFlags={experiment:{controlledBottomTabs:RNS_CONTROLLED_BOTTOM_TABS_DEFAULT,synchronousScreenUpdatesEnabled:RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT,synchronousHeaderConfigUpdatesEnabled:RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT,synchronousHeaderSubviewUpdatesEnabled:RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT,androidResetScreenShadowStateOnOrientationChangeEnabled:RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT},stable:{}};var createExperimentalFeatureFlagAccessor=function createExperimentalFeatureFlagAccessor(key,defaultValue){return{get:function get(){return _featureFlags.experiment[key];},set:function set(value){if(value!==_featureFlags.experiment[key]&&_featureFlags.experiment[key]!==defaultValue){console.error(`[RNScreens] ${key} feature flag modified for a second time; this might lead to unexpected effects`);}_featureFlags.experiment[key]=value;}};};var controlledBottomTabsAccessor=createExperimentalFeatureFlagAccessor('controlledBottomTabs',RNS_CONTROLLED_BOTTOM_TABS_DEFAULT);var synchronousScreenUpdatesAccessor=createExperimentalFeatureFlagAccessor('synchronousScreenUpdatesEnabled',RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT);var synchronousHeaderConfigUpdatesAccessor=createExperimentalFeatureFlagAccessor('synchronousHeaderConfigUpdatesEnabled',RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT);var synchronousHeaderSubviewUpdatesAccessor=createExperimentalFeatureFlagAccessor('synchronousHeaderSubviewUpdatesEnabled',RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT);var androidResetScreenShadowStateOnOrientationChangeAccessor=createExperimentalFeatureFlagAccessor('androidResetScreenShadowStateOnOrientationChangeEnabled',RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT);var featureFlags=exports.featureFlags={experiment:{get controlledBottomTabs(){return controlledBottomTabsAccessor.get();},set controlledBottomTabs(value){controlledBottomTabsAccessor.set(value);},get synchronousScreenUpdatesEnabled(){return synchronousScreenUpdatesAccessor.get();},set synchronousScreenUpdatesEnabled(value){synchronousScreenUpdatesAccessor.set(value);},get synchronousHeaderConfigUpdatesEnabled(){return synchronousHeaderConfigUpdatesAccessor.get();},set synchronousHeaderConfigUpdatesEnabled(value){synchronousHeaderConfigUpdatesAccessor.set(value);},get synchronousHeaderSubviewUpdatesEnabled(){return synchronousHeaderSubviewUpdatesAccessor.get();},set synchronousHeaderSubviewUpdatesEnabled(value){synchronousHeaderSubviewUpdatesAccessor.set(value);},get androidResetScreenShadowStateOnOrientationChangeEnabled(){return androidResetScreenShadowStateOnOrientationChangeAccessor.get();},set androidResetScreenShadowStateOnOrientationChangeEnabled(value){androidResetScreenShadowStateOnOrientationChangeAccessor.set(value);}},stable:{}};var _default=exports["default"]=featureFlags;

/***/ },

/***/ 30879
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.RNSScreensRefContext=exports.GHContext=void 0;var _react=_interopRequireDefault(__webpack_require__(96540));var GHContext=exports.GHContext=_react.default.createContext(function(props){return _react.default.createElement(_react.default.Fragment,null,props.children);});var RNSScreensRefContext=exports.RNSScreensRefContext=_react.default.createContext(null);

/***/ },

/***/ 31755
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});var _exportNames={Assets:true,Background:true,Badge:true,Button:true,getDefaultSidebarWidth:true,getDefaultHeaderHeight:true,getHeaderTitle:true,Header:true,HeaderBackButton:true,HeaderBackContext:true,HeaderBackground:true,HeaderButton:true,HeaderHeightContext:true,HeaderShownContext:true,HeaderTitle:true,useHeaderHeight:true,getLabel:true,Label:true,Lazy:true,MissingIcon:true,PlatformPressable:true,ResourceSavingView:true,SafeAreaProviderCompat:true,Screen:true,Text:true,useFrameSize:true};exports.Assets=void 0;Object.defineProperty(exports,"Background",{enumerable:true,get:function get(){return _Background.Background;}});Object.defineProperty(exports,"Badge",{enumerable:true,get:function get(){return _Badge.Badge;}});Object.defineProperty(exports,"Button",{enumerable:true,get:function get(){return _Button.Button;}});Object.defineProperty(exports,"Header",{enumerable:true,get:function get(){return _Header.Header;}});Object.defineProperty(exports,"HeaderBackButton",{enumerable:true,get:function get(){return _HeaderBackButton.HeaderBackButton;}});Object.defineProperty(exports,"HeaderBackContext",{enumerable:true,get:function get(){return _HeaderBackContext.HeaderBackContext;}});Object.defineProperty(exports,"HeaderBackground",{enumerable:true,get:function get(){return _HeaderBackground.HeaderBackground;}});Object.defineProperty(exports,"HeaderButton",{enumerable:true,get:function get(){return _HeaderButton.HeaderButton;}});Object.defineProperty(exports,"HeaderHeightContext",{enumerable:true,get:function get(){return _HeaderHeightContext.HeaderHeightContext;}});Object.defineProperty(exports,"HeaderShownContext",{enumerable:true,get:function get(){return _HeaderShownContext.HeaderShownContext;}});Object.defineProperty(exports,"HeaderTitle",{enumerable:true,get:function get(){return _HeaderTitle.HeaderTitle;}});Object.defineProperty(exports,"Label",{enumerable:true,get:function get(){return _Label.Label;}});Object.defineProperty(exports,"Lazy",{enumerable:true,get:function get(){return _Lazy.Lazy;}});Object.defineProperty(exports,"MissingIcon",{enumerable:true,get:function get(){return _MissingIcon.MissingIcon;}});Object.defineProperty(exports,"PlatformPressable",{enumerable:true,get:function get(){return _PlatformPressable.PlatformPressable;}});Object.defineProperty(exports,"ResourceSavingView",{enumerable:true,get:function get(){return _ResourceSavingView.ResourceSavingView;}});Object.defineProperty(exports,"SafeAreaProviderCompat",{enumerable:true,get:function get(){return _SafeAreaProviderCompat.SafeAreaProviderCompat;}});Object.defineProperty(exports,"Screen",{enumerable:true,get:function get(){return _Screen.Screen;}});Object.defineProperty(exports,"Text",{enumerable:true,get:function get(){return _Text.Text;}});Object.defineProperty(exports,"getDefaultHeaderHeight",{enumerable:true,get:function get(){return _getDefaultHeaderHeight.getDefaultHeaderHeight;}});Object.defineProperty(exports,"getDefaultSidebarWidth",{enumerable:true,get:function get(){return _getDefaultSidebarWidth.getDefaultSidebarWidth;}});Object.defineProperty(exports,"getHeaderTitle",{enumerable:true,get:function get(){return _getHeaderTitle.getHeaderTitle;}});Object.defineProperty(exports,"getLabel",{enumerable:true,get:function get(){return _getLabel.getLabel;}});Object.defineProperty(exports,"useFrameSize",{enumerable:true,get:function get(){return _useFrameSize.useFrameSize;}});Object.defineProperty(exports,"useHeaderHeight",{enumerable:true,get:function get(){return _useHeaderHeight.useHeaderHeight;}});var _backIcon=_interopRequireDefault(require("./assets/back-icon.png"));var _backIconMask=_interopRequireDefault(require("./assets/back-icon-mask.png"));var _clearIcon=_interopRequireDefault(require("./assets/clear-icon.png"));var _closeIcon=_interopRequireDefault(require("./assets/close-icon.png"));var _searchIcon=_interopRequireDefault(require("./assets/search-icon.png"));var _Background=require("./Background.js");var _Badge=require("./Badge.js");var _Button=require("./Button.js");var _getDefaultSidebarWidth=require("./getDefaultSidebarWidth.js");var _getDefaultHeaderHeight=require("./Header/getDefaultHeaderHeight.js");var _getHeaderTitle=require("./Header/getHeaderTitle.js");var _Header=require("./Header/Header.js");var _HeaderBackButton=require("./Header/HeaderBackButton.js");var _HeaderBackContext=require("./Header/HeaderBackContext.js");var _HeaderBackground=require("./Header/HeaderBackground.js");var _HeaderButton=require("./Header/HeaderButton.js");var _HeaderHeightContext=require("./Header/HeaderHeightContext.js");var _HeaderShownContext=require("./Header/HeaderShownContext.js");var _HeaderTitle=require("./Header/HeaderTitle.js");var _useHeaderHeight=require("./Header/useHeaderHeight.js");var _getLabel=require("./Label/getLabel.js");var _Label=require("./Label/Label.js");var _Lazy=require("./Lazy.js");var _MissingIcon=require("./MissingIcon.js");var _PlatformPressable=require("./PlatformPressable.js");var _ResourceSavingView=require("./ResourceSavingView.js");var _SafeAreaProviderCompat=require("./SafeAreaProviderCompat.js");var _Screen=require("./Screen.js");var _Text=require("./Text.js");var _useFrameSize=require("./useFrameSize.js");var _types=require("./types.js");Object.keys(_types).forEach(function(key){if(key==="default"||key==="__esModule")return;if(Object.prototype.hasOwnProperty.call(_exportNames,key))return;if(key in exports&&exports[key]===_types[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _types[key];}});});var Assets=exports.Assets=[_backIcon.default,_backIconMask.default,_searchIcon.default,_closeIcon.default,_clearIcon.default];

/***/ },

/***/ 34819
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.SlideFromRightIOS=exports.SlideFromLeftIOS=exports.ScaleFromCenterAndroid=exports.RevealFromBottomAndroid=exports.ModalTransition=exports.ModalSlideFromBottomIOS=exports.ModalPresentationIOS=exports.ModalFadeTransition=exports.FadeFromRightAndroid=exports.FadeFromBottomAndroid=exports.DefaultTransition=exports.BottomSheetAndroid=void 0;var _Platform=_interopRequireDefault(__webpack_require__(67862));var _CardStyleInterpolators=__webpack_require__(16511);var _HeaderStyleInterpolators=__webpack_require__(94934);var _TransitionSpecs=__webpack_require__(98591);var ANDROID_VERSION_PIE=28;var ANDROID_VERSION_10=29;var ANDROID_VERSION_14=34;var SlideFromRightIOS=exports.SlideFromRightIOS={gestureDirection:'horizontal',transitionSpec:{open:_TransitionSpecs.TransitionIOSSpec,close:_TransitionSpecs.TransitionIOSSpec},cardStyleInterpolator:_CardStyleInterpolators.forHorizontalIOS,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var ModalSlideFromBottomIOS=exports.ModalSlideFromBottomIOS={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.TransitionIOSSpec,close:_TransitionSpecs.TransitionIOSSpec},cardStyleInterpolator:_CardStyleInterpolators.forVerticalIOS,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var ModalPresentationIOS=exports.ModalPresentationIOS={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.TransitionIOSSpec,close:_TransitionSpecs.TransitionIOSSpec},cardStyleInterpolator:_CardStyleInterpolators.forModalPresentationIOS,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var FadeFromBottomAndroid=exports.FadeFromBottomAndroid={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.FadeInFromBottomAndroidSpec,close:_TransitionSpecs.FadeOutToBottomAndroidSpec},cardStyleInterpolator:_CardStyleInterpolators.forFadeFromBottomAndroid,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var RevealFromBottomAndroid=exports.RevealFromBottomAndroid={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.RevealFromBottomAndroidSpec,close:_TransitionSpecs.RevealFromBottomAndroidSpec},cardStyleInterpolator:_CardStyleInterpolators.forRevealFromBottomAndroid,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var ScaleFromCenterAndroid=exports.ScaleFromCenterAndroid={gestureDirection:'horizontal',transitionSpec:{open:_TransitionSpecs.ScaleFromCenterAndroidSpec,close:_TransitionSpecs.ScaleFromCenterAndroidSpec},cardStyleInterpolator:_CardStyleInterpolators.forScaleFromCenterAndroid,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var FadeFromRightAndroid=exports.FadeFromRightAndroid={gestureDirection:'horizontal',transitionSpec:{open:_TransitionSpecs.FadeInFromBottomAndroidSpec,close:_TransitionSpecs.FadeOutToBottomAndroidSpec},cardStyleInterpolator:_CardStyleInterpolators.forFadeFromRightAndroid,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var BottomSheetAndroid=exports.BottomSheetAndroid={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.BottomSheetSlideInSpec,close:_TransitionSpecs.BottomSheetSlideOutSpec},cardStyleInterpolator:_CardStyleInterpolators.forBottomSheetAndroid,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var ModalFadeTransition=exports.ModalFadeTransition={gestureDirection:'vertical',transitionSpec:{open:_TransitionSpecs.BottomSheetSlideInSpec,close:_TransitionSpecs.BottomSheetSlideOutSpec},cardStyleInterpolator:_CardStyleInterpolators.forFadeFromCenter,headerStyleInterpolator:_HeaderStyleInterpolators.forFade};var DefaultTransition=exports.DefaultTransition=_Platform.default.select({ios:SlideFromRightIOS,android:Number(_Platform.default.Version)>=ANDROID_VERSION_14?FadeFromRightAndroid:Number(_Platform.default.Version)>=ANDROID_VERSION_10?ScaleFromCenterAndroid:Number(_Platform.default.Version)>=ANDROID_VERSION_PIE?RevealFromBottomAndroid:FadeFromBottomAndroid,default:ScaleFromCenterAndroid});var ModalTransition=exports.ModalTransition=_Platform.default.select({ios:ModalPresentationIOS,default:BottomSheetAndroid});var SlideFromLeftIOS=exports.SlideFromLeftIOS=Object.assign({},SlideFromRightIOS,{cardStyleInterpolator:_CardStyleInterpolators.forHorizontalIOSInverted});

/***/ },

/***/ 35172
(__unused_webpack_module, exports, __webpack_require__) {

'use client';Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var React=_interopRequireWildcard(__webpack_require__(96540));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var _default=exports["default"]=React.createContext(undefined);

/***/ },

/***/ 36430
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ exports_Modal)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(58168);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(98587);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(40961);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/canUseDom/index.js
var canUseDom = __webpack_require__(7162);
;// ./node_modules/react-native-web/dist/exports/Modal/ModalPortal.js
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */




function ModalPortal(props) {
  var children = props.children;
  var elementRef = react.useRef(null);
  if (canUseDom/* default */.A && !elementRef.current) {
    var element = document.createElement('div');
    if (element && document.body) {
      document.body.appendChild(element);
      elementRef.current = element;
    }
  }
  react.useEffect(() => {
    if (canUseDom/* default */.A) {
      return () => {
        if (document.body && elementRef.current) {
          document.body.removeChild(elementRef.current);
          elementRef.current = null;
        }
      };
    }
  }, []);
  return elementRef.current && canUseDom/* default */.A ? /*#__PURE__*/(0,react_dom.createPortal)(children, elementRef.current) : null;
}
/* harmony default export */ const Modal_ModalPortal = (ModalPortal);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(43999);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/createElement/index.js + 5 modules
var createElement = __webpack_require__(8646);
;// ./node_modules/react-native-web/dist/exports/Modal/ModalAnimation.js
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */




var ANIMATION_DURATION = 250;
function getAnimationStyle(animationType, visible) {
  if (animationType === 'slide') {
    return visible ? animatedSlideInStyles : animatedSlideOutStyles;
  }
  if (animationType === 'fade') {
    return visible ? animatedFadeInStyles : animatedFadeOutStyles;
  }
  return visible ? styles.container : styles.hidden;
}
function ModalAnimation(props) {
  var animationType = props.animationType,
    children = props.children,
    onDismiss = props.onDismiss,
    onShow = props.onShow,
    visible = props.visible;
  var _React$useState = react.useState(false),
    isRendering = _React$useState[0],
    setIsRendering = _React$useState[1];
  var wasVisible = react.useRef(false);
  var wasRendering = react.useRef(false);
  var isAnimated = animationType && animationType !== 'none';
  var animationEndCallback = react.useCallback(e => {
    if (e && e.currentTarget !== e.target) {
      // If the event was generated for something NOT this element we
      // should ignore it as it's not relevant to us
      return;
    }
    if (visible) {
      if (onShow) {
        onShow();
      }
    } else {
      setIsRendering(false);
    }
  }, [onShow, visible]);
  react.useEffect(() => {
    if (wasRendering.current && !isRendering && onDismiss) {
      onDismiss();
    }
    wasRendering.current = isRendering;
  }, [isRendering, onDismiss]);
  react.useEffect(() => {
    if (visible) {
      setIsRendering(true);
    }
    if (visible !== wasVisible.current && !isAnimated) {
      // Manually call `animationEndCallback` if no animation is used
      animationEndCallback();
    }
    wasVisible.current = visible;
  }, [isAnimated, visible, animationEndCallback]);
  return isRendering || visible ? (0,createElement/* default */.A)('div', {
    style: isRendering ? getAnimationStyle(animationType, visible) : styles.hidden,
    onAnimationEnd: animationEndCallback,
    children
  }) : null;
}
var styles = StyleSheet["default"].create({
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999
  },
  animatedIn: {
    animationDuration: ANIMATION_DURATION + "ms",
    animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  },
  animatedOut: {
    pointerEvents: 'none',
    animationDuration: ANIMATION_DURATION + "ms",
    animationTimingFunction: 'cubic-bezier(0.47, 0, 0.745, 0.715)'
  },
  fadeIn: {
    opacity: 1,
    animationKeyframes: {
      '0%': {
        opacity: 0
      },
      '100%': {
        opacity: 1
      }
    }
  },
  fadeOut: {
    opacity: 0,
    animationKeyframes: {
      '0%': {
        opacity: 1
      },
      '100%': {
        opacity: 0
      }
    }
  },
  slideIn: {
    transform: 'translateY(0%)',
    animationKeyframes: {
      '0%': {
        transform: 'translateY(100%)'
      },
      '100%': {
        transform: 'translateY(0%)'
      }
    }
  },
  slideOut: {
    transform: 'translateY(100%)',
    animationKeyframes: {
      '0%': {
        transform: 'translateY(0%)'
      },
      '100%': {
        transform: 'translateY(100%)'
      }
    }
  },
  hidden: {
    opacity: 0
  }
});
var animatedSlideInStyles = [styles.container, styles.animatedIn, styles.slideIn];
var animatedSlideOutStyles = [styles.container, styles.animatedOut, styles.slideOut];
var animatedFadeInStyles = [styles.container, styles.animatedIn, styles.fadeIn];
var animatedFadeOutStyles = [styles.container, styles.animatedOut, styles.fadeOut];
/* harmony default export */ const Modal_ModalAnimation = (ModalAnimation);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
;// ./node_modules/react-native-web/dist/exports/Modal/ModalContent.js


var _excluded = ["active", "children", "onRequestClose", "transparent"];
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */





var ModalContent = /*#__PURE__*/react.forwardRef((props, forwardedRef) => {
  var active = props.active,
    children = props.children,
    onRequestClose = props.onRequestClose,
    transparent = props.transparent,
    rest = (0,objectWithoutPropertiesLoose/* default */.A)(props, _excluded);
  react.useEffect(() => {
    if (canUseDom/* default */.A) {
      var closeOnEscape = e => {
        if (active && e.key === 'Escape') {
          e.stopPropagation();
          if (onRequestClose) {
            onRequestClose();
          }
        }
      };
      document.addEventListener('keyup', closeOnEscape, false);
      return () => document.removeEventListener('keyup', closeOnEscape, false);
    }
  }, [active, onRequestClose]);
  var style = react.useMemo(() => {
    return [ModalContent_styles.modal, transparent ? ModalContent_styles.modalTransparent : ModalContent_styles.modalOpaque];
  }, [transparent]);
  return /*#__PURE__*/react.createElement(View["default"], (0,esm_extends/* default */.A)({}, rest, {
    "aria-modal": true,
    ref: forwardedRef,
    role: active ? 'dialog' : null,
    style: style
  }), /*#__PURE__*/react.createElement(View["default"], {
    style: ModalContent_styles.container
  }, children));
});
var ModalContent_styles = StyleSheet["default"].create({
  modal: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  modalTransparent: {
    backgroundColor: 'transparent'
  },
  modalOpaque: {
    backgroundColor: 'white'
  },
  container: {
    top: 0,
    flex: 1
  }
});
/* harmony default export */ const Modal_ModalContent = (ModalContent);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/UIManager/index.js + 3 modules
var UIManager = __webpack_require__(8683);
;// ./node_modules/react-native-web/dist/exports/Modal/ModalFocusTrap.js
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */








/**
 * This Component is used to "wrap" the modal we're opening
 * so that changing focus via tab will never leave the document.
 *
 * This allows us to properly trap the focus within a modal
 * even if the modal is at the start or end of a document.
 */

var FocusBracket = () => {
  return (0,createElement/* default */.A)('div', {
    role: 'none',
    tabIndex: 0,
    style: ModalFocusTrap_styles.focusBracket
  });
};
function attemptFocus(element) {
  if (!canUseDom/* default */.A) {
    return false;
  }
  try {
    element.focus();
  } catch (e) {
    // Do nothing
  }
  return document.activeElement === element;
}
function focusFirstDescendant(element) {
  for (var i = 0; i < element.childNodes.length; i++) {
    var child = element.childNodes[i];
    if (attemptFocus(child) || focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
}
function focusLastDescendant(element) {
  for (var i = element.childNodes.length - 1; i >= 0; i--) {
    var child = element.childNodes[i];
    if (attemptFocus(child) || focusLastDescendant(child)) {
      return true;
    }
  }
  return false;
}
var ModalFocusTrap = _ref => {
  var active = _ref.active,
    children = _ref.children;
  var trapElementRef = react.useRef();
  var focusRef = react.useRef({
    trapFocusInProgress: false,
    lastFocusedElement: null
  });
  react.useEffect(() => {
    if (canUseDom/* default */.A) {
      var trapFocus = () => {
        // We should not trap focus if:
        // - The modal hasn't fully initialized with an HTMLElement ref
        // - Focus is already in the process of being trapped (e.g., we're refocusing)
        // - isTrapActive prop being falsey tells us to do nothing
        if (trapElementRef.current == null || focusRef.current.trapFocusInProgress || !active) {
          return;
        }
        try {
          focusRef.current.trapFocusInProgress = true;
          if (document.activeElement instanceof Node && !trapElementRef.current.contains(document.activeElement)) {
            // To handle keyboard focusing we can make an assumption here.
            // If you're tabbing through the focusable elements, the previously
            // active element will either be the first or the last.
            // If the previously selected element is the "first" descendant
            // and we're leaving it - this means that we should be looping
            // around to the other side of the modal.
            var hasFocused = focusFirstDescendant(trapElementRef.current);
            if (focusRef.current.lastFocusedElement === document.activeElement) {
              hasFocused = focusLastDescendant(trapElementRef.current);
            }
            // If we couldn't focus a new element then we need to focus onto the trap target
            if (!hasFocused && trapElementRef.current != null && document.activeElement) {
              UIManager["default"].focus(trapElementRef.current);
            }
          }
        } finally {
          focusRef.current.trapFocusInProgress = false;
        }
        focusRef.current.lastFocusedElement = document.activeElement;
      };

      // Call the trapFocus callback at least once when this modal has been activated.
      trapFocus();
      document.addEventListener('focus', trapFocus, true);
      return () => document.removeEventListener('focus', trapFocus, true);
    }
  }, [active]);

  // To be fully compliant with WCAG we need to refocus element that triggered opening modal
  // after closing it
  react.useEffect(function () {
    if (canUseDom/* default */.A) {
      var lastFocusedElementOutsideTrap = document.activeElement;
      return function () {
        if (lastFocusedElementOutsideTrap && document.contains(lastFocusedElementOutsideTrap)) {
          UIManager["default"].focus(lastFocusedElementOutsideTrap);
        }
      };
    }
  }, []);
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(FocusBracket, null), /*#__PURE__*/react.createElement(View["default"], {
    ref: trapElementRef
  }, children), /*#__PURE__*/react.createElement(FocusBracket, null));
};
/* harmony default export */ const Modal_ModalFocusTrap = (ModalFocusTrap);
var ModalFocusTrap_styles = StyleSheet["default"].create({
  focusBracket: {
    outlineStyle: 'none'
  }
});
;// ./node_modules/react-native-web/dist/exports/Modal/index.js
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use client';



var Modal_excluded = ["animationType", "children", "onDismiss", "onRequestClose", "onShow", "transparent", "visible"];





var uniqueModalIdentifier = 0;
var activeModalStack = [];
var activeModalListeners = {};
function notifyActiveModalListeners() {
  if (activeModalStack.length === 0) {
    return;
  }
  var activeModalId = activeModalStack[activeModalStack.length - 1];
  activeModalStack.forEach(modalId => {
    if (modalId in activeModalListeners) {
      activeModalListeners[modalId](modalId === activeModalId);
    }
  });
}
function removeActiveModal(modalId) {
  if (modalId in activeModalListeners) {
    // Before removing this listener we should probably tell it
    // that it's no longer the active modal for sure.
    activeModalListeners[modalId](false);
    delete activeModalListeners[modalId];
  }
  var index = activeModalStack.indexOf(modalId);
  if (index !== -1) {
    activeModalStack.splice(index, 1);
    notifyActiveModalListeners();
  }
}
function addActiveModal(modalId, listener) {
  removeActiveModal(modalId);
  activeModalStack.push(modalId);
  activeModalListeners[modalId] = listener;
  notifyActiveModalListeners();
}
var Modal = /*#__PURE__*/react.forwardRef((props, forwardedRef) => {
  var animationType = props.animationType,
    children = props.children,
    onDismiss = props.onDismiss,
    onRequestClose = props.onRequestClose,
    onShow = props.onShow,
    transparent = props.transparent,
    _props$visible = props.visible,
    visible = _props$visible === void 0 ? true : _props$visible,
    rest = (0,objectWithoutPropertiesLoose/* default */.A)(props, Modal_excluded);

  // Set a unique model identifier so we can correctly route
  // dismissals and check the layering of modals.
  var modalId = react.useMemo(() => uniqueModalIdentifier++, []);
  var _React$useState = react.useState(false),
    isActive = _React$useState[0],
    setIsActive = _React$useState[1];
  var onDismissCallback = react.useCallback(() => {
    removeActiveModal(modalId);
    if (onDismiss) {
      onDismiss();
    }
  }, [modalId, onDismiss]);
  var onShowCallback = react.useCallback(() => {
    addActiveModal(modalId, setIsActive);
    if (onShow) {
      onShow();
    }
  }, [modalId, onShow]);
  react.useEffect(() => {
    return () => removeActiveModal(modalId);
  }, [modalId]);
  return /*#__PURE__*/react.createElement(Modal_ModalPortal, null, /*#__PURE__*/react.createElement(Modal_ModalAnimation, {
    animationType: animationType,
    onDismiss: onDismissCallback,
    onShow: onShowCallback,
    visible: visible
  }, /*#__PURE__*/react.createElement(Modal_ModalFocusTrap, {
    active: isActive
  }, /*#__PURE__*/react.createElement(Modal_ModalContent, (0,esm_extends/* default */.A)({}, rest, {
    active: isActive,
    onRequestClose: onRequestClose,
    ref: forwardedRef,
    transparent: transparent
  }), children))));
});
/* harmony default export */ const exports_Modal = (Modal);

/***/ },

/***/ 37813
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.initialWindowSafeAreaInsets=exports.initialWindowMetrics=void 0;var initialWindowMetrics=exports.initialWindowMetrics=null;var initialWindowSafeAreaInsets=exports.initialWindowSafeAreaInsets=null;

/***/ },

/***/ 42599
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var React=_interopRequireWildcard(__webpack_require__(96540));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _warnOnce=_interopRequireDefault(__webpack_require__(4909));var _DebugContainer=_interopRequireDefault(__webpack_require__(29716));var _ScreenStackHeaderConfig=__webpack_require__(16107);var _Screen=_interopRequireDefault(__webpack_require__(93126));var _ScreenStack=_interopRequireDefault(__webpack_require__(68384));var _contexts=__webpack_require__(30879);var _ScreenFooter=__webpack_require__(5629);var _SafeAreaView=_interopRequireDefault(__webpack_require__(68425));var _flags=__webpack_require__(30064);var _excluded=["children","headerConfig","activityState","shouldFreeze","stackPresentation","sheetAllowedDetents","contentStyle","style","screenId","onHeaderHeightChange","unstable_sheetFooter"],_excluded2=["backgroundColor"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r]);}return n;},_extends.apply(null,arguments);}function ScreenStackItem(_ref,ref){var _headerConfig$hidden,_headerConfig$largeTi,_headerConfig$largeTi2;var children=_ref.children,headerConfig=_ref.headerConfig,activityState=_ref.activityState,shouldFreeze=_ref.shouldFreeze,stackPresentation=_ref.stackPresentation,sheetAllowedDetents=_ref.sheetAllowedDetents,contentStyle=_ref.contentStyle,style=_ref.style,screenId=_ref.screenId,onHeaderHeightChange=_ref.onHeaderHeightChange,unstable_sheetFooter=_ref.unstable_sheetFooter,rest=(0,_objectWithoutProperties2.default)(_ref,_excluded);var currentScreenRef=React.useRef(null);var screenRefs=React.useContext(_contexts.RNSScreensRefContext);React.useImperativeHandle(ref,function(){return currentScreenRef.current;});var stackPresentationWithDefault=stackPresentation!=null?stackPresentation:'push';var headerConfigHiddenWithDefault=(_headerConfig$hidden=headerConfig==null?void 0:headerConfig.hidden)!=null?_headerConfig$hidden:false;var isHeaderInModal=_Platform.default.OS==='android'?false:stackPresentationWithDefault!=='push'&&headerConfigHiddenWithDefault===false;var headerHiddenPreviousRef=React.useRef(headerConfigHiddenWithDefault);React.useEffect(function(){(0,_warnOnce.default)(_Platform.default.OS!=='android'&&stackPresentationWithDefault!=='push'&&headerHiddenPreviousRef.current!==headerConfigHiddenWithDefault,`Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`);headerHiddenPreviousRef.current=headerConfigHiddenWithDefault;},[headerConfigHiddenWithDefault,stackPresentationWithDefault]);var hasEdgeEffects=(rest==null?void 0:rest.scrollEdgeEffects)===undefined||Object.values(rest.scrollEdgeEffects).some(function(propValue){return propValue!=='hidden';});var hasBlurEffect=(headerConfig==null?void 0:headerConfig.blurEffect)!==undefined&&headerConfig.blurEffect!=='none';(0,_warnOnce.default)(hasEdgeEffects&&hasBlurEffect&&_Platform.default.OS==='ios'&&parseInt(_Platform.default.Version,10)>=26,'[RNScreens] Using both `blurEffect` and `scrollEdgeEffects` simultaneously may cause overlapping effects.');var debugContainerStyle=getPositioningStyle(sheetAllowedDetents,stackPresentationWithDefault);var internalScreenStyle;if(stackPresentationWithDefault==='formSheet'&&_Platform.default.OS==='ios'&&contentStyle){var _extractScreenStyles=extractScreenStyles(contentStyle),screenStyles=_extractScreenStyles.screenStyles,contentWrapperStyles=_extractScreenStyles.contentWrapperStyles;internalScreenStyle=screenStyles;contentStyle=contentWrapperStyles;}var shouldUseSafeAreaView=_Platform.default.OS==='ios'&&parseInt(_Platform.default.Version,10)>=26;var content=React.createElement(React.Fragment,null,React.createElement(_DebugContainer.default,{contentStyle:contentStyle,style:debugContainerStyle,stackPresentation:stackPresentationWithDefault},shouldUseSafeAreaView?React.createElement(_SafeAreaView.default,{edges:getSafeAreaEdges(headerConfig)},children):children),React.createElement(_ScreenStackHeaderConfig.ScreenStackHeaderConfig,headerConfig),stackPresentationWithDefault==='formSheet'&&unstable_sheetFooter&&React.createElement(_ScreenFooter.FooterComponent,null,unstable_sheetFooter()));return React.createElement(_Screen.default,_extends({ref:function ref(node){currentScreenRef.current=node;if(screenRefs===null){console.warn('Looks like RNSScreensRefContext is missing. Make sure the ScreenStack component is wrapped in it');return;}var currentRefs=screenRefs.current;if(node===null){delete currentRefs[screenId];}else{currentRefs[screenId]={current:node};}},enabled:true,isNativeStack:true,activityState:activityState,shouldFreeze:shouldFreeze,screenId:screenId,stackPresentation:stackPresentationWithDefault,hasLargeHeader:(_headerConfig$largeTi=headerConfig==null?void 0:headerConfig.largeTitle)!=null?_headerConfig$largeTi:false,sheetAllowedDetents:sheetAllowedDetents,style:[style,internalScreenStyle],onHeaderHeightChange:isHeaderInModal?undefined:onHeaderHeightChange},rest),isHeaderInModal?React.createElement(_ScreenStack.default,{style:styles.container},React.createElement(_Screen.default,{enabled:true,isNativeStack:true,activityState:activityState,shouldFreeze:shouldFreeze,hasLargeHeader:(_headerConfig$largeTi2=headerConfig==null?void 0:headerConfig.largeTitle)!=null?_headerConfig$largeTi2:false,style:_StyleSheet.default.absoluteFill,onHeaderHeightChange:onHeaderHeightChange},content)):content);}var _default=exports["default"]=React.forwardRef(ScreenStackItem);function getPositioningStyle(allowedDetents,presentation){var isIOS=_Platform.default.OS==='ios';var rnMinorVersion=_Platform.default.constants.reactNativeVersion.minor;if(presentation!=='formSheet'){return styles.container;}if(isIOS){if(allowedDetents!=='fitToContents'&&rnMinorVersion>=82&&_flags.featureFlags.experiment.synchronousScreenUpdatesEnabled){return styles.container;}else{return styles.absoluteWithNoBottom;}}if(allowedDetents==='fitToContents'){return styles.absoluteWithNoBottom;}return styles.container;}function extractScreenStyles(style){var flatStyle=_StyleSheet.default.flatten(style);var backgroundColor=flatStyle.backgroundColor,contentWrapperStyles=(0,_objectWithoutProperties2.default)(flatStyle,_excluded2);var screenStyles={backgroundColor:backgroundColor};return{screenStyles:screenStyles,contentWrapperStyles:contentWrapperStyles};}function getSafeAreaEdges(headerConfig){if(_Platform.default.OS!=='ios'||parseInt(_Platform.default.Version,10)<26){return{};}var defaultEdges;if(headerConfig!=null&&headerConfig.translucent||headerConfig!=null&&headerConfig.hidden){defaultEdges={};}else{defaultEdges={top:true};}return defaultEdges;}var styles=_StyleSheet.default.create({container:{flex:1},absoluteWithNoBottom:{position:'absolute',top:0,start:0,end:0}});

/***/ },

/***/ 45822
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.CardContainer=void 0;var _elements=__webpack_require__(31755);var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _ModalPresentationContext=__webpack_require__(19989);var _useKeyboardManager2=__webpack_require__(57202);var _Card=__webpack_require__(8727);var _CardA11yWrapper=__webpack_require__(97206);var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\CardContainer.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var EPSILON=0.1;function CardContainerInner(_ref){var interpolationIndex=_ref.interpolationIndex,index=_ref.index,active=_ref.active,opening=_ref.opening,closing=_ref.closing,gesture=_ref.gesture,focused=_ref.focused,modal=_ref.modal,getPreviousScene=_ref.getPreviousScene,getFocusedRoute=_ref.getFocusedRoute,hasAbsoluteFloatHeader=_ref.hasAbsoluteFloatHeader,headerHeight=_ref.headerHeight,onHeaderHeightChange=_ref.onHeaderHeightChange,isParentHeaderShown=_ref.isParentHeaderShown,isNextScreenTransparent=_ref.isNextScreenTransparent,detachCurrentScreen=_ref.detachCurrentScreen,layout=_ref.layout,onCloseRoute=_ref.onCloseRoute,onOpenRoute=_ref.onOpenRoute,onGestureCancel=_ref.onGestureCancel,onGestureEnd=_ref.onGestureEnd,onGestureStart=_ref.onGestureStart,onTransitionEnd=_ref.onTransitionEnd,onTransitionStart=_ref.onTransitionStart,preloaded=_ref.preloaded,renderHeader=_ref.renderHeader,safeAreaInsetBottom=_ref.safeAreaInsetBottom,safeAreaInsetLeft=_ref.safeAreaInsetLeft,safeAreaInsetRight=_ref.safeAreaInsetRight,safeAreaInsetTop=_ref.safeAreaInsetTop,scene=_ref.scene;var wrapperRef=React.useRef(null);var _useLocale=(0,_native.useLocale)(),direction=_useLocale.direction;var parentHeaderHeight=React.useContext(_elements.HeaderHeightContext);var _useKeyboardManager=(0,_useKeyboardManager2.useKeyboardManager)(React.useCallback(function(){var _scene$descriptor=scene.descriptor,options=_scene$descriptor.options,navigation=_scene$descriptor.navigation;return navigation.isFocused()&&options.keyboardHandlingEnabled!==false;},[scene.descriptor])),onPageChangeStart=_useKeyboardManager.onPageChangeStart,onPageChangeCancel=_useKeyboardManager.onPageChangeCancel,onPageChangeConfirm=_useKeyboardManager.onPageChangeConfirm;var handleOpen=function handleOpen(){var route=scene.descriptor.route;onTransitionEnd({route:route},false);onOpenRoute({route:route});};var handleClose=function handleClose(){var route=scene.descriptor.route;onTransitionEnd({route:route},true);onCloseRoute({route:route});};var handleGestureBegin=function handleGestureBegin(){var route=scene.descriptor.route;onPageChangeStart();onGestureStart({route:route});};var handleGestureCanceled=function handleGestureCanceled(){var route=scene.descriptor.route;onPageChangeCancel();onGestureCancel({route:route});};var handleGestureEnd=function handleGestureEnd(){var route=scene.descriptor.route;onGestureEnd({route:route});};var handleTransition=function handleTransition(_ref2){var _wrapperRef$current;var closing=_ref2.closing,gesture=_ref2.gesture;(_wrapperRef$current=wrapperRef.current)==null||_wrapperRef$current.setInert(closing);var route=scene.descriptor.route;if(!gesture){onPageChangeConfirm==null||onPageChangeConfirm(true);}else if(active&&closing){onPageChangeConfirm==null||onPageChangeConfirm(false);}else{onPageChangeCancel==null||onPageChangeCancel();}onTransitionStart==null||onTransitionStart({route:route},closing);};var insets={top:safeAreaInsetTop,right:safeAreaInsetRight,bottom:safeAreaInsetBottom,left:safeAreaInsetLeft};var _useTheme=(0,_native.useTheme)(),colors=_useTheme.colors;React.useEffect(function(){var _scene$progress$next;var listener=(_scene$progress$next=scene.progress.next)==null||_scene$progress$next.addListener==null?void 0:_scene$progress$next.addListener(function(_ref3){var _wrapperRef$current2;var value=_ref3.value;(_wrapperRef$current2=wrapperRef.current)==null||_wrapperRef$current2.setInert(value>EPSILON);});return function(){if(listener){var _scene$progress$next2;(_scene$progress$next2=scene.progress.next)==null||_scene$progress$next2.removeListener==null||_scene$progress$next2.removeListener(listener);}};},[scene.progress.next]);var _scene$descriptor$opt=scene.descriptor.options,presentation=_scene$descriptor$opt.presentation,animation=_scene$descriptor$opt.animation,cardOverlay=_scene$descriptor$opt.cardOverlay,cardOverlayEnabled=_scene$descriptor$opt.cardOverlayEnabled,cardShadowEnabled=_scene$descriptor$opt.cardShadowEnabled,cardStyle=_scene$descriptor$opt.cardStyle,cardStyleInterpolator=_scene$descriptor$opt.cardStyleInterpolator,gestureDirection=_scene$descriptor$opt.gestureDirection,gestureEnabled=_scene$descriptor$opt.gestureEnabled,gestureResponseDistance=_scene$descriptor$opt.gestureResponseDistance,gestureVelocityImpact=_scene$descriptor$opt.gestureVelocityImpact,headerMode=_scene$descriptor$opt.headerMode,headerShown=_scene$descriptor$opt.headerShown,transitionSpec=_scene$descriptor$opt.transitionSpec;var _useLinkBuilder=(0,_native.useLinkBuilder)(),buildHref=_useLinkBuilder.buildHref;var previousScene=getPreviousScene({route:scene.descriptor.route});var backTitle;var href;if(previousScene){var _previousScene$descri=previousScene.descriptor,options=_previousScene$descri.options,route=_previousScene$descri.route;backTitle=(0,_elements.getHeaderTitle)(options,route.name);href=buildHref(route.name,route.params);}var canGoBack=previousScene!=null;var headerBack=React.useMemo(function(){if(canGoBack){return{href:href,title:backTitle};}return undefined;},[canGoBack,backTitle,href]);var animated=animation!=='none';return(0,_jsxRuntime.jsx)(_CardA11yWrapper.CardA11yWrapper,{ref:wrapperRef,focused:focused,active:active,animated:animated,isNextScreenTransparent:isNextScreenTransparent,detachCurrentScreen:detachCurrentScreen,children:(0,_jsxRuntime.jsx)(_Card.Card,{animated:animated,interpolationIndex:interpolationIndex,gestureDirection:gestureDirection,layout:layout,insets:insets,direction:direction,gesture:gesture,current:scene.progress.current,next:scene.progress.next,opening:opening,closing:closing,onOpen:handleOpen,onClose:handleClose,overlay:cardOverlay,overlayEnabled:cardOverlayEnabled,shadowEnabled:cardShadowEnabled,onTransition:handleTransition,onGestureBegin:handleGestureBegin,onGestureCanceled:handleGestureCanceled,onGestureEnd:handleGestureEnd,gestureEnabled:index===0?false:gestureEnabled,gestureResponseDistance:gestureResponseDistance,gestureVelocityImpact:gestureVelocityImpact,transitionSpec:transitionSpec,styleInterpolator:cardStyleInterpolator,pageOverflowEnabled:headerMode!=='float'&&presentation!=='modal',preloaded:preloaded,containerStyle:hasAbsoluteFloatHeader&&headerMode!=='screen'?{marginTop:headerHeight}:null,contentStyle:[{backgroundColor:presentation==='transparentModal'?'transparent':colors.background},cardStyle],children:(0,_jsxRuntime.jsx)(_View.default,{style:styles.container,children:(0,_jsxRuntime.jsxs)(_ModalPresentationContext.ModalPresentationContext.Provider,{value:modal,children:[headerMode!=='float'?renderHeader({mode:'screen',layout:layout,scenes:[previousScene,scene],getPreviousScene:getPreviousScene,getFocusedRoute:getFocusedRoute,onContentHeightChange:onHeaderHeightChange,style:styles.header}):null,(0,_jsxRuntime.jsx)(_View.default,{style:styles.scene,children:(0,_jsxRuntime.jsx)(_elements.HeaderBackContext.Provider,{value:headerBack,children:(0,_jsxRuntime.jsx)(_elements.HeaderShownContext.Provider,{value:isParentHeaderShown||headerShown!==false,children:(0,_jsxRuntime.jsx)(_elements.HeaderHeightContext.Provider,{value:headerShown!==false?headerHeight:parentHeaderHeight!=null?parentHeaderHeight:0,children:scene.descriptor.render()})})})})]})})})});}var CardContainer=exports.CardContainer=React.memo(CardContainerInner);var styles=_StyleSheet.default.create({container:{flex:1},header:{zIndex:1},scene:{flex:1}});

/***/ },

/***/ 46582
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var ScreenContentWrapper=_View.default;var _default=exports["default"]=ScreenContentWrapper;

/***/ },

/***/ 51888
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.CardContent=CardContent;var _slicedToArray2=_interopRequireDefault(__webpack_require__(85715));var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var React=_interopRequireWildcard(__webpack_require__(96540));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\CardContent.tsx";var _excluded=["enabled","layout","style"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function CardContent(_ref){var enabled=_ref.enabled,layout=_ref.layout,style=_ref.style,rest=(0,_objectWithoutProperties2.default)(_ref,_excluded);var _React$useState=React.useState(false),_React$useState2=(0,_slicedToArray2.default)(_React$useState,2),fill=_React$useState2[0],setFill=_React$useState2[1];React.useEffect(function(){if(typeof document==='undefined'||!document.body){return;}var width=document.body.clientWidth;var height=document.body.clientHeight;var isFullHeight=height===layout.height;var id='__react-navigation-stack-mobile-chrome-viewport-fix';var unsubscribe;if(isFullHeight&&navigator.maxTouchPoints>0){var _document$getElementB;var _style=(_document$getElementB=document.getElementById(id))!=null?_document$getElementB:document.createElement('style');_style.id=id;var updateStyle=function updateStyle(){var vh=window.innerHeight*0.01;_style.textContent=[`:root { --vh: ${vh}px; }`,`body { height: calc(var(--vh, 1vh) * 100); }`].join('\n');};updateStyle();if(!document.head.contains(_style)){document.head.appendChild(_style);}window.addEventListener('resize',updateStyle);unsubscribe=function unsubscribe(){window.removeEventListener('resize',updateStyle);};}else{var _document$getElementB2;(_document$getElementB2=document.getElementById(id))==null||_document$getElementB2.remove();}setFill(width===layout.width&&height===layout.height);return unsubscribe;},[layout.height,layout.width]);return(0,_jsxRuntime.jsx)(_View.default,Object.assign({},rest,{pointerEvents:"box-none",style:[enabled&&fill?styles.page:styles.card,style]}));}var styles=_StyleSheet.default.create({page:{minHeight:'100%'},card:{flex:1,overflow:'hidden'}});

/***/ },

/***/ 52444
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ lib_module),
  useAsyncStorage: () => (/* reexport */ useAsyncStorage)
});

// EXTERNAL MODULE: ./node_modules/merge-options/index.js
var merge_options = __webpack_require__(6864);
;// ./node_modules/merge-options/index.mjs
/**
 * Thin ESM wrapper for CJS named exports.
 *
 * Ref: https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1
 */


/* harmony default export */ const node_modules_merge_options = (merge_options);

;// ./node_modules/@react-native-async-storage/async-storage/lib/module/AsyncStorage.js


/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



// eslint-disable-next-line @typescript-eslint/ban-types

// eslint-disable-next-line @typescript-eslint/ban-types

const merge = node_modules_merge_options.bind({
  concatArrays: true,
  ignoreUndefined: true
});
function mergeLocalStorageItem(key, value) {
  const oldValue = window.localStorage.getItem(key);
  if (oldValue) {
    const oldObject = JSON.parse(oldValue);
    const newObject = JSON.parse(value);
    const nextValue = JSON.stringify(merge(oldObject, newObject));
    window.localStorage.setItem(key, nextValue);
  } else {
    window.localStorage.setItem(key, value);
  }
}
function createPromise(getValue, callback) {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();
      callback?.(null, value);
      resolve(value);
    } catch (err) {
      callback?.(err);
      reject(err);
    }
  });
}
function createPromiseAll(promises, callback, processResult) {
  return Promise.all(promises).then(result => {
    const value = processResult?.(result) ?? null;
    callback?.(null, value);
    return Promise.resolve(value);
  }, errors => {
    callback?.(errors);
    return Promise.reject(errors);
  });
}
const AsyncStorage = {
  /**
   * Fetches `key` value.
   */
  getItem: (key, callback) => {
    return createPromise(() => window.localStorage.getItem(key), callback);
  },
  /**
   * Sets `value` for `key`.
   */
  setItem: (key, value, callback) => {
    return createPromise(() => window.localStorage.setItem(key, value), callback);
  },
  /**
   * Removes a `key`
   */
  removeItem: (key, callback) => {
    return createPromise(() => window.localStorage.removeItem(key), callback);
  },
  /**
   * Merges existing value with input value, assuming they are stringified JSON.
   */
  mergeItem: (key, value, callback) => {
    return createPromise(() => mergeLocalStorageItem(key, value), callback);
  },
  /**
   * Erases *all* AsyncStorage for the domain.
   */
  clear: callback => {
    return createPromise(() => window.localStorage.clear(), callback);
  },
  /**
   * Gets *all* keys known to the app, for all callers, libraries, etc.
   */
  getAllKeys: callback => {
    return createPromise(() => {
      const numberOfKeys = window.localStorage.length;
      const keys = [];
      for (let i = 0; i < numberOfKeys; i += 1) {
        const key = window.localStorage.key(i) || "";
        keys.push(key);
      }
      return keys;
    }, callback);
  },
  /**
   * (stub) Flushes any pending requests using a single batch call to get the data.
   */
  flushGetRequests: () => undefined,
  /**
   * multiGet resolves to an array of key-value pair arrays that matches the
   * input format of multiSet.
   *
   *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
   */
  multiGet: (keys, callback) => {
    const promises = keys.map(key => AsyncStorage.getItem(key));
    const processResult = result => result.map((value, i) => [keys[i], value]);
    return createPromiseAll(promises, callback, processResult);
  },
  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  multiSet: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage.setItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  },
  /**
   * Delete all the keys in the `keys` array.
   */
  multiRemove: (keys, callback) => {
    const promises = keys.map(key => AsyncStorage.removeItem(key));
    return createPromiseAll(promises, callback);
  },
  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  multiMerge: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage.mergeItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }
};
/* harmony default export */ const module_AsyncStorage = (AsyncStorage);
//# sourceMappingURL=AsyncStorage.js.map
;// ./node_modules/@react-native-async-storage/async-storage/lib/module/hooks.js



function useAsyncStorage(key) {
  return {
    getItem: (...args) => module_AsyncStorage.getItem(key, ...args),
    setItem: (...args) => module_AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => module_AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => module_AsyncStorage.removeItem(key, ...args)
  };
}
//# sourceMappingURL=hooks.js.map
;// ./node_modules/@react-native-async-storage/async-storage/lib/module/index.js




/* harmony default export */ const lib_module = (module_AsyncStorage);
//# sourceMappingURL=index.js.map

/***/ },

/***/ 53853
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var SearchBar=_View.default;var _default=exports["default"]=SearchBar;

/***/ },

/***/ 54081
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

class Alert {
  static alert() {}
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Alert);

/***/ },

/***/ 54411
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.NativeSafeAreaProvider=NativeSafeAreaProvider;var React=_interopRequireWildcard(__webpack_require__(96540));var _View=_interopRequireDefault(__webpack_require__(9176));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var CSSTransitions={WebkitTransition:'webkitTransitionEnd',Transition:'transitionEnd',MozTransition:'transitionend',MSTransition:'msTransitionEnd',OTransition:'oTransitionEnd'};function NativeSafeAreaProvider(_ref){var children=_ref.children,style=_ref.style,onInsetsChange=_ref.onInsetsChange;React.useEffect(function(){if(typeof document==='undefined'){return;}var element=createContextElement();document.body.appendChild(element);var onEnd=function onEnd(){var _window$getComputedSt=window.getComputedStyle(element),paddingTop=_window$getComputedSt.paddingTop,paddingBottom=_window$getComputedSt.paddingBottom,paddingLeft=_window$getComputedSt.paddingLeft,paddingRight=_window$getComputedSt.paddingRight;var insets={top:paddingTop?parseInt(paddingTop,10):0,bottom:paddingBottom?parseInt(paddingBottom,10):0,left:paddingLeft?parseInt(paddingLeft,10):0,right:paddingRight?parseInt(paddingRight,10):0};var frame={x:0,y:0,width:document.documentElement.offsetWidth,height:document.documentElement.offsetHeight};onInsetsChange({nativeEvent:{insets:insets,frame:frame}});};element.addEventListener(getSupportedTransitionEvent(),onEnd);onEnd();return function(){document.body.removeChild(element);element.removeEventListener(getSupportedTransitionEvent(),onEnd);};},[onInsetsChange]);return React.createElement(_View.default,{style:style},children);}var _supportedTransitionEvent=null;function getSupportedTransitionEvent(){if(_supportedTransitionEvent!=null){return _supportedTransitionEvent;}var element=document.createElement('invalidtype');_supportedTransitionEvent=CSSTransitions.Transition;for(var key in CSSTransitions){if(element.style[key]!==undefined){_supportedTransitionEvent=CSSTransitions[key];break;}}return _supportedTransitionEvent;}var _supportedEnv=null;function getSupportedEnv(){if(_supportedEnv!==null){return _supportedEnv;}var _window=window,CSS=_window.CSS;if(CSS&&CSS.supports&&CSS.supports('top: constant(safe-area-inset-top)')){_supportedEnv='constant';}else{_supportedEnv='env';}return _supportedEnv;}function getInset(side){return`${getSupportedEnv()}(safe-area-inset-${side})`;}function createContextElement(){var element=document.createElement('div');var style=element.style;style.position='fixed';style.left='0';style.top='0';style.width='0';style.height='0';style.zIndex='-1';style.overflow='hidden';style.visibility='hidden';style.transitionDuration='0.05s';style.transitionProperty='padding';style.transitionDelay='0s';style.paddingTop=getInset('top');style.paddingBottom=getInset('bottom');style.paddingLeft=getInset('left');style.paddingRight=getInset('right');return element;}

/***/ },

/***/ 54910
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.findLastIndex=findLastIndex;function findLastIndex(array,callback){for(var i=array.length-1;i>=0;i--){if(callback(array[i])){return i;}}return-1;}

/***/ },

/***/ 56527
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.CardStack=void 0;exports.getAnimationEnabled=getAnimationEnabled;var _toConsumableArray2=_interopRequireDefault(__webpack_require__(41132));var _defineProperty2=_interopRequireDefault(__webpack_require__(43693));var _classCallCheck2=_interopRequireDefault(__webpack_require__(17383));var _createClass2=_interopRequireDefault(__webpack_require__(34579));var _possibleConstructorReturn2=_interopRequireDefault(__webpack_require__(28452));var _getPrototypeOf2=_interopRequireDefault(__webpack_require__(63072));var _inherits2=_interopRequireDefault(__webpack_require__(29511));var _elements=__webpack_require__(31755);var React=_interopRequireWildcard(__webpack_require__(96540));var _Animated=_interopRequireDefault(__webpack_require__(48831));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _CardStyleInterpolators=__webpack_require__(16511);var _TransitionPresets=__webpack_require__(34819);var _findLastIndex=__webpack_require__(54910);var _getDistanceForDirection=__webpack_require__(62596);var _getModalRoutesKeys=__webpack_require__(12536);var _Screens=__webpack_require__(20239);var _CardContainer=__webpack_require__(45822);var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\CardStack.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}var NAMED_TRANSITIONS_PRESETS={default:_TransitionPresets.DefaultTransition,fade:_TransitionPresets.ModalFadeTransition,fade_from_bottom:_TransitionPresets.FadeFromBottomAndroid,fade_from_right:_TransitionPresets.FadeFromRightAndroid,none:_TransitionPresets.DefaultTransition,reveal_from_bottom:_TransitionPresets.RevealFromBottomAndroid,scale_from_center:_TransitionPresets.ScaleFromCenterAndroid,slide_from_left:_TransitionPresets.SlideFromLeftIOS,slide_from_right:_TransitionPresets.SlideFromRightIOS,slide_from_bottom:_Platform.default.select({ios:_TransitionPresets.ModalSlideFromBottomIOS,default:_TransitionPresets.BottomSheetAndroid})};var EPSILON=1e-5;var STATE_INACTIVE=0;var STATE_TRANSITIONING_OR_BELOW_TOP=1;var STATE_ON_TOP=2;var FALLBACK_DESCRIPTOR=Object.freeze({options:{}});var getInterpolationIndex=function getInterpolationIndex(scenes,index){var cardStyleInterpolator=scenes[index].descriptor.options.cardStyleInterpolator;var interpolationIndex=0;for(var i=index-1;i>=0;i--){var _scenes$i;var cardStyleInterpolatorCurrent=(_scenes$i=scenes[i])==null?void 0:_scenes$i.descriptor.options.cardStyleInterpolator;if(cardStyleInterpolatorCurrent!==cardStyleInterpolator){break;}interpolationIndex++;}return interpolationIndex;};var getIsModalPresentation=function getIsModalPresentation(cardStyleInterpolator){return cardStyleInterpolator===_CardStyleInterpolators.forModalPresentationIOS||cardStyleInterpolator.name==='forModalPresentationIOS';};var getIsModal=function getIsModal(scene,interpolationIndex,isParentModal){if(isParentModal){return true;}var cardStyleInterpolator=scene.descriptor.options.cardStyleInterpolator;var isModalPresentation=getIsModalPresentation(cardStyleInterpolator);var isModal=isModalPresentation&&interpolationIndex!==0;return isModal;};var getHeaderHeights=function getHeaderHeights(scenes,insets,isParentHeaderShown,isParentModal,layout,previous){return scenes.reduce(function(acc,curr,index){var _curr$descriptor$opti=curr.descriptor.options,_curr$descriptor$opti2=_curr$descriptor$opti.headerStatusBarHeight,headerStatusBarHeight=_curr$descriptor$opti2===void 0?isParentHeaderShown?0:insets.top:_curr$descriptor$opti2,headerStyle=_curr$descriptor$opti.headerStyle;var style=_StyleSheet.default.flatten(headerStyle||{});var height='height'in style&&typeof style.height==='number'?style.height:previous[curr.route.key];var interpolationIndex=getInterpolationIndex(scenes,index);var isModal=getIsModal(curr,interpolationIndex,isParentModal);acc[curr.route.key]=typeof height==='number'?height:(0,_elements.getDefaultHeaderHeight)(layout,isModal,headerStatusBarHeight);return acc;},{});};var getDistanceFromOptions=function getDistanceFromOptions(layout,options,isRTL){var _NAMED_TRANSITIONS_PR;if(options!=null&&options.gestureDirection){return(0,_getDistanceForDirection.getDistanceForDirection)(layout,options.gestureDirection,isRTL);}var defaultGestureDirection=(options==null?void 0:options.presentation)==='modal'?_TransitionPresets.ModalTransition.gestureDirection:_TransitionPresets.DefaultTransition.gestureDirection;var gestureDirection=options!=null&&options.animation?(_NAMED_TRANSITIONS_PR=NAMED_TRANSITIONS_PRESETS[options==null?void 0:options.animation])==null?void 0:_NAMED_TRANSITIONS_PR.gestureDirection:defaultGestureDirection;return(0,_getDistanceForDirection.getDistanceForDirection)(layout,gestureDirection,isRTL);};var getProgressFromGesture=function getProgressFromGesture(gesture,layout,options,isRTL){var distance=getDistanceFromOptions({width:Math.max(1,layout.width),height:Math.max(1,layout.height)},options,isRTL);if(distance>0){return gesture.interpolate({inputRange:[0,distance],outputRange:[1,0]});}return gesture.interpolate({inputRange:[distance,0],outputRange:[0,1]});};function getDefaultAnimation(animation){var excludedPlatforms=_Platform.default.OS!=='web'&&_Platform.default.OS!=='windows'&&_Platform.default.OS!=='macos';return animation!=null?animation:excludedPlatforms?'default':'none';}function getAnimationEnabled(animation){return getDefaultAnimation(animation)!=='none';}var CardStack=exports.CardStack=function(_React$Component){function CardStack(_props){var _this;(0,_classCallCheck2.default)(this,CardStack);_this=_callSuper(this,CardStack,[_props]);_this.handleLayout=function(e){var _e$nativeEvent$layout=e.nativeEvent.layout,height=_e$nativeEvent$layout.height,width=_e$nativeEvent$layout.width;var layout={width:width,height:height};_this.setState(function(state,props){if(height===state.layout.height&&width===state.layout.width){return null;}return{layout:layout,headerHeights:getHeaderHeights(state.scenes,props.insets,props.isParentHeaderShown,props.isParentModal,layout,state.headerHeights)};});};_this.handleHeaderLayout=function(_ref){var route=_ref.route,height=_ref.height;_this.setState(function(_ref2){var headerHeights=_ref2.headerHeights;var previousHeight=headerHeights[route.key];if(previousHeight===height){return null;}return{headerHeights:Object.assign({},headerHeights,(0,_defineProperty2.default)({},route.key,height))};});};_this.getFocusedRoute=function(){var state=_this.props.state;return state.routes[state.index];};_this.getPreviousScene=function(_ref3){var route=_ref3.route;var getPreviousRoute=_this.props.getPreviousRoute;var scenes=_this.state.scenes;var previousRoute=getPreviousRoute({route:route});if(previousRoute){var previousScene=scenes.find(function(scene){return scene.descriptor.route.key===previousRoute.key;});return previousScene;}return undefined;};_this.state={routes:[],scenes:[],gestures:{},layout:_elements.SafeAreaProviderCompat.initialMetrics.frame,descriptors:_this.props.descriptors,activeStates:[],headerHeights:{}};return _this;}(0,_inherits2.default)(CardStack,_React$Component);return(0,_createClass2.default)(CardStack,[{key:"render",value:function render(){var _this2=this;var _this$props=this.props,insets=_this$props.insets,state=_this$props.state,routes=_this$props.routes,openingRouteKeys=_this$props.openingRouteKeys,closingRouteKeys=_this$props.closingRouteKeys,onOpenRoute=_this$props.onOpenRoute,onCloseRoute=_this$props.onCloseRoute,renderHeader=_this$props.renderHeader,isParentHeaderShown=_this$props.isParentHeaderShown,isParentModal=_this$props.isParentModal,onTransitionStart=_this$props.onTransitionStart,onTransitionEnd=_this$props.onTransitionEnd,onGestureStart=_this$props.onGestureStart,onGestureEnd=_this$props.onGestureEnd,onGestureCancel=_this$props.onGestureCancel,_this$props$detachIna=_this$props.detachInactiveScreens,detachInactiveScreens=_this$props$detachIna===void 0?_Platform.default.OS==='web'||_Platform.default.OS==='android'||_Platform.default.OS==='ios':_this$props$detachIna;var _this$state=this.state,scenes=_this$state.scenes,layout=_this$state.layout,gestures=_this$state.gestures,activeStates=_this$state.activeStates,headerHeights=_this$state.headerHeights;var focusedRoute=state.routes[state.index];var focusedHeaderHeight=headerHeights[focusedRoute.key];var isFloatHeaderAbsolute=this.state.scenes.slice(-2).some(function(scene){var _scene$descriptor$opt;var options=(_scene$descriptor$opt=scene.descriptor.options)!=null?_scene$descriptor$opt:{};var headerMode=options.headerMode,headerTransparent=options.headerTransparent,_options$headerShown=options.headerShown,headerShown=_options$headerShown===void 0?true:_options$headerShown;if(headerTransparent||headerShown===false||headerMode==='screen'){return true;}return false;});return(0,_jsxRuntime.jsxs)(_View.default,{style:styles.container,children:[renderHeader({mode:'float',layout:layout,scenes:scenes,getPreviousScene:this.getPreviousScene,getFocusedRoute:this.getFocusedRoute,onContentHeightChange:this.handleHeaderLayout,style:[styles.floating,isFloatHeaderAbsolute&&[{height:focusedHeaderHeight},styles.absolute]]}),(0,_jsxRuntime.jsx)(_Screens.MaybeScreenContainer,{enabled:detachInactiveScreens,style:styles.container,onLayout:this.handleLayout,children:[].concat((0,_toConsumableArray2.default)(routes),(0,_toConsumableArray2.default)(state.preloadedRoutes)).map(function(route,index){var _scenes,_scenes2;var focused=focusedRoute.key===route.key;var gesture=gestures[route.key];var scene=scenes[index];var isPreloaded=state.preloadedRoutes.includes(route)&&!routes.includes(route);if(state.preloadedRoutes.includes(route)&&routes.includes(route)&&index>=routes.length){return null;}var _scene$descriptor$opt2=scene.descriptor.options,_scene$descriptor$opt3=_scene$descriptor$opt2.headerShown,headerShown=_scene$descriptor$opt3===void 0?true:_scene$descriptor$opt3,headerTransparent=_scene$descriptor$opt2.headerTransparent,freezeOnBlur=_scene$descriptor$opt2.freezeOnBlur,autoHideHomeIndicator=_scene$descriptor$opt2.autoHideHomeIndicator;var safeAreaInsetTop=insets.top;var safeAreaInsetRight=insets.right;var safeAreaInsetBottom=insets.bottom;var safeAreaInsetLeft=insets.left;var headerHeight=headerShown!==false?headerHeights[route.key]:0;var interpolationIndex=getInterpolationIndex(scenes,index);var isModal=getIsModal(scene,interpolationIndex,isParentModal);var isNextScreenTransparent=((_scenes=scenes[index+1])==null?void 0:_scenes.descriptor.options.presentation)==='transparentModal';var detachCurrentScreen=((_scenes2=scenes[index+1])==null?void 0:_scenes2.descriptor.options.detachPreviousScreen)!==false;var activityState=isPreloaded?STATE_INACTIVE:activeStates[index];return(0,_jsxRuntime.jsx)(_Screens.MaybeScreen,{style:[_StyleSheet.default.absoluteFill],enabled:detachInactiveScreens,active:activityState,freezeOnBlur:freezeOnBlur,shouldFreeze:activityState===STATE_INACTIVE&&!isPreloaded,homeIndicatorHidden:autoHideHomeIndicator,pointerEvents:"box-none",children:(0,_jsxRuntime.jsx)(_CardContainer.CardContainer,{index:index,interpolationIndex:interpolationIndex,modal:isModal,active:index===routes.length-1,focused:focused,opening:openingRouteKeys.includes(route.key),closing:closingRouteKeys.includes(route.key),layout:layout,gesture:gesture,scene:scene,safeAreaInsetTop:safeAreaInsetTop,safeAreaInsetRight:safeAreaInsetRight,safeAreaInsetBottom:safeAreaInsetBottom,safeAreaInsetLeft:safeAreaInsetLeft,onGestureStart:onGestureStart,onGestureCancel:onGestureCancel,onGestureEnd:onGestureEnd,headerHeight:headerHeight,isParentHeaderShown:isParentHeaderShown,onHeaderHeightChange:_this2.handleHeaderLayout,getPreviousScene:_this2.getPreviousScene,getFocusedRoute:_this2.getFocusedRoute,hasAbsoluteFloatHeader:isFloatHeaderAbsolute&&!headerTransparent,renderHeader:renderHeader,onOpenRoute:onOpenRoute,onCloseRoute:onCloseRoute,onTransitionStart:onTransitionStart,onTransitionEnd:onTransitionEnd,isNextScreenTransparent:isNextScreenTransparent,detachCurrentScreen:detachCurrentScreen,preloaded:isPreloaded})},route.key);})})]});}}],[{key:"getDerivedStateFromProps",value:function getDerivedStateFromProps(props,state){if(props.routes===state.routes&&props.descriptors===state.descriptors){return null;}var gestures=[].concat((0,_toConsumableArray2.default)(props.routes),(0,_toConsumableArray2.default)(props.state.preloadedRoutes)).reduce(function(acc,curr){var descriptor=props.descriptors[curr.key]||props.preloadedDescriptors[curr.key];var _ref4=(descriptor==null?void 0:descriptor.options)||{},animation=_ref4.animation;acc[curr.key]=state.gestures[curr.key]||new _Animated.default.Value(props.openingRouteKeys.includes(curr.key)&&getAnimationEnabled(animation)||props.state.preloadedRoutes.includes(curr)?getDistanceFromOptions(state.layout,descriptor==null?void 0:descriptor.options,props.direction==='rtl'):0);return acc;},{});var modalRouteKeys=(0,_getModalRoutesKeys.getModalRouteKeys)([].concat((0,_toConsumableArray2.default)(props.routes),(0,_toConsumableArray2.default)(props.state.preloadedRoutes)),Object.assign({},props.descriptors,props.preloadedDescriptors));var scenes=[].concat((0,_toConsumableArray2.default)(props.routes),(0,_toConsumableArray2.default)(props.state.preloadedRoutes)).map(function(route,index,self){var _ref5,_ref6,_descriptor$options$h;var isPreloaded=props.state.preloadedRoutes.includes(route);var previousRoute=isPreloaded?undefined:self[index-1];var nextRoute=isPreloaded?undefined:self[index+1];var oldScene=state.scenes[index];var currentGesture=gestures[route.key];var previousGesture=previousRoute?gestures[previousRoute.key]:undefined;var nextGesture=nextRoute?gestures[nextRoute.key]:undefined;var descriptor=(isPreloaded?props.preloadedDescriptors:props.descriptors)[route.key]||state.descriptors[route.key]||(oldScene?oldScene.descriptor:FALLBACK_DESCRIPTOR);var nextOptions=nextRoute&&((_ref5=props.descriptors[nextRoute==null?void 0:nextRoute.key]||state.descriptors[nextRoute==null?void 0:nextRoute.key])==null?void 0:_ref5.options);var previousOptions=previousRoute&&((_ref6=props.descriptors[previousRoute==null?void 0:previousRoute.key]||state.descriptors[previousRoute==null?void 0:previousRoute.key])==null?void 0:_ref6.options);var optionsForTransitionConfig=index!==self.length-1&&nextOptions&&(nextOptions==null?void 0:nextOptions.presentation)!=='transparentModal'?nextOptions:descriptor.options;var isModal=modalRouteKeys.includes(route.key);var animation=getDefaultAnimation(optionsForTransitionConfig.animation);var isAnimationEnabled=getAnimationEnabled(animation);var transitionPreset=animation!=='default'?NAMED_TRANSITIONS_PRESETS[animation]:optionsForTransitionConfig.presentation==='transparentModal'?_TransitionPresets.ModalFadeTransition:optionsForTransitionConfig.presentation==='modal'||isModal?_TransitionPresets.ModalTransition:_TransitionPresets.DefaultTransition;var _optionsForTransition=optionsForTransitionConfig.gestureEnabled,gestureEnabled=_optionsForTransition===void 0?_Platform.default.OS==='ios'&&isAnimationEnabled:_optionsForTransition,_optionsForTransition2=optionsForTransitionConfig.gestureDirection,gestureDirection=_optionsForTransition2===void 0?transitionPreset.gestureDirection:_optionsForTransition2,_optionsForTransition3=optionsForTransitionConfig.transitionSpec,transitionSpec=_optionsForTransition3===void 0?transitionPreset.transitionSpec:_optionsForTransition3,_optionsForTransition4=optionsForTransitionConfig.cardStyleInterpolator,cardStyleInterpolator=_optionsForTransition4===void 0?isAnimationEnabled?transitionPreset.cardStyleInterpolator:_CardStyleInterpolators.forNoAnimation:_optionsForTransition4,_optionsForTransition5=optionsForTransitionConfig.headerStyleInterpolator,headerStyleInterpolator=_optionsForTransition5===void 0?transitionPreset.headerStyleInterpolator:_optionsForTransition5,_optionsForTransition6=optionsForTransitionConfig.cardOverlayEnabled,cardOverlayEnabled=_optionsForTransition6===void 0?_Platform.default.OS!=='ios'&&optionsForTransitionConfig.presentation!=='transparentModal'||getIsModalPresentation(cardStyleInterpolator):_optionsForTransition6;var headerMode=(_descriptor$options$h=descriptor.options.headerMode)!=null?_descriptor$options$h:!(optionsForTransitionConfig.presentation==='modal'||optionsForTransitionConfig.presentation==='transparentModal'||(nextOptions==null?void 0:nextOptions.presentation)==='modal'||(nextOptions==null?void 0:nextOptions.presentation)==='transparentModal'||getIsModalPresentation(cardStyleInterpolator))&&_Platform.default.OS==='ios'&&descriptor.options.header===undefined?'float':'screen';var isRTL=props.direction==='rtl';var scene={route:route,descriptor:Object.assign({},descriptor,{options:Object.assign({},descriptor.options,{animation:animation,cardOverlayEnabled:cardOverlayEnabled,cardStyleInterpolator:cardStyleInterpolator,gestureDirection:gestureDirection,gestureEnabled:gestureEnabled,headerStyleInterpolator:headerStyleInterpolator,transitionSpec:transitionSpec,headerMode:headerMode})}),progress:{current:getProgressFromGesture(currentGesture,state.layout,descriptor.options,isRTL),next:nextGesture&&(nextOptions==null?void 0:nextOptions.presentation)!=='transparentModal'?getProgressFromGesture(nextGesture,state.layout,nextOptions,isRTL):undefined,previous:previousGesture?getProgressFromGesture(previousGesture,state.layout,previousOptions,isRTL):undefined},__memo:[state.layout,descriptor,nextOptions,previousOptions,currentGesture,nextGesture,previousGesture]};if(oldScene&&scene.__memo.every(function(it,i){return oldScene.__memo[i]===it;})){return oldScene;}return scene;});var activeStates=state.activeStates;if(props.routes.length!==state.routes.length){var activeScreensLimit=1;for(var i=props.routes.length-1;i>=0;i--){var options=scenes[i].descriptor.options;var _options$detachPrevio=options.detachPreviousScreen,detachPreviousScreen=_options$detachPrevio===void 0?options.presentation==='transparentModal'?false:getIsModalPresentation(options.cardStyleInterpolator)?i!==(0,_findLastIndex.findLastIndex)(scenes,function(scene){var cardStyleInterpolator=scene.descriptor.options.cardStyleInterpolator;return cardStyleInterpolator===_CardStyleInterpolators.forModalPresentationIOS||(cardStyleInterpolator==null?void 0:cardStyleInterpolator.name)==='forModalPresentationIOS';}):true:_options$detachPrevio;if(detachPreviousScreen===false){activeScreensLimit++;}else{if(i<=props.routes.length-2){break;}}}activeStates=props.routes.map(function(_,index,self){var activityState;var lastActiveState=state.activeStates[index];var activeAfterTransition=index>=self.length-activeScreensLimit;if(lastActiveState===STATE_INACTIVE&&!activeAfterTransition){activityState=STATE_INACTIVE;}else{var sceneForActivity=scenes[self.length-1];var outputValue=index===self.length-1?STATE_ON_TOP:activeAfterTransition?STATE_TRANSITIONING_OR_BELOW_TOP:STATE_INACTIVE;activityState=sceneForActivity?sceneForActivity.progress.current.interpolate({inputRange:[0,1-EPSILON,1],outputRange:[1,1,outputValue],extrapolate:'clamp'}):STATE_TRANSITIONING_OR_BELOW_TOP;}return activityState;});}return{routes:props.routes,scenes:scenes,gestures:gestures,descriptors:props.descriptors,activeStates:activeStates,headerHeights:getHeaderHeights(scenes,props.insets,props.isParentHeaderShown,props.isParentModal,state.layout,state.headerHeights)};}}]);}(React.Component);var styles=_StyleSheet.default.create({container:{flex:1},absolute:{position:'absolute',top:0,start:0,end:0},floating:{zIndex:1}});

/***/ },

/***/ 57202
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.useKeyboardManager=useKeyboardManager;var React=_interopRequireWildcard(__webpack_require__(96540));var _Keyboard=_interopRequireDefault(__webpack_require__(87068));var _TextInput=_interopRequireDefault(__webpack_require__(15782));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function useKeyboardManager(isEnabled){var previouslyFocusedTextInputRef=React.useRef(undefined);var startTimestampRef=React.useRef(0);var keyboardTimeoutRef=React.useRef(undefined);var clearKeyboardTimeout=React.useCallback(function(){if(keyboardTimeoutRef.current!==undefined){clearTimeout(keyboardTimeoutRef.current);keyboardTimeoutRef.current=undefined;}},[]);var onPageChangeStart=React.useCallback(function(){if(!isEnabled()){return;}clearKeyboardTimeout();var input=_TextInput.default.State.currentlyFocusedInput();input==null||input.blur();previouslyFocusedTextInputRef.current=input;startTimestampRef.current=Date.now();},[clearKeyboardTimeout,isEnabled]);var onPageChangeConfirm=React.useCallback(function(force){if(!isEnabled()){return;}clearKeyboardTimeout();if(force){_Keyboard.default.dismiss();}else{var input=previouslyFocusedTextInputRef.current;input==null||input.blur();}previouslyFocusedTextInputRef.current=undefined;},[clearKeyboardTimeout,isEnabled]);var onPageChangeCancel=React.useCallback(function(){if(!isEnabled()){return;}clearKeyboardTimeout();var input=previouslyFocusedTextInputRef.current;if(input){if(Date.now()-startTimestampRef.current<100){keyboardTimeoutRef.current=setTimeout(function(){input==null||input.focus();previouslyFocusedTextInputRef.current=undefined;},100);}else{input==null||input.focus();previouslyFocusedTextInputRef.current=undefined;}}},[clearKeyboardTimeout,isEnabled]);React.useEffect(function(){return function(){return clearKeyboardTimeout();};},[clearKeyboardTimeout]);return{onPageChangeStart:onPageChangeStart,onPageChangeConfirm:onPageChangeConfirm,onPageChangeCancel:onPageChangeCancel};}

/***/ },

/***/ 58269
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.conditional=conditional;var _Animated=_interopRequireDefault(__webpack_require__(48831));var add=_Animated.default.add,multiply=_Animated.default.multiply;function conditional(condition,main,fallback){return add(multiply(condition,main),multiply(condition.interpolate({inputRange:[0,1],outputRange:[1,0]}),fallback));}

/***/ },

/***/ 59121
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _TabsHost=_interopRequireDefault(__webpack_require__(11459));var _TabsScreen=_interopRequireDefault(__webpack_require__(68101));var Tabs={Host:_TabsHost.default,Screen:_TabsScreen.default};var _default=exports["default"]=Tabs;

/***/ },

/***/ 62596
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.getDistanceForDirection=getDistanceForDirection;var _getInvertedMultiplier=__webpack_require__(22539);function getDistanceForDirection(layout,gestureDirection,isRTL){var multiplier=(0,_getInvertedMultiplier.getInvertedMultiplier)(gestureDirection,isRTL);switch(gestureDirection){case'vertical':case'vertical-inverted':return layout.height*multiplier;case'horizontal':case'horizontal-inverted':return layout.width*multiplier;}}

/***/ },

/***/ 64778
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));

/***/ },

/***/ 67316
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=useTransitionProgress;var React=_interopRequireWildcard(__webpack_require__(96540));var _TransitionProgressContext=_interopRequireDefault(__webpack_require__(35172));function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function useTransitionProgress(){var progress=React.useContext(_TransitionProgressContext.default);if(progress===undefined){throw new Error("Couldn't find values for transition progress. Are you inside a screen in Native Stack?");}return progress;}

/***/ },

/***/ 68101
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var TabsScreen=_View.default;var _default=exports["default"]=TabsScreen;

/***/ },

/***/ 68384
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var ScreenStack=_View.default;var _default=exports["default"]=ScreenStack;

/***/ },

/***/ 68425
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var SafeAreaView=_View.default;var _default=exports["default"]=SafeAreaView;

/***/ },

/***/ 68444
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58168);
/* harmony import */ var _babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98587);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96540);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(43999);
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9176);
/* harmony import */ var _modules_canUseDom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7162);


var _excluded = ["style"];
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */





var cssFunction = function () {
  if (_modules_canUseDom__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A && window.CSS && window.CSS.supports && window.CSS.supports('top: constant(safe-area-inset-top)')) {
    return 'constant';
  }
  return 'env';
}();
var SafeAreaView = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.forwardRef((props, ref) => {
  var style = props.style,
    rest = (0,_babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(props, _excluded);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_View__WEBPACK_IMPORTED_MODULE_4__["default"], (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)({}, rest, {
    ref: ref,
    style: [styles.root, style]
  }));
});
SafeAreaView.displayName = 'SafeAreaView';
var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_3__["default"].create({
  root: {
    paddingTop: cssFunction + "(safe-area-inset-top)",
    paddingRight: cssFunction + "(safe-area-inset-right)",
    paddingBottom: cssFunction + "(safe-area-inset-bottom)",
    paddingLeft: cssFunction + "(safe-area-inset-left)"
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SafeAreaView);

/***/ },

/***/ 70258
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.StackView=void 0;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var _toConsumableArray2=_interopRequireDefault(__webpack_require__(41132));var _classCallCheck2=_interopRequireDefault(__webpack_require__(17383));var _createClass2=_interopRequireDefault(__webpack_require__(34579));var _possibleConstructorReturn2=_interopRequireDefault(__webpack_require__(28452));var _getPrototypeOf2=_interopRequireDefault(__webpack_require__(63072));var _inherits2=_interopRequireDefault(__webpack_require__(29511));var _elements=__webpack_require__(31755);var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _reactNativeSafeAreaContext=__webpack_require__(1913);var _ModalPresentationContext=__webpack_require__(19989);var _GestureHandler=__webpack_require__(22713);var _HeaderContainer=__webpack_require__(86844);var _CardStack=__webpack_require__(56527);var _jsxRuntime=__webpack_require__(74848);var _excluded=["state","descriptors"];var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\StackView.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}var GestureHandlerWrapper=_GestureHandler.GestureHandlerRootView!=null?_GestureHandler.GestureHandlerRootView:_View.default;var isArrayEqual=function isArrayEqual(a,b){return a.length===b.length&&a.every(function(it,index){return Object.is(it,b[index]);});};var StackView=exports.StackView=function(_React$Component){function StackView(){var _this;(0,_classCallCheck2.default)(this,StackView);for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_callSuper(this,StackView,[].concat(args));_this.state={routes:[],previousRoutes:[],previousDescriptors:{},openingRouteKeys:[],closingRouteKeys:[],replacingRouteKeys:[],descriptors:{}};_this.getPreviousRoute=function(_ref){var route=_ref.route;var _this$state=_this.state,closingRouteKeys=_this$state.closingRouteKeys,replacingRouteKeys=_this$state.replacingRouteKeys;var routes=_this.state.routes.filter(function(r){return r.key===route.key||!closingRouteKeys.includes(r.key)&&!replacingRouteKeys.includes(r.key);});var index=routes.findIndex(function(r){return r.key===route.key;});return routes[index-1];};_this.renderHeader=function(props){return(0,_jsxRuntime.jsx)(_HeaderContainer.HeaderContainer,Object.assign({},props));};_this.handleOpenRoute=function(_ref2){var route=_ref2.route;var _this$props=_this.props,state=_this$props.state,navigation=_this$props.navigation;var _this$state2=_this.state,closingRouteKeys=_this$state2.closingRouteKeys,replacingRouteKeys=_this$state2.replacingRouteKeys;if(closingRouteKeys.some(function(key){return key===route.key;})&&replacingRouteKeys.every(function(key){return key!==route.key;})&&state.routeNames.includes(route.name)&&!state.routes.some(function(r){return r.key===route.key;})){navigation.dispatch(function(state){var routes=[].concat((0,_toConsumableArray2.default)(state.routes.filter(function(r){return r.key!==route.key;})),[route]);return _native.CommonActions.reset(Object.assign({},state,{routes:routes,index:routes.length-1}));});}else{_this.setState(function(state){return{routes:state.replacingRouteKeys.length?state.routes.filter(function(r){return!state.replacingRouteKeys.includes(r.key);}):state.routes,openingRouteKeys:state.openingRouteKeys.filter(function(key){return key!==route.key;}),closingRouteKeys:state.closingRouteKeys.filter(function(key){return key!==route.key;}),replacingRouteKeys:[]};});}};_this.handleCloseRoute=function(_ref3){var route=_ref3.route;var _this$props2=_this.props,state=_this$props2.state,navigation=_this$props2.navigation;if(state.routes.some(function(r){return r.key===route.key;})){navigation.dispatch(Object.assign({},_native.StackActions.pop(),{source:route.key,target:state.key}));}else{_this.setState(function(state){return{routes:state.routes.filter(function(r){return r.key!==route.key;}),openingRouteKeys:state.openingRouteKeys.filter(function(key){return key!==route.key;}),closingRouteKeys:state.closingRouteKeys.filter(function(key){return key!==route.key;})};});}};_this.handleTransitionStart=function(_ref4,closing){var route=_ref4.route;return _this.props.navigation.emit({type:'transitionStart',data:{closing:closing},target:route.key});};_this.handleTransitionEnd=function(_ref5,closing){var route=_ref5.route;return _this.props.navigation.emit({type:'transitionEnd',data:{closing:closing},target:route.key});};_this.handleGestureStart=function(_ref6){var route=_ref6.route;_this.props.navigation.emit({type:'gestureStart',target:route.key});};_this.handleGestureEnd=function(_ref7){var route=_ref7.route;_this.props.navigation.emit({type:'gestureEnd',target:route.key});};_this.handleGestureCancel=function(_ref8){var route=_ref8.route;_this.props.navigation.emit({type:'gestureCancel',target:route.key});};return _this;}(0,_inherits2.default)(StackView,_React$Component);return(0,_createClass2.default)(StackView,[{key:"render",value:function render(){var _this2=this;var _this$props3=this.props,state=_this$props3.state,_=_this$props3.descriptors,rest=(0,_objectWithoutProperties2.default)(_this$props3,_excluded);var _this$state3=this.state,routes=_this$state3.routes,descriptors=_this$state3.descriptors,openingRouteKeys=_this$state3.openingRouteKeys,closingRouteKeys=_this$state3.closingRouteKeys;var preloadedDescriptors=state.preloadedRoutes.reduce(function(acc,route){acc[route.key]=acc[route.key]||_this2.props.describe(route,true);return acc;},{});return(0,_jsxRuntime.jsx)(GestureHandlerWrapper,{style:styles.container,children:(0,_jsxRuntime.jsx)(_elements.SafeAreaProviderCompat,{children:(0,_jsxRuntime.jsx)(_reactNativeSafeAreaContext.SafeAreaInsetsContext.Consumer,{children:function children(insets){return(0,_jsxRuntime.jsx)(_ModalPresentationContext.ModalPresentationContext.Consumer,{children:function children(isParentModal){return(0,_jsxRuntime.jsx)(_elements.HeaderShownContext.Consumer,{children:function children(isParentHeaderShown){return(0,_jsxRuntime.jsx)(_CardStack.CardStack,Object.assign({insets:insets,isParentHeaderShown:isParentHeaderShown,isParentModal:isParentModal,getPreviousRoute:_this2.getPreviousRoute,routes:routes,openingRouteKeys:openingRouteKeys,closingRouteKeys:closingRouteKeys,onOpenRoute:_this2.handleOpenRoute,onCloseRoute:_this2.handleCloseRoute,onTransitionStart:_this2.handleTransitionStart,onTransitionEnd:_this2.handleTransitionEnd,renderHeader:_this2.renderHeader,state:state,descriptors:descriptors,onGestureStart:_this2.handleGestureStart,onGestureEnd:_this2.handleGestureEnd,onGestureCancel:_this2.handleGestureCancel,preloadedDescriptors:preloadedDescriptors},rest));}});}});}})})});}}],[{key:"getDerivedStateFromProps",value:function getDerivedStateFromProps(props,state){if((props.state.routes===state.previousRoutes||isArrayEqual(props.state.routes.map(function(r){return r.key;}),state.previousRoutes.map(function(r){return r.key;})))&&state.routes.length){var _routes=state.routes;var _previousRoutes=state.previousRoutes;var _descriptors=props.descriptors;var previousDescriptors=state.previousDescriptors;if(props.descriptors!==state.previousDescriptors){_descriptors=state.routes.reduce(function(acc,route){acc[route.key]=props.descriptors[route.key]||state.descriptors[route.key];return acc;},{});previousDescriptors=props.descriptors;}if(props.state.routes!==state.previousRoutes){var map=props.state.routes.reduce(function(acc,route){acc[route.key]=route;return acc;},{});_routes=state.routes.map(function(route){return map[route.key]||route;});_previousRoutes=props.state.routes;}return{routes:_routes,previousRoutes:_previousRoutes,descriptors:_descriptors,previousDescriptors:previousDescriptors};}var routes=props.state.index<props.state.routes.length-1?props.state.routes.slice(0,props.state.index+1):props.state.routes;var previousRoutes=state.previousRoutes;var openingRouteKeys=state.openingRouteKeys,closingRouteKeys=state.closingRouteKeys,replacingRouteKeys=state.replacingRouteKeys;var previousFocusedRoute=previousRoutes[previousRoutes.length-1];var nextFocusedRoute=routes[routes.length-1];var isAnimationEnabled=function isAnimationEnabled(key){var descriptor=props.descriptors[key]||state.descriptors[key];return(0,_CardStack.getAnimationEnabled)(descriptor==null?void 0:descriptor.options.animation);};var getAnimationTypeForReplace=function getAnimationTypeForReplace(key){var _descriptor$options$a;var descriptor=props.descriptors[key]||state.descriptors[key];return(_descriptor$options$a=descriptor.options.animationTypeForReplace)!=null?_descriptor$options$a:'push';};if(previousFocusedRoute&&previousFocusedRoute.key!==nextFocusedRoute.key){if(previousRoutes.some(function(r){return r.key===nextFocusedRoute.key;})&&!routes.some(function(r){return r.key===previousFocusedRoute.key;})){if(isAnimationEnabled(previousFocusedRoute.key)&&!closingRouteKeys.includes(previousFocusedRoute.key)){closingRouteKeys=[].concat((0,_toConsumableArray2.default)(closingRouteKeys),[previousFocusedRoute.key]);openingRouteKeys=openingRouteKeys.filter(function(key){return key!==previousFocusedRoute.key;});replacingRouteKeys=replacingRouteKeys.filter(function(key){return key!==previousFocusedRoute.key;});routes=[].concat((0,_toConsumableArray2.default)(routes),[previousFocusedRoute]);}}else{if(isAnimationEnabled(nextFocusedRoute.key)&&!openingRouteKeys.includes(nextFocusedRoute.key)){openingRouteKeys=[].concat((0,_toConsumableArray2.default)(openingRouteKeys),[nextFocusedRoute.key]);closingRouteKeys=closingRouteKeys.filter(function(key){return key!==nextFocusedRoute.key;});replacingRouteKeys=replacingRouteKeys.filter(function(key){return key!==nextFocusedRoute.key;});if(!routes.some(function(r){return r.key===previousFocusedRoute.key;})){openingRouteKeys=openingRouteKeys.filter(function(key){return key!==previousFocusedRoute.key;});if(getAnimationTypeForReplace(nextFocusedRoute.key)==='pop'){closingRouteKeys=[].concat((0,_toConsumableArray2.default)(closingRouteKeys),[previousFocusedRoute.key]);openingRouteKeys=openingRouteKeys.filter(function(key){return key!==nextFocusedRoute.key;});routes=[].concat((0,_toConsumableArray2.default)(routes),[previousFocusedRoute]);}else{replacingRouteKeys=[].concat((0,_toConsumableArray2.default)(replacingRouteKeys),[previousFocusedRoute.key]);closingRouteKeys=closingRouteKeys.filter(function(key){return key!==previousFocusedRoute.key;});routes=routes.slice();routes.splice(routes.length-1,0,previousFocusedRoute);}}}}}else if(replacingRouteKeys.length||closingRouteKeys.length){var _routes2;routes=routes.slice();(_routes2=routes).splice.apply(_routes2,[routes.length-1,0].concat((0,_toConsumableArray2.default)(state.routes.filter(function(_ref9){var key=_ref9.key;return isAnimationEnabled(key)?replacingRouteKeys.includes(key)||closingRouteKeys.includes(key):false;}))));}if(!routes.length){throw new Error('There should always be at least one route in the navigation state.');}var descriptors=routes.reduce(function(acc,route){acc[route.key]=props.descriptors[route.key]||state.descriptors[route.key];return acc;},{});return{routes:routes,previousRoutes:props.state.routes,previousDescriptors:props.descriptors,openingRouteKeys:openingRouteKeys,closingRouteKeys:closingRouteKeys,replacingRouteKeys:replacingRouteKeys,descriptors:descriptors};}}]);}(React.Component);var styles=_StyleSheet.default.create({container:{flex:1}});

/***/ },

/***/ 72833
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.throttle=throttle;function throttle(func,duration){var timeout;return function(){if(timeout==null){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}func.apply(this,args);timeout=setTimeout(function(){timeout=undefined;},duration);}};}

/***/ },

/***/ 76513
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
Object.defineProperty(exports,"__esModule",{value:true});var _exportNames={createStaticNavigation:true,Link:true,LinkingContext:true,LocaleDirContext:true,NavigationContainer:true,ServerContainer:true,DarkTheme:true,DefaultTheme:true,UNSTABLE_UnhandledLinkingContext:true,useLinkBuilder:true,useLinkProps:true,useLinkTo:true,useLocale:true,useRoutePath:true,useScrollToTop:true};Object.defineProperty(exports,"DarkTheme",{enumerable:true,get:function get(){return _DarkTheme.DarkTheme;}});Object.defineProperty(exports,"DefaultTheme",{enumerable:true,get:function get(){return _DefaultTheme.DefaultTheme;}});Object.defineProperty(exports,"Link",{enumerable:true,get:function get(){return _Link.Link;}});Object.defineProperty(exports,"LinkingContext",{enumerable:true,get:function get(){return _LinkingContext.LinkingContext;}});Object.defineProperty(exports,"LocaleDirContext",{enumerable:true,get:function get(){return _LocaleDirContext.LocaleDirContext;}});Object.defineProperty(exports,"NavigationContainer",{enumerable:true,get:function get(){return _NavigationContainer.NavigationContainer;}});Object.defineProperty(exports,"ServerContainer",{enumerable:true,get:function get(){return _ServerContainer.ServerContainer;}});Object.defineProperty(exports,"UNSTABLE_UnhandledLinkingContext",{enumerable:true,get:function get(){return _UnhandledLinkingContext.UnhandledLinkingContext;}});Object.defineProperty(exports,"createStaticNavigation",{enumerable:true,get:function get(){return _createStaticNavigation.createStaticNavigation;}});Object.defineProperty(exports,"useLinkBuilder",{enumerable:true,get:function get(){return _useLinkBuilder.useLinkBuilder;}});Object.defineProperty(exports,"useLinkProps",{enumerable:true,get:function get(){return _useLinkProps.useLinkProps;}});Object.defineProperty(exports,"useLinkTo",{enumerable:true,get:function get(){return _useLinkTo.useLinkTo;}});Object.defineProperty(exports,"useLocale",{enumerable:true,get:function get(){return _useLocale.useLocale;}});Object.defineProperty(exports,"useRoutePath",{enumerable:true,get:function get(){return _useRoutePath.useRoutePath;}});Object.defineProperty(exports,"useScrollToTop",{enumerable:true,get:function get(){return _useScrollToTop.useScrollToTop;}});var _createStaticNavigation=require("./createStaticNavigation.js");var _Link=require("./Link.js");var _LinkingContext=require("./LinkingContext.js");var _LocaleDirContext=require("./LocaleDirContext.js");var _NavigationContainer=require("./NavigationContainer.js");var _ServerContainer=require("./ServerContainer.js");var _DarkTheme=require("./theming/DarkTheme.js");var _DefaultTheme=require("./theming/DefaultTheme.js");var _types=require("./types.js");Object.keys(_types).forEach(function(key){if(key==="default"||key==="__esModule")return;if(Object.prototype.hasOwnProperty.call(_exportNames,key))return;if(key in exports&&exports[key]===_types[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _types[key];}});});var _UnhandledLinkingContext=require("./UnhandledLinkingContext.js");var _useLinkBuilder=require("./useLinkBuilder.js");var _useLinkProps=require("./useLinkProps.js");var _useLinkTo=require("./useLinkTo.js");var _useLocale=require("./useLocale.js");var _useRoutePath=require("./useRoutePath.js");var _useScrollToTop=require("./useScrollToTop.js");var _core=require("@react-navigation/core");Object.keys(_core).forEach(function(key){if(key==="default"||key==="__esModule")return;if(Object.prototype.hasOwnProperty.call(_exportNames,key))return;if(key in exports&&exports[key]===_core[key])return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return _core[key];}});});

/***/ },

/***/ 76976
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var React = __webpack_require__(96540);
/**
 * Use `useEffect` during SSR and `useLayoutEffect` in the Browser & React Native to avoid warnings.
 */
var useClientLayoutEffect = typeof document !== 'undefined' ||
    (typeof navigator !== 'undefined' && navigator.product === 'ReactNative')
    ? React.useLayoutEffect
    : React.useEffect;
/**
 * React hook which returns the latest callback without changing the reference.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function useLatestCallback(callback) {
    var ref = React.useRef(callback);
    var latestCallback = React.useRef(function latestCallback() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return ref.current.apply(this, args);
    }).current;
    useClientLayoutEffect(function () {
        ref.current = callback;
    });
    return latestCallback;
}
module.exports = useLatestCallback;


/***/ },

/***/ 82949
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _default=exports["default"]={};

/***/ },

/***/ 83062
(__unused_webpack_module, exports) {

Object.defineProperty(exports, "__esModule", ({value:true}));

/***/ },

/***/ 83496
(module) {

module.exports = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};


/***/ },

/***/ 84644
(__unused_webpack_module, exports, __webpack_require__) {

'use client';var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.enableFreeze=enableFreeze;exports.enableScreens=enableScreens;exports.freezeEnabled=freezeEnabled;exports.isNativePlatformSupported=void 0;exports.screensEnabled=screensEnabled;var _Platform=_interopRequireDefault(__webpack_require__(67862));var _UIManager=_interopRequireDefault(__webpack_require__(8683));var isNativePlatformSupported=exports.isNativePlatformSupported=_Platform.default.OS==='ios'||_Platform.default.OS==='android'||_Platform.default.OS==='windows';var ENABLE_SCREENS=isNativePlatformSupported;function enableScreens(){var shouldEnableScreens=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;ENABLE_SCREENS=shouldEnableScreens;if(!isNativePlatformSupported){return;}if(ENABLE_SCREENS&&!_UIManager.default.getViewManagerConfig('RNSScreen')){console.error(`Screen native module hasn't been linked. Please check the react-native-screens README for more details`);}}var ENABLE_FREEZE=false;function enableFreeze(){var shouldEnableReactFreeze=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;if(!isNativePlatformSupported){return;}ENABLE_FREEZE=shouldEnableReactFreeze;}function screensEnabled(){return ENABLE_SCREENS;}function freezeEnabled(){return ENABLE_FREEZE;}

/***/ },

/***/ 85884
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.SafeAreaView=void 0;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var React=_interopRequireWildcard(__webpack_require__(96540));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _SafeAreaContext=__webpack_require__(96910);var _excluded=["style","mode","edges"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r]);}return n;},_extends.apply(null,arguments);}var defaultEdges={top:'additive',left:'additive',bottom:'additive',right:'additive'};function getEdgeValue(inset,current,mode){switch(mode){case'off':return current;case'maximum':return Math.max(current,inset);case'additive':default:return current+inset;}}var SafeAreaView=exports.SafeAreaView=React.forwardRef(function(_ref,ref){var _ref$style=_ref.style,style=_ref$style===void 0?{}:_ref$style,mode=_ref.mode,edges=_ref.edges,rest=(0,_objectWithoutProperties2.default)(_ref,_excluded);var insets=(0,_SafeAreaContext.useSafeAreaInsets)();var edgesRecord=React.useMemo(function(){if(edges==null){return defaultEdges;}return Array.isArray(edges)?edges.reduce(function(acc,edge){acc[edge]='additive';return acc;},{}):edges;},[edges]);var appliedStyle=React.useMemo(function(){var flatStyle=_StyleSheet.default.flatten(style);if(mode==='margin'){var _flatStyle$margin=flatStyle.margin,margin=_flatStyle$margin===void 0?0:_flatStyle$margin,_flatStyle$marginVert=flatStyle.marginVertical,marginVertical=_flatStyle$marginVert===void 0?margin:_flatStyle$marginVert,_flatStyle$marginHori=flatStyle.marginHorizontal,marginHorizontal=_flatStyle$marginHori===void 0?margin:_flatStyle$marginHori,_flatStyle$marginTop=flatStyle.marginTop,marginTop=_flatStyle$marginTop===void 0?marginVertical:_flatStyle$marginTop,_flatStyle$marginRigh=flatStyle.marginRight,marginRight=_flatStyle$marginRigh===void 0?marginHorizontal:_flatStyle$marginRigh,_flatStyle$marginBott=flatStyle.marginBottom,marginBottom=_flatStyle$marginBott===void 0?marginVertical:_flatStyle$marginBott,_flatStyle$marginLeft=flatStyle.marginLeft,marginLeft=_flatStyle$marginLeft===void 0?marginHorizontal:_flatStyle$marginLeft;var marginStyle={marginTop:getEdgeValue(insets.top,marginTop,edgesRecord.top),marginRight:getEdgeValue(insets.right,marginRight,edgesRecord.right),marginBottom:getEdgeValue(insets.bottom,marginBottom,edgesRecord.bottom),marginLeft:getEdgeValue(insets.left,marginLeft,edgesRecord.left)};return[style,marginStyle];}else{var _flatStyle$padding=flatStyle.padding,padding=_flatStyle$padding===void 0?0:_flatStyle$padding,_flatStyle$paddingVer=flatStyle.paddingVertical,paddingVertical=_flatStyle$paddingVer===void 0?padding:_flatStyle$paddingVer,_flatStyle$paddingHor=flatStyle.paddingHorizontal,paddingHorizontal=_flatStyle$paddingHor===void 0?padding:_flatStyle$paddingHor,_flatStyle$paddingTop=flatStyle.paddingTop,paddingTop=_flatStyle$paddingTop===void 0?paddingVertical:_flatStyle$paddingTop,_flatStyle$paddingRig=flatStyle.paddingRight,paddingRight=_flatStyle$paddingRig===void 0?paddingHorizontal:_flatStyle$paddingRig,_flatStyle$paddingBot=flatStyle.paddingBottom,paddingBottom=_flatStyle$paddingBot===void 0?paddingVertical:_flatStyle$paddingBot,_flatStyle$paddingLef=flatStyle.paddingLeft,paddingLeft=_flatStyle$paddingLef===void 0?paddingHorizontal:_flatStyle$paddingLef;var paddingStyle={paddingTop:getEdgeValue(insets.top,paddingTop,edgesRecord.top),paddingRight:getEdgeValue(insets.right,paddingRight,edgesRecord.right),paddingBottom:getEdgeValue(insets.bottom,paddingBottom,edgesRecord.bottom),paddingLeft:getEdgeValue(insets.left,paddingLeft,edgesRecord.left)};return[style,paddingStyle];}},[edgesRecord.bottom,edgesRecord.left,edgesRecord.right,edgesRecord.top,insets.bottom,insets.left,insets.right,insets.top,mode,style]);return React.createElement(_View.default,_extends({style:appliedStyle},rest,{ref:ref}));});

/***/ },

/***/ 86844
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.HeaderContainer=HeaderContainer;var _elements=__webpack_require__(31755);var _native=__webpack_require__(76513);var React=_interopRequireWildcard(__webpack_require__(96540));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _HeaderStyleInterpolators=__webpack_require__(94934);var _Header=__webpack_require__(22357);var _jsxRuntime=__webpack_require__(74848);var _jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Header\\HeaderContainer.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function HeaderContainer(_ref){var _this=this;var mode=_ref.mode,scenes=_ref.scenes,layout=_ref.layout,getPreviousScene=_ref.getPreviousScene,getFocusedRoute=_ref.getFocusedRoute,onContentHeightChange=_ref.onContentHeightChange,style=_ref.style;var focusedRoute=getFocusedRoute();var parentHeaderBack=React.useContext(_elements.HeaderBackContext);var _useLinkBuilder=(0,_native.useLinkBuilder)(),buildHref=_useLinkBuilder.buildHref;return(0,_jsxRuntime.jsx)(_View.default,{pointerEvents:"box-none",style:style,children:scenes.slice(-2).map(function(scene,i,self){var _self,_self2;if(mode==='screen'&&i!==self.length-1||!scene){return null;}var _scene$descriptor$opt=scene.descriptor.options,header=_scene$descriptor$opt.header,headerMode=_scene$descriptor$opt.headerMode,_scene$descriptor$opt2=_scene$descriptor$opt.headerShown,headerShown=_scene$descriptor$opt2===void 0?true:_scene$descriptor$opt2,headerTransparent=_scene$descriptor$opt.headerTransparent,headerStyleInterpolator=_scene$descriptor$opt.headerStyleInterpolator;if(headerMode!==mode||!headerShown){return null;}var isFocused=focusedRoute.key===scene.descriptor.route.key;var previousScene=getPreviousScene({route:scene.descriptor.route});var headerBack=parentHeaderBack;if(previousScene){var _previousScene$descri=previousScene.descriptor,options=_previousScene$descri.options,route=_previousScene$descri.route;headerBack=previousScene?{title:(0,_elements.getHeaderTitle)(options,route.name),href:buildHref(route.name,route.params)}:parentHeaderBack;}var previousDescriptor=(_self=self[i-1])==null?void 0:_self.descriptor;var nextDescriptor=(_self2=self[i+1])==null?void 0:_self2.descriptor;var _ref2=(previousDescriptor==null?void 0:previousDescriptor.options)||{},_ref2$headerShown=_ref2.headerShown,previousHeaderShown=_ref2$headerShown===void 0?true:_ref2$headerShown,previousHeaderMode=_ref2.headerMode;var nextHeaderlessScene=self.slice(i+1).find(function(scene){var _ref3=(scene==null?void 0:scene.descriptor.options)||{},_ref3$headerShown=_ref3.headerShown,currentHeaderShown=_ref3$headerShown===void 0?true:_ref3$headerShown,currentHeaderMode=_ref3.headerMode;return currentHeaderShown===false||currentHeaderMode==='screen';});var _ref4=(nextHeaderlessScene==null?void 0:nextHeaderlessScene.descriptor.options)||{},nextHeaderlessGestureDirection=_ref4.gestureDirection;var isHeaderStatic=(previousHeaderShown===false||previousHeaderMode==='screen')&&!nextDescriptor||nextHeaderlessScene;var props={layout:layout,back:headerBack,progress:scene.progress,options:scene.descriptor.options,route:scene.descriptor.route,navigation:scene.descriptor.navigation,styleInterpolator:mode==='float'?isHeaderStatic?nextHeaderlessGestureDirection==='vertical'||nextHeaderlessGestureDirection==='vertical-inverted'?_HeaderStyleInterpolators.forSlideUp:nextHeaderlessGestureDirection==='horizontal-inverted'?_HeaderStyleInterpolators.forSlideRight:_HeaderStyleInterpolators.forSlideLeft:headerStyleInterpolator:_HeaderStyleInterpolators.forNoAnimation};return(0,_jsxRuntime.jsx)(_native.NavigationContext.Provider,{value:scene.descriptor.navigation,children:(0,_jsxRuntime.jsx)(_native.NavigationRouteContext.Provider,{value:scene.descriptor.route,children:(0,_jsxRuntime.jsx)(_View.default,{onLayout:onContentHeightChange?function(e){var height=e.nativeEvent.layout.height;onContentHeightChange({route:scene.descriptor.route,height:height});}:undefined,pointerEvents:isFocused?'box-none':'none',"aria-hidden":!isFocused,style:mode==='float'&&!isFocused||headerTransparent?styles.header:null,children:header!==undefined?header(props):(0,_jsxRuntime.jsx)(_Header.Header,Object.assign({},props))})})},scene.descriptor.route.key);})});}var styles=_StyleSheet.default.create({header:{position:'absolute',top:0,start:0,end:0}});

/***/ },

/***/ 89742
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function emptyFunction() {}
var BackHandler = {
  exitApp: emptyFunction,
  addEventListener() {
    console.error('BackHandler is not supported on web and should not be used.');
    return {
      remove: emptyFunction
    };
  },
  removeEventListener: emptyFunction
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BackHandler);

/***/ },

/***/ 91568
(__unused_webpack_module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.useGestureHandlerRef=useGestureHandlerRef;var React=_interopRequireWildcard(__webpack_require__(96540));var _GestureHandlerRefContext=__webpack_require__(5414);function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function useGestureHandlerRef(){var ref=React.useContext(_GestureHandlerRefContext.GestureHandlerRefContext);if(ref===undefined){throw new Error("Couldn't find a ref for gesture handler. Are you inside a screen in Stack?");}return ref;}

/***/ },

/***/ 93126
(__unused_webpack_module, exports, __webpack_require__) {

'use client';var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=exports.ScreenContext=exports.NativeScreen=exports.InnerScreen=void 0;var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var _classCallCheck2=_interopRequireDefault(__webpack_require__(17383));var _createClass2=_interopRequireDefault(__webpack_require__(34579));var _possibleConstructorReturn2=_interopRequireDefault(__webpack_require__(28452));var _getPrototypeOf2=_interopRequireDefault(__webpack_require__(63072));var _inherits2=_interopRequireDefault(__webpack_require__(29511));var _Animated=_interopRequireDefault(__webpack_require__(48831));var _View=_interopRequireDefault(__webpack_require__(9176));var _react=_interopRequireDefault(__webpack_require__(96540));var _core=__webpack_require__(84644);var _excluded=["active","activityState","style","enabled"];function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r]);}return n;},_extends.apply(null,arguments);}var InnerScreen=exports.InnerScreen=_View.default;var NativeScreen=exports.NativeScreen=function(_React$Component){function NativeScreen(){(0,_classCallCheck2.default)(this,NativeScreen);return _callSuper(this,NativeScreen,arguments);}(0,_inherits2.default)(NativeScreen,_React$Component);return(0,_createClass2.default)(NativeScreen,[{key:"render",value:function render(){var _this$props=this.props,active=_this$props.active,activityState=_this$props.activityState,style=_this$props.style,_this$props$enabled=_this$props.enabled,enabled=_this$props$enabled===void 0?(0,_core.screensEnabled)():_this$props$enabled,rest=(0,_objectWithoutProperties2.default)(_this$props,_excluded);if(enabled){if(active!==undefined&&activityState===undefined){activityState=active!==0?2:0;}return _react.default.createElement(_View.default,_extends({hidden:activityState===0,style:[style,{display:activityState!==0?'flex':'none'}]},rest));}return _react.default.createElement(_View.default,rest);}}]);}(_react.default.Component);var Screen=_Animated.default.createAnimatedComponent(NativeScreen);var ScreenContext=exports.ScreenContext=_react.default.createContext(Screen);var _default=exports["default"]=Screen;

/***/ },

/***/ 94650
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ exports_TouchableOpacity)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(58168);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(98587);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(96540);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/useMergeRefs/index.js
var useMergeRefs = __webpack_require__(11804);
;// ./node_modules/react-native-web/dist/modules/usePressEvents/PressResponder.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */



var DELAY = 'DELAY';
var ERROR = 'ERROR';
var LONG_PRESS_DETECTED = 'LONG_PRESS_DETECTED';
var NOT_RESPONDER = 'NOT_RESPONDER';
var RESPONDER_ACTIVE_LONG_PRESS_START = 'RESPONDER_ACTIVE_LONG_PRESS_START';
var RESPONDER_ACTIVE_PRESS_START = 'RESPONDER_ACTIVE_PRESS_START';
var RESPONDER_INACTIVE_PRESS_START = 'RESPONDER_INACTIVE_PRESS_START';
var RESPONDER_GRANT = 'RESPONDER_GRANT';
var RESPONDER_RELEASE = 'RESPONDER_RELEASE';
var RESPONDER_TERMINATED = 'RESPONDER_TERMINATED';
var Transitions = Object.freeze({
  NOT_RESPONDER: {
    DELAY: ERROR,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: ERROR,
    RESPONDER_TERMINATED: ERROR,
    LONG_PRESS_DETECTED: ERROR
  },
  RESPONDER_INACTIVE_PRESS_START: {
    DELAY: RESPONDER_ACTIVE_PRESS_START,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: ERROR
  },
  RESPONDER_ACTIVE_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START
  },
  RESPONDER_ACTIVE_LONG_PRESS_START: {
    DELAY: ERROR,
    RESPONDER_GRANT: ERROR,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: RESPONDER_ACTIVE_LONG_PRESS_START
  },
  ERROR: {
    DELAY: NOT_RESPONDER,
    RESPONDER_GRANT: RESPONDER_INACTIVE_PRESS_START,
    RESPONDER_RELEASE: NOT_RESPONDER,
    RESPONDER_TERMINATED: NOT_RESPONDER,
    LONG_PRESS_DETECTED: NOT_RESPONDER
  }
});
var getElementRole = element => element.getAttribute('role');
var getElementType = element => element.tagName.toLowerCase();
var isActiveSignal = signal => signal === RESPONDER_ACTIVE_PRESS_START || signal === RESPONDER_ACTIVE_LONG_PRESS_START;
var isButtonRole = element => getElementRole(element) === 'button';
var isPressStartSignal = signal => signal === RESPONDER_INACTIVE_PRESS_START || signal === RESPONDER_ACTIVE_PRESS_START || signal === RESPONDER_ACTIVE_LONG_PRESS_START;
var isTerminalSignal = signal => signal === RESPONDER_TERMINATED || signal === RESPONDER_RELEASE;
var isValidKeyPress = event => {
  var key = event.key,
    target = event.target;
  var isSpacebar = key === ' ' || key === 'Spacebar';
  var isButtonish = getElementType(target) === 'button' || isButtonRole(target);
  return key === 'Enter' || isSpacebar && isButtonish;
};
var DEFAULT_LONG_PRESS_DELAY_MS = 450; // 500 - 50
var DEFAULT_PRESS_DELAY_MS = 50;

/**
 * =========================== PressResponder Tutorial ===========================
 *
 * The `PressResponder` class helps you create press interactions by analyzing the
 * geometry of elements and observing when another responder (e.g. ScrollView)
 * has stolen the touch lock. It offers hooks for your component to provide
 * interaction feedback to the user:
 *
 * - When a press has activated (e.g. highlight an element)
 * - When a press has deactivated (e.g. un-highlight an element)
 * - When a press sould trigger an action, meaning it activated and deactivated
 *   while within the geometry of the element without the lock being stolen.
 *
 * A high quality interaction isn't as simple as you might think. There should
 * be a slight delay before activation. Moving your finger beyond an element's
 * bounds should trigger deactivation, but moving the same finger back within an
 * element's bounds should trigger reactivation.
 *
 * In order to use `PressResponder`, do the following:
 *
 *     const pressResponder = new PressResponder(config);
 *
 * 2. Choose the rendered component who should collect the press events. On that
 *    element, spread `pressability.getEventHandlers()` into its props.
 *
 *    return (
 *      <View {...this.state.pressResponder.getEventHandlers()} />
 *    );
 *
 * 3. Reset `PressResponder` when your component unmounts.
 *
 *    componentWillUnmount() {
 *      this.state.pressResponder.reset();
 *    }
 *
 * ==================== Implementation Details ====================
 *
 * `PressResponder` only assumes that there exists a `HitRect` node. The `PressRect`
 * is an abstract box that is extended beyond the `HitRect`.
 *
 * # Geometry
 *
 *  ┌────────────────────────┐
 *  │  ┌──────────────────┐  │ - Presses start anywhere within `HitRect`.
 *  │  │  ┌────────────┐  │  │
 *  │  │  │ VisualRect │  │  │
 *  │  │  └────────────┘  │  │ - When pressed down for sufficient amount of time
 *  │  │    HitRect       │  │   before letting up, `VisualRect` activates.
 *  │  └──────────────────┘  │
 *  │       Out Region   o   │
 *  └────────────────────│───┘
 *                       └────── When the press is released outside the `HitRect`,
 *                               the responder is NOT eligible for a "press".
 *
 * # State Machine
 *
 * ┌───────────────┐ ◀──── RESPONDER_RELEASE
 * │ NOT_RESPONDER │
 * └───┬───────────┘ ◀──── RESPONDER_TERMINATED
 *     │
 *     │ RESPONDER_GRANT (HitRect)
 *     │
 *     ▼
 * ┌─────────────────────┐          ┌───────────────────┐              ┌───────────────────┐
 * │ RESPONDER_INACTIVE_ │  DELAY   │ RESPONDER_ACTIVE_ │  T + DELAY   │ RESPONDER_ACTIVE_ │
 * │ PRESS_START         ├────────▶ │ PRESS_START       ├────────────▶ │ LONG_PRESS_START  │
 * └─────────────────────┘          └───────────────────┘              └───────────────────┘
 *
 * T + DELAY => LONG_PRESS_DELAY + DELAY
 *
 * Not drawn are the side effects of each transition. The most important side
 * effect is the invocation of `onLongPress`. Only when the browser produces a
 * `click` event is `onPress` invoked.
 */
class PressResponder {
  constructor(config) {
    this._eventHandlers = null;
    this._isPointerTouch = false;
    this._longPressDelayTimeout = null;
    this._longPressDispatched = false;
    this._pressDelayTimeout = null;
    this._pressOutDelayTimeout = null;
    this._touchState = NOT_RESPONDER;
    this._responderElement = null;
    this.configure(config);
  }
  configure(config) {
    this._config = config;
  }

  /**
   * Resets any pending timers. This should be called on unmount.
   */
  reset() {
    this._cancelLongPressDelayTimeout();
    this._cancelPressDelayTimeout();
    this._cancelPressOutDelayTimeout();
  }

  /**
   * Returns a set of props to spread into the interactive element.
   */
  getEventHandlers() {
    if (this._eventHandlers == null) {
      this._eventHandlers = this._createEventHandlers();
    }
    return this._eventHandlers;
  }
  _createEventHandlers() {
    var start = (event, shouldDelay) => {
      event.persist();
      this._cancelPressOutDelayTimeout();
      this._longPressDispatched = false;
      this._selectionTerminated = false;
      this._touchState = NOT_RESPONDER;
      this._isPointerTouch = event.nativeEvent.type === 'touchstart';
      this._receiveSignal(RESPONDER_GRANT, event);
      var delayPressStart = normalizeDelay(this._config.delayPressStart, 0, DEFAULT_PRESS_DELAY_MS);
      if (shouldDelay !== false && delayPressStart > 0) {
        this._pressDelayTimeout = setTimeout(() => {
          this._receiveSignal(DELAY, event);
        }, delayPressStart);
      } else {
        this._receiveSignal(DELAY, event);
      }
      var delayLongPress = normalizeDelay(this._config.delayLongPress, 10, DEFAULT_LONG_PRESS_DELAY_MS);
      this._longPressDelayTimeout = setTimeout(() => {
        this._handleLongPress(event);
      }, delayLongPress + delayPressStart);
    };
    var end = event => {
      this._receiveSignal(RESPONDER_RELEASE, event);
    };
    var keyupHandler = event => {
      var onPress = this._config.onPress;
      var target = event.target;
      if (this._touchState !== NOT_RESPONDER && isValidKeyPress(event)) {
        end(event);
        document.removeEventListener('keyup', keyupHandler);
        var role = target.getAttribute('role');
        var elementType = getElementType(target);
        var isNativeInteractiveElement = role === 'link' || elementType === 'a' || elementType === 'button' || elementType === 'input' || elementType === 'select' || elementType === 'textarea';
        var isActiveElement = this._responderElement === target;
        if (onPress != null && !isNativeInteractiveElement && isActiveElement) {
          onPress(event);
        }
        this._responderElement = null;
      }
    };
    return {
      onStartShouldSetResponder: event => {
        var disabled = this._config.disabled;
        if (disabled && isButtonRole(event.currentTarget)) {
          event.stopPropagation();
        }
        if (disabled == null) {
          return true;
        }
        return !disabled;
      },
      onKeyDown: event => {
        var disabled = this._config.disabled;
        var key = event.key,
          target = event.target;
        if (!disabled && isValidKeyPress(event)) {
          if (this._touchState === NOT_RESPONDER) {
            start(event, false);
            this._responderElement = target;
            // Listen to 'keyup' on document to account for situations where
            // focus is moved to another element during 'keydown'.
            document.addEventListener('keyup', keyupHandler);
          }
          var isSpacebarKey = key === ' ' || key === 'Spacebar';
          var role = getElementRole(target);
          var isButtonLikeRole = role === 'button' || role === 'menuitem';
          if (isSpacebarKey && isButtonLikeRole && getElementType(target) !== 'button') {
            // Prevent spacebar scrolling the window if using non-native button
            event.preventDefault();
          }
          event.stopPropagation();
        }
      },
      onResponderGrant: event => start(event),
      onResponderMove: event => {
        if (this._config.onPressMove != null) {
          this._config.onPressMove(event);
        }
        var touch = getTouchFromResponderEvent(event);
        if (this._touchActivatePosition != null) {
          var deltaX = this._touchActivatePosition.pageX - touch.pageX;
          var deltaY = this._touchActivatePosition.pageY - touch.pageY;
          if (Math.hypot(deltaX, deltaY) > 10) {
            this._cancelLongPressDelayTimeout();
          }
        }
      },
      onResponderRelease: event => end(event),
      onResponderTerminate: event => {
        if (event.nativeEvent.type === 'selectionchange') {
          this._selectionTerminated = true;
        }
        this._receiveSignal(RESPONDER_TERMINATED, event);
      },
      onResponderTerminationRequest: event => {
        var _this$_config = this._config,
          cancelable = _this$_config.cancelable,
          disabled = _this$_config.disabled,
          onLongPress = _this$_config.onLongPress;
        // If `onLongPress` is provided, don't terminate on `contextmenu` as default
        // behavior will be prevented for non-mouse pointers.
        if (!disabled && onLongPress != null && this._isPointerTouch && event.nativeEvent.type === 'contextmenu') {
          return false;
        }
        if (cancelable == null) {
          return true;
        }
        return cancelable;
      },
      // NOTE: this diverges from react-native in 3 significant ways:
      // * The `onPress` callback is not connected to the responder system (the native
      //  `click` event must be used but is dispatched in many scenarios where no pointers
      //   are on the screen.) Therefore, it's possible for `onPress` to be called without
      //   `onPress{Start,End}` being called first.
      // * The `onPress` callback is only be called on the first ancestor of the native
      //   `click` target that is using the PressResponder.
      // * The event's `nativeEvent` is a `MouseEvent` not a `TouchEvent`.
      onClick: event => {
        var _this$_config2 = this._config,
          disabled = _this$_config2.disabled,
          onPress = _this$_config2.onPress;
        if (!disabled) {
          // If long press dispatched, cancel default click behavior.
          // If the responder terminated because text was selected during the gesture,
          // cancel the default click behavior.
          event.stopPropagation();
          if (this._longPressDispatched || this._selectionTerminated) {
            event.preventDefault();
          } else if (onPress != null && event.altKey === false) {
            onPress(event);
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation();
          }
        }
      },
      // If `onLongPress` is provided and a touch pointer is being used, prevent the
      // default context menu from opening.
      onContextMenu: event => {
        var _this$_config3 = this._config,
          disabled = _this$_config3.disabled,
          onLongPress = _this$_config3.onLongPress;
        if (!disabled) {
          if (onLongPress != null && this._isPointerTouch && !event.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
          }
        } else {
          if (isButtonRole(event.currentTarget)) {
            event.stopPropagation();
          }
        }
      }
    };
  }

  /**
   * Receives a state machine signal, performs side effects of the transition
   * and stores the new state. Validates the transition as well.
   */
  _receiveSignal(signal, event) {
    var prevState = this._touchState;
    var nextState = null;
    if (Transitions[prevState] != null) {
      nextState = Transitions[prevState][signal];
    }
    if (this._touchState === NOT_RESPONDER && signal === RESPONDER_RELEASE) {
      return;
    }
    if (nextState == null || nextState === ERROR) {
      console.error("PressResponder: Invalid signal " + signal + " for state " + prevState + " on responder");
    } else if (prevState !== nextState) {
      this._performTransitionSideEffects(prevState, nextState, signal, event);
      this._touchState = nextState;
    }
  }

  /**
   * Performs a transition between touchable states and identify any activations
   * or deactivations (and callback invocations).
   */
  _performTransitionSideEffects(prevState, nextState, signal, event) {
    if (isTerminalSignal(signal)) {
      // Pressable suppression of contextmenu on windows.
      // On Windows, the contextmenu is displayed after pointerup.
      // https://github.com/necolas/react-native-web/issues/2296
      setTimeout(() => {
        this._isPointerTouch = false;
      }, 0);
      this._touchActivatePosition = null;
      this._cancelLongPressDelayTimeout();
    }
    if (isPressStartSignal(prevState) && signal === LONG_PRESS_DETECTED) {
      var onLongPress = this._config.onLongPress;
      // Long press is not supported for keyboards because 'click' can be dispatched
      // immediately (and multiple times) after 'keydown'.
      if (onLongPress != null && event.nativeEvent.key == null) {
        onLongPress(event);
        this._longPressDispatched = true;
      }
    }
    var isPrevActive = isActiveSignal(prevState);
    var isNextActive = isActiveSignal(nextState);
    if (!isPrevActive && isNextActive) {
      this._activate(event);
    } else if (isPrevActive && !isNextActive) {
      this._deactivate(event);
    }
    if (isPressStartSignal(prevState) && signal === RESPONDER_RELEASE) {
      var _this$_config4 = this._config,
        _onLongPress = _this$_config4.onLongPress,
        onPress = _this$_config4.onPress;
      if (onPress != null) {
        var isPressCanceledByLongPress = _onLongPress != null && prevState === RESPONDER_ACTIVE_LONG_PRESS_START;
        if (!isPressCanceledByLongPress) {
          // If we never activated (due to delays), activate and deactivate now.
          if (!isNextActive && !isPrevActive) {
            this._activate(event);
            this._deactivate(event);
          }
        }
      }
    }
    this._cancelPressDelayTimeout();
  }
  _activate(event) {
    var _this$_config5 = this._config,
      onPressChange = _this$_config5.onPressChange,
      onPressStart = _this$_config5.onPressStart;
    var touch = getTouchFromResponderEvent(event);
    this._touchActivatePosition = {
      pageX: touch.pageX,
      pageY: touch.pageY
    };
    if (onPressStart != null) {
      onPressStart(event);
    }
    if (onPressChange != null) {
      onPressChange(true);
    }
  }
  _deactivate(event) {
    var _this$_config6 = this._config,
      onPressChange = _this$_config6.onPressChange,
      onPressEnd = _this$_config6.onPressEnd;
    function end() {
      if (onPressEnd != null) {
        onPressEnd(event);
      }
      if (onPressChange != null) {
        onPressChange(false);
      }
    }
    var delayPressEnd = normalizeDelay(this._config.delayPressEnd);
    if (delayPressEnd > 0) {
      this._pressOutDelayTimeout = setTimeout(() => {
        end();
      }, delayPressEnd);
    } else {
      end();
    }
  }
  _handleLongPress(event) {
    if (this._touchState === RESPONDER_ACTIVE_PRESS_START || this._touchState === RESPONDER_ACTIVE_LONG_PRESS_START) {
      this._receiveSignal(LONG_PRESS_DETECTED, event);
    }
  }
  _cancelLongPressDelayTimeout() {
    if (this._longPressDelayTimeout != null) {
      clearTimeout(this._longPressDelayTimeout);
      this._longPressDelayTimeout = null;
    }
  }
  _cancelPressDelayTimeout() {
    if (this._pressDelayTimeout != null) {
      clearTimeout(this._pressDelayTimeout);
      this._pressDelayTimeout = null;
    }
  }
  _cancelPressOutDelayTimeout() {
    if (this._pressOutDelayTimeout != null) {
      clearTimeout(this._pressOutDelayTimeout);
      this._pressOutDelayTimeout = null;
    }
  }
}
function normalizeDelay(delay, min, fallback) {
  if (min === void 0) {
    min = 0;
  }
  if (fallback === void 0) {
    fallback = 0;
  }
  return Math.max(min, delay !== null && delay !== void 0 ? delay : fallback);
}
function getTouchFromResponderEvent(event) {
  var _event$nativeEvent = event.nativeEvent,
    changedTouches = _event$nativeEvent.changedTouches,
    touches = _event$nativeEvent.touches;
  if (touches != null && touches.length > 0) {
    return touches[0];
  }
  if (changedTouches != null && changedTouches.length > 0) {
    return changedTouches[0];
  }
  return event.nativeEvent;
}
;// ./node_modules/react-native-web/dist/modules/usePressEvents/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */





function usePressEvents(hostRef, config) {
  var pressResponderRef = (0,react.useRef)(null);
  if (pressResponderRef.current == null) {
    pressResponderRef.current = new PressResponder(config);
  }
  var pressResponder = pressResponderRef.current;

  // Re-configure to use the current node and configuration.
  (0,react.useEffect)(() => {
    pressResponder.configure(config);
  }, [config, pressResponder]);

  // Reset the `pressResponder` when cleanup needs to occur. This is
  // a separate effect because we do not want to rest the responder when `config` changes.
  (0,react.useEffect)(() => {
    return () => {
      pressResponder.reset();
    };
  }, [pressResponder]);
  (0,react.useDebugValue)(config);
  return pressResponder.getEventHandlers();
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(43999);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
;// ./node_modules/react-native-web/dist/exports/TouchableOpacity/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use client';



var _excluded = ["activeOpacity", "delayPressIn", "delayPressOut", "delayLongPress", "disabled", "focusable", "onLongPress", "onPress", "onPressIn", "onPressOut", "rejectResponderTermination", "style"];






//import { warnOnce } from '../../modules/warnOnce';

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 */
function TouchableOpacity(props, forwardedRef) {
  /*
  warnOnce(
    'TouchableOpacity',
    'TouchableOpacity is deprecated. Please use Pressable.'
  );
  */

  var activeOpacity = props.activeOpacity,
    delayPressIn = props.delayPressIn,
    delayPressOut = props.delayPressOut,
    delayLongPress = props.delayLongPress,
    disabled = props.disabled,
    focusable = props.focusable,
    onLongPress = props.onLongPress,
    onPress = props.onPress,
    onPressIn = props.onPressIn,
    onPressOut = props.onPressOut,
    rejectResponderTermination = props.rejectResponderTermination,
    style = props.style,
    rest = (0,objectWithoutPropertiesLoose/* default */.A)(props, _excluded);
  var hostRef = (0,react.useRef)(null);
  var setRef = (0,useMergeRefs/* default */.A)(forwardedRef, hostRef);
  var _useState = (0,react.useState)('0s'),
    duration = _useState[0],
    setDuration = _useState[1];
  var _useState2 = (0,react.useState)(null),
    opacityOverride = _useState2[0],
    setOpacityOverride = _useState2[1];
  var setOpacityTo = (0,react.useCallback)((value, duration) => {
    setOpacityOverride(value);
    setDuration(duration ? duration / 1000 + "s" : '0s');
  }, [setOpacityOverride, setDuration]);
  var setOpacityActive = (0,react.useCallback)(duration => {
    setOpacityTo(activeOpacity !== null && activeOpacity !== void 0 ? activeOpacity : 0.2, duration);
  }, [activeOpacity, setOpacityTo]);
  var setOpacityInactive = (0,react.useCallback)(duration => {
    setOpacityTo(null, duration);
  }, [setOpacityTo]);
  var pressConfig = (0,react.useMemo)(() => ({
    cancelable: !rejectResponderTermination,
    disabled,
    delayLongPress,
    delayPressStart: delayPressIn,
    delayPressEnd: delayPressOut,
    onLongPress,
    onPress,
    onPressStart(event) {
      var isGrant = event.dispatchConfig != null ? event.dispatchConfig.registrationName === 'onResponderGrant' : event.type === 'keydown';
      setOpacityActive(isGrant ? 0 : 150);
      if (onPressIn != null) {
        onPressIn(event);
      }
    },
    onPressEnd(event) {
      setOpacityInactive(250);
      if (onPressOut != null) {
        onPressOut(event);
      }
    }
  }), [delayLongPress, delayPressIn, delayPressOut, disabled, onLongPress, onPress, onPressIn, onPressOut, rejectResponderTermination, setOpacityActive, setOpacityInactive]);
  var pressEventHandlers = usePressEvents(hostRef, pressConfig);
  return /*#__PURE__*/react.createElement(View["default"], (0,esm_extends/* default */.A)({}, rest, pressEventHandlers, {
    accessibilityDisabled: disabled,
    focusable: !disabled && focusable !== false,
    pointerEvents: disabled ? 'box-none' : undefined,
    ref: setRef,
    style: [styles.root, !disabled && styles.actionable, style, opacityOverride != null && {
      opacity: opacityOverride
    }, {
      transitionDuration: duration
    }]
  }));
}
var styles = StyleSheet["default"].create({
  root: {
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    userSelect: 'none'
  },
  actionable: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  }
});
var MemoedTouchableOpacity = /*#__PURE__*/react.memo(/*#__PURE__*/react.forwardRef(TouchableOpacity));
MemoedTouchableOpacity.displayName = 'TouchableOpacity';
/* harmony default export */ const exports_TouchableOpacity = (MemoedTouchableOpacity);

/***/ },

/***/ 94934
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.forFade=forFade;exports.forNoAnimation=forNoAnimation;exports.forSlideLeft=forSlideLeft;exports.forSlideRight=forSlideRight;exports.forSlideUp=forSlideUp;exports.forUIKit=forUIKit;var _Animated=_interopRequireDefault(__webpack_require__(48831));var _Platform=_interopRequireDefault(__webpack_require__(67862));var add=_Animated.default.add,multiply=_Animated.default.multiply;var IPAD_MINI_MEDIUM_WIDTH=414;function forUIKit(_ref){var current=_ref.current,next=_ref.next,direction=_ref.direction,layouts=_ref.layouts;var defaultOffset=100;var leftSpacing=27+(_Platform.default.OS==='ios'&&layouts.screen.width>=IPAD_MINI_MEDIUM_WIDTH?5:0);var leftLabelOffset=layouts.leftLabel?(layouts.screen.width-layouts.leftLabel.width)/2-leftSpacing:defaultOffset;var titleLeftOffset=layouts.title?(layouts.screen.width-layouts.title.width)/2-leftSpacing:defaultOffset;var rightOffset=layouts.screen.width/4;var multiplier=direction==='rtl'?-1:1;var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);return{leftButtonStyle:{opacity:progress.interpolate({inputRange:[0.3,1,1.5],outputRange:[0,1,0]})},leftLabelStyle:{transform:[{translateX:multiply(multiplier,progress.interpolate({inputRange:[0,1,2],outputRange:[leftLabelOffset,0,-rightOffset]}))}]},rightButtonStyle:{opacity:progress.interpolate({inputRange:[0.3,1,1.5],outputRange:[0,1,0]})},titleStyle:{opacity:progress.interpolate({inputRange:[0,0.5,0.75,1,1.5],outputRange:[0,0,0.1,1,0]}),transform:[{translateX:multiply(multiplier,progress.interpolate({inputRange:[0.5,1,2],outputRange:[rightOffset,0,-titleLeftOffset]}))}]},backgroundStyle:{transform:[{translateX:multiply(multiplier,progress.interpolate({inputRange:[0,1,2],outputRange:[layouts.screen.width,0,-layouts.screen.width]}))}]}};}function forFade(_ref2){var current=_ref2.current,next=_ref2.next;var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var opacity=progress.interpolate({inputRange:[0,1,2],outputRange:[0,1,0]});return{leftButtonStyle:{opacity:opacity},rightButtonStyle:{opacity:opacity},titleStyle:{opacity:opacity},backgroundStyle:{opacity:progress.interpolate({inputRange:[0,1,1.9,2],outputRange:[0,1,1,0]})}};}function forSlideLeft(_ref3){var current=_ref3.current,next=_ref3.next,direction=_ref3.direction,screen=_ref3.layouts.screen;var isRTL=direction==='rtl';var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var translateX=progress.interpolate({inputRange:[0,1,2],outputRange:isRTL?[-screen.width,0,screen.width]:[screen.width,0,-screen.width]});var transform=[{translateX:translateX}];return{leftButtonStyle:{transform:transform},rightButtonStyle:{transform:transform},titleStyle:{transform:transform},backgroundStyle:{transform:transform}};}function forSlideRight(_ref4){var current=_ref4.current,next=_ref4.next,direction=_ref4.direction,screen=_ref4.layouts.screen;var isRTL=direction==='rtl';var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var translateX=progress.interpolate({inputRange:[0,1,2],outputRange:isRTL?[screen.width,0,-screen.width]:[-screen.width,0,screen.width]});var transform=[{translateX:translateX}];return{leftButtonStyle:{transform:transform},rightButtonStyle:{transform:transform},titleStyle:{transform:transform},backgroundStyle:{transform:transform}};}function forSlideUp(_ref5){var current=_ref5.current,next=_ref5.next,header=_ref5.layouts.header;var progress=add(current.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}),next?next.progress.interpolate({inputRange:[0,1],outputRange:[0,1],extrapolate:'clamp'}):0);var translateY=progress.interpolate({inputRange:[0,1,2],outputRange:[-header.height,0,-header.height]});var transform=[{translateY:translateY}];return{leftButtonStyle:{transform:transform},rightButtonStyle:{transform:transform},titleStyle:{transform:transform},backgroundStyle:{transform:transform}};}function forNoAnimation(){return{};}

/***/ },

/***/ 96910
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.SafeAreaInsetsContext=exports.SafeAreaFrameContext=exports.SafeAreaContext=exports.SafeAreaConsumer=void 0;exports.SafeAreaListener=SafeAreaListener;exports.SafeAreaProvider=SafeAreaProvider;exports.useSafeArea=useSafeArea;exports.useSafeAreaFrame=useSafeAreaFrame;exports.useSafeAreaInsets=useSafeAreaInsets;exports.withSafeAreaInsets=withSafeAreaInsets;var _slicedToArray2=_interopRequireDefault(__webpack_require__(85715));var _objectWithoutProperties2=_interopRequireDefault(__webpack_require__(91847));var React=_interopRequireWildcard(__webpack_require__(96540));var _Dimensions=_interopRequireDefault(__webpack_require__(63384));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _NativeSafeAreaProvider=__webpack_require__(54411);var _excluded=["children","initialMetrics","initialSafeAreaInsets","style"],_excluded2=["onChange","style","children"];function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r]);}return n;},_extends.apply(null,arguments);}var isDev="production"!=='production';var SafeAreaInsetsContext=exports.SafeAreaInsetsContext=React.createContext(null);if(isDev){SafeAreaInsetsContext.displayName='SafeAreaInsetsContext';}var SafeAreaFrameContext=exports.SafeAreaFrameContext=React.createContext(null);if(isDev){SafeAreaFrameContext.displayName='SafeAreaFrameContext';}function SafeAreaProvider(_ref){var _ref2,_ref3,_initialMetrics$inset,_ref4,_initialMetrics$frame;var children=_ref.children,initialMetrics=_ref.initialMetrics,initialSafeAreaInsets=_ref.initialSafeAreaInsets,style=_ref.style,others=(0,_objectWithoutProperties2.default)(_ref,_excluded);var parentInsets=useParentSafeAreaInsets();var parentFrame=useParentSafeAreaFrame();var _React$useState=React.useState((_ref2=(_ref3=(_initialMetrics$inset=initialMetrics==null?void 0:initialMetrics.insets)!=null?_initialMetrics$inset:initialSafeAreaInsets)!=null?_ref3:parentInsets)!=null?_ref2:null),_React$useState2=(0,_slicedToArray2.default)(_React$useState,2),insets=_React$useState2[0],setInsets=_React$useState2[1];var _React$useState3=React.useState((_ref4=(_initialMetrics$frame=initialMetrics==null?void 0:initialMetrics.frame)!=null?_initialMetrics$frame:parentFrame)!=null?_ref4:{x:0,y:0,width:_Dimensions.default.get('window').width,height:_Dimensions.default.get('window').height}),_React$useState4=(0,_slicedToArray2.default)(_React$useState3,2),frame=_React$useState4[0],setFrame=_React$useState4[1];var onInsetsChange=React.useCallback(function(event){var _event$nativeEvent=event.nativeEvent,nextFrame=_event$nativeEvent.frame,nextInsets=_event$nativeEvent.insets;setFrame(function(curFrame){if(nextFrame&&(nextFrame.height!==curFrame.height||nextFrame.width!==curFrame.width||nextFrame.x!==curFrame.x||nextFrame.y!==curFrame.y)){return nextFrame;}else{return curFrame;}});setInsets(function(curInsets){if(!curInsets||nextInsets.bottom!==curInsets.bottom||nextInsets.left!==curInsets.left||nextInsets.right!==curInsets.right||nextInsets.top!==curInsets.top){return nextInsets;}else{return curInsets;}});},[]);return React.createElement(_NativeSafeAreaProvider.NativeSafeAreaProvider,_extends({style:[styles.fill,style],onInsetsChange:onInsetsChange},others),insets!=null?React.createElement(SafeAreaFrameContext.Provider,{value:frame},React.createElement(SafeAreaInsetsContext.Provider,{value:insets},children)):null);}function SafeAreaListener(_ref5){var onChange=_ref5.onChange,style=_ref5.style,children=_ref5.children,others=(0,_objectWithoutProperties2.default)(_ref5,_excluded2);return React.createElement(_NativeSafeAreaProvider.NativeSafeAreaProvider,_extends({},others,{style:[styles.fill,style],onInsetsChange:function onInsetsChange(e){onChange({insets:e.nativeEvent.insets,frame:e.nativeEvent.frame});}}),children);}var styles=_StyleSheet.default.create({fill:{flex:1}});function useParentSafeAreaInsets(){return React.useContext(SafeAreaInsetsContext);}function useParentSafeAreaFrame(){return React.useContext(SafeAreaFrameContext);}var NO_INSETS_ERROR='No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.';function useSafeAreaInsets(){var insets=React.useContext(SafeAreaInsetsContext);if(insets==null){throw new Error(NO_INSETS_ERROR);}return insets;}function useSafeAreaFrame(){var frame=React.useContext(SafeAreaFrameContext);if(frame==null){throw new Error(NO_INSETS_ERROR);}return frame;}function withSafeAreaInsets(WrappedComponent){return React.forwardRef(function(props,ref){var insets=useSafeAreaInsets();return React.createElement(WrappedComponent,_extends({},props,{insets:insets,ref:ref}));});}function useSafeArea(){return useSafeAreaInsets();}var SafeAreaConsumer=exports.SafeAreaConsumer=SafeAreaInsetsContext.Consumer;var SafeAreaContext=exports.SafeAreaContext=SafeAreaInsetsContext;

/***/ },

/***/ 97206
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.CardA11yWrapper=void 0;var _slicedToArray2=_interopRequireDefault(__webpack_require__(85715));var React=_interopRequireWildcard(__webpack_require__(96540));var _Platform=_interopRequireDefault(__webpack_require__(67862));var _StyleSheet=_interopRequireDefault(__webpack_require__(43999));var _View=_interopRequireDefault(__webpack_require__(9176));var _jsxRuntime=__webpack_require__(74848);var _this=(/* unused pure expression or super */ null && (this)),_jsxFileName="D:\\Freeprojects\\alive\\AliveApp\\node_modules\\@react-navigation\\stack\\src\\views\\Stack\\CardA11yWrapper.tsx";function _interopRequireWildcard(e,t){if("function"==typeof WeakMap)var r=new WeakMap(),n=new WeakMap();return(_interopRequireWildcard=function _interopRequireWildcard(e,t){if(!t&&e&&e.__esModule)return e;var o,i,f={__proto__:null,default:e};if(null===e||"object"!=typeof e&&"function"!=typeof e)return f;if(o=t?n:r){if(o.has(e))return o.get(e);o.set(e,f);}for(var _t in e)"default"!==_t&&{}.hasOwnProperty.call(e,_t)&&((i=(o=Object.defineProperty)&&Object.getOwnPropertyDescriptor(e,_t))&&(i.get||i.set)?o(f,_t,i):f[_t]=e[_t]);return f;})(e,t);}var CardA11yWrapper=exports.CardA11yWrapper=React.forwardRef(function(_ref,ref){var focused=_ref.focused,active=_ref.active,animated=_ref.animated,isNextScreenTransparent=_ref.isNextScreenTransparent,detachCurrentScreen=_ref.detachCurrentScreen,children=_ref.children;var _React$useState=React.useState(false),_React$useState2=(0,_slicedToArray2.default)(_React$useState,2),inert=_React$useState2[0],setInert=_React$useState2[1];React.useImperativeHandle(ref,function(){return{setInert:setInert};},[]);var isHidden=!animated&&isNextScreenTransparent===false&&detachCurrentScreen!==false&&!focused;return(0,_jsxRuntime.jsx)(_View.default,{"aria-hidden":!focused,pointerEvents:(animated?inert:!focused)?'none':'box-none',style:[_StyleSheet.default.absoluteFill,{overflow:active?undefined:'hidden',display:_Platform.default.OS!=='web'&&isHidden?'none':'flex',visibility:isHidden?'hidden':'visible'}],collapsable:false,children:children});});CardA11yWrapper.displayName='CardA11yWrapper';

/***/ },

/***/ 98591
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports.TransitionIOSSpec=exports.ScaleFromCenterAndroidSpec=exports.RevealFromBottomAndroidSpec=exports.FadeOutToLeftAndroidSpec=exports.FadeOutToBottomAndroidSpec=exports.FadeInFromRightAndroidSpec=exports.FadeInFromBottomAndroidSpec=exports.BottomSheetSlideOutSpec=exports.BottomSheetSlideInSpec=void 0;var _Easing=_interopRequireDefault(__webpack_require__(96693));var TransitionIOSSpec=exports.TransitionIOSSpec={animation:'spring',config:{stiffness:1000,damping:500,mass:3,overshootClamping:true,restDisplacementThreshold:10,restSpeedThreshold:10}};var FadeInFromBottomAndroidSpec=exports.FadeInFromBottomAndroidSpec={animation:'timing',config:{duration:350,easing:_Easing.default.out(_Easing.default.poly(5))}};var FadeOutToBottomAndroidSpec=exports.FadeOutToBottomAndroidSpec={animation:'timing',config:{duration:150,easing:_Easing.default.in(_Easing.default.linear)}};var RevealFromBottomAndroidSpec=exports.RevealFromBottomAndroidSpec={animation:'timing',config:{duration:425,easing:_Easing.default.bezier(0.20833,0.82,0.25,1)}};var ScaleFromCenterAndroidSpec=exports.ScaleFromCenterAndroidSpec={animation:'timing',config:{duration:400,easing:_Easing.default.bezier(0.20833,0.82,0.25,1)}};var FadeInFromRightAndroidSpec=exports.FadeInFromRightAndroidSpec={animation:'timing',config:{duration:450,easing:_Easing.default.bezier(0.20833,0.82,0.25,1)}};var FadeOutToLeftAndroidSpec=exports.FadeOutToLeftAndroidSpec={animation:'timing',config:{duration:450,easing:_Easing.default.bezier(0.20833,0.82,0.25,1)}};var BottomSheetSlideInSpec=exports.BottomSheetSlideInSpec={animation:'timing',config:{duration:250,easing:function easing(t){return Math.cos((t+1)*Math.PI)/2.0+0.5;}}};var BottomSheetSlideOutSpec=exports.BottomSheetSlideOutSpec={animation:'timing',config:{duration:200,easing:function easing(t){return t===1.0?1:Math.pow(t,2);}}};

/***/ },

/***/ 99303
(__unused_webpack_module, exports, __webpack_require__) {

var _interopRequireDefault=__webpack_require__(24994);Object.defineProperty(exports, "__esModule", ({value:true}));exports["default"]=void 0;var _View=_interopRequireDefault(__webpack_require__(9176));var _default=exports["default"]=_View.default;

/***/ }

}]);
//# sourceMappingURL=bundle.web.e5e6efde1b080ffe7295.js.map