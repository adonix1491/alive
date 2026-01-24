(self["webpackChunkAliveApp"] = self["webpackChunkAliveApp"] || []).push([[299],{

/***/ 454
(module) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp('(' + token + ')|([^%]+?)', 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return [decodeURIComponent(components.join(''))];
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher) || [];

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher) || [];
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ },

/***/ 528
(module) {

"use strict";


module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};


/***/ },

/***/ 734
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(5659);
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

/***/ 2017
(module) {

"use strict";


// do not edit .js files directly - edit src/index.jst



module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};


/***/ },

/***/ 2168
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  q9: () => (/* binding */ SafeAreaInsetsContext),
  Oy: () => (/* binding */ SafeAreaProvider),
  Or: () => (/* binding */ useSafeAreaInsets)
});

// UNUSED EXPORTS: SafeAreaConsumer, SafeAreaContext, SafeAreaFrameContext, SafeAreaListener, useSafeArea, useSafeAreaFrame, withSafeAreaInsets

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Dimensions/index.js
var Dimensions = __webpack_require__(3384);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
;// ./node_modules/react-native-safe-area-context/lib/module/NativeSafeAreaProvider.web.js
/* eslint-env browser */



/**
 * TODO:
 * Currently insets and frame are based on the window and are not
 * relative to the provider view. This is inconsistent with iOS and Android.
 * However in most cases if the provider view covers the screen this is not
 * an issue.
 */
const CSSTransitions = {
  WebkitTransition: 'webkitTransitionEnd',
  Transition: 'transitionEnd',
  MozTransition: 'transitionend',
  MSTransition: 'msTransitionEnd',
  OTransition: 'oTransitionEnd'
};
function NativeSafeAreaProvider_web_NativeSafeAreaProvider({
  children,
  style,
  onInsetsChange
}) {
  react.useEffect(() => {
    // Skip for SSR.
    if (typeof document === 'undefined') {
      return;
    }
    const element = createContextElement();
    document.body.appendChild(element);
    const onEnd = () => {
      const {
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight
      } = window.getComputedStyle(element);
      const insets = {
        top: paddingTop ? parseInt(paddingTop, 10) : 0,
        bottom: paddingBottom ? parseInt(paddingBottom, 10) : 0,
        left: paddingLeft ? parseInt(paddingLeft, 10) : 0,
        right: paddingRight ? parseInt(paddingRight, 10) : 0
      };
      const frame = {
        x: 0,
        y: 0,
        width: document.documentElement.offsetWidth,
        height: document.documentElement.offsetHeight
      };
      // @ts-ignore: missing properties
      onInsetsChange({
        nativeEvent: {
          insets,
          frame
        }
      });
    };
    element.addEventListener(getSupportedTransitionEvent(), onEnd);
    onEnd();
    return () => {
      document.body.removeChild(element);
      element.removeEventListener(getSupportedTransitionEvent(), onEnd);
    };
  }, [onInsetsChange]);
  return /*#__PURE__*/react.createElement(View/* default */.A, {
    style: style
  }, children);
}
let _supportedTransitionEvent = null;
function getSupportedTransitionEvent() {
  if (_supportedTransitionEvent != null) {
    return _supportedTransitionEvent;
  }
  const element = document.createElement('invalidtype');
  _supportedTransitionEvent = CSSTransitions.Transition;
  for (const key in CSSTransitions) {
    if (element.style[key] !== undefined) {
      _supportedTransitionEvent = CSSTransitions[key];
      break;
    }
  }
  return _supportedTransitionEvent;
}
let _supportedEnv = null;
function getSupportedEnv() {
  if (_supportedEnv !== null) {
    return _supportedEnv;
  }
  const {
    CSS
  } = window;
  if (CSS && CSS.supports && CSS.supports('top: constant(safe-area-inset-top)')) {
    _supportedEnv = 'constant';
  } else {
    _supportedEnv = 'env';
  }
  return _supportedEnv;
}
function getInset(side) {
  return `${getSupportedEnv()}(safe-area-inset-${side})`;
}
function createContextElement() {
  const element = document.createElement('div');
  const {
    style
  } = element;
  style.position = 'fixed';
  style.left = '0';
  style.top = '0';
  style.width = '0';
  style.height = '0';
  style.zIndex = '-1';
  style.overflow = 'hidden';
  style.visibility = 'hidden';
  // Bacon: Anything faster than this and the callback will be invoked too early with the wrong insets
  style.transitionDuration = '0.05s';
  style.transitionProperty = 'padding';
  style.transitionDelay = '0s';
  style.paddingTop = getInset('top');
  style.paddingBottom = getInset('bottom');
  style.paddingLeft = getInset('left');
  style.paddingRight = getInset('right');
  return element;
}
;// ./node_modules/react-native-safe-area-context/lib/module/SafeAreaContext.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}




const isDev = "production" !== 'production';
const SafeAreaInsetsContext = /*#__PURE__*/react.createContext(null);
if (isDev) {
  SafeAreaInsetsContext.displayName = 'SafeAreaInsetsContext';
}
const SafeAreaFrameContext = /*#__PURE__*/react.createContext(null);
if (isDev) {
  SafeAreaFrameContext.displayName = 'SafeAreaFrameContext';
}
function SafeAreaProvider({
  children,
  initialMetrics,
  initialSafeAreaInsets,
  style,
  ...others
}) {
  const parentInsets = useParentSafeAreaInsets();
  const parentFrame = useParentSafeAreaFrame();
  const [insets, setInsets] = react.useState(initialMetrics?.insets ?? initialSafeAreaInsets ?? parentInsets ?? null);
  const [frame, setFrame] = react.useState(initialMetrics?.frame ?? parentFrame ?? {
    // Backwards compat so we render anyway if we don't have frame.
    x: 0,
    y: 0,
    width: Dimensions/* default */.A.get('window').width,
    height: Dimensions/* default */.A.get('window').height
  });
  const onInsetsChange = react.useCallback(event => {
    const {
      nativeEvent: {
        frame: nextFrame,
        insets: nextInsets
      }
    } = event;
    setFrame(curFrame => {
      if (
      // Backwards compat with old native code that won't send frame.
      nextFrame && (nextFrame.height !== curFrame.height || nextFrame.width !== curFrame.width || nextFrame.x !== curFrame.x || nextFrame.y !== curFrame.y)) {
        return nextFrame;
      } else {
        return curFrame;
      }
    });
    setInsets(curInsets => {
      if (!curInsets || nextInsets.bottom !== curInsets.bottom || nextInsets.left !== curInsets.left || nextInsets.right !== curInsets.right || nextInsets.top !== curInsets.top) {
        return nextInsets;
      } else {
        return curInsets;
      }
    });
  }, []);
  return /*#__PURE__*/react.createElement(NativeSafeAreaProvider_web_NativeSafeAreaProvider, _extends({
    style: [styles.fill, style],
    onInsetsChange: onInsetsChange
  }, others), insets != null ? /*#__PURE__*/react.createElement(SafeAreaFrameContext.Provider, {
    value: frame
  }, /*#__PURE__*/react.createElement(SafeAreaInsetsContext.Provider, {
    value: insets
  }, children)) : null);
}
function SafeAreaListener({
  onChange,
  style,
  children,
  ...others
}) {
  return /*#__PURE__*/React.createElement(NativeSafeAreaProvider, _extends({}, others, {
    style: [styles.fill, style],
    onInsetsChange: e => {
      onChange({
        insets: e.nativeEvent.insets,
        frame: e.nativeEvent.frame
      });
    }
  }), children);
}
const styles = StyleSheet/* default */.A.create({
  fill: {
    flex: 1
  }
});
function useParentSafeAreaInsets() {
  return react.useContext(SafeAreaInsetsContext);
}
function useParentSafeAreaFrame() {
  return react.useContext(SafeAreaFrameContext);
}
const NO_INSETS_ERROR = 'No safe area value available. Make sure you are rendering `<SafeAreaProvider>` at the top of your app.';
function useSafeAreaInsets() {
  const insets = react.useContext(SafeAreaInsetsContext);
  if (insets == null) {
    throw new Error(NO_INSETS_ERROR);
  }
  return insets;
}
function useSafeAreaFrame() {
  const frame = React.useContext(SafeAreaFrameContext);
  if (frame == null) {
    throw new Error(NO_INSETS_ERROR);
  }
  return frame;
}
function withSafeAreaInsets(WrappedComponent) {
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    const insets = useSafeAreaInsets();
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      insets: insets,
      ref: ref
    }));
  });
}

/**
 * @deprecated
 */
function useSafeArea() {
  return useSafeAreaInsets();
}

/**
 * @deprecated
 */
const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;

/**
 * @deprecated
 */
const SafeAreaContext = (/* unused pure expression or super */ null && (SafeAreaInsetsContext));

/***/ },

/***/ 2444
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ lib_module)
});

// UNUSED EXPORTS: useAsyncStorage

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
const AsyncStorage_AsyncStorage = {
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
    const promises = keys.map(key => AsyncStorage_AsyncStorage.getItem(key));
    const processResult = result => result.map((value, i) => [keys[i], value]);
    return createPromiseAll(promises, callback, processResult);
  },
  /**
   * Takes an array of key-value array pairs.
   *   multiSet([['k1', 'val1'], ['k2', 'val2']])
   */
  multiSet: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage_AsyncStorage.setItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  },
  /**
   * Delete all the keys in the `keys` array.
   */
  multiRemove: (keys, callback) => {
    const promises = keys.map(key => AsyncStorage_AsyncStorage.removeItem(key));
    return createPromiseAll(promises, callback);
  },
  /**
   * Takes an array of key-value array pairs and merges them with existing
   * values, assuming they are stringified JSON.
   *
   *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
   */
  multiMerge: (keyValuePairs, callback) => {
    const promises = keyValuePairs.map(item => AsyncStorage_AsyncStorage.mergeItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }
};
/* harmony default export */ const module_AsyncStorage = (AsyncStorage_AsyncStorage);
//# sourceMappingURL=AsyncStorage.js.map
;// ./node_modules/@react-native-async-storage/async-storage/lib/module/hooks.js



function useAsyncStorage(key) {
  return {
    getItem: (...args) => AsyncStorage.getItem(key, ...args),
    setItem: (...args) => AsyncStorage.setItem(key, ...args),
    mergeItem: (...args) => AsyncStorage.mergeItem(key, ...args),
    removeItem: (...args) => AsyncStorage.removeItem(key, ...args)
  };
}
//# sourceMappingURL=hooks.js.map
;// ./node_modules/@react-native-async-storage/async-storage/lib/module/index.js




/* harmony default export */ const lib_module = (module_AsyncStorage);
//# sourceMappingURL=index.js.map

/***/ },

/***/ 2520
(module, __unused_webpack_exports, __webpack_require__) {

const colorString = __webpack_require__(8854);
const convert = __webpack_require__(734);

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

/***/ 2640
(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAAlklEQVR4Ae3a1REDMRDG4A3VmHbcUFLigf0exn/mkxuQjmELAAAAAD5Eq5atP6+rZeuPhGz9kZCtPxKy9fs6Zuuf60CfPn369OnTp0+fPn369OnTfx36X1vh+nO6/pytL+D1BCexy+iNhFPt6/dIOEiQIEGCBAkSJEiQ8B0k+PwoQYKhP2OXAYOvRo+vD38bvwcAAACABXF8ILs1PQqpAAAAAElFTkSuQmCC"

/***/ },

/***/ 2834
(module) {

"use strict";


module.exports = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};


/***/ },

/***/ 3055
(module) {

"use strict";

module.exports = function (obj, predicate) {
	var ret = {};
	var keys = Object.keys(obj);
	var isArr = Array.isArray(predicate);

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = obj[key];

		if (isArr ? predicate.indexOf(key) !== -1 : predicate(key, val, obj)) {
			ret[key] = val;
		}
	}

	return ret;
};


/***/ },

/***/ 3496
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

/***/ 4081
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
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

/***/ 4175
(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAABVCAQAAAChx3/YAAACVElEQVR42t3ZP2sUURQFcI0xm9gEg4I2GjSIX0DFRkFsbE20DtqIfgBRMCalpV9CUUEQQWIUBBFBEGKze899s+smO2HFRhtNYv5d2eqA284pnm/7/fEeM/PuPXdX1Wt5v03jVVpH8FcpEAN+Mj3nnwuQ2IMpm8eGACFRTPkiNhEyJPYWV/HFtxCVIyRwG58amwgZUh/yO7ZkPUKFRM3v2jK2ETIkavawXpKoEiFxHx0elABpD9usrXAXAqQcaT4gIUFiqDkN2BZChhQ1XIfbDqJyhITfRAKJChESt7wkIUDeDaZzqYFAyJCiVpx3QwiR9nDzkgMhRGLQT/OgJEhRq59JhhAgJHDBHSFASKSLqYUQIuVIcTY1EUKkuy9d7u1CgZCY9BWEDIndxUFcSSQUSGsU93qEACFRzKQfCCHSPuSz+IlQICQe4zt2hMjSYTyxXxYIGfL1KJ6ChAJpj+M9fltAgHAXr7FKQoAUx9MC1kgIkOZE+mjrJATIt/H0wnhQCqQ+YS9tFQEdUo75WyehQXyO/aoO+YCQI+gi/o+d+JxtyJFyLL3h05Xpe6J/4/u/XVhTMQzDjtkCmXzvE96MproZubpHeMdnXK2w7nrEuivXCpK1sM+AtXCWVT37Ez9QZ3+SbafV3zNm3v2yjyejTySyzlaYEp1iSgR93pV5cscMsq5EmKZ2eBEIc2F3MrKEu7jGhDvfrL5/6pDx/ISPwAwnQdKZVqPD3eQ6neufM+Y8MeXs1xc5+81yik1mwCZt3v+IEDKtE3iWtkUI1+fRdOPfKvovc6zWpmERVBkAAAAASUVORK5CYII="

/***/ },

/***/ 4280
(module) {

"use strict";

module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);


/***/ },

/***/ 4405
(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;
/**
 * @license React
 * react-is.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
  REACT_PORTAL_TYPE = Symbol.for("react.portal"),
  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
  REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
  REACT_PROFILER_TYPE = Symbol.for("react.profiler"),
  REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
  REACT_CONTEXT_TYPE = Symbol.for("react.context"),
  REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
  REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
  REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
  REACT_MEMO_TYPE = Symbol.for("react.memo"),
  REACT_LAZY_TYPE = Symbol.for("react.lazy"),
  REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"),
  REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
function typeOf(object) {
  if ("object" === typeof object && null !== object) {
    var $$typeof = object.$$typeof;
    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        switch (((object = object.type), object)) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
          case REACT_VIEW_TRANSITION_TYPE:
            return object;
          default:
            switch (((object = object && object.$$typeof), object)) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
                return object;
              case REACT_CONSUMER_TYPE:
                return object;
              default:
                return $$typeof;
            }
        }
      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }
}
__webpack_unused_export__ = REACT_CONSUMER_TYPE;
__webpack_unused_export__ = REACT_CONTEXT_TYPE;
__webpack_unused_export__ = REACT_ELEMENT_TYPE;
__webpack_unused_export__ = REACT_FORWARD_REF_TYPE;
__webpack_unused_export__ = REACT_FRAGMENT_TYPE;
__webpack_unused_export__ = REACT_LAZY_TYPE;
__webpack_unused_export__ = REACT_MEMO_TYPE;
__webpack_unused_export__ = REACT_PORTAL_TYPE;
__webpack_unused_export__ = REACT_PROFILER_TYPE;
__webpack_unused_export__ = REACT_STRICT_MODE_TYPE;
__webpack_unused_export__ = REACT_SUSPENSE_TYPE;
__webpack_unused_export__ = REACT_SUSPENSE_LIST_TYPE;
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_CONSUMER_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
};
__webpack_unused_export__ = function (object) {
  return (
    "object" === typeof object &&
    null !== object &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_LAZY_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_MEMO_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
};
__webpack_unused_export__ = function (object) {
  return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
};
exports.Hy = function (type) {
  return "string" === typeof type ||
    "function" === typeof type ||
    type === REACT_FRAGMENT_TYPE ||
    type === REACT_PROFILER_TYPE ||
    type === REACT_STRICT_MODE_TYPE ||
    type === REACT_SUSPENSE_TYPE ||
    type === REACT_SUSPENSE_LIST_TYPE ||
    ("object" === typeof type &&
      null !== type &&
      (type.$$typeof === REACT_LAZY_TYPE ||
        type.$$typeof === REACT_MEMO_TYPE ||
        type.$$typeof === REACT_CONTEXT_TYPE ||
        type.$$typeof === REACT_CONSUMER_TYPE ||
        type.$$typeof === REACT_FORWARD_REF_TYPE ||
        type.$$typeof === REACT_CLIENT_REFERENCE ||
        void 0 !== type.getModuleId))
    ? !0
    : !1;
};
__webpack_unused_export__ = typeOf;


/***/ },

/***/ 5160
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/**
 * @license React
 * use-sync-external-store-with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


var React = __webpack_require__(6540);
function is(x, y) {
  return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
}
var objectIs = "function" === typeof Object.is ? Object.is : is,
  useSyncExternalStore = React.useSyncExternalStore,
  useRef = React.useRef,
  useEffect = React.useEffect,
  useMemo = React.useMemo,
  useDebugValue = React.useDebugValue;
exports.useSyncExternalStoreWithSelector = function (
  subscribe,
  getSnapshot,
  getServerSnapshot,
  selector,
  isEqual
) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: !1, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function () {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = !0;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return (memoizedSelection = currentSelection);
          }
          return (memoizedSelection = nextSnapshot);
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return (memoizedSnapshot = nextSnapshot), currentSelection;
        memoizedSnapshot = nextSnapshot;
        return (memoizedSelection = nextSelection);
      }
      var hasMemo = !1,
        memoizedSnapshot,
        memoizedSelection,
        maybeGetServerSnapshot =
          void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function () {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot
          ? void 0
          : function () {
              return memoizedSelector(maybeGetServerSnapshot());
            }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function () {
      inst.hasValue = !0;
      inst.value = value;
    },
    [value]
  );
  useDebugValue(value);
  return value;
};


/***/ },

/***/ 5470
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8168);
/* harmony import */ var _babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8587);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6540);
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
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_View__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)({
      onLayout: this.onLayout
    }, rest));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (KeyboardAvoidingView);

/***/ },

/***/ 5571
(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAAFVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAASAQCkAAAABnRSTlMANO8Qy7qrh7/eAAAA4ElEQVR4Xu3WvQ3CQAxHcRALoGxAQ00RJkBiASQGQPDffwSU+t3pFe4in9xFuV8+fLYPvTo69hv38wg4vmbA6XkZAcv3NgHWfAbE8ZrHDEgGxJJMiDXZCAKZEO9kIwgkv6GwBMQGYBtck11ICEBCARIEhCAgBAAjACgBwAgASgAwAoASAIwAoAQAIwAYAcAIAEYAEAKAEASccMBv8Ecqv7R/1vKP89QoJ5+nd/kA+REtFwEvM+VC5qWyXIy93JcbiresclP0tltt7D46VIcTH3+KA5aPcPUh0cfQjo6Ona4/2hPAtwOzeV0AAAAASUVORK5CYII="

/***/ },

/***/ 5628
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  FullWindowOverlay: () => (/* reexport */ FullWindowOverlay_web),
  InnerScreen: () => (/* reexport */ InnerScreen),
  Screen: () => (/* reexport */ Screen_web),
  ScreenContainer: () => (/* reexport */ ScreenContainer_web),
  ScreenContentWrapper: () => (/* reexport */ ScreenContentWrapper_web),
  ScreenContext: () => (/* reexport */ ScreenContext),
  ScreenFooter: () => (/* reexport */ ScreenFooter_web),
  ScreenStack: () => (/* reexport */ ScreenStack_web),
  ScreenStackHeaderBackButtonImage: () => (/* reexport */ ScreenStackHeaderBackButtonImage),
  ScreenStackHeaderCenterView: () => (/* reexport */ ScreenStackHeaderCenterView),
  ScreenStackHeaderConfig: () => (/* reexport */ ScreenStackHeaderConfig),
  ScreenStackHeaderLeftView: () => (/* reexport */ ScreenStackHeaderLeftView),
  ScreenStackHeaderRightView: () => (/* reexport */ ScreenStackHeaderRightView),
  ScreenStackHeaderSearchBarView: () => (/* reexport */ ScreenStackHeaderSearchBarView),
  ScreenStackHeaderSubview: () => (/* reexport */ ScreenStackHeaderSubview),
  ScreenStackItem: () => (/* reexport */ components_ScreenStackItem),
  SearchBar: () => (/* reexport */ SearchBar_web),
  Tabs: () => (/* reexport */ tabs),
  compatibilityFlags: () => (/* reexport */ compatibilityFlags),
  enableFreeze: () => (/* reexport */ enableFreeze),
  enableScreens: () => (/* reexport */ enableScreens),
  executeNativeBackPress: () => (/* reexport */ executeNativeBackPress),
  featureFlags: () => (/* reexport */ featureFlags),
  freezeEnabled: () => (/* reexport */ freezeEnabled),
  isSearchBarAvailableForCurrentPlatform: () => (/* reexport */ isSearchBarAvailableForCurrentPlatform),
  screensEnabled: () => (/* reexport */ screensEnabled),
  useTransitionProgress: () => (/* reexport */ useTransitionProgress)
});

;// ./node_modules/react-native-screens/lib/module/fabric/NativeScreensModule.web.js
/* harmony default export */ const NativeScreensModule_web = ({});
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var Platform = __webpack_require__(7862);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/UIManager/index.js + 3 modules
var UIManager = __webpack_require__(8683);
;// ./node_modules/react-native-screens/lib/module/core.js
'use client';



const isNativePlatformSupported = Platform/* default */.A.OS === 'ios' || Platform/* default */.A.OS === 'android' || Platform/* default */.A.OS === 'windows';
let ENABLE_SCREENS = isNativePlatformSupported;
function enableScreens(shouldEnableScreens = true) {
  ENABLE_SCREENS = shouldEnableScreens;
  if (!isNativePlatformSupported) {
    return;
  }
  if (ENABLE_SCREENS && !UIManager/* default */.A.getViewManagerConfig('RNSScreen')) {
    console.error(`Screen native module hasn't been linked. Please check the react-native-screens README for more details`);
  }
}
let ENABLE_FREEZE = false;
function enableFreeze(shouldEnableReactFreeze = true) {
  if (!isNativePlatformSupported) {
    return;
  }
  ENABLE_FREEZE = shouldEnableReactFreeze;
}
function screensEnabled() {
  return ENABLE_SCREENS;
}
function freezeEnabled() {
  return ENABLE_FREEZE;
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 45 modules
var Animated = __webpack_require__(8831);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
;// ./node_modules/react-native-screens/lib/module/components/Screen.web.js
'use client';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}




const InnerScreen = View/* default */.A;

// We're using class component here because of the error from reanimated:
// createAnimatedComponent` does not support stateless functional components; use a class component instead.
// NOTE: React Server Components do not support class components.
class NativeScreen extends react.Component {
  render() {
    let {
      active,
      activityState,
      style,
      enabled = screensEnabled(),
      ...rest
    } = this.props;
    if (enabled) {
      if (active !== undefined && activityState === undefined) {
        activityState = active !== 0 ? 2 : 0; // change taken from index.native.tsx
      }
      return /*#__PURE__*/react.createElement(View/* default */.A
      // @ts-expect-error: hidden exists on web, but not in React Native
      , _extends({
        hidden: activityState === 0,
        style: [style, {
          display: activityState !== 0 ? 'flex' : 'none'
        }]
      }, rest));
    }
    return /*#__PURE__*/react.createElement(View/* default */.A, rest);
  }
}
const Screen = Animated/* default */.A.createAnimatedComponent(NativeScreen);
const ScreenContext = /*#__PURE__*/react.createContext(Screen);
/* harmony default export */ const Screen_web = (Screen);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Image/index.js + 2 modules
var Image = __webpack_require__(728);
;// ./node_modules/react-native-screens/lib/module/components/ScreenStackHeaderConfig.web.js
function ScreenStackHeaderConfig_web_extends() {
  return ScreenStackHeaderConfig_web_extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, ScreenStackHeaderConfig_web_extends.apply(null, arguments);
}



const ScreenStackHeaderBackButtonImage = props => /*#__PURE__*/react.createElement(View/* default */.A, null, /*#__PURE__*/react.createElement(Image/* default */.A, ScreenStackHeaderConfig_web_extends({
  resizeMode: "center",
  fadeDuration: 0
}, props)));
const ScreenStackHeaderRightView = props => /*#__PURE__*/react.createElement(View/* default */.A, props);
const ScreenStackHeaderLeftView = props => /*#__PURE__*/react.createElement(View/* default */.A, props);
const ScreenStackHeaderCenterView = props => /*#__PURE__*/react.createElement(View/* default */.A, props);
const ScreenStackHeaderSearchBarView = props => /*#__PURE__*/react.createElement(View/* default */.A, props);
const ScreenStackHeaderConfig = props => /*#__PURE__*/react.createElement(View/* default */.A, props);
const ScreenStackHeaderSubview = View/* default */.A;
;// ./node_modules/react-native-screens/lib/module/components/SearchBar.web.js

const SearchBar = View/* default */.A;
/* harmony default export */ const SearchBar_web = (SearchBar);
;// ./node_modules/react-native-screens/lib/module/components/ScreenContainer.web.js

const ScreenContainer = View/* default */.A;
/* harmony default export */ const ScreenContainer_web = (ScreenContainer);
;// ./node_modules/react-native-screens/lib/module/components/ScreenStack.web.js

const ScreenStack = View/* default */.A;
/* harmony default export */ const ScreenStack_web = (ScreenStack);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
// EXTERNAL MODULE: ./node_modules/warn-once/index.js
var warn_once = __webpack_require__(7290);
var warn_once_default = /*#__PURE__*/__webpack_require__.n(warn_once);
;// ./node_modules/react-native-screens/lib/module/components/ScreenContentWrapper.web.js

const ScreenContentWrapper = View/* default */.A;
/* harmony default export */ const ScreenContentWrapper_web = (ScreenContentWrapper);
;// ./node_modules/react-native-screens/lib/module/components/DebugContainer.web.js


function DebugContainer(props) {
  return /*#__PURE__*/react.createElement(ScreenContentWrapper_web, props);
}
;// ./node_modules/react-native-screens/lib/module/contexts.js

const GHContext = /*#__PURE__*/(/* unused pure expression or super */ null && (React.createContext(props => /*#__PURE__*/React.createElement(React.Fragment, null, props.children))));
const RNSScreensRefContext = /*#__PURE__*/react.createContext(null);
;// ./node_modules/react-native-screens/lib/module/components/ScreenFooter.web.js

const ScreenFooter = View/* default */.A;
const FooterComponent = View/* default */.A;
/* harmony default export */ const ScreenFooter_web = (ScreenFooter);

;// ./node_modules/react-native-screens/lib/module/components/safe-area/SafeAreaView.web.js

const SafeAreaView = View/* default */.A;
/* harmony default export */ const SafeAreaView_web = (SafeAreaView);
;// ./node_modules/react-native-screens/lib/module/flags.js
const RNS_CONTROLLED_BOTTOM_TABS_DEFAULT = false;
const RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT = false;
const RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT = true;

// TODO: Migrate freeze here

/**
 * Exposes information useful for downstream navigation library implementers,
 * so they can keep reasonable backward compatibility, if desired.
 *
 * We don't mean for this object to only grow in number of fields, however at the same time
 * we won't be very hasty to reduce it. Expect gradual changes.
 */
const compatibilityFlags = {
  /**
   * Because of a bug introduced in https://github.com/software-mansion/react-native-screens/pull/1646
   * react-native-screens v3.21 changed how header's backTitle handles whitespace strings in https://github.com/software-mansion/react-native-screens/pull/1726
   * To allow for backwards compatibility in @react-navigation/native-stack we need a way to check if this version or newer is used.
   * See https://github.com/react-navigation/react-navigation/pull/11423 for more context.
   */
  isNewBackTitleImplementation: true,
  /**
   * With version 4.0.0 the header implementation has been changed. To allow for backward compat
   * with native-stack@v6 we want to expose a way to check whether the new implementation
   * is in use or not.
   *
   * See:
   * * https://github.com/software-mansion/react-native-screens/pull/2325
   * * https://github.com/react-navigation/react-navigation/pull/12125
   */
  usesHeaderFlexboxImplementation: true,
  /**
   * In https://github.com/software-mansion/react-native-screens/pull/3402, we fix values
   * reported in `onHeaderHeightChange` event on Android. To allow backward compatibility in
   * `@react-navigation/native-stack`, we expose a way to check whether the new implementation
   * is in use or not.
   */
  usesNewAndroidHeaderHeightImplementation: true
};
const _featureFlags = {
  experiment: {
    controlledBottomTabs: RNS_CONTROLLED_BOTTOM_TABS_DEFAULT,
    synchronousScreenUpdatesEnabled: RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT,
    synchronousHeaderConfigUpdatesEnabled: RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT,
    synchronousHeaderSubviewUpdatesEnabled: RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT,
    androidResetScreenShadowStateOnOrientationChangeEnabled: RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT
  },
  stable: {}
};
const createExperimentalFeatureFlagAccessor = (key, defaultValue) => {
  return {
    get() {
      return _featureFlags.experiment[key];
    },
    set(value) {
      if (value !== _featureFlags.experiment[key] && _featureFlags.experiment[key] !== defaultValue) {
        console.error(`[RNScreens] ${key} feature flag modified for a second time; this might lead to unexpected effects`);
      }
      _featureFlags.experiment[key] = value;
    }
  };
};
const controlledBottomTabsAccessor = createExperimentalFeatureFlagAccessor('controlledBottomTabs', RNS_CONTROLLED_BOTTOM_TABS_DEFAULT);
const synchronousScreenUpdatesAccessor = createExperimentalFeatureFlagAccessor('synchronousScreenUpdatesEnabled', RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT);
const synchronousHeaderConfigUpdatesAccessor = createExperimentalFeatureFlagAccessor('synchronousHeaderConfigUpdatesEnabled', RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT);
const synchronousHeaderSubviewUpdatesAccessor = createExperimentalFeatureFlagAccessor('synchronousHeaderSubviewUpdatesEnabled', RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT);
const androidResetScreenShadowStateOnOrientationChangeAccessor = createExperimentalFeatureFlagAccessor('androidResetScreenShadowStateOnOrientationChangeEnabled', RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT);

/**
 * Exposes configurable global behaviour of the library.
 *
 * Most of these can be overridden on particular component level, these are global switches.
 */
const featureFlags = {
  /**
   *  Flags to enable experimental features. These might be removed w/o notice or moved to stable.
   */
  experiment: {
    get controlledBottomTabs() {
      return controlledBottomTabsAccessor.get();
    },
    set controlledBottomTabs(value) {
      controlledBottomTabsAccessor.set(value);
    },
    get synchronousScreenUpdatesEnabled() {
      return synchronousScreenUpdatesAccessor.get();
    },
    set synchronousScreenUpdatesEnabled(value) {
      synchronousScreenUpdatesAccessor.set(value);
    },
    get synchronousHeaderConfigUpdatesEnabled() {
      return synchronousHeaderConfigUpdatesAccessor.get();
    },
    set synchronousHeaderConfigUpdatesEnabled(value) {
      synchronousHeaderConfigUpdatesAccessor.set(value);
    },
    get synchronousHeaderSubviewUpdatesEnabled() {
      return synchronousHeaderSubviewUpdatesAccessor.get();
    },
    set synchronousHeaderSubviewUpdatesEnabled(value) {
      synchronousHeaderSubviewUpdatesAccessor.set(value);
    },
    get androidResetScreenShadowStateOnOrientationChangeEnabled() {
      return androidResetScreenShadowStateOnOrientationChangeAccessor.get();
    },
    set androidResetScreenShadowStateOnOrientationChangeEnabled(value) {
      androidResetScreenShadowStateOnOrientationChangeAccessor.set(value);
    }
  },
  /**
   * Section for stable flags, which can be used to configure library behaviour.
   */
  stable: {}
};
/* harmony default export */ const flags = ((/* unused pure expression or super */ null && (featureFlags)));
;// ./node_modules/react-native-screens/lib/module/components/ScreenStackItem.js
function ScreenStackItem_extends() {
  return ScreenStackItem_extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, ScreenStackItem_extends.apply(null, arguments);
}












function ScreenStackItem({
  children,
  headerConfig,
  activityState,
  shouldFreeze,
  stackPresentation,
  sheetAllowedDetents,
  contentStyle,
  style,
  screenId,
  onHeaderHeightChange,
  // eslint-disable-next-line camelcase
  unstable_sheetFooter,
  ...rest
}, ref) {
  const currentScreenRef = react.useRef(null);
  const screenRefs = react.useContext(RNSScreensRefContext);
  react.useImperativeHandle(ref, () => currentScreenRef.current);
  const stackPresentationWithDefault = stackPresentation ?? 'push';
  const headerConfigHiddenWithDefault = headerConfig?.hidden ?? false;
  const isHeaderInModal = Platform/* default */.A.OS === 'android' ? false : stackPresentationWithDefault !== 'push' && headerConfigHiddenWithDefault === false;
  const headerHiddenPreviousRef = react.useRef(headerConfigHiddenWithDefault);
  react.useEffect(() => {
    warn_once_default()(Platform/* default */.A.OS !== 'android' && stackPresentationWithDefault !== 'push' && headerHiddenPreviousRef.current !== headerConfigHiddenWithDefault, `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`);
    headerHiddenPreviousRef.current = headerConfigHiddenWithDefault;
  }, [headerConfigHiddenWithDefault, stackPresentationWithDefault]);
  const hasEdgeEffects = rest?.scrollEdgeEffects === undefined || Object.values(rest.scrollEdgeEffects).some(propValue => propValue !== 'hidden');
  const hasBlurEffect = headerConfig?.blurEffect !== undefined && headerConfig.blurEffect !== 'none';
  warn_once_default()(hasEdgeEffects && hasBlurEffect && Platform/* default */.A.OS === 'ios' && parseInt(Platform/* default */.A.Version, 10) >= 26, '[RNScreens] Using both `blurEffect` and `scrollEdgeEffects` simultaneously may cause overlapping effects.');
  const debugContainerStyle = getPositioningStyle(sheetAllowedDetents, stackPresentationWithDefault);

  // For iOS, we need to extract background color and apply it to Screen
  // due to the safe area inset at the bottom of ScreenContentWrapper
  let internalScreenStyle;
  if (stackPresentationWithDefault === 'formSheet' && Platform/* default */.A.OS === 'ios' && contentStyle) {
    const {
      screenStyles,
      contentWrapperStyles
    } = extractScreenStyles(contentStyle);
    internalScreenStyle = screenStyles;
    contentStyle = contentWrapperStyles;
  }
  const shouldUseSafeAreaView = Platform/* default */.A.OS === 'ios' && parseInt(Platform/* default */.A.Version, 10) >= 26;
  const content = /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(DebugContainer, {
    contentStyle: contentStyle,
    style: debugContainerStyle,
    stackPresentation: stackPresentationWithDefault
  }, shouldUseSafeAreaView ? /*#__PURE__*/react.createElement(SafeAreaView_web, {
    edges: getSafeAreaEdges(headerConfig)
  }, children) : children), /*#__PURE__*/react.createElement(ScreenStackHeaderConfig, headerConfig), stackPresentationWithDefault === 'formSheet' && unstable_sheetFooter && /*#__PURE__*/react.createElement(FooterComponent, null, unstable_sheetFooter()));
  return /*#__PURE__*/react.createElement(Screen_web, ScreenStackItem_extends({
    ref: node => {
      currentScreenRef.current = node;
      if (screenRefs === null) {
        console.warn('Looks like RNSScreensRefContext is missing. Make sure the ScreenStack component is wrapped in it');
        return;
      }
      const currentRefs = screenRefs.current;
      if (node === null) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentRefs[screenId];
      } else {
        currentRefs[screenId] = {
          current: node
        };
      }
    },
    enabled: true,
    isNativeStack: true,
    activityState: activityState,
    shouldFreeze: shouldFreeze,
    screenId: screenId,
    stackPresentation: stackPresentationWithDefault,
    hasLargeHeader: headerConfig?.largeTitle ?? false,
    sheetAllowedDetents: sheetAllowedDetents,
    style: [style, internalScreenStyle],
    onHeaderHeightChange: isHeaderInModal ? undefined : onHeaderHeightChange
  }, rest), isHeaderInModal ? /*#__PURE__*/react.createElement(ScreenStack_web, {
    style: styles.container
  }, /*#__PURE__*/react.createElement(Screen_web, {
    enabled: true,
    isNativeStack: true,
    activityState: activityState,
    shouldFreeze: shouldFreeze,
    hasLargeHeader: headerConfig?.largeTitle ?? false,
    style: StyleSheet/* default */.A.absoluteFill,
    onHeaderHeightChange: onHeaderHeightChange
  }, content)) : content);
}
/* harmony default export */ const components_ScreenStackItem = (/*#__PURE__*/react.forwardRef(ScreenStackItem));
function getPositioningStyle(allowedDetents, presentation) {
  const isIOS = Platform/* default */.A.OS === 'ios';
  const rnMinorVersion = Platform/* default */.A.constants.reactNativeVersion.minor;
  if (presentation !== 'formSheet') {
    return styles.container;
  }
  if (isIOS) {
    if (allowedDetents !== 'fitToContents' && rnMinorVersion >= 82 && featureFlags.experiment.synchronousScreenUpdatesEnabled) {
      return styles.container;
    } else {
      return styles.absoluteWithNoBottom;
    }
  }

  /**
   * Note: `bottom: 0` is intentionally excluded from these styles for two reasons:
   *
   * 1. Omitting the bottom constraint ensures the Yoga layout engine does not dynamically
   * recalculate the Screen and content size during animations.
   *
   * 2. Including `bottom: 0` with 'position: absolute' would force
   * the component to anchor itself to an ancestor's bottom edge. This creates
   * a dependency on the ancestor's size, whereas 'fitToContents' requires the
   * FormSheet's dimensions to be derived strictly from its children.
   *
   * It was tested reliably only on Android.
   */
  if (allowedDetents === 'fitToContents') {
    return styles.absoluteWithNoBottom;
  }
  return styles.container;
}
// TODO: figure out whether other styles, like borders, filters, etc.
// shouldn't be applied on the Screen level on iOS due to the inset.
function extractScreenStyles(style) {
  const flatStyle = StyleSheet/* default */.A.flatten(style);
  const {
    backgroundColor,
    ...contentWrapperStyles
  } = flatStyle;
  const screenStyles = {
    backgroundColor
  };
  return {
    screenStyles,
    contentWrapperStyles
  };
}
function getSafeAreaEdges(headerConfig) {
  if (Platform/* default */.A.OS !== 'ios' || parseInt(Platform/* default */.A.Version, 10) < 26) {
    return {};
  }
  let defaultEdges;
  if (headerConfig?.translucent || headerConfig?.hidden) {
    defaultEdges = {};
  } else {
    defaultEdges = {
      top: true
    };
  }
  return defaultEdges;
}
const styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  absoluteWithNoBottom: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
;// ./node_modules/react-native-screens/lib/module/components/FullWindowOverlay.web.js

/* harmony default export */ const FullWindowOverlay_web = (View/* default */.A);
;// ./node_modules/react-native-web/dist/exports/BackHandler/index.js
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
/* harmony default export */ const exports_BackHandler = (BackHandler);
;// ./node_modules/react-native-screens/lib/module/utils.js


const isSearchBarAvailableForCurrentPlatform = ['ios', 'android'].includes(Platform/* default */.A.OS);
const isHeaderBarButtonsAvailableForCurrentPlatform = Platform/* default */.A.OS === 'ios';
function executeNativeBackPress() {
  // This function invokes the native back press event
  exports_BackHandler.exitApp();
  return true;
}
function parseBooleanToOptionalBooleanNativeProp(prop) {
  switch (prop) {
    case undefined:
      return 'undefined';
    case true:
      return 'true';
    case false:
      return 'false';
  }
}
;// ./node_modules/react-native-screens/lib/module/TransitionProgressContext.js
'use client';


/* harmony default export */ const TransitionProgressContext = (/*#__PURE__*/react.createContext(undefined));
;// ./node_modules/react-native-screens/lib/module/useTransitionProgress.js


function useTransitionProgress() {
  const progress = react.useContext(TransitionProgressContext);
  if (progress === undefined) {
    throw new Error("Couldn't find values for transition progress. Are you inside a screen in Native Stack?");
  }
  return progress;
}
;// ./node_modules/react-native-screens/lib/module/components/tabs/TabsHost.web.js

const TabsHost = View/* default */.A;
/* harmony default export */ const TabsHost_web = (TabsHost);
;// ./node_modules/react-native-screens/lib/module/components/tabs/TabsScreen.web.js

const TabsScreen = View/* default */.A;
/* harmony default export */ const TabsScreen_web = (TabsScreen);
;// ./node_modules/react-native-screens/lib/module/components/tabs/index.js


/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost_web,
  Screen: TabsScreen_web
};
/* harmony default export */ const tabs = (Tabs);
;// ./node_modules/react-native-screens/lib/module/index.js
// Side effects import declaration to ensure our TurboModule
// is loaded.



/**
 * Core
 */


/**
 * RNS Components
 */










/**
 * Utils
 */


/**
 * Flags
 */


/**
 * Hooks
 */


/**
 * EXPERIMENTAL API BELOW. MIGHT CHANGE W/O ANY NOTICE
 */


/***/ },

/***/ 5659
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

/***/ 5973
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  W9: () => (/* reexport */ createBottomTabNavigator)
});

// UNUSED EXPORTS: BottomTabBar, BottomTabBarHeightCallbackContext, BottomTabBarHeightContext, BottomTabView, SceneStyleInterpolators, TransitionPresets, TransitionSpecs, useBottomTabBarHeight

;// ./node_modules/@react-navigation/bottom-tabs/lib/module/TransitionConfigs/SceneStyleInterpolators.js


/**
 * Simple cross fade animation
 */
function forFade({
  current
}) {
  return {
    sceneStyle: {
      opacity: current.progress.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 0]
      })
    }
  };
}

/**
 * Animation where the screens slightly shift to left/right
 */
function forShift({
  current
}) {
  return {
    sceneStyle: {
      opacity: current.progress.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 1, 0]
      }),
      transform: [{
        translateX: current.progress.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-50, 0, 50]
        })
      }]
    }
  };
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Easing/index.js + 2 modules
var Easing = __webpack_require__(6693);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/TransitionConfigs/TransitionSpecs.js



const FadeSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing/* default */.A.in(Easing/* default */.A.linear)
  }
};
const ShiftSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing/* default */.A.inOut(Easing/* default */.A.ease)
  }
};
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/TransitionConfigs/TransitionPresets.js




const FadeTransition = {
  transitionSpec: FadeSpec,
  sceneStyleInterpolator: forFade
};
const ShiftTransition = {
  transitionSpec: ShiftSpec,
  sceneStyleInterpolator: forShift
};
// EXTERNAL MODULE: ./node_modules/@react-navigation/native/lib/module/index.js + 103 modules
var lib_module = __webpack_require__(7397);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/index.js + 35 modules
var elements_lib_module = __webpack_require__(7418);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 45 modules
var Animated = __webpack_require__(8831);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var Platform = __webpack_require__(7862);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
// EXTERNAL MODULE: ./node_modules/react-native-safe-area-context/lib/module/SafeAreaContext.js + 1 modules
var SafeAreaContext = __webpack_require__(2168);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/utils/BottomTabBarHeightCallbackContext.js



const BottomTabBarHeightCallbackContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/utils/BottomTabBarHeightContext.js



const BottomTabBarHeightContext_BottomTabBarHeightContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/utils/useAnimatedHashMap.js




function useAnimatedHashMap({
  routes,
  index
}) {
  const refs = react.useRef({});
  const previous = refs.current;
  const routeKeys = Object.keys(previous);
  if (routes.length === routeKeys.length && routes.every(route => routeKeys.includes(route.key))) {
    return previous;
  }
  refs.current = {};
  routes.forEach(({
    key
  }, i) => {
    refs.current[key] = previous[key] ?? new Animated/* default */.A.Value(i === index ? 0 : i >= index ? 1 : -1);
  });
  return refs.current;
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Keyboard/index.js
var Keyboard = __webpack_require__(7068);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/utils/useIsKeyboardShown.js





function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = react.useState(false);
  react.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);
    let subscriptions;
    if (Platform/* default */.A.OS === 'ios') {
      subscriptions = [Keyboard/* default */.A.addListener('keyboardWillShow', handleKeyboardShow), Keyboard/* default */.A.addListener('keyboardWillHide', handleKeyboardHide)];
    } else {
      subscriptions = [Keyboard/* default */.A.addListener('keyboardDidShow', handleKeyboardShow), Keyboard/* default */.A.addListener('keyboardDidHide', handleKeyboardHide)];
    }
    return () => {
      subscriptions.forEach(s => s.remove());
    };
  }, []);
  return isKeyboardShown;
}
// EXTERNAL MODULE: ./node_modules/color/index.js
var color = __webpack_require__(2520);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/views/TabBarIcon.js







/**
 * Icon sizes taken from Apple HIG
 * https://developer.apple.com/design/human-interface-guidelines/tab-bars
 */
const ICON_SIZE_WIDE = 31;
const ICON_SIZE_WIDE_COMPACT = 23;
const ICON_SIZE_TALL = 28;
const ICON_SIZE_TALL_COMPACT = 20;
const ICON_SIZE_ROUND = 25;
const ICON_SIZE_ROUND_COMPACT = 18;
const ICON_SIZE_MATERIAL = 24;
function TabBarIcon({
  route: _,
  variant,
  size,
  badge,
  badgeStyle,
  activeOpacity,
  inactiveOpacity,
  activeTintColor,
  inactiveTintColor,
  renderIcon,
  allowFontScaling,
  style
}) {
  const iconSize = variant === 'material' ? ICON_SIZE_MATERIAL : size === 'compact' ? ICON_SIZE_ROUND_COMPACT : ICON_SIZE_ROUND;

  // We render the icon twice at the same position on top of each other:
  // active and inactive one, so we can fade between them.
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
    style: [variant === 'material' ? styles.wrapperMaterial : size === 'compact' ? styles.wrapperUikitCompact : styles.wrapperUikit, style],
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      style: [styles.icon, {
        opacity: activeOpacity,
        // Workaround for react-native >= 0.54 layout bug
        minWidth: iconSize
      }],
      children: renderIcon({
        focused: true,
        size: iconSize,
        color: activeTintColor
      })
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      style: [styles.icon, {
        opacity: inactiveOpacity
      }],
      children: renderIcon({
        focused: false,
        size: iconSize,
        color: inactiveTintColor
      })
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* Badge */.Ex, {
      visible: badge != null,
      size: iconSize * 0.75,
      allowFontScaling: allowFontScaling,
      style: [styles.badge, badgeStyle],
      children: badge
    })]
  });
}
const styles = StyleSheet/* default */.A.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  wrapperUikit: {
    width: ICON_SIZE_WIDE,
    height: ICON_SIZE_TALL
  },
  wrapperUikitCompact: {
    width: ICON_SIZE_WIDE_COMPACT,
    height: ICON_SIZE_TALL_COMPACT
  },
  wrapperMaterial: {
    width: ICON_SIZE_MATERIAL,
    height: ICON_SIZE_MATERIAL
  },
  badge: {
    position: 'absolute',
    end: -3,
    top: -3
  }
});
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/views/BottomTabItem.js











const renderButtonDefault = props => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* PlatformPressable */.jV, {
  ...props
});
const SUPPORTS_LARGE_CONTENT_VIEWER = Platform/* default */.A.OS === 'ios' && parseInt(Platform/* default */.A.Version, 10) >= 13;
function BottomTabItem({
  route,
  href,
  focused,
  descriptor,
  label,
  icon,
  badge,
  badgeStyle,
  button = renderButtonDefault,
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
  horizontal,
  compact,
  sidebar,
  variant,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor: customActiveBackgroundColor,
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  // On iOS 13+, we use `largeContentTitle` for accessibility
  // So we don't need the font to scale up
  // https://developer.apple.com/documentation/uikit/uiview/3183939-largecontenttitle
  allowFontScaling = SUPPORTS_LARGE_CONTENT_VIEWER ? false : undefined,
  labelStyle,
  iconStyle,
  style
}) {
  const {
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  const activeTintColor = customActiveTintColor ?? (variant === 'uikit' && sidebar && horizontal ? color(colors.primary).isDark() ? 'white' : color(colors.primary).darken(0.71).string() : colors.primary);
  const inactiveTintColor = customInactiveTintColor === undefined ? variant === 'material' ? color(colors.text).alpha(0.68).rgb().string() : color(colors.text).mix(color(colors.card), 0.5).hex() : customInactiveTintColor;
  const activeBackgroundColor = customActiveBackgroundColor ?? (variant === 'material' ? color(activeTintColor).alpha(0.12).rgb().string() : sidebar && horizontal ? colors.primary : 'transparent');
  const {
    options
  } = descriptor;
  const labelString = (0,elements_lib_module/* getLabel */.p9)({
    label: typeof options.tabBarLabel === 'string' ? options.tabBarLabel : undefined,
    title: options.title
  }, route.name);
  let labelInactiveTintColor = inactiveTintColor;
  let iconInactiveTintColor = inactiveTintColor;
  if (variant === 'uikit' && sidebar && horizontal && customInactiveTintColor === undefined) {
    iconInactiveTintColor = colors.primary;
    labelInactiveTintColor = colors.text;
  }
  const renderLabel = ({
    focused
  }) => {
    if (showLabel === false) {
      return null;
    }
    const color = focused ? activeTintColor : labelInactiveTintColor;
    if (typeof label !== 'string') {
      return label({
        focused,
        color,
        position: horizontal ? 'beside-icon' : 'below-icon',
        children: labelString
      });
    }
    return /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* Label */.JU, {
      style: [horizontal ? [BottomTabItem_styles.labelBeside, variant === 'material' ? BottomTabItem_styles.labelSidebarMaterial : sidebar ? BottomTabItem_styles.labelSidebarUiKit : compact ? BottomTabItem_styles.labelBesideUikitCompact : BottomTabItem_styles.labelBesideUikit, icon == null && {
        marginStart: 0
      }] : BottomTabItem_styles.labelBeneath, compact || variant === 'uikit' && sidebar && horizontal ? fonts.regular : fonts.medium, labelStyle],
      allowFontScaling: allowFontScaling,
      tintColor: color,
      children: label
    });
  };
  const renderIcon = ({
    focused
  }) => {
    if (icon === undefined) {
      return null;
    }
    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;
    return /*#__PURE__*/(0,jsx_runtime.jsx)(TabBarIcon, {
      route: route,
      variant: variant,
      size: compact ? 'compact' : 'regular',
      badge: badge,
      badgeStyle: badgeStyle,
      activeOpacity: activeOpacity,
      allowFontScaling: allowFontScaling,
      inactiveOpacity: inactiveOpacity,
      activeTintColor: activeTintColor,
      inactiveTintColor: iconInactiveTintColor,
      renderIcon: icon,
      style: iconStyle
    });
  };
  const scene = {
    route,
    focused
  };
  const backgroundColor = focused ? activeBackgroundColor : inactiveBackgroundColor;
  const {
    flex
  } = StyleSheet/* default */.A.flatten(style || {});
  const borderRadius = variant === 'material' ? horizontal ? 56 : 16 : sidebar && horizontal ? 10 : 0;
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    style: [
    // Clip ripple effect on Android
    {
      borderRadius,
      overflow: variant === 'material' ? 'hidden' : 'visible'
    }, style],
    children: button({
      href,
      onPress,
      onLongPress,
      testID,
      'aria-label': accessibilityLabel,
      'accessibilityLargeContentTitle': labelString,
      'accessibilityShowsLargeContentViewer': true,
      // FIXME: role: 'tab' doesn't seem to work as expected on iOS
      'role': Platform/* default */.A.select({
        ios: 'button',
        default: 'tab'
      }),
      'aria-selected': focused,
      'android_ripple': {
        borderless: true
      },
      'hoverEffect': variant === 'material' || sidebar && horizontal ? {
        color: colors.text
      } : undefined,
      'pressOpacity': 1,
      'style': [BottomTabItem_styles.tab, {
        flex,
        backgroundColor,
        borderRadius
      }, sidebar ? variant === 'material' ? horizontal ? BottomTabItem_styles.tabBarSidebarMaterial : BottomTabItem_styles.tabVerticalMaterial : horizontal ? BottomTabItem_styles.tabBarSidebarUiKit : BottomTabItem_styles.tabVerticalUiKit : variant === 'material' ? BottomTabItem_styles.tabVerticalMaterial : horizontal ? BottomTabItem_styles.tabHorizontalUiKit : BottomTabItem_styles.tabVerticalUiKit],
      'children': /*#__PURE__*/(0,jsx_runtime.jsxs)(react.Fragment, {
        children: [renderIcon(scene), renderLabel(scene)]
      })
    })
  });
}
const BottomTabItem_styles = StyleSheet/* default */.A.create({
  tab: {
    alignItems: 'center',
    // Roundness for iPad hover effect
    borderRadius: 10,
    borderCurve: 'continuous'
  },
  tabVerticalUiKit: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 5
  },
  tabVerticalMaterial: {
    padding: 10
  },
  tabHorizontalUiKit: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5
  },
  tabBarSidebarUiKit: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 5
  },
  tabBarSidebarMaterial: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingStart: 16,
    paddingEnd: 24
  },
  labelSidebarMaterial: {
    marginStart: 12
  },
  labelSidebarUiKit: {
    fontSize: 17,
    marginStart: 10
  },
  labelBeneath: {
    fontSize: 10
  },
  labelBeside: {
    marginEnd: 12,
    lineHeight: 24
  },
  labelBesideUikit: {
    fontSize: 13,
    marginStart: 5
  },
  labelBesideUikitCompact: {
    fontSize: 12,
    marginStart: 5
  }
});
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/views/BottomTabBar.js













const TABBAR_HEIGHT_UIKIT = 49;
const TABBAR_HEIGHT_UIKIT_COMPACT = 32;
const SPACING_UIKIT = 15;
const SPACING_MATERIAL = 12;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;
const useNativeDriver = Platform/* default */.A.OS !== 'web';
const shouldUseHorizontalLabels = ({
  state,
  descriptors,
  dimensions
}) => {
  const {
    tabBarLabelPosition
  } = descriptors[state.routes[state.index].key].options;
  if (tabBarLabelPosition) {
    switch (tabBarLabelPosition) {
      case 'beside-icon':
        return true;
      case 'below-icon':
        return false;
    }
  }
  if (dimensions.width >= 768) {
    // Screen size matches a tablet
    const maxTabWidth = state.routes.reduce((acc, route) => {
      const {
        tabBarItemStyle
      } = descriptors[route.key].options;
      const flattenedStyle = StyleSheet/* default */.A.flatten(tabBarItemStyle);
      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          return acc + flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          return acc + flattenedStyle.maxWidth;
        }
      }
      return acc + DEFAULT_MAX_TAB_ITEM_WIDTH;
    }, 0);
    return maxTabWidth <= dimensions.width;
  } else {
    return dimensions.width > dimensions.height;
  }
};
const isCompact = ({
  state,
  descriptors,
  dimensions
}) => {
  const {
    tabBarPosition,
    tabBarVariant
  } = descriptors[state.routes[state.index].key].options;
  if (tabBarPosition === 'left' || tabBarPosition === 'right' || tabBarVariant === 'material') {
    return false;
  }
  const isLandscape = dimensions.width > dimensions.height;
  const horizontalLabels = shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions
  });
  if (Platform/* default */.A.OS === 'ios' && !Platform/* default */.A.isPad && isLandscape && horizontalLabels) {
    return true;
  }
  return false;
};
const getTabBarHeight = ({
  state,
  descriptors,
  dimensions,
  insets,
  style
}) => {
  const {
    tabBarPosition
  } = descriptors[state.routes[state.index].key].options;
  const flattenedStyle = StyleSheet/* default */.A.flatten(style);
  const customHeight = flattenedStyle && 'height' in flattenedStyle ? flattenedStyle.height : undefined;
  if (typeof customHeight === 'number') {
    return customHeight;
  }
  const inset = insets[tabBarPosition === 'top' ? 'top' : 'bottom'];
  if (isCompact({
    state,
    descriptors,
    dimensions
  })) {
    return TABBAR_HEIGHT_UIKIT_COMPACT + inset;
  }
  return TABBAR_HEIGHT_UIKIT + inset;
};
function BottomTabBar({
  state,
  navigation,
  descriptors,
  insets,
  style
}) {
  const {
    colors
  } = (0,lib_module.useTheme)();
  const {
    direction
  } = (0,lib_module.useLocale)();
  const {
    buildHref
  } = (0,lib_module.useLinkBuilder)();
  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const {
    tabBarPosition = 'bottom',
    tabBarShowLabel,
    tabBarLabelPosition,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarVariant = 'uikit',
    tabBarStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor
  } = focusedOptions;
  if (tabBarVariant === 'material' && tabBarPosition !== 'left' && tabBarPosition !== 'right') {
    throw new Error("The 'material' variant for tab bar is only supported when 'tabBarPosition' is set to 'left' or 'right'.");
  }
  if (tabBarLabelPosition === 'below-icon' && tabBarVariant === 'uikit' && (tabBarPosition === 'left' || tabBarPosition === 'right')) {
    throw new Error("The 'below-icon' label position for tab bar is only supported when 'tabBarPosition' is set to 'top' or 'bottom' when using the 'uikit' variant.");
  }
  const isKeyboardShown = useIsKeyboardShown();
  const onHeightChange = react.useContext(BottomTabBarHeightCallbackContext);
  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);
  const visibilityAnimationConfigRef = react.useRef(tabBarVisibilityAnimationConfig);
  react.useEffect(() => {
    visibilityAnimationConfigRef.current = tabBarVisibilityAnimationConfig;
  });
  const [isTabBarHidden, setIsTabBarHidden] = react.useState(!shouldShowTabBar);
  const [visible] = react.useState(() => new Animated/* default */.A.Value(shouldShowTabBar ? 1 : 0));
  react.useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;
    if (shouldShowTabBar) {
      const animation = visibilityAnimationConfig?.show?.animation === 'spring' ? Animated/* default */.A.spring : Animated/* default */.A.timing;
      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...visibilityAnimationConfig?.show?.config
      }).start(({
        finished
      }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setIsTabBarHidden(true);
      const animation = visibilityAnimationConfig?.hide?.animation === 'spring' ? Animated/* default */.A.spring : Animated/* default */.A.timing;
      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...visibilityAnimationConfig?.hide?.config
      }).start();
    }
    return () => visible.stopAnimation();
  }, [visible, shouldShowTabBar]);
  const [layout, setLayout] = react.useState({
    height: 0
  });
  const handleLayout = e => {
    const {
      height
    } = e.nativeEvent.layout;
    onHeightChange?.(height);
    setLayout(layout => {
      if (height === layout.height) {
        return layout;
      } else {
        return {
          height
        };
      }
    });
  };
  const {
    routes
  } = state;
  const tabBarHeight = (0,elements_lib_module/* useFrameSize */.gV)(dimensions => getTabBarHeight({
    state,
    descriptors,
    insets,
    dimensions,
    style: [tabBarStyle, style]
  }));
  const hasHorizontalLabels = (0,elements_lib_module/* useFrameSize */.gV)(dimensions => shouldUseHorizontalLabels({
    state,
    descriptors,
    dimensions
  }));
  const compact = (0,elements_lib_module/* useFrameSize */.gV)(dimensions => isCompact({
    state,
    descriptors,
    dimensions
  }));
  const sidebar = tabBarPosition === 'left' || tabBarPosition === 'right';
  const spacing = tabBarVariant === 'material' ? SPACING_MATERIAL : SPACING_UIKIT;
  const minSidebarWidth = (0,elements_lib_module/* useFrameSize */.gV)(size => sidebar && hasHorizontalLabels ? (0,elements_lib_module/* getDefaultSidebarWidth */.eY)(size) : 0);
  const tabBarBackgroundElement = tabBarBackground?.();
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
    style: [tabBarPosition === 'left' ? BottomTabBar_styles.start : tabBarPosition === 'right' ? BottomTabBar_styles.end : BottomTabBar_styles.bottom, (Platform/* default */.A.OS === 'web' ? tabBarPosition === 'right' : direction === 'rtl' && tabBarPosition === 'left' || direction !== 'rtl' && tabBarPosition === 'right') ? {
      borderLeftWidth: StyleSheet/* default */.A.hairlineWidth
    } : (Platform/* default */.A.OS === 'web' ? tabBarPosition === 'left' : direction === 'rtl' && tabBarPosition === 'right' || direction !== 'rtl' && tabBarPosition === 'left') ? {
      borderRightWidth: StyleSheet/* default */.A.hairlineWidth
    } : tabBarPosition === 'top' ? {
      borderBottomWidth: StyleSheet/* default */.A.hairlineWidth
    } : {
      borderTopWidth: StyleSheet/* default */.A.hairlineWidth
    }, {
      backgroundColor: tabBarBackgroundElement != null ? 'transparent' : colors.card,
      borderColor: colors.border
    }, sidebar ? {
      paddingTop: (hasHorizontalLabels ? spacing : spacing / 2) + insets.top,
      paddingBottom: (hasHorizontalLabels ? spacing : spacing / 2) + insets.bottom,
      paddingStart: spacing + (tabBarPosition === 'left' ? insets.left : 0),
      paddingEnd: spacing + (tabBarPosition === 'right' ? insets.right : 0),
      minWidth: minSidebarWidth
    } : [{
      transform: [{
        translateY: visible.interpolate({
          inputRange: [0, 1],
          outputRange: [layout.height + insets[tabBarPosition === 'top' ? 'top' : 'bottom'] + StyleSheet/* default */.A.hairlineWidth, 0]
        })
      }],
      // Absolutely position the tab bar so that the content is below it
      // This is needed to avoid gap at bottom when the tab bar is hidden
      position: isTabBarHidden ? 'absolute' : undefined
    }, {
      height: tabBarHeight,
      paddingBottom: tabBarPosition === 'bottom' ? insets.bottom : 0,
      paddingTop: tabBarPosition === 'top' ? insets.top : 0,
      paddingHorizontal: Math.max(insets.left, insets.right)
    }], tabBarStyle],
    pointerEvents: isTabBarHidden ? 'none' : 'auto',
    onLayout: sidebar ? undefined : handleLayout,
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      pointerEvents: "none",
      style: StyleSheet/* default */.A.absoluteFill,
      children: tabBarBackgroundElement
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      role: "tablist",
      style: sidebar ? BottomTabBar_styles.sideContent : BottomTabBar_styles.bottomContent,
      children: routes.map((route, index) => {
        const focused = index === state.index;
        const {
          options
        } = descriptors[route.key];
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });
          if (!focused && !event.defaultPrevented) {
            navigation.dispatch({
              ...lib_module.CommonActions.navigate(route),
              target: state.key
            });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };
        const label = typeof options.tabBarLabel === 'function' ? options.tabBarLabel : (0,elements_lib_module/* getLabel */.p9)({
          label: options.tabBarLabel,
          title: options.title
        }, route.name);
        const accessibilityLabel = options.tabBarAccessibilityLabel !== undefined ? options.tabBarAccessibilityLabel : typeof label === 'string' && Platform/* default */.A.OS === 'ios' ? `${label}, tab, ${index + 1} of ${routes.length}` : undefined;
        return /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationContext.Provider, {
          value: descriptors[route.key].navigation,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationRouteContext.Provider, {
            value: route,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(BottomTabItem, {
              href: buildHref(route.name, route.params),
              route: route,
              descriptor: descriptors[route.key],
              focused: focused,
              horizontal: hasHorizontalLabels,
              compact: compact,
              sidebar: sidebar,
              variant: tabBarVariant,
              onPress: onPress,
              onLongPress: onLongPress,
              accessibilityLabel: accessibilityLabel,
              testID: options.tabBarButtonTestID,
              allowFontScaling: options.tabBarAllowFontScaling,
              activeTintColor: tabBarActiveTintColor,
              inactiveTintColor: tabBarInactiveTintColor,
              activeBackgroundColor: tabBarActiveBackgroundColor,
              inactiveBackgroundColor: tabBarInactiveBackgroundColor,
              button: options.tabBarButton,
              icon: options.tabBarIcon ?? (({
                color,
                size
              }) => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* MissingIcon */.SX, {
                color: color,
                size: size
              })),
              badge: options.tabBarBadge,
              badgeStyle: options.tabBarBadgeStyle,
              label: label,
              showLabel: tabBarShowLabel,
              labelStyle: options.tabBarLabelStyle,
              iconStyle: options.tabBarIconStyle,
              style: [sidebar ? {
                marginVertical: hasHorizontalLabels ? tabBarVariant === 'material' ? 0 : 1 : spacing / 2
              } : BottomTabBar_styles.bottomItem, options.tabBarItemStyle]
            })
          })
        }, route.key);
      })
    })]
  });
}
const BottomTabBar_styles = StyleSheet/* default */.A.create({
  start: {
    top: 0,
    bottom: 0,
    start: 0
  },
  end: {
    top: 0,
    bottom: 0,
    end: 0
  },
  bottom: {
    start: 0,
    end: 0,
    bottom: 0,
    elevation: 8
  },
  bottomContent: {
    flex: 1,
    flexDirection: 'row'
  },
  sideContent: {
    flex: 1,
    flexDirection: 'column'
  },
  bottomItem: {
    flex: 1
  }
});
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/views/ScreenFallback.js





let Screens;
try {
  Screens = require('react-native-screens');
} catch (e) {
  // Ignore
}
const MaybeScreenContainer = ({
  enabled,
  ...rest
}) => {
  if (Screens?.screensEnabled?.()) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(Screens.ScreenContainer, {
      enabled: enabled,
      ...rest
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    ...rest
  });
};
function MaybeScreen({
  enabled,
  active,
  ...rest
}) {
  if (Screens?.screensEnabled?.()) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(Screens.Screen, {
      enabled: enabled,
      activityState: active,
      ...rest
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    ...rest
  });
}
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/views/BottomTabView.js
















const EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;
const NAMED_TRANSITIONS_PRESETS = {
  fade: FadeTransition,
  shift: ShiftTransition,
  none: {
    sceneStyleInterpolator: undefined,
    transitionSpec: {
      animation: 'timing',
      config: {
        duration: 0
      }
    }
  }
};
const BottomTabView_useNativeDriver = Platform/* default */.A.OS !== 'web';
const hasAnimation = options => {
  const {
    animation,
    transitionSpec
  } = options;
  if (animation) {
    return animation !== 'none';
  }
  return Boolean(transitionSpec);
};
const renderTabBarDefault = props => /*#__PURE__*/(0,jsx_runtime.jsx)(BottomTabBar, {
  ...props
});
function BottomTabView(props) {
  const {
    tabBar = renderTabBarDefault,
    state,
    navigation,
    descriptors,
    safeAreaInsets,
    detachInactiveScreens = Platform/* default */.A.OS === 'web' || Platform/* default */.A.OS === 'android' || Platform/* default */.A.OS === 'ios'
  } = props;
  const focusedRouteKey = state.routes[state.index].key;

  /**
   * List of loaded tabs, tabs will be loaded when navigated to.
   */
  const [loaded, setLoaded] = react.useState([focusedRouteKey]);
  if (!loaded.includes(focusedRouteKey)) {
    // Set the current tab to be loaded if it was not loaded before
    setLoaded([...loaded, focusedRouteKey]);
  }
  const previousRouteKeyRef = react.useRef(focusedRouteKey);
  const tabAnims = useAnimatedHashMap(state);
  react.useEffect(() => {
    const previousRouteKey = previousRouteKeyRef.current;
    let popToTopAction;
    if (previousRouteKey !== focusedRouteKey && descriptors[previousRouteKey]?.options.popToTopOnBlur) {
      const prevRoute = state.routes.find(route => route.key === previousRouteKey);
      if (prevRoute?.state?.type === 'stack' && prevRoute.state.key) {
        popToTopAction = {
          ...lib_module.StackActions.popToTop(),
          target: prevRoute.state.key
        };
      }
    }
    const animateToIndex = () => {
      if (previousRouteKey !== focusedRouteKey) {
        navigation.emit({
          type: 'transitionStart',
          target: focusedRouteKey
        });
      }
      Animated/* default */.A.parallel(state.routes.map((route, index) => {
        const {
          options
        } = descriptors[route.key];
        const {
          animation = 'none',
          transitionSpec = NAMED_TRANSITIONS_PRESETS[animation].transitionSpec
        } = options;
        let spec = transitionSpec;
        if (route.key !== previousRouteKey && route.key !== focusedRouteKey) {
          // Don't animate if the screen is not previous one or new one
          // This will avoid flicker for screens not involved in the transition
          spec = NAMED_TRANSITIONS_PRESETS.none.transitionSpec;
        }
        spec = spec ?? NAMED_TRANSITIONS_PRESETS.none.transitionSpec;
        const toValue = index === state.index ? 0 : index >= state.index ? 1 : -1;
        return Animated/* default */.A[spec.animation](tabAnims[route.key], {
          ...spec.config,
          toValue,
          useNativeDriver: BottomTabView_useNativeDriver
        });
      }).filter(Boolean)).start(({
        finished
      }) => {
        if (finished && popToTopAction) {
          navigation.dispatch(popToTopAction);
        }
        if (previousRouteKey !== focusedRouteKey) {
          navigation.emit({
            type: 'transitionEnd',
            target: focusedRouteKey
          });
        }
      });
    };
    animateToIndex();
    previousRouteKeyRef.current = focusedRouteKey;
  }, [descriptors, focusedRouteKey, navigation, state.index, state.routes, tabAnims]);
  const dimensions = elements_lib_module/* SafeAreaProviderCompat */.ge.initialMetrics.frame;
  const [tabBarHeight, setTabBarHeight] = react.useState(() => getTabBarHeight({
    state,
    descriptors,
    dimensions,
    insets: {
      ...elements_lib_module/* SafeAreaProviderCompat */.ge.initialMetrics.insets,
      ...props.safeAreaInsets
    },
    style: descriptors[state.routes[state.index].key].options.tabBarStyle
  }));
  const renderTabBar = () => {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(SafeAreaContext/* SafeAreaInsetsContext */.q9.Consumer, {
      children: insets => tabBar({
        state: state,
        descriptors: descriptors,
        navigation: navigation,
        insets: {
          top: safeAreaInsets?.top ?? insets?.top ?? 0,
          right: safeAreaInsets?.right ?? insets?.right ?? 0,
          bottom: safeAreaInsets?.bottom ?? insets?.bottom ?? 0,
          left: safeAreaInsets?.left ?? insets?.left ?? 0
        }
      })
    });
  };
  const {
    routes
  } = state;

  // If there is no animation, we only have 2 states: visible and invisible
  const hasTwoStates = !routes.some(route => hasAnimation(descriptors[route.key].options));
  const {
    tabBarPosition = 'bottom'
  } = descriptors[focusedRouteKey].options;
  const tabBarElement = /*#__PURE__*/(0,jsx_runtime.jsx)(BottomTabBarHeightCallbackContext.Provider, {
    value: setTabBarHeight,
    children: renderTabBar()
  }, "tabbar");
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(elements_lib_module/* SafeAreaProviderCompat */.ge, {
    style: {
      flexDirection: tabBarPosition === 'left' || tabBarPosition === 'right' ? 'row' : 'column'
    },
    children: [tabBarPosition === 'top' || tabBarPosition === 'left' ? tabBarElement : null, /*#__PURE__*/(0,jsx_runtime.jsx)(MaybeScreenContainer, {
      enabled: detachInactiveScreens,
      hasTwoStates: hasTwoStates,
      style: BottomTabView_styles.screens,
      children: routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const {
          lazy = true,
          animation = 'none',
          sceneStyleInterpolator = NAMED_TRANSITIONS_PRESETS[animation].sceneStyleInterpolator
        } = descriptor.options;
        const isFocused = state.index === index;
        const isPreloaded = state.preloadedRouteKeys.includes(route.key);
        if (lazy && !loaded.includes(route.key) && !isFocused && !isPreloaded) {
          // Don't render a lazy screen if we've never navigated to it or it wasn't preloaded
          return null;
        }
        const {
          freezeOnBlur,
          header = ({
            layout,
            options
          }) => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* Header */.Y9, {
            ...options,
            layout: layout,
            title: (0,elements_lib_module/* getHeaderTitle */.k1)(options, route.name)
          }),
          headerShown,
          headerStatusBarHeight,
          headerTransparent,
          sceneStyle: customSceneStyle
        } = descriptor.options;
        const {
          sceneStyle
        } = sceneStyleInterpolator?.({
          current: {
            progress: tabAnims[route.key]
          }
        }) ?? {};
        const animationEnabled = hasAnimation(descriptor.options);
        const activityState = isFocused ? STATE_ON_TOP // the screen is on top after the transition
        : animationEnabled // is animation is not enabled, immediately move to inactive state
        ? tabAnims[route.key].interpolate({
          inputRange: [0, 1 - EPSILON, 1],
          outputRange: [STATE_TRANSITIONING_OR_BELOW_TOP,
          // screen visible during transition
          STATE_TRANSITIONING_OR_BELOW_TOP, STATE_INACTIVE // the screen is detached after transition
          ],
          extrapolate: 'extend'
        }) : STATE_INACTIVE;
        return /*#__PURE__*/(0,jsx_runtime.jsx)(MaybeScreen, {
          style: [StyleSheet/* default */.A.absoluteFill, {
            zIndex: isFocused ? 0 : -1
          }],
          active: activityState,
          enabled: detachInactiveScreens,
          freezeOnBlur: freezeOnBlur,
          shouldFreeze: activityState === STATE_INACTIVE && !isPreloaded,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(BottomTabBarHeightContext_BottomTabBarHeightContext.Provider, {
            value: tabBarPosition === 'bottom' ? tabBarHeight : 0,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* Screen */.ff, {
              focused: isFocused,
              route: descriptor.route,
              navigation: descriptor.navigation,
              headerShown: headerShown,
              headerStatusBarHeight: headerStatusBarHeight,
              headerTransparent: headerTransparent,
              header: header({
                layout: dimensions,
                route: descriptor.route,
                navigation: descriptor.navigation,
                options: descriptor.options
              }),
              style: [customSceneStyle, animationEnabled && sceneStyle],
              children: descriptor.render()
            })
          })
        }, route.key);
      })
    }, "screens"), tabBarPosition === 'bottom' || tabBarPosition === 'right' ? tabBarElement : null]
  });
}
const BottomTabView_styles = StyleSheet/* default */.A.create({
  screens: {
    flex: 1,
    overflow: 'hidden'
  }
});
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/navigators/createBottomTabNavigator.js





function BottomTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  ...rest
}) {
  const {
    state,
    descriptors,
    navigation,
    NavigationContent
  } = (0,lib_module.useNavigationBuilder)(lib_module.TabRouter, {
    id,
    initialRouteName,
    backBehavior,
    UNSTABLE_routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router
  });
  return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContent, {
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(BottomTabView, {
      ...rest,
      state: state,
      navigation: navigation,
      descriptors: descriptors
    })
  });
}
function createBottomTabNavigator(config) {
  return (0,lib_module.createNavigatorFactory)(BottomTabNavigator)(config);
}
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/utils/useBottomTabBarHeight.js




function useBottomTabBarHeight() {
  const height = React.useContext(BottomTabBarHeightContext);
  if (height === undefined) {
    throw new Error("Couldn't find the bottom tab bar height. Are you inside a screen in Bottom Tab Navigator?");
  }
  return height;
}
;// ./node_modules/@react-navigation/bottom-tabs/lib/module/index.js






/**
 * Transition Presets
 */


/**
 * Navigators
 */


/**
 * Views
 */



/**
 * Utilities
 */




/**
 * Types
 */

/***/ },

/***/ 6368
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

/***/ 6413
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8168);
/* harmony import */ var _babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8587);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6540);
/* harmony import */ var _modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1804);
/* harmony import */ var _modules_usePressEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6533);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3999);
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9176);
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
    rest = (0,_babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A)(props, _excluded);
  var hostRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  var setRef = (0,_modules_useMergeRefs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(forwardedRef, hostRef);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)('0s'),
    duration = _useState[0],
    setDuration = _useState[1];
  var _useState2 = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null),
    opacityOverride = _useState2[0],
    setOpacityOverride = _useState2[1];
  var setOpacityTo = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)((value, duration) => {
    setOpacityOverride(value);
    setDuration(duration ? duration / 1000 + "s" : '0s');
  }, [setOpacityOverride, setDuration]);
  var setOpacityActive = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(duration => {
    setOpacityTo(activeOpacity !== null && activeOpacity !== void 0 ? activeOpacity : 0.2, duration);
  }, [activeOpacity, setOpacityTo]);
  var setOpacityInactive = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(duration => {
    setOpacityTo(null, duration);
  }, [setOpacityTo]);
  var pressConfig = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
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
  var pressEventHandlers = (0,_modules_usePressEvents__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A)(hostRef, pressConfig);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_View__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)({}, rest, pressEventHandlers, {
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
var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A.create({
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
var MemoedTouchableOpacity = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.memo(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.forwardRef(TouchableOpacity));
MemoedTouchableOpacity.displayName = 'TouchableOpacity';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MemoedTouchableOpacity);

/***/ },

/***/ 6430
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ exports_Modal)
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(8168);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(8587);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(961);
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
var StyleSheet = __webpack_require__(3999);
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
var styles = StyleSheet/* default */.A.create({
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
  return /*#__PURE__*/react.createElement(View/* default */.A, (0,esm_extends/* default */.A)({}, rest, {
    "aria-modal": true,
    ref: forwardedRef,
    role: active ? 'dialog' : null,
    style: style
  }), /*#__PURE__*/react.createElement(View/* default */.A, {
    style: ModalContent_styles.container
  }, children));
});
var ModalContent_styles = StyleSheet/* default */.A.create({
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
              UIManager/* default */.A.focus(trapElementRef.current);
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
          UIManager/* default */.A.focus(lastFocusedElementOutsideTrap);
        }
      };
    }
  }, []);
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(FocusBracket, null), /*#__PURE__*/react.createElement(View/* default */.A, {
    ref: trapElementRef
  }, children), /*#__PURE__*/react.createElement(FocusBracket, null));
};
/* harmony default export */ const Modal_ModalFocusTrap = (ModalFocusTrap);
var ModalFocusTrap_styles = StyleSheet/* default */.A.create({
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

/***/ 6533
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ usePressEvents)
});

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
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
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

/***/ },

/***/ 6663
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

const strictUriEncode = __webpack_require__(4280);
const decodeComponent = __webpack_require__(454);
const splitOnFirst = __webpack_require__(528);
const filterObject = __webpack_require__(3055);

const isNullOrUndefined = value => value === null || value === undefined;

const encodeFragmentIdentifier = Symbol('encodeFragmentIdentifier');

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;

				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'colon-list-separator':
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), ':list='].join('')];
				}

				return [...result, [encode(key, options), ':list=', encode(value, options)].join('')];
			};

		case 'comma':
		case 'separator':
		case 'bracket-separator': {
			const keyValueSep = options.arrayFormat === 'bracket-separator' ?
				'[]=' :
				'=';

			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				// Translate null to an empty string so that it doesn't serialize as 'null'
				value = value === null ? '' : value;

				if (result.length === 0) {
					return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}

		default:
			return key => (result, value) => {
				if (
					value === undefined ||
					(options.skipNull && value === null) ||
					(options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'colon-list-separator':
			return (key, value, accumulator) => {
				result = /(:list)$/.exec(key);
				key = key.replace(/:list$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
		case 'separator':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.includes(options.arrayFormatSeparator);
				const isEncodedArray = (typeof value === 'string' && !isArray && decode(value, options).includes(options.arrayFormatSeparator));
				value = isEncodedArray ? decode(value, options) : value;
				const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map(item => decode(item, options)) : value === null ? value : decode(value, options);
				accumulator[key] = newValue;
			};

		case 'bracket-separator':
			return (key, value, accumulator) => {
				const isArray = /(\[\])$/.test(key);
				key = key.replace(/\[\]$/, '');

				if (!isArray) {
					accumulator[key] = value ? decode(value, options) : value;
					return;
				}

				const arrayValue = value === null ?
					[] :
					value.split(options.arrayFormatSeparator).map(item => decode(item, options));

				if (accumulator[key] === undefined) {
					accumulator[key] = arrayValue;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], arrayValue);
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function validateArrayFormatSeparator(value) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function getHash(url) {
	let hash = '';
	const hashStart = url.indexOf('#');
	if (hashStart !== -1) {
		hash = url.slice(hashStart);
	}

	return hash;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(query, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof query !== 'string') {
		return ret;
	}

	query = query.trim().replace(/^[?#&]/, '');

	if (!query) {
		return ret;
	}

	for (const param of query.split('&')) {
		if (param === '') {
			continue;
		}

		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : ['comma', 'separator', 'bracket-separator'].includes(options.arrayFormat) ? value : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ','
	}, options);

	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = key => (
		(options.skipNull && isNullOrUndefined(object[key])) ||
		(options.skipEmptyString && object[key] === '')
	);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = {};

	for (const key of Object.keys(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = object[key];
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
				return encode(key, options) + '[]';
			}

			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (url, options) => {
	options = Object.assign({
		decode: true
	}, options);

	const [url_, hash] = splitOnFirst(url, '#');

	return Object.assign(
		{
			url: url_.split('?')[0] || '',
			query: parse(extract(url), options)
		},
		options && options.parseFragmentIdentifier && hash ? {fragmentIdentifier: decode(hash, options)} : {}
	);
};

exports.stringifyUrl = (object, options) => {
	options = Object.assign({
		encode: true,
		strict: true,
		[encodeFragmentIdentifier]: true
	}, options);

	const url = removeHash(object.url).split('?')[0] || '';
	const queryFromUrl = exports.extract(object.url);
	const parsedQueryFromUrl = exports.parse(queryFromUrl, {sort: false});

	const query = Object.assign(parsedQueryFromUrl, object.query);
	let queryString = exports.stringify(query, options);
	if (queryString) {
		queryString = `?${queryString}`;
	}

	let hash = getHash(object.url);
	if (object.fragmentIdentifier) {
		hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
	}

	return `${url}${queryString}${hash}`;
};

exports.pick = (input, filter, options) => {
	options = Object.assign({
		parseFragmentIdentifier: true,
		[encodeFragmentIdentifier]: false
	}, options);

	const {url, query, fragmentIdentifier} = exports.parseUrl(input, options);
	return exports.stringifyUrl({
		url,
		query: filterObject(query, filter),
		fragmentIdentifier
	}, options);
};

exports.exclude = (input, filter, options) => {
	const exclusionFilter = Array.isArray(filter) ? key => !filter.includes(key) : (key, value) => !filter(key, value);

	return exports.pick(input, exclusionFilter, options);
};


/***/ },

/***/ 6864
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const isOptionObject = __webpack_require__(6368);

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

/***/ 6976
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var React = __webpack_require__(6540);
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

/***/ 7135
(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAADZ0lEQVR42u3bS0hUURzH8W+mzrKwpDJ6gb18VEJvo3da1CqoFrWICoIsWvROs1oELQpqUYsI2lRYFCFGVPR+U7QJalMU9NAMKzRC1NETSBDevwedOXPOnYnz+e0E/+f+7rlzZ+bC4Hme53melxz6pOKiw1hGHjmdGYziK7WdeUMNX0hqE6nkJUqbDl5QTgFJaTbPUL3MI2aSVPKpQcWYK4wjKUQ4SRQVR6IcJ4OQDeIJyiD3GUiIiviIMswHCgnJMn6jekgHqsf8opQQFKE//DpOsZIZjCCTCCOZwSpOU4/SpIkCHBvER80ZP8t0+gBSGsVUafbkPQNxKKJ56d5gEj2ZzG0UMvfIwJkTKJEW1tFbG2lFiRzFkTzkfb+eYmIxlwYxo5VcnKhGHv4oYjWa72LOBRyYhbx4ionHPNrELWAK1smX73ritUnMuoNlBWLJm5h4IOblYlW52PQiTEwXBbZh1YvAcucwdTkw8SEWDRXvozMxNT8wsZ1srNkobp9pmErnR2DqWqw5FljqNIlwNjD1MIbS0Mmhq1uYk1Ny3BX4RCJ8Dq9AHYlQS1dDbBWQo2stFLC6A8rCg0Oxns2BdQk8V/p9rTcu4GSz9VO+uiswnEQYFt4OLCIRSsSFaq3Aa/FkqC+mMllCV4+wZrD4MDcbUyXiiWl/LHoaWO4Spq4GJj7Gql2oQKZhYo6YV4lVY5HPl008E98GxmDZXVFhC/HaIWZVYd1UsWiUhcRjKe3iG3YhDlwUFX4wnlgV0ijmVONELm1i6Z8sivHsy8NvJh9HjqBEomyN4dpvR4lswZl0zSPyJ8yiJ3N5jkLmKk5l8Q7VbaopIQOQMlnMNc1/fSMbx/JoRGnSSBXrKaWQLAYwgVI2cJEmlDZtrCZChEwcWoCsYJ6DODSetyjD1NMaZoUsbqEMUkM2K8RfD+BQOodpQcWRZjb/naDCrQCjOEcHKoZ0cIV8EAVCqwBF3ET1KlHOU8A/fVHdZj/OjWQrd4miv1k+pILRBO0Ls4KUxRoOcYbrvKKBBl5zh/McZTn90KnQVKgk2fzPFco1Ffb5Cg7t1VSo8BUc2qOpUO4rOLRbU2Gvr+DQLk2FPb6CQzs1FXaneoUyUsiO1D58WaGMFLRdHH6KVigjhW2jzP8szPM8z/M8z0t2fwDen7r/jhTzQwAAAABJRU5ErkJggg=="

/***/ },

/***/ 7147
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_src_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6976);
// eslint-disable-next-line import/extensions


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_lib_src_index_js__WEBPACK_IMPORTED_MODULE_0__);


/***/ },

/***/ 7170
(module) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAACTElEQVR42sWZTYoaQRiGH2kR4hEUc4QIGjBnUEEPoDPLqCfQO8REdwq61+1oDqBewAGz0MUszd5FHGfzZTZSJDRVdnW39T5b4X2hy6rvh8BKU6XHkDlrDpzeObBmzpAeVdLEqI+0+ckZ0XBmSYscEStFh2ckAM90SBGJPJq8IBa80MQjlBLU2SEh2FEngaWybJAI2JDFQl84IhFxpERAPXJBIuTCIzcryQ8kBvokb7NfIDHxdEuE70iM9M3fXmLmQX/yL0jMvFICf2X5jdyBIxl8lGCD3ImN3+1YR+5Ijf/k8Qu5Izs8/lFTe4uN+ESRCW8IZt6YUCDPSHukG6CU0j64I64qc8F86Za5aqx9rFNwVQfRkAefCGZ7yCMaOlxlqHaK4BPBbA+fEQ1bVeuJlgn4RDDbwxTRkgOAtvFQlX0imO3LxkPbAoCl+WBpImh/YWABkOaM2EWwtFecSUMVQWwjWNorKtBDwkSwsld0YYiEiWBlrxjAHAkTwcpeMYM1YhnB3l6xggNiGcHeXrGHE2IZwd5ecXIewPkncH4Inf8NnV9Ezq9i54+R2+f4Dx+cFyTuSzL3Ram5LC9Yl+VFfVnuvDFx3prd3pyOyVNkenNzOqVAnvHtzSl47Jy25+4HFLgf0UCWo6MhlfsxnftBpftRrVKSJ7fDakjSR2LgG0l3C4tXHgiokquVjVImsqVVBkslqIVe29VIEEoeDevFZQMvutXtFgnAljYpIlaOFkvj8nrBV3LEqDQVugyYsWLP6Z09K2YM6FIJvr7/C289zVf6dsfbAAAAAElFTkSuQmCC"

/***/ },

/***/ 7290
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

/***/ 7397
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BaseNavigationContainer: () => (/* reexport */ BaseNavigationContainer),
  BaseRouter: () => (/* reexport */ BaseRouter),
  CommonActions: () => (/* reexport */ CommonActions_namespaceObject),
  CurrentRenderContext: () => (/* reexport */ CurrentRenderContext),
  DarkTheme: () => (/* reexport */ DarkTheme),
  DefaultTheme: () => (/* reexport */ DefaultTheme),
  DrawerActions: () => (/* reexport */ DrawerActions),
  DrawerRouter: () => (/* reexport */ DrawerRouter),
  Link: () => (/* reexport */ Link),
  LinkingContext: () => (/* reexport */ LinkingContext),
  LocaleDirContext: () => (/* reexport */ LocaleDirContext),
  NavigationContainer: () => (/* reexport */ NavigationContainer),
  NavigationContainerRefContext: () => (/* reexport */ NavigationContainerRefContext),
  NavigationContext: () => (/* reexport */ NavigationContext),
  NavigationHelpersContext: () => (/* reexport */ NavigationHelpersContext),
  NavigationIndependentTree: () => (/* reexport */ NavigationIndependentTree),
  NavigationMetaContext: () => (/* reexport */ NavigationMetaContext),
  NavigationRouteContext: () => (/* reexport */ NavigationRouteContext),
  PreventRemoveContext: () => (/* reexport */ PreventRemoveContext),
  PreventRemoveProvider: () => (/* reexport */ PreventRemoveProvider),
  PrivateValueStore: () => (/* reexport */ PrivateValueStore),
  ServerContainer: () => (/* reexport */ ServerContainer),
  StackActions: () => (/* reexport */ StackActions),
  StackRouter: () => (/* reexport */ StackRouter),
  TabActions: () => (/* reexport */ TabActions),
  TabRouter: () => (/* reexport */ TabRouter),
  ThemeContext: () => (/* reexport */ ThemeContext),
  ThemeProvider: () => (/* reexport */ ThemeProvider),
  UNSTABLE_UnhandledLinkingContext: () => (/* reexport */ UnhandledLinkingContext),
  createComponentForStaticNavigation: () => (/* reexport */ createComponentForStaticNavigation),
  createNavigationContainerRef: () => (/* reexport */ createNavigationContainerRef),
  createNavigatorFactory: () => (/* reexport */ createNavigatorFactory),
  createPathConfigForStaticNavigation: () => (/* reexport */ createPathConfigForStaticNavigation),
  createStaticNavigation: () => (/* reexport */ createStaticNavigation),
  findFocusedRoute: () => (/* reexport */ findFocusedRoute),
  getActionFromState: () => (/* reexport */ getActionFromState_getActionFromState),
  getFocusedRouteNameFromRoute: () => (/* reexport */ getFocusedRouteNameFromRoute),
  getPathFromState: () => (/* reexport */ getPathFromState_getPathFromState),
  getStateFromPath: () => (/* reexport */ getStateFromPath_getStateFromPath),
  useFocusEffect: () => (/* reexport */ useFocusEffect),
  useIsFocused: () => (/* reexport */ useIsFocused),
  useLinkBuilder: () => (/* reexport */ useLinkBuilder),
  useLinkProps: () => (/* reexport */ useLinkProps),
  useLinkTo: () => (/* reexport */ useLinkTo),
  useLocale: () => (/* reexport */ useLocale),
  useNavigation: () => (/* reexport */ useNavigation),
  useNavigationBuilder: () => (/* reexport */ useNavigationBuilder),
  useNavigationContainerRef: () => (/* reexport */ useNavigationContainerRef),
  useNavigationIndependentTree: () => (/* reexport */ useNavigationIndependentTree),
  useNavigationState: () => (/* reexport */ useNavigationState),
  usePreventRemove: () => (/* reexport */ usePreventRemove),
  usePreventRemoveContext: () => (/* reexport */ usePreventRemoveContext),
  useRoute: () => (/* reexport */ useRoute),
  useRoutePath: () => (/* reexport */ useRoutePath),
  useScrollToTop: () => (/* reexport */ useScrollToTop),
  useStateForPath: () => (/* reexport */ useStateForPath),
  useTheme: () => (/* reexport */ useTheme),
  validatePathConfig: () => (/* reexport */ validatePathConfig)
});

// NAMESPACE OBJECT: ./node_modules/@react-navigation/routers/lib/module/CommonActions.js
var CommonActions_namespaceObject = {};
__webpack_require__.r(CommonActions_namespaceObject);
__webpack_require__.d(CommonActions_namespaceObject, {
  goBack: () => (goBack),
  navigate: () => (CommonActions_navigate),
  navigateDeprecated: () => (navigateDeprecated),
  preload: () => (preload),
  replaceParams: () => (replaceParams),
  reset: () => (CommonActions_reset),
  setParams: () => (setParams)
});

;// ./node_modules/@react-navigation/routers/lib/module/CommonActions.js


function goBack() {
  return {
    type: 'GO_BACK'
  };
}
function CommonActions_navigate(...args) {
  if (typeof args[0] === 'string') {
    const [name, params, options] = args;
    if (typeof options === 'boolean') {
      console.warn(`Passing a boolean as the third argument to 'navigate' is deprecated. Pass '{ merge: true }' instead.`);
    }
    return {
      type: 'NAVIGATE',
      payload: {
        name,
        params,
        merge: typeof options === 'boolean' ? options : options?.merge,
        pop: options?.pop
      }
    };
  } else {
    const payload = args[0] || {};
    if (!('name' in payload)) {
      throw new Error('You need to specify a name when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigate for usage.');
    }
    return {
      type: 'NAVIGATE',
      payload
    };
  }
}
function navigateDeprecated(...args) {
  if (typeof args[0] === 'string') {
    return {
      type: 'NAVIGATE_DEPRECATED',
      payload: {
        name: args[0],
        params: args[1]
      }
    };
  } else {
    const payload = args[0] || {};
    if (!('name' in payload)) {
      throw new Error('You need to specify a name when calling navigateDeprecated with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigatelegacy for usage.');
    }
    return {
      type: 'NAVIGATE_DEPRECATED',
      payload
    };
  }
}
function CommonActions_reset(state) {
  return {
    type: 'RESET',
    payload: state
  };
}
function setParams(params) {
  return {
    type: 'SET_PARAMS',
    payload: {
      params
    }
  };
}
function replaceParams(params) {
  return {
    type: 'REPLACE_PARAMS',
    payload: {
      params
    }
  };
}
function preload(name, params) {
  return {
    type: 'PRELOAD',
    payload: {
      name,
      params
    }
  };
}
;// ./node_modules/nanoid/non-secure/index.js
let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size | 0
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size | 0
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}


;// ./node_modules/@react-navigation/routers/lib/module/BaseRouter.js



/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
const BaseRouter = {
  getStateForAction(state, action) {
    switch (action.type) {
      case 'SET_PARAMS':
      case 'REPLACE_PARAMS':
        {
          const index = action.source ? state.routes.findIndex(r => r.key === action.source) : state.index;
          if (index === -1) {
            return null;
          }
          return {
            ...state,
            routes: state.routes.map((r, i) => i === index ? {
              ...r,
              params: action.type === 'REPLACE_PARAMS' ? action.payload.params : {
                ...r.params,
                ...action.payload.params
              }
            } : r)
          };
        }
      case 'RESET':
        {
          const nextState = action.payload;
          if (nextState.routes.length === 0 || nextState.routes.some(route => !state.routeNames.includes(route.name))) {
            return null;
          }
          if (nextState.stale === false) {
            if (state.routeNames.length !== nextState.routeNames.length || nextState.routeNames.some(name => !state.routeNames.includes(name))) {
              return null;
            }
            return {
              ...nextState,
              routes: nextState.routes.map(route => route.key ? route : {
                ...route,
                key: `${route.name}-${nanoid()}`
              })
            };
          }
          return nextState;
        }
      default:
        return null;
    }
  },
  shouldActionChangeFocus(action) {
    return action.type === 'NAVIGATE' || action.type === 'NAVIGATE_DEPRECATED';
  }
};
;// ./node_modules/@react-navigation/routers/lib/module/createParamsFromAction.js


function createParamsFromAction({
  action,
  routeParamList
}) {
  const {
    name,
    params
  } = action.payload;
  return routeParamList[name] !== undefined ? {
    ...routeParamList[name],
    ...params
  } : params;
}
;// ./node_modules/@react-navigation/routers/lib/module/TabRouter.js





const TYPE_ROUTE = 'route';
const TabActions = {
  jumpTo(name, params) {
    return {
      type: 'JUMP_TO',
      payload: {
        name,
        params
      }
    };
  }
};
const getRouteHistory = (routes, index, backBehavior, initialRouteName) => {
  const history = [{
    type: TYPE_ROUTE,
    key: routes[index].key
  }];
  let initialRouteIndex;
  switch (backBehavior) {
    case 'order':
      for (let i = index; i > 0; i--) {
        history.unshift({
          type: TYPE_ROUTE,
          key: routes[i - 1].key
        });
      }
      break;
    case 'firstRoute':
      if (index !== 0) {
        history.unshift({
          type: TYPE_ROUTE,
          key: routes[0].key
        });
      }
      break;
    case 'initialRoute':
      initialRouteIndex = routes.findIndex(route => route.name === initialRouteName);
      initialRouteIndex = initialRouteIndex === -1 ? 0 : initialRouteIndex;
      if (index !== initialRouteIndex) {
        history.unshift({
          type: TYPE_ROUTE,
          key: routes[initialRouteIndex].key
        });
      }
      break;
    case 'history':
    case 'fullHistory':
      // The history will fill up on navigation
      break;
  }
  return history;
};
const changeIndex = (state, index, backBehavior, initialRouteName) => {
  let history = state.history;
  if (backBehavior === 'history' || backBehavior === 'fullHistory') {
    const currentRoute = state.routes[index];
    if (backBehavior === 'history') {
      // Remove the existing key from the history to de-duplicate it
      history = history.filter(it => it.type === 'route' ? it.key !== currentRoute.key : false);
    } else if (backBehavior === 'fullHistory') {
      const lastHistoryRouteItemIndex = history.findLastIndex(item => item.type === 'route');
      if (currentRoute.key === history[lastHistoryRouteItemIndex]?.key) {
        // For full-history, only remove if it matches the last route
        // Useful for drawer, if current route was in history, then drawer state changed
        // Then we only need to move the route to the front
        history = [...history.slice(0, lastHistoryRouteItemIndex), ...history.slice(lastHistoryRouteItemIndex + 1)];
      }
    }
    history = history.concat({
      type: TYPE_ROUTE,
      key: currentRoute.key,
      params: backBehavior === 'fullHistory' ? currentRoute.params : undefined
    });
  } else {
    history = getRouteHistory(state.routes, index, backBehavior, initialRouteName);
  }
  return {
    ...state,
    index,
    history
  };
};
function TabRouter({
  initialRouteName,
  backBehavior = 'firstRoute'
}) {
  const router = {
    ...BaseRouter,
    type: 'tab',
    getInitialState({
      routeNames,
      routeParamList
    }) {
      const index = initialRouteName !== undefined && routeNames.includes(initialRouteName) ? routeNames.indexOf(initialRouteName) : 0;
      const routes = routeNames.map(name => ({
        name,
        key: `${name}-${nanoid()}`,
        params: routeParamList[name]
      }));
      const history = getRouteHistory(routes, index, backBehavior, initialRouteName);
      return {
        stale: false,
        type: 'tab',
        key: `tab-${nanoid()}`,
        index,
        routeNames,
        history,
        routes,
        preloadedRouteKeys: []
      };
    },
    getRehydratedState(partialState, {
      routeNames,
      routeParamList
    }) {
      const state = partialState;
      if (state.stale === false) {
        return state;
      }
      const routes = routeNames.map(name => {
        const route = state.routes.find(r => r.name === name);
        return {
          ...route,
          name,
          key: route && route.name === name && route.key ? route.key : `${name}-${nanoid()}`,
          params: routeParamList[name] !== undefined ? {
            ...routeParamList[name],
            ...(route ? route.params : undefined)
          } : route ? route.params : undefined
        };
      });
      const index = Math.min(Math.max(routeNames.indexOf(state.routes[state?.index ?? 0]?.name), 0), routes.length - 1);
      const routeKeys = routes.map(route => route.key);
      const history = state.history?.filter(it => routeKeys.includes(it.key)) ?? [];
      return changeIndex({
        stale: false,
        type: 'tab',
        key: `tab-${nanoid()}`,
        index,
        routeNames,
        history,
        routes,
        preloadedRouteKeys: state.preloadedRouteKeys?.filter(key => routeKeys.includes(key)) ?? []
      }, index, backBehavior, initialRouteName);
    },
    getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList,
      routeKeyChanges
    }) {
      const routes = routeNames.map(name => state.routes.find(r => r.name === name && !routeKeyChanges.includes(r.name)) || {
        name,
        key: `${name}-${nanoid()}`,
        params: routeParamList[name]
      });
      const index = Math.max(0, routeNames.indexOf(state.routes[state.index].name));
      let history = state.history.filter(
      // Type will always be 'route' for tabs, but could be different in a router extending this (e.g. drawer)
      it => it.type !== 'route' || routes.find(r => r.key === it.key));
      if (!history.length) {
        history = getRouteHistory(routes, index, backBehavior, initialRouteName);
      }
      return {
        ...state,
        history,
        routeNames,
        routes,
        index
      };
    },
    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);
      if (index === -1 || index === state.index) {
        return state;
      }
      return changeIndex(state, index, backBehavior, initialRouteName);
    },
    getStateForAction(state, action, {
      routeParamList,
      routeGetIdList
    }) {
      switch (action.type) {
        case 'JUMP_TO':
        case 'NAVIGATE':
        case 'NAVIGATE_DEPRECATED':
          {
            const index = state.routes.findIndex(route => route.name === action.payload.name);
            if (index === -1) {
              return null;
            }
            const updatedState = changeIndex({
              ...state,
              routes: state.routes.map(route => {
                if (route.name !== action.payload.name) {
                  return route;
                }
                const getId = routeGetIdList[route.name];
                const currentId = getId?.({
                  params: route.params
                });
                const nextId = getId?.({
                  params: action.payload.params
                });
                const key = currentId === nextId ? route.key : `${route.name}-${nanoid()}`;
                let params;
                if ((action.type === 'NAVIGATE' || action.type === 'NAVIGATE_DEPRECATED') && action.payload.merge && currentId === nextId) {
                  params = action.payload.params !== undefined || routeParamList[route.name] !== undefined ? {
                    ...routeParamList[route.name],
                    ...route.params,
                    ...action.payload.params
                  } : route.params;
                } else {
                  params = createParamsFromAction({
                    action,
                    routeParamList
                  });
                }
                const path = action.type === 'NAVIGATE' && action.payload.path != null ? action.payload.path : route.path;
                return params !== route.params || path !== route.path ? {
                  ...route,
                  key,
                  path,
                  params
                } : route;
              })
            }, index, backBehavior, initialRouteName);
            return {
              ...updatedState,
              preloadedRouteKeys: updatedState.preloadedRouteKeys.filter(key => key !== state.routes[updatedState.index].key)
            };
          }
        case 'SET_PARAMS':
        case 'REPLACE_PARAMS':
          {
            const nextState = BaseRouter.getStateForAction(state, action);
            if (nextState !== null) {
              const index = nextState.index;
              if (index != null) {
                const focusedRoute = nextState.routes[index];
                const historyItemIndex = state.history.findLastIndex(item => item.key === focusedRoute.key);
                let updatedHistory = state.history;
                if (historyItemIndex !== -1) {
                  updatedHistory = [...state.history];
                  updatedHistory[historyItemIndex] = {
                    ...updatedHistory[historyItemIndex],
                    params: focusedRoute.params
                  };
                }
                return {
                  ...nextState,
                  history: updatedHistory
                };
              }
            }
            return nextState;
          }
        case 'GO_BACK':
          {
            if (state.history.length === 1) {
              return null;
            }
            const previousHistoryItem = state.history[state.history.length - 2];
            const previousKey = previousHistoryItem?.key;
            const index = state.routes.findLastIndex(route => route.key === previousKey);
            if (index === -1) {
              return null;
            }
            let routes = state.routes;
            if (backBehavior === 'fullHistory' && routes[index].params !== previousHistoryItem.params) {
              routes = [...state.routes];
              routes[index] = {
                ...routes[index],
                params: previousHistoryItem.params
              };
            }
            return {
              ...state,
              routes,
              preloadedRouteKeys: state.preloadedRouteKeys.filter(key => key !== state.routes[index].key),
              history: state.history.slice(0, -1),
              index
            };
          }
        case 'PRELOAD':
          {
            const routeIndex = state.routes.findIndex(route => route.name === action.payload.name);
            if (routeIndex === -1) {
              return null;
            }
            const route = state.routes[routeIndex];
            const getId = routeGetIdList[route.name];
            const currentId = getId?.({
              params: route.params
            });
            const nextId = getId?.({
              params: action.payload.params
            });
            const key = currentId === nextId ? route.key : `${route.name}-${nanoid()}`;
            const params = createParamsFromAction({
              action,
              routeParamList
            });
            const newRoute = params !== route.params ? {
              ...route,
              key,
              params
            } : route;
            return {
              ...state,
              preloadedRouteKeys: state.preloadedRouteKeys.filter(key => key !== route.key).concat(newRoute.key),
              routes: state.routes.map((route, index) => index === routeIndex ? newRoute : route),
              history: key === route.key ? state.history : state.history.filter(record => record.key !== route.key)
            };
          }
        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },
    actionCreators: TabActions
  };
  return router;
}
;// ./node_modules/@react-navigation/routers/lib/module/DrawerRouter.js




const DrawerActions = {
  ...TabActions,
  openDrawer() {
    return {
      type: 'OPEN_DRAWER'
    };
  },
  closeDrawer() {
    return {
      type: 'CLOSE_DRAWER'
    };
  },
  toggleDrawer() {
    return {
      type: 'TOGGLE_DRAWER'
    };
  }
};
function DrawerRouter({
  defaultStatus = 'closed',
  ...rest
}) {
  const router = TabRouter(rest);
  const isDrawerInHistory = state => Boolean(state.history?.some(it => it.type === 'drawer'));
  const addDrawerToHistory = state => {
    if (isDrawerInHistory(state)) {
      return state;
    }
    return {
      ...state,
      history: [...state.history, {
        type: 'drawer',
        status: defaultStatus === 'open' ? 'closed' : 'open'
      }]
    };
  };
  const removeDrawerFromHistory = state => {
    if (!isDrawerInHistory(state)) {
      return state;
    }
    return {
      ...state,
      history: state.history.filter(it => it.type !== 'drawer')
    };
  };
  const openDrawer = state => {
    if (defaultStatus === 'open') {
      return removeDrawerFromHistory(state);
    }
    return addDrawerToHistory(state);
  };
  const closeDrawer = state => {
    if (defaultStatus === 'open') {
      return addDrawerToHistory(state);
    }
    return removeDrawerFromHistory(state);
  };
  return {
    ...router,
    type: 'drawer',
    getInitialState({
      routeNames,
      routeParamList,
      routeGetIdList
    }) {
      const state = router.getInitialState({
        routeNames,
        routeParamList,
        routeGetIdList
      });
      return {
        ...state,
        default: defaultStatus,
        stale: false,
        type: 'drawer',
        key: `drawer-${nanoid()}`
      };
    },
    getRehydratedState(partialState, {
      routeNames,
      routeParamList,
      routeGetIdList
    }) {
      if (partialState.stale === false) {
        return partialState;
      }
      let state = router.getRehydratedState(partialState, {
        routeNames,
        routeParamList,
        routeGetIdList
      });
      if (isDrawerInHistory(partialState)) {
        // Re-sync the drawer entry in history to correct it if it was wrong
        state = removeDrawerFromHistory(state);
        state = addDrawerToHistory(state);
      }
      return {
        ...state,
        default: defaultStatus,
        type: 'drawer',
        key: `drawer-${nanoid()}`
      };
    },
    getStateForRouteFocus(state, key) {
      const result = router.getStateForRouteFocus(state, key);
      return closeDrawer(result);
    },
    getStateForAction(state, action, options) {
      switch (action.type) {
        case 'OPEN_DRAWER':
          return openDrawer(state);
        case 'CLOSE_DRAWER':
          return closeDrawer(state);
        case 'TOGGLE_DRAWER':
          if (isDrawerInHistory(state)) {
            return removeDrawerFromHistory(state);
          }
          return addDrawerToHistory(state);
        case 'JUMP_TO':
        case 'NAVIGATE':
        case 'NAVIGATE_DEPRECATED':
          {
            const result = router.getStateForAction(state, action, options);
            if (result != null && result.index !== state.index) {
              return closeDrawer(result);
            }
            return result;
          }
        case 'GO_BACK':
          if (isDrawerInHistory(state)) {
            return removeDrawerFromHistory(state);
          }
          return router.getStateForAction(state, action, options);
        default:
          return router.getStateForAction(state, action, options);
      }
    },
    actionCreators: DrawerActions
  };
}
;// ./node_modules/@react-navigation/routers/lib/module/createRouteFromAction.js




function createRouteFromAction({
  action,
  routeParamList
}) {
  const {
    name
  } = action.payload;
  return {
    key: `${name}-${nanoid()}`,
    name,
    params: createParamsFromAction({
      action,
      routeParamList
    })
  };
}
;// ./node_modules/@react-navigation/routers/lib/module/StackRouter.js






const StackActions = {
  replace(name, params) {
    return {
      type: 'REPLACE',
      payload: {
        name,
        params
      }
    };
  },
  push(name, params) {
    return {
      type: 'PUSH',
      payload: {
        name,
        params
      }
    };
  },
  pop(count = 1) {
    return {
      type: 'POP',
      payload: {
        count
      }
    };
  },
  popToTop() {
    return {
      type: 'POP_TO_TOP'
    };
  },
  popTo(name, params, options) {
    if (typeof options === 'boolean') {
      console.warn(`Passing a boolean as the third argument to 'popTo' is deprecated. Pass '{ merge: true }' instead.`);
    }
    return {
      type: 'POP_TO',
      payload: {
        name,
        params,
        merge: typeof options === 'boolean' ? options : options?.merge
      }
    };
  }
};
function StackRouter(options) {
  const router = {
    ...BaseRouter,
    type: 'stack',
    getInitialState({
      routeNames,
      routeParamList
    }) {
      const initialRouteName = options.initialRouteName !== undefined && routeNames.includes(options.initialRouteName) ? options.initialRouteName : routeNames[0];
      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: 0,
        routeNames,
        preloadedRoutes: [],
        routes: [{
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        }]
      };
    },
    getRehydratedState(partialState, {
      routeNames,
      routeParamList
    }) {
      const state = partialState;
      if (state.stale === false) {
        return state;
      }
      const routes = state.routes.filter(route => routeNames.includes(route.name)).map(route => ({
        ...route,
        key: route.key || `${route.name}-${nanoid()}`,
        params: routeParamList[route.name] !== undefined ? {
          ...routeParamList[route.name],
          ...route.params
        } : route.params
      }));
      const preloadedRoutes = state.preloadedRoutes?.filter(route => routeNames.includes(route.name)).map(route => ({
        ...route,
        key: route.key || `${route.name}-${nanoid()}`,
        params: routeParamList[route.name] !== undefined ? {
          ...routeParamList[route.name],
          ...route.params
        } : route.params
      })) ?? [];
      if (routes.length === 0) {
        const initialRouteName = options.initialRouteName !== undefined ? options.initialRouteName : routeNames[0];
        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        });
      }
      return {
        stale: false,
        type: 'stack',
        key: `stack-${nanoid()}`,
        index: routes.length - 1,
        routeNames,
        routes,
        preloadedRoutes
      };
    },
    getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList,
      routeKeyChanges
    }) {
      const routes = state.routes.filter(route => routeNames.includes(route.name) && !routeKeyChanges.includes(route.name));
      if (routes.length === 0) {
        const initialRouteName = options.initialRouteName !== undefined && routeNames.includes(options.initialRouteName) ? options.initialRouteName : routeNames[0];
        routes.push({
          key: `${initialRouteName}-${nanoid()}`,
          name: initialRouteName,
          params: routeParamList[initialRouteName]
        });
      }
      return {
        ...state,
        routeNames,
        routes,
        index: Math.min(state.index, routes.length - 1)
      };
    },
    getStateForRouteFocus(state, key) {
      const index = state.routes.findIndex(r => r.key === key);
      if (index === -1 || index === state.index) {
        return state;
      }
      return {
        ...state,
        index,
        routes: state.routes.slice(0, index + 1)
      };
    },
    getStateForAction(state, action, options) {
      const {
        routeParamList
      } = options;
      switch (action.type) {
        case 'REPLACE':
          {
            const currentIndex = action.target === state.key && action.source ? state.routes.findIndex(r => r.key === action.source) : state.index;
            if (currentIndex === -1) {
              return null;
            }
            if (!state.routeNames.includes(action.payload.name)) {
              return null;
            }
            const getId = options.routeGetIdList[action.payload.name];
            const id = getId?.({
              params: action.payload.params
            });

            // Re-use preloaded route if available
            let route = state.preloadedRoutes.find(route => route.name === action.payload.name && id === getId?.({
              params: route.params
            }));
            if (!route) {
              route = createRouteFromAction({
                action,
                routeParamList
              });
            }
            return {
              ...state,
              routes: state.routes.map((r, i) => i === currentIndex ? route : r),
              preloadedRoutes: state.preloadedRoutes.filter(r => r.key !== route.key)
            };
          }
        case 'PUSH':
        case 'NAVIGATE':
          {
            if (!state.routeNames.includes(action.payload.name)) {
              return null;
            }
            const getId = options.routeGetIdList[action.payload.name];
            const id = getId?.({
              params: action.payload.params
            });
            let route;
            if (id !== undefined) {
              route = state.routes.findLast(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
            } else if (action.type === 'NAVIGATE') {
              const currentRoute = state.routes[state.index];

              // If the route matches the current one, then navigate to it
              if (action.payload.name === currentRoute.name) {
                route = currentRoute;
              } else if (action.payload.pop) {
                route = state.routes.findLast(route => route.name === action.payload.name);
              }
            }
            if (!route) {
              route = state.preloadedRoutes.find(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
            }
            let params;
            if (action.type === 'NAVIGATE' && action.payload.merge && route) {
              params = action.payload.params !== undefined || routeParamList[action.payload.name] !== undefined ? {
                ...routeParamList[action.payload.name],
                ...route.params,
                ...action.payload.params
              } : route.params;
            } else {
              params = createParamsFromAction({
                action,
                routeParamList
              });
            }
            let routes;
            if (route) {
              if (action.type === 'NAVIGATE' && action.payload.pop) {
                routes = [];

                // Get all routes until the matching one
                for (const r of state.routes) {
                  if (r.key === route.key) {
                    routes.push({
                      ...route,
                      path: action.payload.path !== undefined ? action.payload.path : route.path,
                      params
                    });
                    break;
                  }
                  routes.push(r);
                }
              } else {
                routes = state.routes.filter(r => r.key !== route.key);
                routes.push({
                  ...route,
                  path: action.type === 'NAVIGATE' && action.payload.path !== undefined ? action.payload.path : route.path,
                  params
                });
              }
            } else {
              routes = [...state.routes, {
                key: `${action.payload.name}-${nanoid()}`,
                name: action.payload.name,
                path: action.type === 'NAVIGATE' ? action.payload.path : undefined,
                params
              }];
            }
            return {
              ...state,
              index: routes.length - 1,
              preloadedRoutes: state.preloadedRoutes.filter(route => routes[routes.length - 1].key !== route.key),
              routes
            };
          }
        case 'NAVIGATE_DEPRECATED':
          {
            if (!state.routeNames.includes(action.payload.name)) {
              return null;
            }
            if (state.preloadedRoutes.find(route => route.name === action.payload.name && id === getId?.({
              params: route.params
            }))) {
              return null;
            }

            // If the route already exists, navigate to that
            let index = -1;
            const getId = options.routeGetIdList[action.payload.name];
            const id = getId?.({
              params: action.payload.params
            });
            if (id !== undefined) {
              index = state.routes.findIndex(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
            } else if (state.routes[state.index].name === action.payload.name) {
              index = state.index;
            } else {
              index = state.routes.findLastIndex(route => route.name === action.payload.name);
            }
            if (index === -1) {
              const routes = [...state.routes, createRouteFromAction({
                action,
                routeParamList
              })];
              return {
                ...state,
                routes,
                index: routes.length - 1
              };
            }
            const route = state.routes[index];
            let params;
            if (action.payload.merge) {
              params = action.payload.params !== undefined || routeParamList[route.name] !== undefined ? {
                ...routeParamList[route.name],
                ...route.params,
                ...action.payload.params
              } : route.params;
            } else {
              params = createParamsFromAction({
                action,
                routeParamList
              });
            }
            return {
              ...state,
              index,
              routes: [...state.routes.slice(0, index), params !== route.params ? {
                ...route,
                params
              } : state.routes[index]]
            };
          }
        case 'POP':
          {
            const currentIndex = action.target === state.key && action.source ? state.routes.findIndex(r => r.key === action.source) : state.index;
            if (currentIndex > 0) {
              const count = Math.max(currentIndex - action.payload.count + 1, 1);
              const routes = state.routes.slice(0, count).concat(state.routes.slice(currentIndex + 1));
              return {
                ...state,
                index: routes.length - 1,
                routes
              };
            }
            return null;
          }
        case 'POP_TO_TOP':
          return router.getStateForAction(state, {
            type: 'POP',
            payload: {
              count: state.routes.length - 1
            }
          }, options);
        case 'POP_TO':
          {
            const currentIndex = action.target === state.key && action.source ? state.routes.findLastIndex(r => r.key === action.source) : state.index;
            if (currentIndex === -1) {
              return null;
            }
            if (!state.routeNames.includes(action.payload.name)) {
              return null;
            }

            // If the route already exists, navigate to it
            let index = -1;
            const getId = options.routeGetIdList[action.payload.name];
            const id = getId?.({
              params: action.payload.params
            });
            if (id !== undefined) {
              index = state.routes.findIndex(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
            } else if (state.routes[currentIndex].name === action.payload.name) {
              index = currentIndex;
            } else {
              for (let i = currentIndex; i >= 0; i--) {
                if (state.routes[i].name === action.payload.name) {
                  index = i;
                  break;
                }
              }
            }

            // If the route doesn't exist, remove the current route and add the new one
            if (index === -1) {
              // Re-use preloaded route if available
              let route = state.preloadedRoutes.find(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
              if (!route) {
                route = createRouteFromAction({
                  action,
                  routeParamList
                });
              }
              const routes = state.routes.slice(0, currentIndex).concat(route);
              return {
                ...state,
                index: routes.length - 1,
                routes,
                preloadedRoutes: state.preloadedRoutes.filter(r => r.key !== route.key)
              };
            }
            const route = state.routes[index];
            let params;
            if (action.payload.merge) {
              params = action.payload.params !== undefined || routeParamList[route.name] !== undefined ? {
                ...routeParamList[route.name],
                ...route.params,
                ...action.payload.params
              } : route.params;
            } else {
              params = createParamsFromAction({
                action,
                routeParamList
              });
            }
            return {
              ...state,
              index,
              routes: [...state.routes.slice(0, index), params !== route.params ? {
                ...route,
                params
              } : state.routes[index]]
            };
          }
        case 'GO_BACK':
          if (state.index > 0) {
            return router.getStateForAction(state, {
              type: 'POP',
              payload: {
                count: 1
              },
              target: action.target,
              source: action.source
            }, options);
          }
          return null;
        case 'PRELOAD':
          {
            const getId = options.routeGetIdList[action.payload.name];
            const id = getId?.({
              params: action.payload.params
            });
            let route;
            if (id !== undefined) {
              route = state.routes.find(route => route.name === action.payload.name && id === getId?.({
                params: route.params
              }));
            }
            if (route) {
              return {
                ...state,
                routes: state.routes.map(r => {
                  if (r.key !== route?.key) {
                    return r;
                  }
                  return {
                    ...r,
                    params: createParamsFromAction({
                      action,
                      routeParamList
                    })
                  };
                })
              };
            } else {
              return {
                ...state,
                preloadedRoutes: state.preloadedRoutes.filter(r => r.name !== action.payload.name || id !== getId?.({
                  params: r.params
                })).concat(createRouteFromAction({
                  action,
                  routeParamList
                }))
              };
            }
          }
        default:
          return BaseRouter.getStateForAction(state, action);
      }
    },
    actionCreators: StackActions
  };
  return router;
}
;// ./node_modules/@react-navigation/routers/lib/module/index.js









// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/use-latest-callback/esm.mjs
var esm = __webpack_require__(7147);
;// ./node_modules/@react-navigation/core/lib/module/createNavigationContainerRef.js



const NOT_INITIALIZED_ERROR = "The 'navigation' object hasn't been initialized yet. This might happen if you don't have a navigator mounted, or if the navigator hasn't finished mounting. See https://reactnavigation.org/docs/navigating-without-navigation-prop#handling-initialization for more details.";
function createNavigationContainerRef() {
  const methods = [...Object.keys(CommonActions_namespaceObject), 'addListener', 'removeListener', 'resetRoot', 'dispatch', 'isFocused', 'canGoBack', 'getRootState', 'getState', 'getParent', 'getCurrentRoute', 'getCurrentOptions'];
  const listeners = {};
  const removeListener = (event, callback) => {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    }
  };
  let current = null;
  const ref = {
    get current() {
      return current;
    },
    set current(value) {
      current = value;
      if (value != null) {
        Object.entries(listeners).forEach(([event, callbacks]) => {
          callbacks.forEach(callback => {
            value.addListener(event, callback);
          });
        });
      }
    },
    isReady: () => {
      if (current == null) {
        return false;
      }
      return current.isReady();
    },
    ...methods.reduce((acc, name) => {
      acc[name] = (...args) => {
        if (current == null) {
          switch (name) {
            case 'addListener':
              {
                const [event, callback] = args;
                listeners[event] = listeners[event] || [];
                listeners[event].push(callback);
                return () => removeListener(event, callback);
              }
            case 'removeListener':
              {
                const [event, callback] = args;
                removeListener(event, callback);
                break;
              }
            default:
              console.error(NOT_INITIALIZED_ERROR);
          }
        } else {
          // @ts-expect-error: this is ok
          return current[name](...args);
        }
      };
      return acc;
    }, {})
  };
  return ref;
}
;// ./node_modules/@react-navigation/core/lib/module/DeprecatedNavigationInChildContext.js




/**
 * Context which enables deprecated bubbling to child navigators.
 */
const DeprecatedNavigationInChildContext = /*#__PURE__*/react.createContext(false);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// ./node_modules/@react-navigation/core/lib/module/EnsureSingleNavigator.js




const MULTIPLE_NAVIGATOR_ERROR = `Another navigator is already registered for this container. You likely have multiple navigators under a single "NavigationContainer" or "Screen". Make sure each navigator is under a separate "Screen" container. See https://reactnavigation.org/docs/nesting-navigators for a guide on nesting.`;
const SingleNavigatorContext = /*#__PURE__*/react.createContext(undefined);

/**
 * Component which ensures that there's only one navigator nested under it.
 */
function EnsureSingleNavigator({
  children
}) {
  const navigatorKeyRef = react.useRef(undefined);
  const value = react.useMemo(() => ({
    register(key) {
      const currentKey = navigatorKeyRef.current;
      if (currentKey !== undefined && key !== currentKey) {
        throw new Error(MULTIPLE_NAVIGATOR_ERROR);
      }
      navigatorKeyRef.current = key;
    },
    unregister(key) {
      const currentKey = navigatorKeyRef.current;
      if (key !== currentKey) {
        return;
      }
      navigatorKeyRef.current = undefined;
    }
  }), []);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(SingleNavigatorContext.Provider, {
    value: value,
    children: children
  });
}
;// ./node_modules/@react-navigation/core/lib/module/findFocusedRoute.js


function findFocusedRoute(state) {
  let current = state;
  while (current?.routes[current.index ?? 0].state != null) {
    current = current.routes[current.index ?? 0].state;
  }
  const route = current?.routes[current?.index ?? 0];
  return route;
}
;// ./node_modules/@react-navigation/core/lib/module/NavigationBuilderContext.js



/**
 * Context which holds the required helpers needed to build nested navigators.
 */
const NavigationBuilderContext = /*#__PURE__*/react.createContext({
  onDispatchAction: () => undefined,
  onOptionsChange: () => undefined,
  scheduleUpdate: () => {
    throw new Error("Couldn't find a context for scheduling updates.");
  },
  flushUpdates: () => {
    throw new Error("Couldn't find a context for flushing updates.");
  }
});
;// ./node_modules/@react-navigation/core/lib/module/NavigationContainerRefContext.js



/**
 * Context which holds the route prop for a screen.
 */
const NavigationContainerRefContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/NavigationIndependentTreeContext.js




/**
 * Context which marks the navigation tree as independent.
 */
const NavigationIndependentTreeContext = /*#__PURE__*/react.createContext(false);
;// ./node_modules/@react-navigation/core/lib/module/NavigationStateContext.js



const MISSING_CONTEXT_ERROR = "Couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'? See https://reactnavigation.org/docs/getting-started for setup instructions.";
const NavigationStateContext = /*#__PURE__*/react.createContext({
  isDefault: true,
  get getKey() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setKey() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get getState() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get getIsInitial() {
    throw new Error(MISSING_CONTEXT_ERROR);
  }
});
;// ./node_modules/@react-navigation/core/lib/module/theming/ThemeContext.js



const ThemeContext = /*#__PURE__*/react.createContext(undefined);
ThemeContext.displayName = 'ThemeContext';
;// ./node_modules/@react-navigation/core/lib/module/theming/ThemeProvider.js





function ThemeProvider({
  value,
  children
}) {
  return /*#__PURE__*/(0,jsx_runtime.jsx)(ThemeContext.Provider, {
    value: value,
    children: children
  });
}
;// ./node_modules/@react-navigation/core/lib/module/UnhandledActionContext.js



const UnhandledActionContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/useChildListeners.js



/**
 * Hook which lets child navigators add action listeners.
 */
function useChildListeners() {
  const {
    current: listeners
  } = react.useRef({
    action: [],
    focus: []
  });
  const addListener = react.useCallback((type, listener) => {
    listeners[type].push(listener);
    let removed = false;
    return () => {
      const index = listeners[type].indexOf(listener);
      if (!removed && index > -1) {
        removed = true;
        listeners[type].splice(index, 1);
      }
    };
  }, [listeners]);
  return {
    listeners,
    addListener
  };
}
;// ./node_modules/@react-navigation/core/lib/module/useEventEmitter.js



/**
 * Hook to manage the event system used by the navigator to notify screens of various events.
 */
function useEventEmitter(listen) {
  const listenRef = react.useRef(listen);
  react.useEffect(() => {
    listenRef.current = listen;
  });
  const listeners = react.useRef(Object.create(null));
  const create = react.useCallback(target => {
    const removeListener = (type, callback) => {
      const callbacks = listeners.current[type] ? listeners.current[type][target] : undefined;
      if (!callbacks) {
        return;
      }
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
    const addListener = (type, callback) => {
      listeners.current[type] = listeners.current[type] || {};
      listeners.current[type][target] = listeners.current[type][target] || [];
      listeners.current[type][target].push(callback);
      let removed = false;
      return () => {
        // Prevent removing other listeners when unsubscribing same listener multiple times
        if (!removed) {
          removed = true;
          removeListener(type, callback);
        }
      };
    };
    return {
      addListener,
      removeListener
    };
  }, []);
  const emit = react.useCallback(({
    type,
    data,
    target,
    canPreventDefault
  }) => {
    const items = listeners.current[type] || {};

    // Copy the current list of callbacks in case they are mutated during execution
    const callbacks = target !== undefined ? items[target]?.slice() : [].concat(...Object.keys(items).map(t => items[t])).filter((cb, i, self) => self.lastIndexOf(cb) === i);
    const event = {
      get type() {
        return type;
      }
    };
    if (target !== undefined) {
      Object.defineProperty(event, 'target', {
        enumerable: true,
        get() {
          return target;
        }
      });
    }
    if (data !== undefined) {
      Object.defineProperty(event, 'data', {
        enumerable: true,
        get() {
          return data;
        }
      });
    }
    if (canPreventDefault) {
      let defaultPrevented = false;
      Object.defineProperties(event, {
        defaultPrevented: {
          enumerable: true,
          get() {
            return defaultPrevented;
          }
        },
        preventDefault: {
          enumerable: true,
          value() {
            defaultPrevented = true;
          }
        }
      });
    }
    listenRef.current?.(event);
    callbacks?.forEach(cb => cb(event));
    return event;
  }, []);
  return react.useMemo(() => ({
    create,
    emit
  }), [create, emit]);
}
;// ./node_modules/@react-navigation/core/lib/module/useKeyedChildListeners.js



/**
 * Hook which lets child navigators add getters to be called for obtaining rehydrated state.
 */
function useKeyedChildListeners() {
  const {
    current: keyedListeners
  } = react.useRef(Object.assign(Object.create(null), {
    getState: {},
    beforeRemove: {}
  }));
  const addKeyedListener = react.useCallback((type, key, listener) => {
    // @ts-expect-error: according to ref stated above you can use `key` to index type
    keyedListeners[type][key] = listener;
    return () => {
      // @ts-expect-error: according to ref stated above you can use `key` to index type
      keyedListeners[type][key] = undefined;
    };
  }, [keyedListeners]);
  return {
    keyedListeners,
    addKeyedListener
  };
}
;// ./node_modules/@react-navigation/core/lib/module/useNavigationIndependentTree.js




function useNavigationIndependentTree() {
  return react.useContext(NavigationIndependentTreeContext);
}
;// ./node_modules/@react-navigation/core/lib/module/useOptionsGetters.js





function useOptionsGetters({
  key,
  options,
  navigation
}) {
  const optionsRef = react.useRef(options);
  const optionsGettersFromChildRef = react.useRef({});
  const {
    onOptionsChange
  } = react.useContext(NavigationBuilderContext);
  const {
    addOptionsGetter: parentAddOptionsGetter
  } = react.useContext(NavigationStateContext);
  const optionsChangeListener = react.useCallback(() => {
    const isFocused = navigation?.isFocused() ?? true;
    const hasChildren = Object.keys(optionsGettersFromChildRef.current).length;
    if (isFocused && !hasChildren) {
      onOptionsChange(optionsRef.current ?? {});
    }
  }, [navigation, onOptionsChange]);
  react.useEffect(() => {
    optionsRef.current = options;
    optionsChangeListener();
    return navigation?.addListener('focus', optionsChangeListener);
  }, [navigation, options, optionsChangeListener]);
  const getOptionsFromListener = react.useCallback(() => {
    for (const key in optionsGettersFromChildRef.current) {
      if (key in optionsGettersFromChildRef.current) {
        const result = optionsGettersFromChildRef.current[key]?.();

        // null means unfocused route
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }, []);
  const getCurrentOptions = react.useCallback(() => {
    const isFocused = navigation?.isFocused() ?? true;
    if (!isFocused) {
      return null;
    }
    const optionsFromListener = getOptionsFromListener();
    if (optionsFromListener !== null) {
      return optionsFromListener;
    }
    return optionsRef.current;
  }, [navigation, getOptionsFromListener]);
  react.useEffect(() => {
    return parentAddOptionsGetter?.(key, getCurrentOptions);
  }, [getCurrentOptions, parentAddOptionsGetter, key]);
  const addOptionsGetter = react.useCallback((key, getter) => {
    optionsGettersFromChildRef.current[key] = getter;
    optionsChangeListener();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete optionsGettersFromChildRef.current[key];
      optionsChangeListener();
    };
  }, [optionsChangeListener]);
  return {
    addOptionsGetter,
    getCurrentOptions
  };
}
;// ./node_modules/@react-navigation/core/lib/module/deepFreeze.js


const isPlainObject = value => {
  if (typeof value === 'object' && value !== null) {
    return Object.getPrototypeOf(value) === Object.prototype;
  }
  return false;
};
const deepFreeze = object => {
  // We only freeze in development to catch issues early
  // Don't freeze in production to avoid unnecessary performance overhead
  if (true) {
    return object;
  }
  // removed by dead control flow

  // removed by dead control flow


  // Freeze properties before freezing self
  // removed by dead control flow

  // removed by dead control flow

};
;// ./node_modules/@react-navigation/core/lib/module/useSyncState.js





const createStore = getInitialState => {
  const listeners = [];
  let initialized = false;
  let state;
  const getState = () => {
    if (initialized) {
      return state;
    }
    initialized = true;
    state = deepFreeze(getInitialState());
    return state;
  };
  let isBatching = false;
  let didUpdate = false;
  const setState = newState => {
    state = deepFreeze(newState);
    didUpdate = true;
    if (!isBatching) {
      listeners.forEach(listener => listener());
    }
  };
  const subscribe = callback => {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };
  const batchUpdates = callback => {
    isBatching = true;
    callback();
    isBatching = false;
    if (didUpdate) {
      didUpdate = false;
      listeners.forEach(listener => listener());
    }
  };
  return {
    getState,
    setState,
    batchUpdates,
    subscribe
  };
};
function useSyncState(getInitialState) {
  const store = react.useRef(createStore(getInitialState)).current;
  const state = react.useSyncExternalStore(store.subscribe, store.getState, store.getState);
  react.useDebugValue(state);
  const pendingUpdatesRef = react.useRef([]);
  const scheduleUpdate = (0,esm/* default */.A)(callback => {
    pendingUpdatesRef.current.push(callback);
  });
  const flushUpdates = (0,esm/* default */.A)(() => {
    const pendingUpdates = pendingUpdatesRef.current;
    pendingUpdatesRef.current = [];
    if (pendingUpdates.length !== 0) {
      store.batchUpdates(() => {
        // Flush all the pending updates
        for (const update of pendingUpdates) {
          update();
        }
      });
    }
  });
  return {
    state,
    getState: store.getState,
    setState: store.setState,
    scheduleUpdate,
    flushUpdates
  };
}
;// ./node_modules/@react-navigation/core/lib/module/BaseNavigationContainer.js
























const serializableWarnings = (/* unused pure expression or super */ null && ([]));
const duplicateNameWarnings = (/* unused pure expression or super */ null && ([]));

/**
 * Remove `key` and `routeNames` from the state objects recursively to get partial state.
 *
 * @param state Initial state object.
 */
const getPartialState = state => {
  if (state === undefined) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    key,
    routeNames,
    ...partialState
  } = state;
  return {
    ...partialState,
    stale: true,
    routes: state.routes.map(route => {
      if (route.state === undefined) {
        return route;
      }
      return {
        ...route,
        state: getPartialState(route.state)
      };
    })
  };
};

/**
 * Container component which holds the navigation state.
 * This should be rendered at the root wrapping the whole app.
 *
 * @param props.initialState Initial state object for the navigation tree.
 * @param props.onReady Callback which is called after the navigation tree mounts.
 * @param props.onStateChange Callback which is called with the latest navigation state when it changes.
 * @param props.onUnhandledAction Callback which is called when an action is not handled.
 * @param props.theme Theme object for the UI elements.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which refers to the navigation object containing helper methods.
 */
const BaseNavigationContainer = /*#__PURE__*/react.forwardRef(function BaseNavigationContainer({
  initialState,
  onStateChange,
  onReady,
  onUnhandledAction,
  navigationInChildEnabled = false,
  theme,
  children
}, ref) {
  const parent = react.useContext(NavigationStateContext);
  const independent = useNavigationIndependentTree();
  if (!parent.isDefault && !independent) {
    throw new Error("Looks like you have nested a 'NavigationContainer' inside another. Normally you need only one container at the root of the app, so this was probably an error. If this was intentional, wrap the container in 'NavigationIndependentTree' explicitly. Note that this will make the child navigators disconnected from the parent and you won't be able to navigate between them.");
  }
  const {
    state,
    getState,
    setState,
    scheduleUpdate,
    flushUpdates
  } = useSyncState(() => getPartialState(initialState == null ? undefined : initialState));
  const isFirstMountRef = react.useRef(true);
  const navigatorKeyRef = react.useRef(undefined);
  const getKey = react.useCallback(() => navigatorKeyRef.current, []);
  const setKey = react.useCallback(key => {
    navigatorKeyRef.current = key;
  }, []);
  const {
    listeners,
    addListener
  } = useChildListeners();
  const {
    keyedListeners,
    addKeyedListener
  } = useKeyedChildListeners();
  const dispatch = (0,esm/* default */.A)(action => {
    if (listeners.focus[0] == null) {
      console.error(NOT_INITIALIZED_ERROR);
    } else {
      listeners.focus[0](navigation => navigation.dispatch(action));
    }
  });
  const canGoBack = (0,esm/* default */.A)(() => {
    if (listeners.focus[0] == null) {
      return false;
    }
    const {
      result,
      handled
    } = listeners.focus[0](navigation => navigation.canGoBack());
    if (handled) {
      return result;
    } else {
      return false;
    }
  });
  const resetRoot = (0,esm/* default */.A)(state => {
    const target = state?.key ?? keyedListeners.getState.root?.().key;
    if (target == null) {
      console.error(NOT_INITIALIZED_ERROR);
    } else {
      listeners.focus[0](navigation => navigation.dispatch({
        ...CommonActions_reset(state),
        target
      }));
    }
  });
  const getRootState = (0,esm/* default */.A)(() => {
    return keyedListeners.getState.root?.();
  });
  const getCurrentRoute = (0,esm/* default */.A)(() => {
    const state = getRootState();
    if (state == null) {
      return undefined;
    }
    const route = findFocusedRoute(state);
    return route;
  });
  const isReady = (0,esm/* default */.A)(() => listeners.focus[0] != null);
  const emitter = useEventEmitter();
  const {
    addOptionsGetter,
    getCurrentOptions
  } = useOptionsGetters({});
  const navigation = react.useMemo(() => ({
    ...Object.keys(CommonActions_namespaceObject).reduce((acc, name) => {
      acc[name] = (...args) =>
      // @ts-expect-error: this is ok
      dispatch(CommonActions_namespaceObject[name](...args));
      return acc;
    }, {}),
    ...emitter.create('root'),
    dispatch,
    resetRoot,
    isFocused: () => true,
    canGoBack,
    getParent: () => undefined,
    getState,
    getRootState,
    getCurrentRoute,
    getCurrentOptions,
    isReady,
    setOptions: () => {
      throw new Error('Cannot call setOptions outside a screen');
    }
  }), [canGoBack, dispatch, emitter, getCurrentOptions, getCurrentRoute, getRootState, getState, isReady, resetRoot]);
  react.useImperativeHandle(ref, () => navigation, [navigation]);
  const onDispatchAction = (0,esm/* default */.A)((action, noop) => {
    emitter.emit({
      type: '__unsafe_action__',
      data: {
        action,
        noop,
        stack: stackRef.current
      }
    });
  });
  const lastEmittedOptionsRef = react.useRef(undefined);
  const onOptionsChange = (0,esm/* default */.A)(options => {
    if (lastEmittedOptionsRef.current === options) {
      return;
    }
    lastEmittedOptionsRef.current = options;
    emitter.emit({
      type: 'options',
      data: {
        options
      }
    });
  });
  const stackRef = react.useRef(undefined);
  const builderContext = react.useMemo(() => ({
    addListener,
    addKeyedListener,
    onDispatchAction,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef
  }), [addListener, addKeyedListener, onDispatchAction, onOptionsChange, scheduleUpdate, flushUpdates]);
  const isInitialRef = react.useRef(true);
  const getIsInitial = react.useCallback(() => isInitialRef.current, []);
  const context = react.useMemo(() => ({
    state,
    getState,
    setState,
    getKey,
    setKey,
    getIsInitial,
    addOptionsGetter
  }), [state, getState, setState, getKey, setKey, getIsInitial, addOptionsGetter]);
  const onReadyRef = react.useRef(onReady);
  const onStateChangeRef = react.useRef(onStateChange);
  react.useEffect(() => {
    isInitialRef.current = false;
    onStateChangeRef.current = onStateChange;
    onReadyRef.current = onReady;
  });
  const onReadyCalledRef = react.useRef(false);
  react.useEffect(() => {
    if (!onReadyCalledRef.current && isReady()) {
      onReadyCalledRef.current = true;
      onReadyRef.current?.();
      emitter.emit({
        type: 'ready'
      });
    }
  }, [state, isReady, emitter]);
  react.useEffect(() => {
    const hydratedState = getRootState();
    if (false) // removed by dead control flow
{}
    emitter.emit({
      type: 'state',
      data: {
        state
      }
    });
    if (!isFirstMountRef.current && onStateChangeRef.current) {
      onStateChangeRef.current(hydratedState);
    }
    isFirstMountRef.current = false;
  }, [getRootState, emitter, state]);
  const defaultOnUnhandledAction = (0,esm/* default */.A)(action => {
    if (true) {
      return;
    }
    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

  });
  return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationIndependentTreeContext.Provider, {
    value: false,
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContainerRefContext.Provider, {
      value: navigation,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationBuilderContext.Provider, {
        value: builderContext,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationStateContext.Provider, {
          value: context,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(UnhandledActionContext.Provider, {
            value: onUnhandledAction ?? defaultOnUnhandledAction,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(DeprecatedNavigationInChildContext.Provider, {
              value: navigationInChildEnabled,
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(EnsureSingleNavigator, {
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(ThemeProvider, {
                  value: theme,
                  children: children
                })
              })
            })
          })
        })
      })
    })
  });
});
;// ./node_modules/@react-navigation/core/lib/module/Group.js


/**
 * Empty component used for grouping screen configs.
 */
function Group(_) {
  /* istanbul ignore next */
  return null;
}
;// ./node_modules/@react-navigation/core/lib/module/Screen.js


/**
 * Empty component used for specifying route configuration.
 */
function Screen(_) {
  /* istanbul ignore next */
  return null;
}
;// ./node_modules/@react-navigation/core/lib/module/createNavigatorFactory.js





/**
 * Higher order component to create a `Navigator` and `Screen` pair.
 * Custom navigators should wrap the navigator component in `createNavigator` before exporting.
 *
 * @param Navigator The navigator component to wrap.
 * @returns Factory method to create a `Navigator` and `Screen` pair.
 */
function createNavigatorFactory(Navigator) {
  function createNavigator(config) {
    if (config != null) {
      return {
        Navigator,
        Screen: Screen,
        Group: Group,
        config
      };
    }
    return {
      Navigator,
      Screen: Screen,
      Group: Group
    };
  }
  return createNavigator;
}
;// ./node_modules/@react-navigation/core/lib/module/CurrentRenderContext.js




/**
 * Context which holds the values for the current navigation tree.
 * Intended for use in SSR. This is not safe to use on the client.
 */
const CurrentRenderContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/getActionFromState.js


function getActionFromState_getActionFromState(state, options) {
  // Create a normalized configs object which will be easier to use
  const normalizedConfig = options ? createNormalizedConfigItem(options) : {};
  const routes = state.index != null ? state.routes.slice(0, state.index + 1) : state.routes;
  if (routes.length === 0) {
    return undefined;
  }
  if (!(routes.length === 1 && routes[0].key === undefined || routes.length === 2 && routes[0].key === undefined && routes[0].name === normalizedConfig?.initialRouteName && routes[1].key === undefined)) {
    return {
      type: 'RESET',
      payload: state
    };
  }
  const route = state.routes[state.index ?? state.routes.length - 1];
  let current = route?.state;
  let config = normalizedConfig?.screens?.[route?.name];
  let params = {
    ...route.params
  };
  const payload = route ? {
    name: route.name,
    path: route.path,
    params
  } : undefined;

  // If the screen contains a navigator, pop other screens to navigate to it
  // This avoid pushing multiple instances of navigators onto a stack
  //
  // For example:
  // - RootStack
  //   - BottomTabs
  //   - SomeScreen
  //
  // In this case, if deep linking to `BottomTabs`, we should pop `SomeScreen`
  // Otherwise, we'll end up with 2 instances of `BottomTabs` in the stack
  //
  // There are 2 ways we can detect if a screen contains a navigator:
  // - The route contains nested state in `route.state`
  // - Nested screens are defined in the config
  if (payload && config?.screens && Object.keys(config.screens).length) {
    payload.pop = true;
  }
  while (current) {
    if (current.routes.length === 0) {
      return undefined;
    }
    const routes = current.index != null ? current.routes.slice(0, current.index + 1) : current.routes;
    const route = routes[routes.length - 1];

    // Explicitly set to override existing value when merging params
    Object.assign(params, {
      initial: undefined,
      screen: undefined,
      params: undefined,
      state: undefined
    });
    if (routes.length === 1 && routes[0].key === undefined) {
      params.initial = true;
      params.screen = route.name;
    } else if (routes.length === 2 && routes[0].key === undefined && routes[0].name === config?.initialRouteName && routes[1].key === undefined) {
      params.initial = false;
      params.screen = route.name;
    } else {
      params.state = current;
      break;
    }
    if (route.state) {
      params.params = {
        ...route.params
      };
      params.pop = true;
      params = params.params;
    } else {
      params.path = route.path;
      params.params = route.params;
    }
    current = route.state;
    config = config?.screens?.[route.name];
    if (config?.screens && Object.keys(config.screens).length) {
      params.pop = true;
    }
  }
  if (payload?.params.screen || payload?.params.state) {
    payload.pop = true;
  }
  if (!payload) {
    return;
  }

  // Try to construct payload for a `NAVIGATE` action from the state
  // This lets us preserve the navigation state and not lose it
  return {
    type: 'NAVIGATE',
    payload
  };
}
const createNormalizedConfigItem = config => typeof config === 'object' && config != null ? {
  initialRouteName: config.initialRouteName,
  screens: config.screens != null ? createNormalizedConfigs(config.screens) : undefined
} : {};
const createNormalizedConfigs = options => Object.entries(options).reduce((acc, [k, v]) => {
  acc[k] = createNormalizedConfigItem(v);
  return acc;
}, {});
;// ./node_modules/@react-navigation/core/lib/module/isRecordEqual.js


/**
 * Compare two records with primitive values as the content.
 */
function isRecordEqual(a, b) {
  if (a === b) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(key => Object.is(a[key], b[key]));
}
;// ./node_modules/@react-navigation/core/lib/module/useRouteCache.js




/**
 * Utilities such as `getFocusedRouteNameFromRoute` need to access state.
 * So we need a way to suppress the warning for those use cases.
 * This is fine since they are internal utilities and this is not public API.
 */
const CHILD_STATE = Symbol('CHILD_STATE');

/**
 * Hook to cache route props for each screen in the navigator.
 * This lets add warnings and modifications to the route object but keep references between renders.
 */
function useRouteCache(routes) {
  // Cache object which holds route objects for each screen
  const cache = react.useMemo(() => ({
    current: new Map()
  }), []);
  cache.current = routes.reduce((acc, route) => {
    const previous = cache.current.get(route.key);
    const {
      state,
      ...routeWithoutState
    } = route;
    let proxy;
    if (previous && isRecordEqual(previous, routeWithoutState)) {
      // If a cached route object already exists, reuse it
      proxy = previous;
    } else {
      proxy = routeWithoutState;
    }
    if (false) // removed by dead control flow
{}
    Object.defineProperty(proxy, CHILD_STATE, {
      enumerable: false,
      configurable: true,
      value: state
    });
    acc.set(route.key, proxy);
    return acc;
  }, new Map());
  return Array.from(cache.current.values());
}
;// ./node_modules/@react-navigation/core/lib/module/getFocusedRouteNameFromRoute.js



function getFocusedRouteNameFromRoute(route) {
  // @ts-expect-error: this isn't in type definitions coz we want this private
  const state = route[CHILD_STATE] ?? route.state;
  const params = route.params;
  const routeName = state ?
  // Get the currently active route name in the nested navigator
  state.routes[
  // If we have a partial state without index, for tab/drawer, first screen will be focused one, and last for stack
  // The type property will only exist for rehydrated state and not for state from deep link
  state.index ?? (typeof state.type === 'string' && state.type !== 'stack' ? 0 : state.routes.length - 1)].name :
  // If state doesn't exist, we need to default to `screen` param if available
  typeof params?.screen === 'string' ? params.screen : undefined;
  return routeName;
}
// EXTERNAL MODULE: ./node_modules/query-string/index.js
var query_string = __webpack_require__(6663);
;// ./node_modules/@react-navigation/core/lib/module/getPatternParts.js


/**
 * Parse a path into an array of parts with information about each segment.
 */
function getPatternParts(path) {
  const parts = [];
  let current = {
    segment: ''
  };
  let isRegex = false;
  let isParam = false;
  let regexInnerParens = 0;

  // One extra iteration to add the last character
  for (let i = 0; i <= path.length; i++) {
    const char = path[i];
    if (char != null) {
      current.segment += char;
    }
    if (char === ':') {
      // The segment must start with a colon if it's a param
      if (current.segment === ':') {
        isParam = true;
      } else if (!isRegex) {
        throw new Error(`Encountered ':' in the middle of a segment in path: ${path}`);
      }
    } else if (char === '(') {
      if (isParam) {
        if (isRegex) {
          // The '(' is part of the regex if we're already inside one
          regexInnerParens++;
        } else {
          isRegex = true;
        }
      } else {
        throw new Error(`Encountered '(' without preceding ':' in path: ${path}`);
      }
    } else if (char === ')') {
      if (isParam && isRegex) {
        if (regexInnerParens) {
          // The ')' is part of the regex if we're already inside one
          regexInnerParens--;
          current.regex += char;
        } else {
          isRegex = false;
          isParam = false;
        }
      } else {
        throw new Error(`Encountered ')' without preceding '(' in path: ${path}`);
      }
    } else if (char === '?') {
      if (current.param) {
        isParam = false;
        current.optional = true;
      } else {
        throw new Error(`Encountered '?' without preceding ':' in path: ${path}`);
      }
    } else if (char == null || char === '/' && !isRegex) {
      isParam = false;

      // Remove trailing slash from segment
      current.segment = current.segment.replace(/\/$/, '');
      if (current.segment === '') {
        continue;
      }
      if (current.param) {
        current.param = current.param.replace(/^:/, '');
      }
      if (current.regex) {
        current.regex = current.regex.replace(/^\(/, '').replace(/\)$/, '');
      }
      parts.push(current);
      if (char == null) {
        break;
      }
      current = {
        segment: ''
      };
    }
    if (isRegex) {
      current.regex = current.regex || '';
      current.regex += char;
    }
    if (isParam && !isRegex) {
      current.param = current.param || '';
      current.param += char;
    }
  }
  if (isRegex) {
    throw new Error(`Could not find closing ')' in path: ${path}`);
  }
  const params = parts.map(part => part.param).filter(Boolean);
  for (const [index, param] of params.entries()) {
    if (params.indexOf(param) !== index) {
      throw new Error(`Duplicate param name '${param}' found in path: ${path}`);
    }
  }
  return parts;
}
;// ./node_modules/@react-navigation/core/lib/module/validatePathConfig.js


const formatToList = items => Object.entries(items).map(([key, value]) => `- ${key} (${value})`).join('\n');
function validatePathConfig(config, root = true) {
  const validation = {
    path: 'string',
    initialRouteName: 'string',
    screens: 'object',
    ...(root ? null : {
      alias: 'array',
      exact: 'boolean',
      stringify: 'object',
      parse: 'object'
    })
  };
  if (typeof config !== 'object' || config === null) {
    throw new Error(`Expected the configuration to be an object, but got ${JSON.stringify(config)}.`);
  }
  const validationErrors = Object.fromEntries(Object.keys(config).map(key => {
    if (key in validation) {
      const type = validation[key];
      // @ts-expect-error: we know the key exists
      const value = config[key];
      if (value !== undefined) {
        if (type === 'array') {
          if (!Array.isArray(value)) {
            return [key, `expected 'Array', got '${typeof value}'`];
          }
        } else if (typeof value !== type) {
          return [key, `expected '${type}', got '${typeof value}'`];
        }
      }
    } else {
      return [key, 'extraneous'];
    }
    return null;
  }).filter(Boolean));
  if (Object.keys(validationErrors).length) {
    throw new Error(`Found invalid properties in the configuration:\n${formatToList(validationErrors)}\n\nYou can only specify the following properties:\n${formatToList(validation)}\n\nIf you want to specify configuration for screens, you need to specify them under a 'screens' property.\n\nSee https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration.`);
  }
  if (root && 'path' in config && typeof config.path === 'string' && config.path.includes(':')) {
    throw new Error(`Found invalid path '${config.path}'. The 'path' in the top-level configuration cannot contain patterns for params.`);
  }
  if ('screens' in config && config.screens) {
    Object.entries(config.screens).forEach(([_, value]) => {
      if (typeof value !== 'string') {
        validatePathConfig(value, false);
      }
    });
  }
}
;// ./node_modules/@react-navigation/core/lib/module/getPathFromState.js





const getActiveRoute = state => {
  const route = typeof state.index === 'number' ? state.routes[state.index] : state.routes[state.routes.length - 1];
  if (route.state) {
    return getActiveRoute(route.state);
  }
  return route;
};
const cachedNormalizedConfigs = new WeakMap();
const getNormalizedConfigs = options => {
  if (!options?.screens) return {};
  const cached = cachedNormalizedConfigs.get(options?.screens);
  if (cached) return cached;
  const normalizedConfigs = getPathFromState_createNormalizedConfigs(options.screens);
  cachedNormalizedConfigs.set(options.screens, normalizedConfigs);
  return normalizedConfigs;
};

/**
 * Utility to serialize a navigation state object to a path string.
 *
 * @example
 * ```js
 * getPathFromState(
 *   {
 *     routes: [
 *       {
 *         name: 'Chat',
 *         params: { author: 'Jane', id: 42 },
 *       },
 *     ],
 *   },
 *   {
 *     screens: {
 *       Chat: {
 *         path: 'chat/:author/:id',
 *         stringify: { author: author => author.toLowerCase() }
 *       }
 *     }
 *   }
 * )
 * ```
 *
 * @param state Navigation state to serialize.
 * @param options Extra options to fine-tune how to serialize the path.
 * @returns Path representing the state, e.g. /foo/bar?count=42.
 */
function getPathFromState_getPathFromState(state, options) {
  if (state == null) {
    throw Error(`Got '${String(state)}' for the navigation state. You must pass a valid state object.`);
  }
  if (options) {
    validatePathConfig(options);
  }
  const configs = getNormalizedConfigs(options);
  let path = '/';
  let current = state;
  const allParams = {};
  while (current) {
    let index = typeof current.index === 'number' ? current.index : 0;
    let route = current.routes[index];
    let parts;
    let focusedParams;
    let currentOptions = configs;
    const focusedRoute = getActiveRoute(state);

    // Keep all the route names that appeared during going deeper in config in case the pattern is resolved to undefined
    const nestedRouteNames = [];
    let hasNext = true;
    while (route.name in currentOptions && hasNext) {
      parts = currentOptions[route.name].parts;
      nestedRouteNames.push(route.name);
      if (route.params) {
        const options = currentOptions[route.name];
        const currentParams = Object.fromEntries(Object.entries(route.params).map(([key, value]) => {
          if (value === undefined) {
            if (options) {
              const optional = options.parts?.find(part => part.param === key)?.optional;
              if (optional) {
                return null;
              }
            } else {
              return null;
            }
          }
          const stringify = options?.stringify?.[key] ?? String;
          return [key, stringify(value)];
        }).filter(entry => entry != null));
        if (parts?.length) {
          Object.assign(allParams, currentParams);
        }
        if (focusedRoute === route) {
          // If this is the focused route, keep the params for later use
          // We save it here since it's been stringified already
          focusedParams = {
            ...currentParams
          };
          parts
          // eslint-disable-next-line no-loop-func
          ?.forEach(({
            param
          }) => {
            if (param) {
              // Remove the params present in the pattern since we'll only use the rest for query string
              if (focusedParams) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete focusedParams[param];
              }
            }
          });
        }
      }

      // If there is no `screens` property or no nested state, we return pattern
      if (!currentOptions[route.name].screens || route.state === undefined) {
        hasNext = false;
      } else {
        index = typeof route.state.index === 'number' ? route.state.index : route.state.routes.length - 1;
        const nextRoute = route.state.routes[index];
        const nestedConfig = currentOptions[route.name].screens;

        // if there is config for next route name, we go deeper
        if (nestedConfig && nextRoute.name in nestedConfig) {
          route = nextRoute;
          currentOptions = nestedConfig;
        } else {
          // If not, there is no sense in going deeper in config
          hasNext = false;
        }
      }
    }
    if (currentOptions[route.name] !== undefined) {
      path += parts?.map(({
        segment,
        param,
        optional
      }) => {
        // We don't know what to show for wildcard patterns
        // Showing the route name seems ok, though whatever we show here will be incorrect
        // Since the page doesn't actually exist
        if (segment === '*') {
          return route.name;
        }

        // If the path has a pattern for a param, put the param in the path
        if (param) {
          const value = allParams[param];
          if (value === undefined && optional) {
            // Optional params without value assigned in route.params should be ignored
            return '';
          }

          // Valid characters according to
          // https://datatracker.ietf.org/doc/html/rfc3986#section-3.3 (see pchar definition)
          return Array.from(String(value)).map(char => /[^A-Za-z0-9\-._~!$&'()*+,;=:@]/g.test(char) ? encodeURIComponent(char) : char).join('');
        }
        return encodeURIComponent(segment);
      }).join('/');
    } else {
      path += encodeURIComponent(route.name);
    }
    if (!focusedParams && focusedRoute.params) {
      focusedParams = Object.fromEntries(Object.entries(focusedRoute.params).map(([key, value]) => [key, String(value)]));
    }
    if (route.state) {
      path += '/';
    } else if (focusedParams) {
      for (const param in focusedParams) {
        if (focusedParams[param] === 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete focusedParams[param];
        }
      }
      const query = query_string.stringify(focusedParams, {
        sort: false
      });
      if (query) {
        path += `?${query}`;
      }
    }
    current = route.state;
  }

  // Include the root path if specified
  if (options?.path) {
    path = `${options.path}/${path}`;
  }

  // Remove multiple as well as trailing slashes
  path = path.replace(/\/+/g, '/');
  path = path.length > 1 ? path.replace(/\/$/, '') : path;

  // If path doesn't start with a slash, add it
  // This makes sure that history.pushState will update the path correctly instead of appending
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
}
const createConfigItem = (config, parentParts) => {
  if (typeof config === 'string') {
    // If a string is specified as the value of the key(e.g. Foo: '/path'), use it as the pattern
    const parts = getPatternParts(config);
    if (parentParts) {
      return {
        parts: [...parentParts, ...parts]
      };
    }
    return {
      parts
    };
  }
  if (config.exact && config.path === undefined) {
    throw new Error("A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. `path: ''`.");
  }

  // If an object is specified as the value (e.g. Foo: { ... }),
  // It can have `path` property and `screens` prop which has nested configs
  const parts = config.exact !== true ? [...(parentParts || []), ...(config.path ? getPatternParts(config.path) : [])] : config.path ? getPatternParts(config.path) : undefined;
  const screens = config.screens ? getPathFromState_createNormalizedConfigs(config.screens, parts) : undefined;
  return {
    parts,
    stringify: config.stringify,
    screens
  };
};
const getPathFromState_createNormalizedConfigs = (options, parts) => Object.fromEntries(Object.entries(options).map(([name, c]) => {
  const result = createConfigItem(c, parts);
  return [name, result];
}));
// EXTERNAL MODULE: ./node_modules/escape-string-regexp/index.js
var escape_string_regexp = __webpack_require__(2834);
;// ./node_modules/@react-navigation/core/lib/module/arrayStartsWith.js


/**
 * Compare two arrays to check if the first array starts with the second array.
 */
function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }
  return start.every((it, index) => it === array[index]);
}
;// ./node_modules/@react-navigation/core/lib/module/isArrayEqual.js


/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */
function isArrayEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((it, index) => Object.is(it, b[index]));
}
;// ./node_modules/@react-navigation/core/lib/module/getStateFromPath.js









/**
 * Utility to parse a path string to initial state object accepted by the container.
 * This is useful for deep linking when we need to handle the incoming URL.
 *
 * @example
 * ```js
 * getStateFromPath(
 *   '/chat/jane/42',
 *   {
 *     screens: {
 *       Chat: {
 *         path: 'chat/:author/:id',
 *         parse: { id: Number }
 *       }
 *     }
 *   }
 * )
 * ```
 * @param path Path string to parse and convert, e.g. /foo/bar?count=42.
 * @param options Extra options to fine-tune how to parse the path.
 */
function getStateFromPath_getStateFromPath(path, options) {
  const {
    initialRoutes,
    configs
  } = getConfigResources(options);
  const screens = options?.screens;
  let remaining = path.replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
  .replace(/^\//, '') // Remove extra leading slash
  .replace(/\?.*$/, ''); // Remove query params which we will handle later

  // Make sure there is a trailing slash
  remaining = remaining.endsWith('/') ? remaining : `${remaining}/`;
  const prefix = options?.path?.replace(/^\//, ''); // Remove extra leading slash

  if (prefix) {
    // Make sure there is a trailing slash
    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

    // If the path doesn't start with the prefix, it's not a match
    if (!remaining.startsWith(normalizedPrefix)) {
      return undefined;
    }

    // Remove the prefix from the path
    remaining = remaining.replace(normalizedPrefix, '');
  }
  if (screens === undefined) {
    // When no config is specified, use the path segments as route names
    const routes = remaining.split('/').filter(Boolean).map(segment => {
      const name = decodeURIComponent(segment);
      return {
        name
      };
    });
    if (routes.length) {
      return createNestedStateObject(path, routes, initialRoutes);
    }
    return undefined;
  }
  if (remaining === '/') {
    // We need to add special handling of empty path so navigation to empty path also works
    // When handling empty path, we should only look at the root level config
    const match = configs.find(config => config.segments.join('/') === '');
    if (match) {
      return createNestedStateObject(path, match.routeNames.map(name => ({
        name
      })), initialRoutes, configs);
    }
    return undefined;
  }
  let result;
  let current;

  // We match the whole path against the regex instead of segments
  // This makes sure matches such as wildcard will catch any unmatched routes, even if nested
  const {
    routes,
    remainingPath
  } = matchAgainstConfigs(remaining, configs);
  if (routes !== undefined) {
    // This will always be empty if full path matched
    current = createNestedStateObject(path, routes, initialRoutes, configs);
    remaining = remainingPath;
    result = current;
  }
  if (current == null || result == null) {
    return undefined;
  }
  return result;
}

/**
 * Reference to the last used config resources. This is used to avoid recomputing the config resources when the options are the same.
 */
const cachedConfigResources = new WeakMap();
function getConfigResources(options) {
  if (!options) return prepareConfigResources();
  const cached = cachedConfigResources.get(options);
  if (cached) return cached;
  const resources = prepareConfigResources(options);
  cachedConfigResources.set(options, resources);
  return resources;
}
function prepareConfigResources(options) {
  if (options) {
    validatePathConfig(options);
  }
  const initialRoutes = getInitialRoutes(options);
  const configs = getSortedNormalizedConfigs(initialRoutes, options?.screens);
  checkForDuplicatedConfigs(configs);
  const configWithRegexes = getConfigsWithRegexes(configs);
  return {
    initialRoutes,
    configs,
    configWithRegexes
  };
}
function getInitialRoutes(options) {
  const initialRoutes = [];
  if (options?.initialRouteName) {
    initialRoutes.push({
      initialRouteName: options.initialRouteName,
      parentScreens: []
    });
  }
  return initialRoutes;
}
function getSortedNormalizedConfigs(initialRoutes, screens = {}) {
  // Create a normalized configs array which will be easier to use
  return [].concat(...Object.keys(screens).map(key => getStateFromPath_createNormalizedConfigs(key, screens, initialRoutes, [], [], []))).sort((a, b) => {
    // Sort config from most specific to least specific:
    // - more segments
    // - static segments
    // - params with regex
    // - regular params
    // - wildcard

    // If 2 patterns are same, move the one with less route names up
    // This is an error state, so it's only useful for consistent error messages
    if (isArrayEqual(a.segments, b.segments)) {
      return b.routeNames.join('>').localeCompare(a.routeNames.join('>'));
    }

    // If one of the patterns starts with the other, it's more exhaustive
    // So move it up
    if (arrayStartsWith(a.segments, b.segments)) {
      return -1;
    }
    if (arrayStartsWith(b.segments, a.segments)) {
      return 1;
    }
    for (let i = 0; i < Math.max(a.segments.length, b.segments.length); i++) {
      // if b is longer, b gets higher priority
      if (a.segments[i] == null) {
        return 1;
      }

      // if a is longer, a gets higher priority
      if (b.segments[i] == null) {
        return -1;
      }
      const aWildCard = a.segments[i] === '*';
      const bWildCard = b.segments[i] === '*';
      const aParam = a.segments[i].startsWith(':');
      const bParam = b.segments[i].startsWith(':');
      const aRegex = aParam && a.segments[i].includes('(');
      const bRegex = bParam && b.segments[i].includes('(');

      // if both are wildcard or regex, we compare next component
      if (aWildCard && bWildCard || aRegex && bRegex) {
        continue;
      }

      // if only a is wildcard, b gets higher priority
      if (aWildCard && !bWildCard) {
        return 1;
      }

      // if only b is wildcard, a gets higher priority
      if (bWildCard && !aWildCard) {
        return -1;
      }

      // If only a has a param, b gets higher priority
      if (aParam && !bParam) {
        return 1;
      }

      // If only b has a param, a gets higher priority
      if (bParam && !aParam) {
        return -1;
      }

      // if only a has regex, a gets higher priority
      if (aRegex && !bRegex) {
        return -1;
      }

      // if only b has regex, b gets higher priority
      if (bRegex && !aRegex) {
        return 1;
      }
    }
    return a.segments.length - b.segments.length;
  });
}
function checkForDuplicatedConfigs(configs) {
  // Check for duplicate patterns in the config
  configs.reduce((acc, config) => {
    const pattern = config.segments.join('/');
    if (acc[pattern]) {
      const a = acc[pattern].routeNames;
      const b = config.routeNames;

      // It's not a problem if the path string omitted from a inner most screen
      // For example, it's ok if a path resolves to `A > B > C` or `A > B`
      const intersects = a.length > b.length ? b.every((it, i) => a[i] === it) : a.every((it, i) => b[i] === it);
      if (!intersects) {
        throw new Error(`Found conflicting screens with the same pattern. The pattern '${pattern}' resolves to both '${a.join(' > ')}' and '${b.join(' > ')}'. Patterns must be unique and cannot resolve to more than one screen.`);
      }
    }
    return Object.assign(acc, {
      [pattern]: config
    });
  }, {});
}
function getConfigsWithRegexes(configs) {
  return configs.map(c => ({
    ...c,
    // Add `$` to the regex to make sure it matches till end of the path and not just beginning
    regex: c.regex ? new RegExp(c.regex.source + '$') : undefined
  }));
}
const matchAgainstConfigs = (remaining, configs) => {
  let routes;
  let remainingPath = remaining;

  // Go through all configs, and see if the next path segment matches our regex
  for (const config of configs) {
    if (!config.regex) {
      continue;
    }
    const match = remainingPath.match(config.regex);

    // If our regex matches, we need to extract params from the path
    if (match) {
      routes = config.routeNames.map(routeName => {
        const routeConfig = configs.find(c => {
          // Check matching name AND pattern in case same screen is used at different levels in config
          return c.screen === routeName && arrayStartsWith(config.segments, c.segments);
        });
        const params = routeConfig && match.groups ? Object.fromEntries(Object.entries(match.groups).map(([key, value]) => {
          const index = Number(key.replace('param_', ''));
          const param = routeConfig.params.find(it => it.index === index);
          if (param?.screen === routeName && param?.name) {
            return [param.name, value];
          }
          return null;
        }).filter(it => it != null).map(([key, value]) => {
          if (value == null) {
            return [key, undefined];
          }
          const decoded = decodeURIComponent(value);
          const parsed = routeConfig.parse?.[key] ? routeConfig.parse[key](decoded) : decoded;
          return [key, parsed];
        })) : undefined;
        if (params && Object.keys(params).length) {
          return {
            name: routeName,
            params
          };
        }
        return {
          name: routeName
        };
      });
      remainingPath = remainingPath.replace(match[0], '');
      break;
    }
  }
  return {
    routes,
    remainingPath
  };
};
const getStateFromPath_createNormalizedConfigs = (screen, routeConfig, initials, paths, parentScreens, routeNames) => {
  const configs = [];
  routeNames.push(screen);
  parentScreens.push(screen);
  const config = routeConfig[screen];
  if (typeof config === 'string') {
    paths.push({
      screen,
      path: config
    });
    configs.push(getStateFromPath_createConfigItem(screen, [...routeNames], [...paths]));
  } else if (typeof config === 'object') {
    // if an object is specified as the value (e.g. Foo: { ... }),
    // it can have `path` property and
    // it could have `screens` prop which has nested configs
    if (typeof config.path === 'string') {
      if (config.exact && config.path == null) {
        throw new Error(`Screen '${screen}' doesn't specify a 'path'. A 'path' needs to be specified when specifying 'exact: true'. If you don't want this screen in the URL, specify it as empty string, e.g. \`path: ''\`.`);
      }

      // We should add alias configs after the main config
      // So unless they are more specific, main config will be matched first
      const aliasConfigs = [];
      if (config.alias) {
        for (const alias of config.alias) {
          if (typeof alias === 'string') {
            aliasConfigs.push(getStateFromPath_createConfigItem(screen, [...routeNames], [...paths, {
              screen,
              path: alias
            }], config.parse));
          } else if (typeof alias === 'object') {
            aliasConfigs.push(getStateFromPath_createConfigItem(screen, [...routeNames], alias.exact ? [{
              screen,
              path: alias.path
            }] : [...paths, {
              screen,
              path: alias.path
            }], alias.parse));
          }
        }
      }
      if (config.exact) {
        // If it's an exact path, we don't need to keep track of the parent screens
        // So we can clear it
        paths.length = 0;
      }
      paths.push({
        screen,
        path: config.path
      });
      configs.push(getStateFromPath_createConfigItem(screen, [...routeNames], [...paths], config.parse));
      configs.push(...aliasConfigs);
    }
    if (typeof config !== 'string' && typeof config.path !== 'string' && config.alias?.length) {
      throw new Error(`Screen '${screen}' doesn't specify a 'path'. A 'path' needs to be specified in order to use 'alias'.`);
    }
    if (config.screens) {
      // property `initialRouteName` without `screens` has no purpose
      if (config.initialRouteName) {
        initials.push({
          initialRouteName: config.initialRouteName,
          parentScreens
        });
      }
      Object.keys(config.screens).forEach(nestedConfig => {
        const result = getStateFromPath_createNormalizedConfigs(nestedConfig, config.screens, initials, [...paths], [...parentScreens], routeNames);
        configs.push(...result);
      });
    }
  }
  routeNames.pop();
  return configs;
};
const getStateFromPath_createConfigItem = (screen, routeNames, paths, parse) => {
  const parts = [];

  // Parse the path string into parts for easier matching
  for (const {
    screen,
    path
  } of paths) {
    parts.push(...getPatternParts(path).map(part => ({
      ...part,
      screen
    })));
  }
  const regex = parts.length ? new RegExp(`^(${parts.map((it, i) => {
    if (it.param) {
      const reg = it.regex || '[^/]+';
      return `(((?<param_${i}>${reg})\\/)${it.optional ? '?' : ''})`;
    }
    return `${it.segment === '*' ? '.*' : escape_string_regexp(it.segment)}\\/`;
  }).join('')})$`) : undefined;
  const segments = parts.map(it => it.segment);
  const params = parts.map((it, i) => it.param ? {
    index: i,
    screen: it.screen,
    name: it.param
  } : null).filter(it => it != null);
  return {
    screen,
    regex,
    segments,
    params,
    routeNames,
    parse
  };
};
const findParseConfigForRoute = (routeName, flatConfig) => {
  for (const config of flatConfig) {
    if (routeName === config.routeNames[config.routeNames.length - 1]) {
      return config.parse;
    }
  }
  return undefined;
};

// Try to find an initial route connected with the one passed
const findInitialRoute = (routeName, parentScreens, initialRoutes) => {
  for (const config of initialRoutes) {
    if (parentScreens.length === config.parentScreens.length) {
      let sameParents = true;
      for (let i = 0; i < parentScreens.length; i++) {
        if (parentScreens[i].localeCompare(config.parentScreens[i]) !== 0) {
          sameParents = false;
          break;
        }
      }
      if (sameParents) {
        return routeName !== config.initialRouteName ? config.initialRouteName : undefined;
      }
    }
  }
  return undefined;
};

// returns state object with values depending on whether
// it is the end of state and if there is initialRoute for this level
const createStateObject = (initialRoute, route, isEmpty) => {
  if (isEmpty) {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{
          name: initialRoute
        }, route]
      };
    } else {
      return {
        routes: [route]
      };
    }
  } else {
    if (initialRoute) {
      return {
        index: 1,
        routes: [{
          name: initialRoute
        }, {
          ...route,
          state: {
            routes: []
          }
        }]
      };
    } else {
      return {
        routes: [{
          ...route,
          state: {
            routes: []
          }
        }]
      };
    }
  }
};
const createNestedStateObject = (path, routes, initialRoutes, flatConfig) => {
  let route = routes.shift();
  const parentScreens = [];
  let initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);
  parentScreens.push(route.name);
  const state = createStateObject(initialRoute, route, routes.length === 0);
  if (routes.length > 0) {
    let nestedState = state;
    while (route = routes.shift()) {
      initialRoute = findInitialRoute(route.name, parentScreens, initialRoutes);
      const nestedStateIndex = nestedState.index || nestedState.routes.length - 1;
      nestedState.routes[nestedStateIndex].state = createStateObject(initialRoute, route, routes.length === 0);
      if (routes.length > 0) {
        nestedState = nestedState.routes[nestedStateIndex].state;
      }
      parentScreens.push(route.name);
    }
  }
  route = findFocusedRoute(state);
  route.path = path.replace(/\/$/, '');
  const params = parseQueryParams(path, flatConfig ? findParseConfigForRoute(route.name, flatConfig) : undefined);
  if (params) {
    route.params = {
      ...route.params,
      ...params
    };
  }
  return state;
};
const parseQueryParams = (path, parseConfig) => {
  const query = path.split('?')[1];
  const params = query_string.parse(query);
  if (parseConfig) {
    Object.keys(params).forEach(name => {
      if (Object.hasOwnProperty.call(parseConfig, name) && typeof params[name] === 'string') {
        params[name] = parseConfig[name](params[name]);
      }
    });
  }
  return Object.keys(params).length ? params : undefined;
};
;// ./node_modules/@react-navigation/core/lib/module/NavigationContext.js



/**
 * Context which holds the navigation prop for a screen.
 */
const NavigationContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/NavigationHelpersContext.js



/**
 * Context which holds the navigation helpers of the parent navigator.
 * Navigators should use this context in their view component.
 */
const NavigationHelpersContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/NavigationRouteContext.js




/**
 * Context which holds the route prop for a screen.
 */
const NavigationRouteContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/NavigationIndependentTree.js







/**
 * Component to make the child navigation container independent of parent containers.
 */

function NavigationIndependentTree({
  children
}) {
  return (/*#__PURE__*/
    // We need to clear any existing contexts for nested independent container to work correctly
    (0,jsx_runtime.jsx)(NavigationRouteContext.Provider, {
      value: undefined,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContext.Provider, {
        value: undefined,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationIndependentTreeContext.Provider, {
          value: true,
          children: children
        })
      })
    })
  );
}
;// ./node_modules/@react-navigation/core/lib/module/NavigationMetaContext.js




/**
 * Context with additional metadata to pass to child navigator in a screen.
 * For example, child native stack to know it's inside native tabs.
 * So it doesn't implement features such as `popToTop` that are handled by native tabs.
 *
 * Consumers should not make any assumptions about the shape of the object.
 * It can be different depending on the navigator and may change without notice.
 * This is not intended to be used by application code.
 */
const NavigationMetaContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/PreventRemoveContext.js




/**
 * A type of an object that have a route key as an object key
 * and a value whether to prevent that route.
 */

const PreventRemoveContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/PreventRemoveProvider.js









/**
 * Util function to transform map of prevented routes to a simpler object.
 */
const transformPreventedRoutes = preventedRoutesMap => {
  const preventedRoutesToTransform = [...preventedRoutesMap.values()];
  const preventedRoutes = preventedRoutesToTransform.reduce((acc, {
    routeKey,
    preventRemove
  }) => {
    acc[routeKey] = {
      preventRemove: acc[routeKey]?.preventRemove || preventRemove
    };
    return acc;
  }, {});
  return preventedRoutes;
};

/**
 * Component used for managing which routes have to be prevented from removal in native-stack.
 */
function PreventRemoveProvider({
  children
}) {
  const [parentId] = react.useState(() => nanoid());
  const [preventedRoutesMap, setPreventedRoutesMap] = react.useState(() => new Map());
  const navigation = react.useContext(NavigationHelpersContext);
  const route = react.useContext(NavigationRouteContext);
  const preventRemoveContextValue = react.useContext(PreventRemoveContext);
  // take `setPreventRemove` from parent context - if exist it means we're in a nested context
  const setParentPrevented = preventRemoveContextValue?.setPreventRemove;
  const setPreventRemove = (0,esm/* default */.A)((id, routeKey, preventRemove) => {
    if (preventRemove && (navigation == null || navigation?.getState().routes.every(route => route.key !== routeKey))) {
      throw new Error(`Couldn't find a route with the key ${routeKey}. Is your component inside NavigationContent?`);
    }
    setPreventedRoutesMap(prevPrevented => {
      // values haven't changed - do nothing
      if (routeKey === prevPrevented.get(id)?.routeKey && preventRemove === prevPrevented.get(id)?.preventRemove) {
        return prevPrevented;
      }
      const nextPrevented = new Map(prevPrevented);
      if (preventRemove) {
        nextPrevented.set(id, {
          routeKey,
          preventRemove
        });
      } else {
        nextPrevented.delete(id);
      }
      return nextPrevented;
    });
  });
  const isPrevented = [...preventedRoutesMap.values()].some(({
    preventRemove
  }) => preventRemove);
  react.useEffect(() => {
    if (route?.key !== undefined && setParentPrevented !== undefined) {
      // when route is defined (and setParentPrevented) it means we're in a nested stack
      // route.key then will be the route key of parent
      setParentPrevented(parentId, route.key, isPrevented);
      return () => {
        setParentPrevented(parentId, route.key, false);
      };
    }
    return;
  }, [parentId, isPrevented, route?.key, setParentPrevented]);
  const value = react.useMemo(() => ({
    setPreventRemove,
    preventedRoutes: transformPreventedRoutes(preventedRoutesMap)
  }), [setPreventRemove, preventedRoutesMap]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(PreventRemoveContext.Provider, {
    value: value,
    children: children
  });
}
// EXTERNAL MODULE: ./node_modules/react-is/cjs/react-is.production.js
var react_is_production = __webpack_require__(4405);
;// ./node_modules/@react-navigation/core/lib/module/useRoute.js




/**
 * Hook to access the route prop of the parent screen anywhere.
 *
 * @returns Route prop of the parent screen.
 */
function useRoute() {
  const route = react.useContext(NavigationRouteContext);
  if (route === undefined) {
    throw new Error("Couldn't find a route object. Is your component inside a screen in a navigator?");
  }
  return route;
}
;// ./node_modules/@react-navigation/core/lib/module/StaticNavigation.js






/**
 * Flatten a type to remove all type alias names, unions etc.
 * This will show a plain object when hovering over the type.
 */

/**
 * keyof T doesn't work for union types. We can use distributive conditional types instead.
 * https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
 */

/**
 * We get a union type when using keyof, but we want an intersection instead.
 * https://stackoverflow.com/a/50375286/1665026
 */

/**
 * Props for a screen component which is rendered by a static navigator.
 * Takes the route params as a generic argument.
 */

/**
 * Infer the param list from the static navigation config.
 */

const MemoizedScreen = /*#__PURE__*/react.memo(({
  component
}) => {
  const route = useRoute();
  const children = /*#__PURE__*/react.createElement(component, {
    route
  });
  return children;
});
MemoizedScreen.displayName = 'Memo(Screen)';
const getItemsFromScreens = (Screen, screens) => {
  return Object.entries(screens).map(([name, item]) => {
    let component;
    let props = {};
    let useIf;
    let isNavigator = false;
    if ('screen' in item) {
      const {
        screen,
        if: _if,
        ...rest
      } = item;
      useIf = _if;
      props = rest;
      if ((0,react_is_production/* isValidElementType */.Hy)(screen)) {
        component = screen;
      } else if ('config' in screen) {
        isNavigator = true;
        component = createComponentForStaticNavigation(screen, `${name}Navigator`);
      }
    } else if ((0,react_is_production/* isValidElementType */.Hy)(item)) {
      component = item;
    } else if ('config' in item) {
      isNavigator = true;
      component = createComponentForStaticNavigation(item, `${name}Navigator`);
    }
    if (component == null) {
      throw new Error(`Couldn't find a 'screen' property for the screen '${name}'. This can happen if you passed 'undefined'. You likely forgot to export your component from the file it's defined in, or mixed up default import and named import when importing.`);
    }
    const element = isNavigator ? (/*#__PURE__*/react.createElement(component, {})) : /*#__PURE__*/(0,jsx_runtime.jsx)(MemoizedScreen, {
      component: component
    });
    return () => {
      const shouldRender = useIf == null || useIf();
      if (!shouldRender) {
        return null;
      }
      return /*#__PURE__*/(0,jsx_runtime.jsx)(Screen, {
        name: name,
        ...props,
        children: () => element
      }, name);
    };
  });
};

/**
 * Create a component that renders a navigator based on the static configuration.
 *
 * @param tree Static navigation config.
 * @param displayName Name of the component to be displayed in React DevTools.
 * @returns A component which renders the navigator.
 */
function createComponentForStaticNavigation(tree, displayName) {
  const {
    Navigator,
    Group,
    Screen,
    config
  } = tree;
  const {
    screens,
    groups,
    ...rest
  } = config;
  if (screens == null && groups == null) {
    throw new Error("Couldn't find a 'screens' or 'groups' property. Make sure to define your screens under a 'screens' property in the configuration.");
  }
  const items = [];

  // Loop through the config to find screens and groups
  // So we add the screens and groups in the same order as they are defined
  for (const key in config) {
    if (key === 'screens' && screens) {
      items.push(...getItemsFromScreens(Screen, screens));
    }
    if (key === 'groups' && groups) {
      items.push(...Object.entries(groups).map(([key, {
        if: useIf,
        ...group
      }]) => {
        const groupItems = getItemsFromScreens(Screen, group.screens);
        return () => {
          // Call unconditionally since screen configs may contain `useIf` hooks
          const children = groupItems.map(item => item());
          const shouldRender = useIf == null || useIf();
          if (!shouldRender) {
            return null;
          }
          return /*#__PURE__*/(0,jsx_runtime.jsx)(Group, {
            navigationKey: key,
            ...group,
            children: children
          }, key);
        };
      }));
    }
  }
  const NavigatorComponent = () => {
    const children = items.map(item => item());
    return /*#__PURE__*/(0,jsx_runtime.jsx)(Navigator, {
      ...rest,
      children: children
    });
  };
  NavigatorComponent.displayName = displayName;
  return NavigatorComponent;
}
/**
 * Create a path config object from a static navigation config for deep linking.
 *
 * @param tree Static navigation config.
 * @param options Additional options from `linking.config`.
 * @param auto Whether to automatically generate paths for leaf screens.
 * @returns Path config object to use in linking config.
 *
 * @example
 * ```js
 * const config = {
 *   screens: {
 *     Home: {
 *       screens: createPathConfigForStaticNavigation(HomeTabs),
 *     },
 *   },
 * };
 * ```
 */
function createPathConfigForStaticNavigation(tree, options, auto) {
  let initialScreenHasPath = false;
  let initialScreenConfig;
  const createPathConfigForTree = (t, o, skipInitialDetection) => {
    const createPathConfigForScreens = (screens, initialRouteName) => {
      return Object.fromEntries(Object.entries(screens)
      // Re-order to move the initial route to the front
      // This way we can detect the initial route correctly
      .sort(([a], [b]) => {
        if (a === initialRouteName) {
          return -1;
        }
        if (b === initialRouteName) {
          return 1;
        }
        return 0;
      }).map(([key, item]) => {
        const screenConfig = {};
        if ('linking' in item) {
          if (typeof item.linking === 'string') {
            screenConfig.path = item.linking;
          } else {
            Object.assign(screenConfig, item.linking);
          }
          if (typeof screenConfig.path === 'string') {
            screenConfig.path = screenConfig.path.replace(/^\//, '') // Remove extra leading slash
            .replace(/\/$/, ''); // Remove extra trailing slash
          }
        }
        let screens;
        const skipInitialDetectionInChild = skipInitialDetection || screenConfig.path != null && screenConfig.path !== '';
        if ('config' in item) {
          screens = createPathConfigForTree(item, undefined, skipInitialDetectionInChild);
        } else if ('screen' in item && 'config' in item.screen && (item.screen.config.screens || item.screen.config.groups)) {
          screens = createPathConfigForTree(item.screen, undefined, skipInitialDetectionInChild);
        }
        if (screens) {
          screenConfig.screens = screens;
        }
        if (auto && !screenConfig.screens &&
        // Skip generating path for screens that specify linking config as `undefined` or `null` explicitly
        !('linking' in item && item.linking == null)) {
          if (screenConfig.path != null) {
            if (!skipInitialDetection) {
              if (key === initialRouteName && screenConfig.path != null) {
                initialScreenHasPath = true;
              } else if (screenConfig.path === '') {
                // We encounter a leaf screen with empty path,
                // Clear the initial screen config as it's not needed anymore
                initialScreenConfig = undefined;
              }
            }
          } else {
            if (!skipInitialDetection && initialScreenConfig == null) {
              initialScreenConfig = screenConfig;
            }
            screenConfig.path = key.replace(/([A-Z]+)/g, '-$1').replace(/^-/, '').toLowerCase();
          }
        }
        return [key, screenConfig];
      }).filter(([, screen]) => Object.keys(screen).length > 0));
    };
    const screens = {};

    // Loop through the config to find screens and groups
    // So we add the screens and groups in the same order as they are defined
    for (const key in t.config) {
      if (key === 'screens' && t.config.screens) {
        Object.assign(screens, createPathConfigForScreens(t.config.screens, o?.initialRouteName ?? t.config.initialRouteName));
      }
      if (key === 'groups' && t.config.groups) {
        Object.entries(t.config.groups).forEach(([, group]) => {
          Object.assign(screens, createPathConfigForScreens(group.screens, o?.initialRouteName ?? t.config.initialRouteName));
        });
      }
    }
    if (Object.keys(screens).length === 0) {
      return undefined;
    }
    return screens;
  };
  const screens = createPathConfigForTree(tree, options, false);
  if (auto && initialScreenConfig && !initialScreenHasPath) {
    initialScreenConfig.path = '';
  }
  return screens;
}
;// ./node_modules/@react-navigation/core/lib/module/theming/useTheme.js




function useTheme() {
  const theme = react.useContext(ThemeContext);
  if (theme == null) {
    throw new Error("Couldn't find a theme. Is your component inside NavigationContainer or does it have a theme?");
  }
  return theme;
}
;// ./node_modules/@react-navigation/core/lib/module/types.js


class PrivateValueStore {}
;// ./node_modules/@react-navigation/core/lib/module/useNavigation.js





/**
 * Hook to access the navigation prop of the parent screen anywhere.
 *
 * @returns Navigation prop of the parent screen.
 */
function useNavigation() {
  const root = react.useContext(NavigationContainerRefContext);
  const navigation = react.useContext(NavigationContext);
  if (navigation === undefined && root === undefined) {
    throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
  }

  // FIXME: Figure out a better way to do this
  return navigation ?? root;
}
;// ./node_modules/@react-navigation/core/lib/module/useFocusEffect.js




/**
 * Hook to run an effect in a focused screen, similar to `React.useEffect`.
 * This can be used to perform side-effects such as fetching data or subscribing to events.
 * The passed callback should be wrapped in `React.useCallback` to avoid running the effect too often.
 *
 * @param callback Memoized callback containing the effect, should optionally return a cleanup function.
 */
function useFocusEffect(effect) {
  const navigation = useNavigation();

  // eslint-disable-next-line prefer-rest-params
  if (arguments[1] !== undefined) {
    const message = "You passed a second argument to 'useFocusEffect', but it only accepts one argument. " + "If you want to pass a dependency array, you can use 'React.useCallback':\n\n" + 'useFocusEffect(\n' + '  React.useCallback(() => {\n' + '    // Your code here\n' + '  }, [depA, depB])\n' + ');\n\n' + 'See usage guide: https://reactnavigation.org/docs/use-focus-effect';
    console.error(message);
  }
  react.useEffect(() => {
    let isFocused = false;
    let cleanup;
    const callback = () => {
      const destroy = effect();
      if (destroy === undefined || typeof destroy === 'function') {
        return destroy;
      }
      if (false) // removed by dead control flow
{}
    };

    // We need to run the effect on initial render/dep changes if the screen is focused
    if (navigation.isFocused()) {
      cleanup = callback();
      isFocused = true;
    }
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on initial render, so we guard against running the effect twice
      if (isFocused) {
        return;
      }
      if (cleanup !== undefined) {
        cleanup();
      }
      cleanup = callback();
      isFocused = true;
    });
    const unsubscribeBlur = navigation.addListener('blur', () => {
      if (cleanup !== undefined) {
        cleanup();
      }
      cleanup = undefined;
      isFocused = false;
    });
    return () => {
      if (cleanup !== undefined) {
        cleanup();
      }
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [effect, navigation]);
}
;// ./node_modules/@react-navigation/core/lib/module/useIsFocused.js





/**
 * Hook to get the current focus state of the screen. Returns a `true` if screen is focused, otherwise `false`.
 * This can be used if a component needs to render something based on the focus state.
 */
function useIsFocused() {
  const navigation = useNavigation();
  const subscribe = react.useCallback(callback => {
    const unsubscribeFocus = navigation.addListener('focus', callback);
    const unsubscribeBlur = navigation.addListener('blur', callback);
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);
  const value = react.useSyncExternalStore(subscribe, navigation.isFocused, navigation.isFocused);
  return value;
}
// EXTERNAL MODULE: ./node_modules/fast-deep-equal/index.js
var fast_deep_equal = __webpack_require__(2017);
;// ./node_modules/@react-navigation/core/lib/module/useClientLayoutEffect.js




/**
 * Use `useEffect` during SSR and `useLayoutEffect` in the Browser & React Native to avoid warnings.
 */
const useClientLayoutEffect = typeof document !== 'undefined' || typeof navigator !== 'undefined' && navigator.product === 'ReactNative' ? react.useLayoutEffect : react.useEffect;
;// ./node_modules/@react-navigation/core/lib/module/useComponent.js




const NavigationContent = ({
  render,
  children
}) => {
  return render(children);
};
function useComponent(render) {
  const renderRef = react.useRef(render);

  // Normally refs shouldn't be mutated in render
  // But we return a component which will be rendered
  // So it's just for immediate consumption
  renderRef.current = render;
  react.useEffect(() => {
    renderRef.current = null;
  });
  return react.useRef(({
    children
  }) => {
    const render = renderRef.current;
    if (render === null) {
      throw new Error('The returned component must be rendered in the same render phase as the hook.');
    }
    return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContent, {
      render: render,
      children: children
    });
  }).current;
}
;// ./node_modules/@react-navigation/core/lib/module/useCurrentRender.js




/**
 * Write the current options, so that server renderer can get current values
 * Mutating values like this is not safe in async mode, but it doesn't apply to SSR
 */
function useCurrentRender({
  state,
  navigation,
  descriptors
}) {
  const current = react.useContext(CurrentRenderContext);
  if (current && navigation.isFocused()) {
    current.options = descriptors[state.routes[state.index].key].options;
  }
}
;// ./node_modules/@react-navigation/core/lib/module/NavigationFocusedRouteStateContext.js



/**
 * Context for the parent route of a navigator.
 */
const NavigationFocusedRouteStateContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/StaticContainer.js




/**
 * Component which prevents updates for children if no props changed
 */
const StaticContainer = /*#__PURE__*/react.memo(function StaticContainer(props) {
  return props.children;
}, (prevProps, nextProps) => {
  const prevPropKeys = Object.keys(prevProps);
  const nextPropKeys = Object.keys(nextProps);
  if (prevPropKeys.length !== nextPropKeys.length) {
    return false;
  }
  for (const key of prevPropKeys) {
    if (key === 'children') {
      continue;
    }
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  return true;
});
;// ./node_modules/@react-navigation/core/lib/module/SceneView.js










/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
function SceneView({
  screen,
  route,
  navigation,
  routeState,
  getState,
  setState,
  options,
  clearOptions
}) {
  const navigatorKeyRef = react.useRef(undefined);
  const getKey = react.useCallback(() => navigatorKeyRef.current, []);
  const {
    addOptionsGetter
  } = useOptionsGetters({
    key: route.key,
    options,
    navigation
  });
  const setKey = react.useCallback(key => {
    navigatorKeyRef.current = key;
  }, []);
  const getCurrentState = react.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find(r => r.key === route.key);
    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);
  const setCurrentState = react.useCallback(child => {
    const state = getState();
    const routes = state.routes.map(r => {
      if (r.key !== route.key) {
        return r;
      }
      const nextRoute = r.state !== child ? {
        ...r,
        state: child
      } : r;

      // Before updating the state, cleanup any nested screen and state
      // This will avoid the navigator trying to handle them again
      if (nextRoute.params && ('state' in nextRoute.params && typeof nextRoute.params.state === 'object' && nextRoute.params.state !== null || 'screen' in nextRoute.params && typeof nextRoute.params.screen === 'string')) {
        // @ts-expect-error: we don't have correct type for params
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          state,
          screen,
          params,
          initial,
          ...rest
        } = nextRoute.params;
        if (Object.keys(rest).length) {
          return {
            ...nextRoute,
            params: rest
          };
        } else {
          const {
            // We destructure the params to omit them
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            params,
            ...restRoute
          } = nextRoute;
          return restRoute;
        }
      }
      return nextRoute;
    });

    // Make sure not to update state if routes haven't changed
    // Otherwise this will result in params cleanup as well
    // We only want to cleanup params when state changes - after they are used
    if (!isArrayEqual(state.routes, routes)) {
      setState({
        ...state,
        routes
      });
    }
  }, [getState, route.key, setState]);
  const isInitialRef = react.useRef(true);
  react.useEffect(() => {
    isInitialRef.current = false;
  });

  // Clear options set by this screen when it is unmounted
  react.useEffect(() => {
    return clearOptions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getIsInitial = react.useCallback(() => isInitialRef.current, []);
  const parentFocusedRouteState = react.useContext(NavigationFocusedRouteStateContext);
  const focusedRouteState = react.useMemo(() => {
    const state = {
      routes: [{
        key: route.key,
        name: route.name,
        params: route.params,
        path: route.path
      }]
    };

    // Add our state to the innermost route of the parent state
    const addState = parent => {
      const parentRoute = parent?.routes[0];
      if (parentRoute) {
        return {
          routes: [{
            ...parentRoute,
            state: addState(parentRoute.state)
          }]
        };
      }
      return state;
    };
    return addState(parentFocusedRouteState);
  }, [parentFocusedRouteState, route.key, route.name, route.params, route.path]);
  const context = react.useMemo(() => ({
    state: routeState,
    getState: getCurrentState,
    setState: setCurrentState,
    getKey,
    setKey,
    getIsInitial,
    addOptionsGetter
  }), [routeState, getCurrentState, setCurrentState, getKey, setKey, getIsInitial, addOptionsGetter]);
  const ScreenComponent = screen.getComponent ? screen.getComponent() : screen.component;
  return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationStateContext.Provider, {
    value: context,
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationFocusedRouteStateContext.Provider, {
      value: focusedRouteState,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(EnsureSingleNavigator, {
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(StaticContainer, {
          name: screen.name,
          render: ScreenComponent || screen.children,
          navigation: navigation,
          route: route,
          children: ScreenComponent !== undefined ? /*#__PURE__*/(0,jsx_runtime.jsx)(ScreenComponent, {
            navigation: navigation,
            route: route
          }) : screen.children !== undefined ? screen.children({
            navigation,
            route
          }) : null
        })
      })
    })
  });
}
;// ./node_modules/@react-navigation/core/lib/module/useNavigationCache.js





/**
 * Hook to cache navigation objects for each screen in the navigator.
 * It's important to cache them to make sure navigation objects don't change between renders.
 * This lets us apply optimizations like `React.memo` to minimize re-rendering screens.
 */
function useNavigationCache({
  state,
  getState,
  navigation,
  setOptions,
  router,
  emitter
}) {
  const {
    stackRef
  } = react.useContext(NavigationBuilderContext);
  const base = react.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      emit,
      ...rest
    } = navigation;
    const actions = {
      ...router.actionCreators,
      ...CommonActions_namespaceObject
    };
    const dispatch = () => {
      throw new Error('Actions cannot be dispatched from a placeholder screen.');
    };
    const helpers = Object.keys(actions).reduce((acc, name) => {
      acc[name] = dispatch;
      return acc;
    }, {});
    return {
      ...rest,
      ...helpers,
      addListener: () => {
        // Event listeners are not supported for placeholder screens

        return () => {
          // Empty function
        };
      },
      removeListener: () => {
        // Event listeners are not supported for placeholder screens
      },
      dispatch,
      getParent: id => {
        if (id !== undefined && id === rest.getId()) {
          return base;
        }
        return rest.getParent(id);
      },
      setOptions: () => {
        throw new Error('Options cannot be set from a placeholder screen.');
      },
      isFocused: () => false
    };
  }, [navigation, router.actionCreators]);

  // Cache object which holds navigation objects for each screen
  // We use `React.useMemo` instead of `React.useRef` coz we want to invalidate it when deps change
  // In reality, these deps will rarely change, if ever
  const cache = react.useMemo(() => ({
    current: {}
  }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [base, getState, navigation, setOptions, emitter]);
  cache.current = state.routes.reduce((acc, route) => {
    const previous = cache.current[route.key];
    if (previous) {
      // If a cached navigation object already exists, reuse it
      acc[route.key] = previous;
    } else {
      const dispatch = thunk => {
        const action = typeof thunk === 'function' ? thunk(getState()) : thunk;
        if (action != null) {
          navigation.dispatch({
            source: route.key,
            ...action
          });
        }
      };
      const withStack = callback => {
        let isStackSet = false;
        try {
          if (false) // removed by dead control flow
{}
          callback();
        } finally {
          if (isStackSet && stackRef) {
            stackRef.current = undefined;
          }
        }
      };
      const actions = {
        ...router.actionCreators,
        ...CommonActions_namespaceObject
      };
      const helpers = Object.keys(actions).reduce((acc, name) => {
        acc[name] = (...args) => withStack(() =>
        // @ts-expect-error: name is a valid key, but TypeScript is dumb
        dispatch(actions[name](...args)));
        return acc;
      }, {});
      acc[route.key] = {
        ...base,
        ...helpers,
        // FIXME: too much work to fix the types for now
        ...emitter.create(route.key),
        dispatch: thunk => withStack(() => dispatch(thunk)),
        getParent: id => {
          if (id !== undefined && id === base.getId()) {
            // If the passed id is the same as the current navigation id,
            // we return the cached navigation object for the relevant route
            return acc[route.key];
          }
          return base.getParent(id);
        },
        setOptions: options => {
          setOptions(o => ({
            ...o,
            [route.key]: {
              ...o[route.key],
              ...options
            }
          }));
        },
        isFocused: () => {
          const state = base.getState();
          if (state.routes[state.index].key !== route.key) {
            return false;
          }

          // If the current screen is focused, we also need to check if parent navigator is focused
          // This makes sure that we return the focus state in the whole tree, not just this navigator
          return navigation ? navigation.isFocused() : true;
        }
      };
    }
    return acc;
  }, {});
  return {
    base,
    navigations: cache.current
  };
}
;// ./node_modules/@react-navigation/core/lib/module/useDescriptors.js











/**
 * Hook to create descriptor objects for the child routes.
 *
 * A descriptor object provides 3 things:
 * - Helper method to render a screen
 * - Options specified by the screen for the navigator
 * - Navigation object intended for the route
 */
function useDescriptors({
  state,
  screens,
  navigation,
  screenOptions,
  screenLayout,
  onAction,
  getState,
  setState,
  addListener,
  addKeyedListener,
  onRouteFocus,
  router,
  emitter
}) {
  const theme = react.useContext(ThemeContext);
  const [options, setOptions] = react.useState({});
  const {
    onDispatchAction,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef
  } = react.useContext(NavigationBuilderContext);
  const context = react.useMemo(() => ({
    navigation,
    onAction,
    addListener,
    addKeyedListener,
    onRouteFocus,
    onDispatchAction,
    onOptionsChange,
    scheduleUpdate,
    flushUpdates,
    stackRef
  }), [navigation, onAction, addListener, addKeyedListener, onRouteFocus, onDispatchAction, onOptionsChange, scheduleUpdate, flushUpdates, stackRef]);
  const {
    base,
    navigations
  } = useNavigationCache({
    state,
    getState,
    navigation,
    setOptions,
    router,
    emitter
  });
  const routes = useRouteCache(state.routes);
  const getOptions = (route, navigation, overrides) => {
    const config = screens[route.name];
    const screen = config.props;
    const optionsList = [
    // The default `screenOptions` passed to the navigator
    screenOptions,
    // The `screenOptions` props passed to `Group` elements
    ...(config.options ? config.options.filter(Boolean) : []),
    // The `options` prop passed to `Screen` elements,
    screen.options,
    // The options set via `navigation.setOptions`
    overrides];
    return optionsList.reduce((acc, curr) => Object.assign(acc,
    // @ts-expect-error: we check for function but TS still complains
    typeof curr !== 'function' ? curr : curr({
      route,
      navigation,
      theme
    })), {});
  };
  const render = (route, navigation, customOptions, routeState) => {
    const config = screens[route.name];
    const screen = config.props;
    const clearOptions = () => setOptions(o => {
      if (route.key in o) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          [route.key]: _,
          ...rest
        } = o;
        return rest;
      }
      return o;
    });
    const layout =
    // The `layout` prop passed to `Screen` elements,
    screen.layout ??
    // The `screenLayout` props passed to `Group` elements
    config.layout ??
    // The default `screenLayout` passed to the navigator
    screenLayout;
    let element = /*#__PURE__*/(0,jsx_runtime.jsx)(SceneView, {
      navigation: navigation,
      route: route,
      screen: screen,
      routeState: routeState,
      getState: getState,
      setState: setState,
      options: customOptions,
      clearOptions: clearOptions
    });
    if (layout != null) {
      element = layout({
        route,
        navigation,
        options: customOptions,
        // @ts-expect-error: in practice `theme` will be defined
        theme,
        children: element
      });
    }
    return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationBuilderContext.Provider, {
      value: context,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContext.Provider, {
        value: navigation,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationRouteContext.Provider, {
          value: route,
          children: element
        })
      })
    }, route.key);
  };
  const descriptors = routes.reduce((acc, route, i) => {
    const navigation = navigations[route.key];
    const customOptions = getOptions(route, navigation, options[route.key]);
    const element = render(route, navigation, customOptions, state.routes[i].state);
    acc[route.key] = {
      route,
      // @ts-expect-error: it's missing action helpers, fix later
      navigation,
      render() {
        return element;
      },
      options: customOptions
    };
    return acc;
  }, {});

  /**
   * Create a descriptor object for a route.
   *
   * @param route Route object for which the descriptor should be created
   * @param placeholder Whether the descriptor should be a placeholder, e.g. for a route not yet in the state
   * @returns Descriptor object
   */
  const describe = (route, placeholder) => {
    if (!placeholder) {
      if (!(route.key in descriptors)) {
        throw new Error(`Couldn't find a route with the key ${route.key}.`);
      }
      return descriptors[route.key];
    }
    const navigation = base;
    const customOptions = getOptions(route, navigation, {});
    const element = render(route, navigation, customOptions, undefined);
    return {
      route,
      navigation,
      render() {
        return element;
      },
      options: customOptions
    };
  };
  return {
    describe,
    descriptors
  };
}
;// ./node_modules/@react-navigation/core/lib/module/useFocusedListenersChildrenAdapter.js




/**
 * Hook for passing focus callback to children
 */
function useFocusedListenersChildrenAdapter({
  navigation,
  focusedListeners
}) {
  const {
    addListener
  } = react.useContext(NavigationBuilderContext);
  const listener = react.useCallback(callback => {
    if (navigation.isFocused()) {
      for (const listener of focusedListeners) {
        const {
          handled,
          result
        } = listener(callback);
        if (handled) {
          return {
            handled,
            result
          };
        }
      }
      return {
        handled: true,
        result: callback(navigation)
      };
    } else {
      return {
        handled: false,
        result: null
      };
    }
  }, [focusedListeners, navigation]);
  react.useEffect(() => addListener?.('focus', listener), [addListener, listener]);
}
;// ./node_modules/@react-navigation/core/lib/module/useFocusEvents.js




/**
 * Hook to take care of emitting `focus` and `blur` events.
 */
function useFocusEvents({
  state,
  emitter
}) {
  const navigation = react.useContext(NavigationContext);
  const lastFocusedKeyRef = react.useRef(undefined);
  const currentFocusedKey = state.routes[state.index].key;

  // When the parent screen changes its focus state, we also need to change child's focus
  // Coz the child screen can't be focused if the parent screen is out of focus
  react.useEffect(() => navigation?.addListener('focus', () => {
    lastFocusedKeyRef.current = currentFocusedKey;
    emitter.emit({
      type: 'focus',
      target: currentFocusedKey
    });
  }), [currentFocusedKey, emitter, navigation]);
  react.useEffect(() => navigation?.addListener('blur', () => {
    lastFocusedKeyRef.current = undefined;
    emitter.emit({
      type: 'blur',
      target: currentFocusedKey
    });
  }), [currentFocusedKey, emitter, navigation]);
  react.useEffect(() => {
    const lastFocusedKey = lastFocusedKeyRef.current;
    lastFocusedKeyRef.current = currentFocusedKey;

    // We wouldn't have `lastFocusedKey` on initial mount
    // Fire focus event for the current route on mount if there's no parent navigator
    if (lastFocusedKey === undefined && !navigation) {
      emitter.emit({
        type: 'focus',
        target: currentFocusedKey
      });
    }

    // We should only emit events when the focused key changed and navigator is focused
    // When navigator is not focused, screens inside shouldn't receive focused status either
    if (lastFocusedKey === currentFocusedKey || !(navigation ? navigation.isFocused() : true)) {
      return;
    }
    if (lastFocusedKey === undefined) {
      // Only fire events after initial mount
      return;
    }
    emitter.emit({
      type: 'blur',
      target: lastFocusedKey
    });
    emitter.emit({
      type: 'focus',
      target: currentFocusedKey
    });
  }, [currentFocusedKey, emitter, navigation]);
}
;// ./node_modules/@react-navigation/core/lib/module/useLazyValue.js



function useLazyValue(create) {
  const lazyRef = react.useRef(undefined);
  if (lazyRef.current === undefined) {
    lazyRef.current = create();
  }
  return lazyRef.current;
}
;// ./node_modules/@react-navigation/core/lib/module/useNavigationHelpers.js






// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
PrivateValueStore;
/**
 * Navigation object with helper methods to be used by a navigator.
 * This object includes methods for common actions as well as methods the parent screen's navigation object.
 */
function useNavigationHelpers({
  id: navigatorId,
  onAction,
  onUnhandledAction,
  getState,
  emitter,
  router,
  stateRef
}) {
  const parentNavigationHelpers = react.useContext(NavigationContext);
  return react.useMemo(() => {
    const dispatch = op => {
      const action = typeof op === 'function' ? op(getState()) : op;
      const handled = onAction(action);
      if (!handled) {
        onUnhandledAction?.(action);
      }
    };
    const actions = {
      ...router.actionCreators,
      ...CommonActions_namespaceObject
    };
    const helpers = Object.keys(actions).reduce((acc, name) => {
      // @ts-expect-error: name is a valid key, but TypeScript is dumb
      acc[name] = (...args) => dispatch(actions[name](...args));
      return acc;
    }, {});
    const navigationHelpers = {
      ...parentNavigationHelpers,
      ...helpers,
      dispatch,
      emit: emitter.emit,
      isFocused: parentNavigationHelpers ? parentNavigationHelpers.isFocused : () => true,
      canGoBack: () => {
        const state = getState();
        return router.getStateForAction(state, goBack(), {
          routeNames: state.routeNames,
          routeParamList: {},
          routeGetIdList: {}
        }) !== null || parentNavigationHelpers?.canGoBack() || false;
      },
      getId: () => navigatorId,
      getParent: id => {
        if (id !== undefined) {
          let current = navigationHelpers;
          while (current && id !== current.getId()) {
            current = current.getParent();
          }
          return current;
        }
        return parentNavigationHelpers;
      },
      getState: () => {
        // FIXME: Workaround for when the state is read during render
        // By this time, we haven't committed the new state yet
        // Without this `useSyncExternalStore` will keep reading the old state
        // This may result in `useNavigationState` or `useIsFocused` returning wrong values
        // Apart from `useSyncExternalStore`, `getState` should never be called during render
        if (stateRef.current != null) {
          return stateRef.current;
        }
        return getState();
      }
    };
    return navigationHelpers;
  }, [router, parentNavigationHelpers, emitter.emit, getState, onAction, onUnhandledAction, navigatorId, stateRef]);
}
// EXTERNAL MODULE: ./node_modules/use-sync-external-store/with-selector.js
var with_selector = __webpack_require__(8418);
;// ./node_modules/@react-navigation/core/lib/module/useNavigationState.js






/**
 * Hook to get a value from the current navigation state using a selector.
 *
 * @param selector Selector function to get a value from the state.
 */
function useNavigationState(selector) {
  const stateListener = react.useContext(NavigationStateListenerContext);
  if (stateListener == null) {
    throw new Error("Couldn't get the navigation state. Is your component inside a navigator?");
  }
  const value = (0,with_selector.useSyncExternalStoreWithSelector)(stateListener.subscribe,
  // @ts-expect-error: this is unsafe, but needed to make the generic work
  stateListener.getState, stateListener.getState, selector);
  return value;
}
function NavigationStateListenerProvider({
  state,
  children
}) {
  const listeners = react.useRef([]);
  const getState = (0,esm/* default */.A)(() => state);
  const subscribe = (0,esm/* default */.A)(callback => {
    listeners.current.push(callback);
    return () => {
      listeners.current = listeners.current.filter(cb => cb !== callback);
    };
  });
  react.useEffect(() => {
    listeners.current.forEach(callback => callback());
  }, [state]);
  const context = react.useMemo(() => ({
    getState,
    subscribe
  }), [getState, subscribe]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationStateListenerContext.Provider, {
    value: context,
    children: children
  });
}
const NavigationStateListenerContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/core/lib/module/useOnPreventRemove.js





const VISITED_ROUTE_KEYS = Symbol('VISITED_ROUTE_KEYS');
const shouldPreventRemove = (emitter, beforeRemoveListeners, currentRoutes, nextRoutes, action) => {
  const nextRouteKeys = nextRoutes.map(route => route.key);

  // Call these in reverse order so last screens handle the event first
  const removedRoutes = currentRoutes.filter(route => !nextRouteKeys.includes(route.key)).reverse();
  const visitedRouteKeys =
  // @ts-expect-error: add this property to mark that we've already emitted this action
  action[VISITED_ROUTE_KEYS] ?? new Set();
  const beforeRemoveAction = {
    ...action,
    [VISITED_ROUTE_KEYS]: visitedRouteKeys
  };
  for (const route of removedRoutes) {
    if (visitedRouteKeys.has(route.key)) {
      // Skip if we've already emitted this action for this screen
      continue;
    }

    // First, we need to check if any child screens want to prevent it
    const isPrevented = beforeRemoveListeners[route.key]?.(beforeRemoveAction);
    if (isPrevented) {
      return true;
    }
    visitedRouteKeys.add(route.key);
    const event = emitter.emit({
      type: 'beforeRemove',
      target: route.key,
      data: {
        action: beforeRemoveAction
      },
      canPreventDefault: true
    });
    if (event.defaultPrevented) {
      return true;
    }
  }
  return false;
};
function useOnPreventRemove({
  getState,
  emitter,
  beforeRemoveListeners
}) {
  const {
    addKeyedListener
  } = react.useContext(NavigationBuilderContext);
  const route = react.useContext(NavigationRouteContext);
  const routeKey = route?.key;
  react.useEffect(() => {
    if (routeKey) {
      return addKeyedListener?.('beforeRemove', routeKey, action => {
        const state = getState();
        return shouldPreventRemove(emitter, beforeRemoveListeners, state.routes, [], action);
      });
    }
  }, [addKeyedListener, beforeRemoveListeners, emitter, getState, routeKey]);
}
;// ./node_modules/@react-navigation/core/lib/module/useOnAction.js






/**
 * Hook to handle actions for a navigator, including state updates and bubbling.
 *
 * Bubbling an action is achieved in 2 ways:
 * 1. To bubble action to parent, we expose the action handler in context and then access the parent context
 * 2. To bubble action to child, child adds event listeners subscribing to actions from parent
 *
 * When the action handler handles as action, it returns `true`, otherwise `false`.
 */
function useOnAction({
  router,
  getState,
  setState,
  key,
  actionListeners,
  beforeRemoveListeners,
  routerConfigOptions,
  emitter
}) {
  const {
    onAction: onActionParent,
    onRouteFocus: onRouteFocusParent,
    addListener: addListenerParent,
    onDispatchAction
  } = react.useContext(NavigationBuilderContext);
  const navigationInChildEnabled = react.useContext(DeprecatedNavigationInChildContext);
  const routerConfigOptionsRef = react.useRef(routerConfigOptions);
  react.useEffect(() => {
    routerConfigOptionsRef.current = routerConfigOptions;
  });
  const onAction = react.useCallback((action, visitedNavigators = new Set()) => {
    const state = getState();

    // Since actions can bubble both up and down, they could come to the same navigator again
    // We keep track of navigators which have already tried to handle the action and return if it's already visited
    if (visitedNavigators.has(state.key)) {
      return false;
    }
    visitedNavigators.add(state.key);
    if (typeof action.target !== 'string' || action.target === state.key) {
      let result = router.getStateForAction(state, action, routerConfigOptionsRef.current);

      // If a target is specified and set to current navigator, the action shouldn't bubble
      // So instead of `null`, we use the state object for such cases to signal that action was handled
      result = result === null && action.target === state.key ? state : result;
      if (result !== null) {
        onDispatchAction(action, state === result);
        if (state !== result) {
          const isPrevented = shouldPreventRemove(emitter, beforeRemoveListeners, state.routes, result.routes, action);
          if (isPrevented) {
            return true;
          }
          setState(result);
        }
        if (onRouteFocusParent !== undefined) {
          // Some actions such as `NAVIGATE` also want to bring the navigated route to focus in the whole tree
          // This means we need to focus all of the parent navigators of this navigator as well
          const shouldFocus = router.shouldActionChangeFocus(action);
          if (shouldFocus && key !== undefined) {
            onRouteFocusParent(key);
          }
        }
        return true;
      }
    }
    if (onActionParent !== undefined) {
      // Bubble action to the parent if the current navigator didn't handle it
      if (onActionParent(action, visitedNavigators)) {
        return true;
      }
    }
    if (typeof action.target === 'string' ||
    // For backward compatibility
    action.type === 'NAVIGATE_DEPRECATED' || navigationInChildEnabled) {
      // If the action wasn't handled by current navigator or a parent navigator, let children handle it
      // Handling this when target isn't specified is deprecated and will be removed in the future
      for (let i = actionListeners.length - 1; i >= 0; i--) {
        const listener = actionListeners[i];
        if (listener(action, visitedNavigators)) {
          return true;
        }
      }
    }
    return false;
  }, [actionListeners, beforeRemoveListeners, emitter, getState, navigationInChildEnabled, key, onActionParent, onDispatchAction, onRouteFocusParent, router, setState]);
  useOnPreventRemove({
    getState,
    emitter,
    beforeRemoveListeners
  });
  react.useEffect(() => addListenerParent?.('action', onAction), [addListenerParent, onAction]);
  return onAction;
}
;// ./node_modules/@react-navigation/core/lib/module/useOnGetState.js






function useOnGetState({
  getState,
  getStateListeners
}) {
  const {
    addKeyedListener
  } = react.useContext(NavigationBuilderContext);
  const route = react.useContext(NavigationRouteContext);
  const key = route ? route.key : 'root';
  const getRehydratedState = react.useCallback(() => {
    const state = getState();

    // Avoid returning new route objects if we don't need to
    const routes = state.routes.map(route => {
      const childState = getStateListeners[route.key]?.();
      if (route.state === childState) {
        return route;
      }
      return {
        ...route,
        state: childState
      };
    });
    if (isArrayEqual(state.routes, routes)) {
      return state;
    }
    return {
      ...state,
      routes
    };
  }, [getState, getStateListeners]);
  react.useEffect(() => {
    return addKeyedListener?.('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);
}
;// ./node_modules/@react-navigation/core/lib/module/useOnRouteFocus.js




/**
 * Hook to handle focus actions for a route.
 * Focus action needs to be treated specially, coz when a nested route is focused,
 * the parent navigators also needs to be focused.
 */
function useOnRouteFocus({
  router,
  getState,
  key: sourceRouteKey,
  setState
}) {
  const {
    onRouteFocus: onRouteFocusParent
  } = react.useContext(NavigationBuilderContext);
  return react.useCallback(key => {
    const state = getState();
    const result = router.getStateForRouteFocus(state, key);
    if (result !== state) {
      setState(result);
    }
    if (onRouteFocusParent !== undefined && sourceRouteKey !== undefined) {
      onRouteFocusParent(sourceRouteKey);
    }
  }, [getState, onRouteFocusParent, router, setState, sourceRouteKey]);
}
;// ./node_modules/@react-navigation/core/lib/module/useRegisterNavigator.js






/**
 * Register a navigator in the parent context (either a navigation container or a screen).
 * This is used to prevent multiple navigators under a single container or screen.
 */
function useRegisterNavigator() {
  const [key] = react.useState(() => nanoid());
  const container = react.useContext(SingleNavigatorContext);
  if (container === undefined) {
    throw new Error("Couldn't register the navigator. Have you wrapped your app with 'NavigationContainer'?\n\nThis can also happen if there are multiple copies of '@react-navigation' packages installed.");
  }
  react.useEffect(() => {
    const {
      register,
      unregister
    } = container;
    register(key);
    return () => unregister(key);
  }, [container, key]);
  return key;
}
;// ./node_modules/@react-navigation/core/lib/module/useScheduleUpdate.js






/**
 * When screen config changes, we want to update the navigator in the same update phase.
 * However, navigation state is in the root component and React won't let us update it from a child.
 * This is a workaround for that, the scheduled update is stored in the ref without actually calling setState.
 * It lets all subsequent updates access the latest state so it stays correct.
 * Then we call setState during after the component updates.
 */
function useScheduleUpdate(callback) {
  const {
    scheduleUpdate,
    flushUpdates
  } = react.useContext(NavigationBuilderContext);

  // FIXME: This is potentially unsafe
  // However, since we are using sync store, it might be fine
  scheduleUpdate(callback);
  useClientLayoutEffect(flushUpdates);
}
;// ./node_modules/@react-navigation/core/lib/module/useNavigationBuilder.js





































// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions

PrivateValueStore;
const isScreen = child => {
  return child.type === Screen;
};
const isGroup = child => {
  return child.type === react.Fragment || child.type === Group;
};
const isValidKey = key => key === undefined || typeof key === 'string' && key !== '';

/**
 * Extract route config object from React children elements.
 *
 * @param children React Elements to extract the config from.
 */
const getRouteConfigsFromChildren = (children, groupKey, groupOptions, groupLayout) => {
  const configs = react.Children.toArray(children).reduce((acc, child) => {
    if (/*#__PURE__*/react.isValidElement(child)) {
      if (isScreen(child)) {
        // We can only extract the config from `Screen` elements
        // If something else was rendered, it's probably a bug

        if (typeof child.props !== 'object' || child.props === null) {
          throw new Error(`Got an invalid element for screen.`);
        }
        if (typeof child.props.name !== 'string' || child.props.name === '') {
          throw new Error(`Got an invalid name (${JSON.stringify(child.props.name)}) for the screen. It must be a non-empty string.`);
        }
        if (child.props.navigationKey !== undefined && (typeof child.props.navigationKey !== 'string' || child.props.navigationKey === '')) {
          throw new Error(`Got an invalid 'navigationKey' prop (${JSON.stringify(child.props.navigationKey)}) for the screen '${child.props.name}'. It must be a non-empty string or 'undefined'.`);
        }
        acc.push({
          keys: [groupKey, child.props.navigationKey],
          options: groupOptions,
          layout: groupLayout,
          props: child.props
        });
        return acc;
      }
      if (isGroup(child)) {
        if (!isValidKey(child.props.navigationKey)) {
          throw new Error(`Got an invalid 'navigationKey' prop (${JSON.stringify(child.props.navigationKey)}) for the group. It must be a non-empty string or 'undefined'.`);
        }

        // When we encounter a fragment or group, we need to dive into its children to extract the configs
        // This is handy to conditionally define a group of screens
        acc.push(...getRouteConfigsFromChildren(child.props.children, child.props.navigationKey,
        // FIXME
        // @ts-expect-error: add validation
        child.type !== Group ? groupOptions : groupOptions != null ? [...groupOptions, child.props.screenOptions] : [child.props.screenOptions], typeof child.props.screenLayout === 'function' ? child.props.screenLayout : groupLayout));
        return acc;
      }
    }
    throw new Error(`A navigator can only contain 'Screen', 'Group' or 'React.Fragment' as its direct children (found ${/*#__PURE__*/ /*#__PURE__*/react.isValidElement(child) ? `'${typeof child.type === 'string' ? child.type : child.type?.name}'${child.props != null && typeof child.props === 'object' && 'name' in child.props && child.props?.name ? ` for the screen '${child.props.name}'` : ''}` : typeof child === 'object' ? JSON.stringify(child) : `'${String(child)}'`}). To render this component in the navigator, pass it in the 'component' prop to 'Screen'.`);
  }, []);
  if (false) // removed by dead control flow
{}
  return configs;
};
const getStateFromParams = params => {
  if (params?.state != null) {
    return params.state;
  } else if (typeof params?.screen === 'string' && params?.initial !== false) {
    return {
      routes: [{
        name: params.screen,
        params: params.params,
        path: params.path
      }]
    };
  }
  return undefined;
};

/**
 * Hook for building navigators.
 *
 * @param createRouter Factory method which returns router object.
 * @param options Options object containing `children` and additional options for the router.
 * @returns An object containing `state`, `navigation`, `descriptors` objects.
 */
function useNavigationBuilder(createRouter, options) {
  const navigatorKey = useRegisterNavigator();
  const route = react.useContext(NavigationRouteContext);
  const {
    children,
    layout,
    screenOptions,
    screenLayout,
    screenListeners,
    UNSTABLE_router,
    ...rest
  } = options;
  const routeConfigs = getRouteConfigsFromChildren(children);
  const router = useLazyValue(() => {
    if (rest.initialRouteName != null && routeConfigs.every(config => config.props.name !== rest.initialRouteName)) {
      throw new Error(`Couldn't find a screen named '${rest.initialRouteName}' to use as 'initialRouteName'.`);
    }
    const original = createRouter(rest);
    if (UNSTABLE_router != null) {
      const overrides = UNSTABLE_router(original);
      return {
        ...original,
        ...overrides
      };
    }
    return original;
  });
  const screens = routeConfigs.reduce((acc, config) => {
    if (config.props.name in acc) {
      throw new Error(`A navigator cannot contain multiple 'Screen' components with the same name (found duplicate screen named '${config.props.name}')`);
    }
    acc[config.props.name] = config;
    return acc;
  }, {});
  const routeNames = routeConfigs.map(config => config.props.name);
  const routeKeyList = routeNames.reduce((acc, curr) => {
    acc[curr] = screens[curr].keys.map(key => key ?? '').join(':');
    return acc;
  }, {});
  const routeParamList = routeNames.reduce((acc, curr) => {
    const {
      initialParams
    } = screens[curr].props;
    acc[curr] = initialParams;
    return acc;
  }, {});
  const routeGetIdList = routeNames.reduce((acc, curr) => Object.assign(acc, {
    [curr]: screens[curr].props.getId
  }), {});
  if (!routeNames.length) {
    throw new Error("Couldn't find any screens for the navigator. Have you defined any screens as its children?");
  }
  const isStateValid = react.useCallback(state => state.type === undefined || state.type === router.type, [router.type]);
  const isStateInitialized = react.useCallback(state => state !== undefined && state.stale === false && isStateValid(state), [isStateValid]);
  const doesStateHaveOnlyInvalidRoutes = react.useCallback(state => state.routes.every(r => !routeNames.includes(r.name)), [routeNames]);
  const {
    state: currentState,
    getState: getCurrentState,
    setState: setCurrentState,
    setKey,
    getKey,
    getIsInitial
  } = react.useContext(NavigationStateContext);
  const stateCleanedUp = react.useRef(false);
  const setState = (0,esm/* default */.A)(state => {
    if (stateCleanedUp.current) {
      // State might have been already cleaned up due to unmount
      // We do not want to expose API allowing to override this
      // This would lead to old data preservation on main navigator unmount
      return;
    }
    setCurrentState(state);
  });
  const [stateBeforeInitialization, initializedState, isFirstStateInitialization] = react.useMemo(() => {
    const initialRouteParamList = routeNames.reduce((acc, curr) => {
      const {
        initialParams
      } = screens[curr].props;
      const initialParamsFromParams = route?.params?.state == null && route?.params?.initial !== false && route?.params?.screen === curr ? route.params.params : undefined;
      acc[curr] = initialParams !== undefined || initialParamsFromParams !== undefined ? {
        ...initialParams,
        ...initialParamsFromParams
      } : undefined;
      return acc;
    }, {});

    // If the current state isn't initialized on first render, we initialize it
    // We also need to re-initialize it if the state passed from parent was changed (maybe due to reset)
    // Otherwise assume that the state was provided as initial state
    // So we need to rehydrate it to make it usable
    if ((currentState === undefined || !isStateValid(currentState)) && route?.params?.state == null && !(typeof route?.params?.screen === 'string' && route?.params?.initial !== false)) {
      return [undefined, router.getInitialState({
        routeNames,
        routeParamList: initialRouteParamList,
        routeGetIdList
      }), true];
    } else {
      const stateFromParams = getStateFromParams(route?.params);
      const stateBeforeInitialization = stateFromParams ?? currentState;
      const hydratedState = router.getRehydratedState(stateBeforeInitialization, {
        routeNames,
        routeParamList: initialRouteParamList,
        routeGetIdList
      });
      if (options.UNSTABLE_routeNamesChangeBehavior === 'lastUnhandled' && doesStateHaveOnlyInvalidRoutes(stateBeforeInitialization)) {
        return [stateBeforeInitialization, hydratedState, true];
      }
      return [undefined, hydratedState, false];
    }
    // We explicitly don't include routeNames, route.params etc. in the dep list
    // below. We want to avoid forcing a new state to be calculated in those cases
    // Instead, we handle changes to these in the nextState code below. Note
    // that some changes to routeConfigs are explicitly ignored, such as changes
    // to initialParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState, router, isStateValid]);
  const previousRouteKeyListRef = react.useRef(routeKeyList);
  react.useEffect(() => {
    previousRouteKeyListRef.current = routeKeyList;
  });
  const previousRouteKeyList = previousRouteKeyListRef.current;
  const [unhandledState, setUnhandledState] = react.useState(stateBeforeInitialization);

  // An unhandled state is state that didn't have any valid routes
  // So it was unhandled, i.e. not used for initializing the state
  // It's possible that they were absent due to conditional render
  // Store this state so we can reuse it if the routes change later
  if (options.UNSTABLE_routeNamesChangeBehavior === 'lastUnhandled' && stateBeforeInitialization && unhandledState !== stateBeforeInitialization) {
    setUnhandledState(stateBeforeInitialization);
  }
  let state =
  // If the state isn't initialized, or stale, use the state we initialized instead
  // The state won't update until there's a change needed in the state we have initialized locally
  // So it'll be `undefined` or stale until the first navigation event happens
  isStateInitialized(currentState) ? currentState : initializedState;
  let nextState = state;
  let shouldClearUnhandledState = false;

  // Previously unhandled state is now valid again
  // And current state no longer has any valid routes
  // We should reuse the unhandled state instead of re-calculating the state
  if (unhandledState?.routes.every(r => routeNames.includes(r.name)) && state?.routes.every(r => !routeNames.includes(r.name))) {
    shouldClearUnhandledState = true;
    nextState = router.getRehydratedState(unhandledState, {
      routeNames,
      routeParamList,
      routeGetIdList
    });
  } else if (!isArrayEqual(state.routeNames, routeNames) || !isRecordEqual(routeKeyList, previousRouteKeyList)) {
    // When the list of route names change, the router should handle it to remove invalid routes
    nextState = router.getStateForRouteNamesChange(state, {
      routeNames,
      routeParamList,
      routeGetIdList,
      routeKeyChanges: Object.keys(routeKeyList).filter(name => name in previousRouteKeyList && routeKeyList[name] !== previousRouteKeyList[name])
    });
  }
  const previousNestedParamsRef = react.useRef(route?.params);
  react.useEffect(() => {
    previousNestedParamsRef.current = route?.params;
  }, [route?.params]);
  if (route?.params) {
    const previousParams = previousNestedParamsRef.current;
    let action;
    if (typeof route.params.state === 'object' && route.params.state != null && route.params !== previousParams) {
      if (options.UNSTABLE_routeNamesChangeBehavior === 'lastUnhandled' && doesStateHaveOnlyInvalidRoutes(route.params.state)) {
        if (route.params.state !== unhandledState) {
          setUnhandledState(route.params.state);
        }
      } else {
        // If the route was updated with new state, we should reset to it
        action = CommonActions_reset(route.params.state);
      }
    } else if (typeof route.params.screen === 'string' && (route.params.initial === false && isFirstStateInitialization || route.params !== previousParams)) {
      if (options.UNSTABLE_routeNamesChangeBehavior === 'lastUnhandled' && !routeNames.includes(route.params.screen)) {
        const state = getStateFromParams(route.params);
        if (state != null && !fast_deep_equal(state, unhandledState)) {
          setUnhandledState(state);
        }
      } else {
        // If the route was updated with new screen name and/or params, we should navigate there
        action = CommonActions_navigate({
          name: route.params.screen,
          params: route.params.params,
          path: route.params.path,
          merge: route.params.merge,
          pop: route.params.pop
        });
      }
    }

    // The update should be limited to current navigator only, so we call the router manually
    const updatedState = action ? router.getStateForAction(nextState, action, {
      routeNames,
      routeParamList,
      routeGetIdList
    }) : null;
    nextState = updatedState !== null ? router.getRehydratedState(updatedState, {
      routeNames,
      routeParamList,
      routeGetIdList
    }) : nextState;
  }
  const shouldUpdate = state !== nextState || typeof route?.params?.state === 'object' || typeof route?.params?.screen === 'string';
  useScheduleUpdate(() => {
    if (shouldUpdate) {
      // If the state needs to be updated, we'll schedule an update
      setState(nextState);
      if (shouldClearUnhandledState) {
        setUnhandledState(undefined);
      }
    }
  });

  // The up-to-date state will come in next render, but we don't need to wait for it
  // We can't use the outdated state since the screens have changed, which will cause error due to mismatched config
  // So we override the state object we return to use the latest state as soon as possible
  state = nextState;
  react.useEffect(() => {
    // In strict mode, React will double-invoke effects.
    // So we need to reset the flag if component was not unmounted
    stateCleanedUp.current = false;
    setKey(navigatorKey);
    if (!getIsInitial()) {
      // If it's not initial render, we need to update the state
      // This will make sure that our container gets notifier of state changes due to new mounts
      // This is necessary for proper screen tracking, URL updates etc.
      setState(nextState);
    }
    return () => {
      // We need to clean up state for this navigator on unmount
      if (getCurrentState() !== undefined && getKey() === navigatorKey) {
        setCurrentState(undefined);
        stateCleanedUp.current = true;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // In some cases (e.g. route names change), internal state might have changed
  // But it hasn't been committed yet, so hasn't propagated to the sync external store
  // During this time, we need to return the internal state in `getState`
  // Otherwise it can result in inconsistent state during render in children
  // To avoid this, we use a ref for render phase, and immediately clear it on commit
  const stateRef = react.useRef(state);
  stateRef.current = state;
  useClientLayoutEffect(() => {
    stateRef.current = null;
  });
  const getState = (0,esm/* default */.A)(() => {
    const currentState = getCurrentState();
    return deepFreeze(isStateInitialized(currentState) ? currentState : initializedState);
  });
  const emitter = useEventEmitter(e => {
    const routeNames = [];
    let route;
    if (e.target) {
      route = state.routes.find(route => route.key === e.target);
      if (route?.name) {
        routeNames.push(route.name);
      }
    } else {
      route = state.routes[state.index];
      routeNames.push(...Object.keys(screens).filter(name => route?.name === name));
    }
    if (route == null) {
      return;
    }
    const navigation = descriptors[route.key].navigation;
    const listeners = [].concat(
    // Get an array of listeners for all screens + common listeners on navigator
    ...[screenListeners, ...routeNames.map(name => {
      const {
        listeners
      } = screens[name].props;
      return listeners;
    })].map(listeners => {
      const map = typeof listeners === 'function' ? listeners({
        route: route,
        navigation
      }) : listeners;
      return map ? Object.keys(map).filter(type => type === e.type).map(type => map?.[type]) : undefined;
    }))
    // We don't want same listener to be called multiple times for same event
    // So we remove any duplicate functions from the array
    .filter((cb, i, self) => cb && self.lastIndexOf(cb) === i);
    listeners.forEach(listener => listener?.(e));
  });
  useFocusEvents({
    state,
    emitter
  });
  react.useEffect(() => {
    emitter.emit({
      type: 'state',
      data: {
        state
      }
    });
  }, [emitter, state]);
  const {
    listeners: childListeners,
    addListener
  } = useChildListeners();
  const {
    keyedListeners,
    addKeyedListener
  } = useKeyedChildListeners();
  const onAction = useOnAction({
    router,
    getState,
    setState,
    key: route?.key,
    actionListeners: childListeners.action,
    beforeRemoveListeners: keyedListeners.beforeRemove,
    routerConfigOptions: {
      routeNames,
      routeParamList,
      routeGetIdList
    },
    emitter
  });
  const onRouteFocus = useOnRouteFocus({
    router,
    key: route?.key,
    getState,
    setState
  });
  const onUnhandledActionParent = react.useContext(UnhandledActionContext);
  const onUnhandledAction = (0,esm/* default */.A)(action => {
    if (options.UNSTABLE_routeNamesChangeBehavior === 'lastUnhandled' && action.type === 'NAVIGATE' && action.payload != null && 'name' in action.payload && typeof action.payload.name === 'string' && !routeNames.includes(action.payload.name)) {
      const state = {
        routes: [{
          name: action.payload.name,
          params: 'params' in action.payload && typeof action.payload.params === 'object' && action.payload.params !== null ? action.payload.params : undefined,
          path: 'path' in action.payload && typeof action.payload.path === 'string' ? action.payload.path : undefined
        }]
      };
      setUnhandledState(state);
    }
    onUnhandledActionParent?.(action);
  });
  const navigation = useNavigationHelpers({
    id: options.id,
    onAction,
    onUnhandledAction,
    getState,
    emitter,
    router,
    stateRef
  });
  useFocusedListenersChildrenAdapter({
    navigation,
    focusedListeners: childListeners.focus
  });
  useOnGetState({
    getState,
    getStateListeners: keyedListeners.getState
  });
  const {
    describe,
    descriptors
  } = useDescriptors({
    state,
    screens,
    navigation,
    screenOptions,
    screenLayout,
    onAction,
    getState,
    setState,
    onRouteFocus,
    addListener,
    addKeyedListener,
    router,
    // @ts-expect-error: this should have both core and custom events, but too much work right now
    emitter
  });
  useCurrentRender({
    state,
    navigation,
    descriptors
  });
  const NavigationContent = useComponent(children => {
    const element = layout != null ? layout({
      state,
      descriptors,
      navigation,
      children
    }) : children;
    return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationMetaContext.Provider, {
      value: undefined,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationHelpersContext.Provider, {
        value: navigation,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationStateListenerProvider, {
          state: state,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(PreventRemoveProvider, {
            children: element
          })
        })
      })
    });
  });
  return {
    state,
    navigation,
    describe,
    descriptors,
    NavigationContent
  };
}
;// ./node_modules/@react-navigation/core/lib/module/useNavigationContainerRef.js




function useNavigationContainerRef() {
  const navigation = react.useRef(null);
  if (navigation.current == null) {
    navigation.current = createNavigationContainerRef();
  }
  return navigation.current;
}
;// ./node_modules/@react-navigation/core/lib/module/usePreventRemoveContext.js




function usePreventRemoveContext() {
  const value = react.useContext(PreventRemoveContext);
  if (value == null) {
    throw new Error("Couldn't find the prevent remove context. Is your component inside NavigationContent?");
  }
  return value;
}
;// ./node_modules/@react-navigation/core/lib/module/usePreventRemove.js









/**
 * Hook to prevent screen from being removed. Can be used to prevent users from leaving the screen.
 *
 * @param preventRemove Boolean indicating whether to prevent screen from being removed.
 * @param callback Function which is executed when screen was prevented from being removed.
 */
function usePreventRemove(preventRemove, callback) {
  const [id] = react.useState(() => nanoid());
  const navigation = useNavigation();
  const {
    key: routeKey
  } = useRoute();
  const {
    setPreventRemove
  } = usePreventRemoveContext();
  react.useEffect(() => {
    setPreventRemove(id, routeKey, preventRemove);
    return () => {
      setPreventRemove(id, routeKey, false);
    };
  }, [setPreventRemove, id, routeKey, preventRemove]);
  const beforeRemoveListener = (0,esm/* default */.A)(e => {
    if (!preventRemove) {
      return;
    }
    e.preventDefault();
    callback({
      data: e.data
    });
  });
  react.useEffect(() => navigation?.addListener('beforeRemove', beforeRemoveListener), [navigation, beforeRemoveListener]);
}
;// ./node_modules/@react-navigation/core/lib/module/useStateForPath.js





/**
 * Hook to get a minimal state representation for the current route.
 * The returned state can be used with `getPathFromState` to build a path.
 *
 * @returns Minimal state to build a path for the current route.
 */
function useStateForPath() {
  const state = react.useContext(NavigationFocusedRouteStateContext);
  return state;
}
;// ./node_modules/@react-navigation/core/lib/module/index.js





































// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/I18nManager/index.js
var I18nManager = __webpack_require__(5784);
;// ./node_modules/@react-navigation/native/lib/module/LinkingContext.js



const LinkingContext_MISSING_CONTEXT_ERROR = "Couldn't find a LinkingContext context.";
const LinkingContext = /*#__PURE__*/react.createContext({
  get options() {
    throw new Error(LinkingContext_MISSING_CONTEXT_ERROR);
  }
});
LinkingContext.displayName = 'LinkingContext';
;// ./node_modules/@react-navigation/native/lib/module/LocaleDirContext.js



const LocaleDirContext = /*#__PURE__*/react.createContext('ltr');
LocaleDirContext.displayName = 'LocaleDirContext';
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var Platform = __webpack_require__(7862);
;// ./node_modules/@react-navigation/native/lib/module/theming/fonts.js



const WEB_FONT_STACK = 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const fonts = Platform/* default */.A.select({
  web: {
    regular: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '400'
    },
    medium: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '500'
    },
    bold: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '600'
    },
    heavy: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '700'
    }
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400'
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500'
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '600'
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '700'
    }
  },
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal'
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal'
    },
    bold: {
      fontFamily: 'sans-serif',
      fontWeight: '600'
    },
    heavy: {
      fontFamily: 'sans-serif',
      fontWeight: '700'
    }
  }
});
;// ./node_modules/@react-navigation/native/lib/module/theming/DefaultTheme.js



const DefaultTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)'
  },
  fonts: fonts
};
;// ./node_modules/@react-navigation/native/lib/module/UnhandledLinkingContext.js



const UnhandledLinkingContext_MISSING_CONTEXT_ERROR = "Couldn't find an UnhandledLinkingContext context.";
const UnhandledLinkingContext = /*#__PURE__*/react.createContext({
  get lastUnhandledLink() {
    throw new Error(UnhandledLinkingContext_MISSING_CONTEXT_ERROR);
  },
  get setLastUnhandledLink() {
    throw new Error(UnhandledLinkingContext_MISSING_CONTEXT_ERROR);
  }
});
UnhandledLinkingContext.displayName = 'UnhandledLinkingContext';
;// ./node_modules/@react-navigation/native/lib/module/useBackButton.js


function useBackButton(_) {
  // No-op
  // BackHandler is not available on web
}
;// ./node_modules/@react-navigation/native/lib/module/useDocumentTitle.js



/**
 * Set the document title for the active screen
 */
function useDocumentTitle(ref, {
  enabled = true,
  formatter = (options, route) => options?.title ?? route?.name
} = {}) {
  react.useEffect(() => {
    if (!enabled) {
      return;
    }
    const navigation = ref.current;
    if (navigation) {
      const title = formatter(navigation.getCurrentOptions(), navigation.getCurrentRoute());
      document.title = title;
    }
    return navigation?.addListener('options', e => {
      const title = formatter(e.data.options, navigation?.getCurrentRoute());
      document.title = title;
    });
  });
}
;// ./node_modules/@react-navigation/native/lib/module/createMemoryHistory.js



function createMemoryHistory() {
  let index = 0;
  let items = [];

  // Pending callbacks for `history.go(n)`
  // We might modify the callback stored if it was interrupted, so we have a ref to identify it
  const pending = [];
  const interrupt = () => {
    // If another history operation was performed we need to interrupt existing ones
    // This makes sure that calls such as `history.replace` after `history.go` don't happen
    // Since otherwise it won't be correct if something else has changed
    pending.forEach(it => {
      const cb = it.cb;
      it.cb = () => cb(true);
    });
  };
  const history = {
    get index() {
      // We store an id in the state instead of an index
      // Index could get out of sync with in-memory values if page reloads
      const id = window.history.state?.id;
      if (id) {
        const index = items.findIndex(item => item.id === id);
        return index > -1 ? index : 0;
      }
      return 0;
    },
    get(index) {
      return items[index];
    },
    backIndex({
      path
    }) {
      // We need to find the index from the element before current to get closest path to go back to
      for (let i = index - 1; i >= 0; i--) {
        const item = items[i];
        if (item.path === path) {
          return i;
        }
      }
      return -1;
    },
    push({
      path,
      state
    }) {
      interrupt();
      const id = nanoid();

      // When a new entry is pushed, all the existing entries after index will be inaccessible
      // So we remove any existing entries after the current index to clean them up
      items = items.slice(0, index + 1);
      items.push({
        path,
        state,
        id
      });
      index = items.length - 1;

      // We pass empty string for title because it's ignored in all browsers except safari
      // We don't store state object in history.state because:
      // - browsers have limits on how big it can be, and we don't control the size
      // - while not recommended, there could be non-serializable data in state
      window.history.pushState({
        id
      }, '', path);
    },
    replace({
      path,
      state
    }) {
      interrupt();
      const id = window.history.state?.id ?? nanoid();

      // Need to keep the hash part of the path if there was no previous history entry
      // or the previous history entry had the same path
      let pathWithHash = path;
      const hash = pathWithHash.includes('#') ? '' : location.hash;
      if (!items.length || items.findIndex(item => item.id === id) < 0) {
        // There are two scenarios for creating an array with only one history record:
        // - When loaded id not found in the items array, this function by default will replace
        //   the first item. We need to keep only the new updated object, otherwise it will break
        //   the page when navigating forward in history.
        // - This is the first time any state modifications are done
        //   So we need to push the entry as there's nothing to replace

        pathWithHash = pathWithHash + hash;
        items = [{
          path: pathWithHash,
          state,
          id
        }];
        index = 0;
      } else {
        if (items[index].path === path) {
          pathWithHash = pathWithHash + hash;
        }
        items[index] = {
          path,
          state,
          id
        };
      }
      window.history.replaceState({
        id
      }, '', pathWithHash);
    },
    // `history.go(n)` is asynchronous, there are couple of things to keep in mind:
    // - it won't do anything if we can't go `n` steps, the `popstate` event won't fire.
    // - each `history.go(n)` call will trigger a separate `popstate` event with correct location.
    // - the `popstate` event fires before the next frame after calling `history.go(n)`.
    // This method differs from `history.go(n)` in the sense that it'll go back as many steps it can.
    go(n) {
      interrupt();

      // To guard against unexpected navigation out of the app we will assume that browser history is only as deep as the length of our memory
      // history. If we don't have an item to navigate to then update our index and navigate as far as we can without taking the user out of the app.
      const nextIndex = index + n;
      const lastItemIndex = items.length - 1;
      if (n < 0 && !items[nextIndex]) {
        // Attempted to navigate beyond the first index. Negating the current index will align the browser history with the first item.
        n = -index;
        index = 0;
      } else if (n > 0 && nextIndex > lastItemIndex) {
        // Attempted to navigate past the last index. Calculate how many indices away from the last index and go there.
        n = lastItemIndex - index;
        index = lastItemIndex;
      } else {
        index = nextIndex;
      }
      if (n === 0) {
        return;
      }

      // When we call `history.go`, `popstate` will fire when there's history to go back to
      // So we need to somehow handle following cases:
      // - There's history to go back, `history.go` is called, and `popstate` fires
      // - `history.go` is called multiple times, we need to resolve on respective `popstate`
      // - No history to go back, but `history.go` was called, browser has no API to detect it
      return new Promise((resolve, reject) => {
        const done = interrupted => {
          clearTimeout(timer);
          if (interrupted) {
            reject(new Error('History was changed during navigation.'));
            return;
          }

          // There seems to be a bug in Chrome regarding updating the title
          // If we set a title just before calling `history.go`, the title gets lost
          // However the value of `document.title` is still what we set it to
          // It's just not displayed in the tab bar
          // To update the tab bar, we need to reset the title to something else first (e.g. '')
          // And set the title to what it was before so it gets applied
          // It won't work without setting it to empty string coz otherwise title isn't changing
          // Which means that the browser won't do anything after setting the title
          const {
            title
          } = window.document;
          window.document.title = '';
          window.document.title = title;
          resolve();
        };
        pending.push({
          ref: done,
          cb: done
        });

        // If navigation didn't happen within 100ms, assume that it won't happen
        // This may not be accurate, but hopefully it won't take so much time
        // In Chrome, navigation seems to happen instantly in next microtask
        // But on Firefox, it seems to take much longer, around 50ms from our testing
        // We're using a hacky timeout since there doesn't seem to be way to know for sure
        const timer = setTimeout(() => {
          const foundIndex = pending.findIndex(it => it.ref === done);
          if (foundIndex > -1) {
            pending[foundIndex].cb();
            pending.splice(foundIndex, 1);
          }
          index = this.index;
        }, 100);
        const onPopState = () => {
          // Fix createMemoryHistory.index variable's value
          // as it may go out of sync when navigating in the browser.
          index = this.index;
          const last = pending.pop();
          window.removeEventListener('popstate', onPopState);
          last?.cb();
        };
        window.addEventListener('popstate', onPopState);
        window.history.go(n);
      });
    },
    // The `popstate` event is triggered when history changes, except `pushState` and `replaceState`
    // If we call `history.go(n)` ourselves, we don't want it to trigger the listener
    // Here we normalize it so that only external changes (e.g. user pressing back/forward) trigger the listener
    listen(listener) {
      const onPopState = () => {
        // Fix createMemoryHistory.index variable's value
        // as it may go out of sync when navigating in the browser.
        index = this.index;
        if (pending.length) {
          // This was triggered by `history.go(n)`, we shouldn't call the listener
          return;
        }
        listener();
      };
      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
    }
  };
  return history;
}
;// ./node_modules/@react-navigation/native/lib/module/ServerContext.js



const ServerContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/native/lib/module/useLinking.js







/**
 * Find the matching navigation state that changed between 2 navigation states
 * e.g.: a -> b -> c -> d and a -> b -> c -> e -> f, if history in b changed, b is the matching state
 */
const findMatchingState = (a, b) => {
  if (a === undefined || b === undefined || a.key !== b.key) {
    return [undefined, undefined];
  }

  // Tab and drawer will have `history` property, but stack will have history in `routes`
  const aHistoryLength = a.history ? a.history.length : a.routes.length;
  const bHistoryLength = b.history ? b.history.length : b.routes.length;
  const aRoute = a.routes[a.index];
  const bRoute = b.routes[b.index];
  const aChildState = aRoute.state;
  const bChildState = bRoute.state;

  // Stop here if this is the state object that changed:
  // - history length is different
  // - focused routes are different
  // - one of them doesn't have child state
  // - child state keys are different
  if (aHistoryLength !== bHistoryLength || aRoute.key !== bRoute.key || aChildState === undefined || bChildState === undefined || aChildState.key !== bChildState.key) {
    return [a, b];
  }
  return findMatchingState(aChildState, bChildState);
};

/**
 * Run async function in series as it's called.
 */
const series = cb => {
  let queue = Promise.resolve();
  const callback = () => {
    // eslint-disable-next-line promise/no-callback-in-promise
    queue = queue.then(cb);
  };
  return callback;
};
const linkingHandlers = (/* unused pure expression or super */ null && ([]));
function useLinking(ref, {
  enabled = true,
  config,
  getStateFromPath = getStateFromPath_getStateFromPath,
  getPathFromState = getPathFromState_getPathFromState,
  getActionFromState = getActionFromState_getActionFromState
}, onUnhandledLinking) {
  const independent = useNavigationIndependentTree();
  react.useEffect(() => {
    if (true) {
      return undefined;
    }
    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow

  }, [enabled, independent]);
  const [history] = react.useState(createMemoryHistory);

  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const enabledRef = react.useRef(enabled);
  const configRef = react.useRef(config);
  const getStateFromPathRef = react.useRef(getStateFromPath);
  const getPathFromStateRef = react.useRef(getPathFromState);
  const getActionFromStateRef = react.useRef(getActionFromState);
  react.useEffect(() => {
    enabledRef.current = enabled;
    configRef.current = config;
    getStateFromPathRef.current = getStateFromPath;
    getPathFromStateRef.current = getPathFromState;
    getActionFromStateRef.current = getActionFromState;
  });
  const validateRoutesNotExistInRootState = react.useCallback(state => {
    const navigation = ref.current;
    const rootState = navigation?.getRootState();
    // Make sure that the routes in the state exist in the root navigator
    // Otherwise there's an error in the linking configuration
    return state?.routes.some(r => !rootState?.routeNames.includes(r.name));
  }, [ref]);
  const server = react.useContext(ServerContext);
  const getInitialState = react.useCallback(() => {
    let value;
    if (enabledRef.current) {
      const location = server?.location ?? (typeof window !== 'undefined' ? window.location : undefined);
      const path = location ? location.pathname + location.search : undefined;
      if (path) {
        value = getStateFromPathRef.current(path, configRef.current);
      }

      // If the link were handled, it gets cleared in NavigationContainer
      onUnhandledLinking(path);
    }
    const thenable = {
      then(onfulfilled) {
        return Promise.resolve(onfulfilled ? onfulfilled(value) : value);
      },
      catch() {
        return thenable;
      }
    };
    return thenable;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const previousIndexRef = react.useRef(undefined);
  const previousStateRef = react.useRef(undefined);
  const pendingPopStatePathRef = react.useRef(undefined);
  react.useEffect(() => {
    previousIndexRef.current = history.index;
    return history.listen(() => {
      const navigation = ref.current;
      if (!navigation || !enabled) {
        return;
      }
      const {
        location
      } = window;
      const path = location.pathname + location.search;
      const index = history.index;
      const previousIndex = previousIndexRef.current ?? 0;
      previousIndexRef.current = index;
      pendingPopStatePathRef.current = path;

      // When browser back/forward is clicked, we first need to check if state object for this index exists
      // If it does we'll reset to that state object
      // Otherwise, we'll handle it like a regular deep link
      const record = history.get(index);
      if (record?.path === path && record?.state) {
        navigation.resetRoot(record.state);
        return;
      }
      const state = getStateFromPathRef.current(path, configRef.current);

      // We should only dispatch an action when going forward
      // Otherwise the action will likely add items to history, which would mess things up
      if (state) {
        // If the link were handled, it gets cleared in NavigationContainer
        onUnhandledLinking(path);
        // Make sure that the routes in the state exist in the root navigator
        // Otherwise there's an error in the linking configuration
        if (validateRoutesNotExistInRootState(state)) {
          return;
        }
        if (index > previousIndex) {
          const action = getActionFromStateRef.current(state, configRef.current);
          if (action !== undefined) {
            try {
              navigation.dispatch(action);
            } catch (e) {
              // Ignore any errors from deep linking.
              // This could happen in case of malformed links, navigation object not being initialized etc.
              console.warn(`An error occurred when trying to handle the link '${path}': ${typeof e === 'object' && e != null && 'message' in e ? e.message : e}`);
            }
          } else {
            navigation.resetRoot(state);
          }
        } else {
          navigation.resetRoot(state);
        }
      } else {
        // if current path didn't return any state, we should revert to initial state
        navigation.resetRoot(state);
      }
    });
  }, [enabled, history, onUnhandledLinking, ref, validateRoutesNotExistInRootState]);
  react.useEffect(() => {
    if (!enabled) {
      return;
    }
    const getPathForRoute = (route, state) => {
      let path;

      // If the `route` object contains a `path`, use that path as long as `route.name` and `params` still match
      // This makes sure that we preserve the original URL for wildcard routes
      if (route?.path) {
        const stateForPath = getStateFromPathRef.current(route.path, configRef.current);
        if (stateForPath) {
          const focusedRoute = findFocusedRoute(stateForPath);
          if (focusedRoute && focusedRoute.name === route.name && fast_deep_equal(focusedRoute.params, route.params)) {
            path = route.path;
          }
        }
      }
      if (path == null) {
        path = getPathFromStateRef.current(state, configRef.current);
      }
      const previousRoute = previousStateRef.current ? findFocusedRoute(previousStateRef.current) : undefined;

      // Preserve the hash if the route didn't change
      if (previousRoute && route && 'key' in previousRoute && 'key' in route && previousRoute.key === route.key) {
        path = path + location.hash;
      }
      return path;
    };
    if (ref.current) {
      // We need to record the current metadata on the first render if they aren't set
      // This will allow the initial state to be in the history entry
      const state = ref.current.getRootState();
      if (state) {
        const route = findFocusedRoute(state);
        const path = getPathForRoute(route, state);
        if (previousStateRef.current === undefined) {
          previousStateRef.current = state;
        }
        history.replace({
          path,
          state
        });
      }
    }
    const onStateChange = async () => {
      const navigation = ref.current;
      if (!navigation || !enabled) {
        return;
      }
      const previousState = previousStateRef.current;
      const state = navigation.getRootState();

      // root state may not available, for example when root navigators switch inside the container
      if (!state) {
        return;
      }
      const pendingPath = pendingPopStatePathRef.current;
      const route = findFocusedRoute(state);
      const path = getPathForRoute(route, state);
      previousStateRef.current = state;
      pendingPopStatePathRef.current = undefined;

      // To detect the kind of state change, we need to:
      // - Find the common focused navigation state in previous and current state
      // - If only the route keys changed, compare history/routes.length to check if we go back/forward/replace
      // - If no common focused navigation state found, it's a replace
      const [previousFocusedState, focusedState] = findMatchingState(previousState, state);
      if (previousFocusedState && focusedState &&
      // We should only handle push/pop if path changed from what was in last `popstate`
      // Otherwise it's likely a change triggered by `popstate`
      path !== pendingPath) {
        const historyDelta = (focusedState.history ? focusedState.history.length : focusedState.routes.length) - (previousFocusedState.history ? previousFocusedState.history.length : previousFocusedState.routes.length);
        if (historyDelta > 0) {
          // If history length is increased, we should pushState
          // Note that path might not actually change here, for example, drawer open should pushState
          history.push({
            path,
            state
          });
        } else if (historyDelta < 0) {
          // If history length is decreased, i.e. entries were removed, we want to go back

          const nextIndex = history.backIndex({
            path
          });
          const currentIndex = history.index;
          try {
            if (nextIndex !== -1 && nextIndex < currentIndex &&
            // We should only go back if the entry exists and it's less than current index
            history.get(nextIndex)) {
              // An existing entry for this path exists and it's less than current index, go back to that
              await history.go(nextIndex - currentIndex);
            } else {
              // We couldn't find an existing entry to go back to, so we'll go back by the delta
              // This won't be correct if multiple routes were pushed in one go before
              // Usually this shouldn't happen and this is a fallback for that
              await history.go(historyDelta);
            }

            // Store the updated state as well as fix the path if incorrect
            history.replace({
              path,
              state
            });
          } catch (e) {
            // The navigation was interrupted
          }
        } else {
          // If history length is unchanged, we want to replaceState
          history.replace({
            path,
            state
          });
        }
      } else {
        // If no common navigation state was found, assume it's a replace
        // This would happen if the user did a reset/conditionally changed navigators
        history.replace({
          path,
          state
        });
      }
    };

    // We debounce onStateChange coz we don't want multiple state changes to be handled at one time
    // This could happen since `history.go(n)` is asynchronous
    // If `pushState` or `replaceState` were called before `history.go(n)` completes, it'll mess stuff up
    return ref.current?.addListener('state', series(onStateChange));
  }, [enabled, history, ref]);
  return {
    getInitialState
  };
}
;// ./node_modules/@react-navigation/native/lib/module/useThenable.js



function useThenable(create) {
  const [promise] = react.useState(create);
  let initialState = [false, undefined];

  // Check if our thenable is synchronous
  // eslint-disable-next-line promise/catch-or-return, promise/always-return
  promise.then(result => {
    initialState = [true, result];
  });
  const [state, setState] = react.useState(initialState);
  const [resolved] = state;
  react.useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      let result;
      try {
        result = await promise;
      } finally {
        if (!cancelled) {
          setState([true, result]);
        }
      }
    };
    if (!resolved) {
      resolve();
    }
    return () => {
      cancelled = true;
    };
  }, [promise, resolved]);
  return state;
}
;// ./node_modules/@react-navigation/native/lib/module/NavigationContainer.js















globalThis.REACT_NAVIGATION_DEVTOOLS = new WeakMap();
function NavigationContainerInner({
  direction = I18nManager/* default */.A.getConstants().isRTL ? 'rtl' : 'ltr',
  theme = DefaultTheme,
  linking,
  fallback = null,
  documentTitle,
  onReady,
  onStateChange,
  ...rest
}, ref) {
  const isLinkingEnabled = linking ? linking.enabled !== false : false;
  if (linking?.config) {
    validatePathConfig(linking.config);
  }
  const refContainer = react.useRef(null);
  useBackButton(refContainer);
  useDocumentTitle(refContainer, documentTitle);
  const [lastUnhandledLink, setLastUnhandledLink] = react.useState();
  const {
    getInitialState
  } = useLinking(refContainer, {
    enabled: isLinkingEnabled,
    prefixes: [],
    ...linking
  }, setLastUnhandledLink);
  const linkingContext = react.useMemo(() => ({
    options: linking
  }), [linking]);
  const unhandledLinkingContext = react.useMemo(() => ({
    lastUnhandledLink,
    setLastUnhandledLink
  }), [lastUnhandledLink, setLastUnhandledLink]);
  const onReadyForLinkingHandling = (0,esm/* default */.A)(() => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onReady?.();
  });
  const onStateChangeForLinkingHandling = (0,esm/* default */.A)(state => {
    // If the screen path matches lastUnhandledLink, we do not track it
    const path = refContainer.current?.getCurrentRoute()?.path;
    setLastUnhandledLink(previousLastUnhandledLink => {
      if (previousLastUnhandledLink === path) {
        return undefined;
      }
      return previousLastUnhandledLink;
    });
    onStateChange?.(state);
  });
  // Add additional linking related info to the ref
  // This will be used by the devtools
  react.useEffect(() => {
    if (refContainer.current) {
      REACT_NAVIGATION_DEVTOOLS.set(refContainer.current, {
        get linking() {
          return {
            ...linking,
            enabled: isLinkingEnabled,
            prefixes: linking?.prefixes ?? [],
            getStateFromPath: linking?.getStateFromPath ?? getStateFromPath_getStateFromPath,
            getPathFromState: linking?.getPathFromState ?? getPathFromState_getPathFromState,
            getActionFromState: linking?.getActionFromState ?? getActionFromState_getActionFromState
          };
        }
      });
    }
  });
  const [isResolved, initialState] = useThenable(getInitialState);

  // FIXME
  // @ts-expect-error not sure why this is not working
  react.useImperativeHandle(ref, () => refContainer.current);
  const isLinkingReady = rest.initialState != null || !isLinkingEnabled || isResolved;
  if (!isLinkingReady) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(LocaleDirContext.Provider, {
      value: direction,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(ThemeProvider, {
        value: theme,
        children: fallback
      })
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(LocaleDirContext.Provider, {
    value: direction,
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(UnhandledLinkingContext.Provider, {
      value: unhandledLinkingContext,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(LinkingContext.Provider, {
        value: linkingContext,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(BaseNavigationContainer, {
          ...rest,
          theme: theme,
          onReady: onReadyForLinkingHandling,
          onStateChange: onStateChangeForLinkingHandling,
          initialState: rest.initialState == null ? initialState : rest.initialState,
          ref: refContainer
        })
      })
    })
  });
}

/**
 * Container component that manages the navigation state.
 * This should be rendered at the root wrapping the whole app.
 */
const NavigationContainer = /*#__PURE__*/react.forwardRef(NavigationContainerInner);
;// ./node_modules/@react-navigation/native/lib/module/createStaticNavigation.js






/**
 * Create a navigation component from a static navigation config.
 * The returned component is a wrapper around `NavigationContainer`.
 *
 * @param tree Static navigation config.
 * @returns Navigation component to use in your app.
 */
function createStaticNavigation(tree) {
  const Component = createComponentForStaticNavigation(tree, 'RootNavigator');
  function Navigation({
    linking,
    ...rest
  }, ref) {
    const linkingConfig = react.useMemo(() => {
      const screens = createPathConfigForStaticNavigation(tree, {
        initialRouteName: linking?.config?.initialRouteName
      }, linking?.enabled === 'auto');
      if (!screens) return;
      return {
        path: linking?.config?.path,
        initialRouteName: linking?.config?.initialRouteName,
        screens
      };
    }, [linking?.enabled, linking?.config?.path, linking?.config?.initialRouteName]);
    const memoizedLinking = react.useMemo(() => {
      if (!linking) {
        return undefined;
      }
      const enabled = typeof linking.enabled === 'boolean' ? linking.enabled : linkingConfig?.screens != null;
      return {
        ...linking,
        enabled,
        config: linkingConfig
      };
    }, [linking, linkingConfig]);
    if (linking?.enabled === true && linkingConfig?.screens == null) {
      throw new Error('Linking is enabled but no linking configuration was found for the screens.\n\n' + 'To solve this:\n' + "- Specify a 'linking' property for the screens you want to link to.\n" + "- Or set 'linking.enabled' to 'auto' to generate paths automatically.\n\n" + 'See usage guide: https://reactnavigation.org/docs/static-configuration#linking');
    }
    return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContainer, {
      ...rest,
      ref: ref,
      linking: memoizedLinking,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(Component, {})
    });
  }
  return /*#__PURE__*/react.forwardRef(Navigation);
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Text/index.js
var Text = __webpack_require__(8506);
;// ./node_modules/@react-navigation/native/lib/module/useLinkProps.js






const useLinkProps_getStateFromParams = params => {
  if (params?.state) {
    return params.state;
  }
  if (params?.screen) {
    return {
      routes: [{
        name: params.screen,
        params: params.params,
        // @ts-expect-error this is fine 🔥
        state: params.screen ? useLinkProps_getStateFromParams(params.params) : undefined
      }]
    };
  }
  return undefined;
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
function useLinkProps({
  screen,
  params,
  href,
  action
}) {
  const root = react.useContext(NavigationContainerRefContext);
  const navigation = react.useContext(NavigationHelpersContext);
  const {
    options
  } = react.useContext(LinkingContext);
  const onPress = e => {
    let shouldHandle = false;
    if (Platform/* default */.A.OS !== 'web' || !e) {
      e?.preventDefault?.();
      shouldHandle = true;
    } else {
      // ignore clicks with modifier keys
      const hasModifierKey = 'metaKey' in e && e.metaKey || 'altKey' in e && e.altKey || 'ctrlKey' in e && e.ctrlKey || 'shiftKey' in e && e.shiftKey;

      // only handle left clicks
      const isLeftClick = 'button' in e ? e.button == null || e.button === 0 : true;

      // let browser handle "target=_blank" etc.
      const isSelfTarget = e.currentTarget && 'target' in e.currentTarget ? [undefined, null, '', 'self'].includes(e.currentTarget.target) : true;
      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault?.();
        shouldHandle = true;
      }
    }
    if (shouldHandle) {
      if (action) {
        if (navigation) {
          navigation.dispatch(action);
        } else if (root) {
          root.dispatch(action);
        } else {
          throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
        }
      } else {
        // @ts-expect-error This is already type-checked by the prop types
        navigation?.navigate(screen, params);
      }
    }
  };
  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState_getPathFromState;
  return {
    href: href ?? (Platform/* default */.A.OS === 'web' && screen != null ? getPathFromStateHelper({
      routes: [{
        // @ts-expect-error this is fine 🔥
        name: screen,
        // @ts-expect-error this is fine 🔥
        params: params,
        // @ts-expect-error this is fine 🔥
        state: useLinkProps_getStateFromParams(params)
      }]
    }, options?.config) : undefined),
    role: 'link',
    onPress
  };
}
;// ./node_modules/@react-navigation/native/lib/module/Link.js







/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
function Link({
  screen,
  params,
  action,
  href,
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = useTheme();
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({
    screen,
    params,
    action,
    href
  });
  const onPress = e => {
    if ('onPress' in rest) {
      rest.onPress?.(e);
    }

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };
  return /*#__PURE__*/react.createElement(Text/* default */.A, {
    ...props,
    ...rest,
    ...Platform/* default */.A.select({
      web: {
        onClick: onPress
      },
      default: {
        onPress
      }
    }),
    style: [{
      color: colors.primary
    }, fonts.regular, style]
  });
}
;// ./node_modules/@react-navigation/native/lib/module/ServerContainer.js






/**
 * Container component for server rendering.
 *
 * @param props.location Location object to base the initial URL for SSR.
 * @param props.children Child elements to render the content.
 * @param props.ref Ref object which contains helper methods.
 */
const ServerContainer = /*#__PURE__*/react.forwardRef(function ServerContainer({
  children,
  location
}, ref) {
  react.useEffect(() => {
    console.error("'ServerContainer' should only be used on the server with 'react-dom/server' for SSR.");
  }, []);

  // eslint-disable-next-line @eslint-react/no-unstable-context-value
  const current = {};
  if (ref) {
    const value = {
      getCurrentOptions() {
        return current.options;
      }
    };

    // We write to the `ref` during render instead of `React.useImperativeHandle`
    // This is because `useImperativeHandle` will update the ref after 'commit',
    // and there's no 'commit' phase during SSR.
    // Mutating ref during render is unsafe in concurrent mode, but we don't care about it for SSR.
    if (typeof ref === 'function') {
      ref(value);
    } else {
      ref.current = value;
    }
  }
  return (/*#__PURE__*/
    // eslint-disable-next-line @eslint-react/no-unstable-context-value
    (0,jsx_runtime.jsx)(ServerContext.Provider, {
      value: {
        location
      },
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(CurrentRenderContext.Provider, {
        value: current,
        children: children
      })
    })
  );
});
;// ./node_modules/@react-navigation/native/lib/module/theming/DarkTheme.js



const DarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(1, 1, 1)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)'
  },
  fonts: fonts
};
;// ./node_modules/@react-navigation/native/lib/module/useLinkBuilder.js





/**
 * Helper to build a href for a screen based on the linking options.
 */
function useBuildHref() {
  const navigation = react.useContext(NavigationHelpersContext);
  const route = react.useContext(NavigationRouteContext);
  const {
    options
  } = react.useContext(LinkingContext);
  const focusedRouteState = useStateForPath();
  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState_getPathFromState;
  const buildHref = react.useCallback((name, params) => {
    if (options?.enabled === false) {
      return undefined;
    }

    // Check that we're inside:
    // - navigator's context
    // - route context of the navigator (could be a screen, tab, etc.)
    // - route matches the state for path (from the screen's context)
    // This ensures that we're inside a screen
    const isScreen = navigation && route?.key && focusedRouteState ? route.key === findFocusedRoute(focusedRouteState)?.key && navigation.getState().routes.some(r => r.key === route.key) : false;
    const stateForRoute = {
      routes: [{
        name,
        params
      }]
    };
    const constructState = state => {
      if (state) {
        const route = state.routes[0];

        // If we're inside a screen and at the innermost route
        // We need to replace the state with the provided one
        // This assumes that we're navigating to a sibling route
        if (isScreen && !route.state) {
          return stateForRoute;
        }

        // Otherwise, dive into the nested state of the route
        return {
          routes: [{
            ...route,
            state: constructState(route.state)
          }]
        };
      }

      // Once there is no more nested state, we're at the innermost route
      // We can add a state based on provided parameters
      // This assumes that we're navigating to a child of this route
      // In this case, the helper is used in a navigator for its routes
      return stateForRoute;
    };
    const state = constructState(focusedRouteState);
    const path = getPathFromStateHelper(state, options?.config);
    return path;
  }, [options?.enabled, options?.config, route?.key, navigation, focusedRouteState, getPathFromStateHelper]);
  return buildHref;
}

/**
 * Helper to build a navigation action from a href based on the linking options.
 */
const useBuildAction = () => {
  const {
    options
  } = react.useContext(LinkingContext);
  const getStateFromPathHelper = options?.getStateFromPath ?? getStateFromPath_getStateFromPath;
  const getActionFromStateHelper = options?.getActionFromState ?? getActionFromState_getActionFromState;
  const buildAction = react.useCallback(href => {
    if (!href.startsWith('/')) {
      throw new Error(`The href must start with '/' (${href}).`);
    }
    const state = getStateFromPathHelper(href, options?.config);
    if (state) {
      const action = getActionFromStateHelper(state, options?.config);
      return action ?? CommonActions_reset(state);
    } else {
      throw new Error('Failed to parse the href to a navigation state.');
    }
  }, [options?.config, getStateFromPathHelper, getActionFromStateHelper]);
  return buildAction;
};

/**
 * Helpers to build href or action based on the linking options.
 *
 * @returns `buildHref` to build an `href` for screen and `buildAction` to build an action from an `href`.
 */
function useLinkBuilder() {
  const buildHref = useBuildHref();
  const buildAction = useBuildAction();
  return {
    buildHref,
    buildAction
  };
}
;// ./node_modules/@react-navigation/native/lib/module/useLinkTo.js






/**
 * Helper to navigate to a screen using a href based on the linking options.
 *
 * @returns function that receives the href to navigate to.
 */
function useLinkTo() {
  const navigation = react.useContext(NavigationContainerRefContext);
  const buildAction = useBuildAction();
  const linkTo = react.useCallback(href => {
    if (navigation === undefined) {
      throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
    }
    const action = buildAction(href);
    navigation.dispatch(action);
  }, [buildAction, navigation]);
  return linkTo;
}
;// ./node_modules/@react-navigation/native/lib/module/useLocale.js





/**
 * Hook to access the text direction specified in the `NavigationContainer`.
 */
function useLocale() {
  const direction = react.useContext(LocaleDirContext);
  if (direction === undefined) {
    throw new Error("Couldn't determine the text direction. Is your component inside NavigationContainer?");
  }
  return {
    direction
  };
}
;// ./node_modules/@react-navigation/native/lib/module/useRoutePath.js






/**
 * Hook to get the path for the current route based on linking options.
 *
 * @returns Path for the current route.
 */
function useRoutePath() {
  const {
    options
  } = react.useContext(LinkingContext);
  const state = useStateForPath();
  if (state === undefined) {
    throw new Error("Couldn't find a state for the route object. Is your component inside a screen in a navigator?");
  }
  const getPathFromStateHelper = options?.getPathFromState ?? getPathFromState_getPathFromState;
  const path = react.useMemo(() => {
    if (options?.enabled === false) {
      return undefined;
    }
    const path = getPathFromStateHelper(state, options?.config);
    return path;
  }, [options?.enabled, options?.config, state, getPathFromStateHelper]);
  return path;
}
;// ./node_modules/@react-navigation/native/lib/module/useScrollToTop.js




function getScrollableNode(ref) {
  if (ref.current == null) {
    return null;
  }
  if ('scrollToTop' in ref.current || 'scrollTo' in ref.current || 'scrollToOffset' in ref.current || 'scrollResponderScrollTo' in ref.current) {
    // This is already a scrollable node.
    return ref.current;
  } else if ('getScrollResponder' in ref.current) {
    // If the view is a wrapper like FlatList, SectionList etc.
    // We need to use `getScrollResponder` to get access to the scroll responder
    return ref.current.getScrollResponder();
  } else if ('getNode' in ref.current) {
    // When a `ScrollView` is wrapped in `Animated.createAnimatedComponent`
    // we need to use `getNode` to get the ref to the actual scrollview.
    // Note that `getNode` is deprecated in newer versions of react-native
    // this is why we check if we already have a scrollable node above.
    return ref.current.getNode();
  } else {
    return ref.current;
  }
}
function useScrollToTop(ref) {
  const navigation = react.useContext(NavigationContext);
  const route = useRoute();
  if (navigation === undefined) {
    throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
  }
  react.useEffect(() => {
    const tabNavigations = [];
    let currentNavigation = navigation;
    // If the screen is nested inside multiple tab navigators, we should scroll to top for any of them
    // So we need to find all the parent tab navigators and add the listeners there
    while (currentNavigation) {
      if (currentNavigation.getState().type === 'tab') {
        tabNavigations.push(currentNavigation);
      }
      currentNavigation = currentNavigation.getParent();
    }
    if (tabNavigations.length === 0) {
      return;
    }
    const unsubscribers = tabNavigations.map(tab => {
      return tab.addListener(
      // We don't wanna import tab types here to avoid extra deps
      // in addition, there are multiple tab implementations
      // @ts-expect-error the `tabPress` event is only available when navigation type is tab
      'tabPress', e => {
        // We should scroll to top only when the screen is focused
        const isFocused = navigation.isFocused();

        // In a nested stack navigator, tab press resets the stack to first screen
        // So we should scroll to top only when we are on first screen
        const isFirst = tabNavigations.includes(navigation) || navigation.getState().routes[0].key === route.key;

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          const scrollable = getScrollableNode(ref);
          if (isFocused && isFirst && scrollable && !e.defaultPrevented) {
            if ('scrollToTop' in scrollable) {
              scrollable.scrollToTop();
            } else if ('scrollTo' in scrollable) {
              scrollable.scrollTo({
                y: 0,
                animated: true
              });
            } else if ('scrollToOffset' in scrollable) {
              scrollable.scrollToOffset({
                offset: 0,
                animated: true
              });
            } else if ('scrollResponderScrollTo' in scrollable) {
              scrollable.scrollResponderScrollTo({
                y: 0,
                animated: true
              });
            }
          }
        });
      });
    });
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [navigation, ref, route.key]);
}
;// ./node_modules/@react-navigation/native/lib/module/index.js




















/***/ },

/***/ 7418
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ex: () => (/* reexport */ Badge),
  Y9: () => (/* reexport */ Header),
  Hm: () => (/* reexport */ HeaderBackButton),
  wW: () => (/* reexport */ HeaderBackContext),
  SF: () => (/* reexport */ HeaderHeightContext_HeaderHeightContext),
  q2: () => (/* reexport */ HeaderShownContext),
  gY: () => (/* reexport */ HeaderTitle),
  JU: () => (/* reexport */ Label),
  SX: () => (/* reexport */ MissingIcon),
  jV: () => (/* reexport */ PlatformPressable_PlatformPressable),
  ge: () => (/* reexport */ SafeAreaProviderCompat),
  ff: () => (/* reexport */ Screen),
  Q6: () => (/* reexport */ getDefaultHeaderHeight),
  eY: () => (/* reexport */ getDefaultSidebarWidth),
  k1: () => (/* reexport */ getHeaderTitle),
  p9: () => (/* reexport */ getLabel),
  gV: () => (/* reexport */ useFrameSize)
});

// UNUSED EXPORTS: Assets, Background, Button, HeaderBackground, HeaderButton, Lazy, ResourceSavingView, Text, useHeaderHeight

// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/assets/back-icon.png
var back_icon = __webpack_require__(2640);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/assets/back-icon-mask.png
var back_icon_mask = __webpack_require__(4175);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/assets/clear-icon.png
var clear_icon = __webpack_require__(7170);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/assets/close-icon.png
var close_icon = __webpack_require__(5571);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/assets/search-icon.png
var search_icon = __webpack_require__(7135);
// EXTERNAL MODULE: ./node_modules/@react-navigation/native/lib/module/index.js + 103 modules
var lib_module = __webpack_require__(7397);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 45 modules
var Animated = __webpack_require__(8831);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// ./node_modules/@react-navigation/elements/lib/module/Background.js






function Background({
  style,
  ...rest
}) {
  const {
    colors
  } = (0,lib_module.useTheme)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
    ...rest,
    style: [{
      flex: 1,
      backgroundColor: colors.background
    }, style]
  });
}
// EXTERNAL MODULE: ./node_modules/color/index.js
var color = __webpack_require__(2520);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var exports_Platform = __webpack_require__(7862);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
;// ./node_modules/@react-navigation/elements/lib/module/Badge.js









const useNativeDriver = exports_Platform/* default */.A.OS !== 'web';
function Badge({
  children,
  style,
  visible = true,
  size = 18,
  ...rest
}) {
  const [opacity] = react.useState(() => new Animated/* default */.A.Value(visible ? 1 : 0));
  const [rendered, setRendered] = react.useState(visible);
  const {
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  react.useEffect(() => {
    if (!rendered) {
      return;
    }
    Animated/* default */.A.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished && !visible) {
        setRendered(false);
      }
    });
    return () => opacity.stopAnimation();
  }, [opacity, rendered, visible]);
  if (!rendered) {
    if (visible) {
      setRendered(true);
    } else {
      return null;
    }
  }

  // @ts-expect-error: backgroundColor definitely exists
  const {
    backgroundColor = colors.notification,
    ...restStyle
  } = StyleSheet/* default */.A.flatten(style) || {};
  const textColor = color(backgroundColor).isLight() ? 'black' : 'white';
  const borderRadius = size / 2;
  const fontSize = Math.floor(size * 3 / 4);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
    numberOfLines: 1,
    style: [{
      transform: [{
        scale: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1]
        })
      }],
      color: textColor,
      lineHeight: size - 1,
      height: size,
      minWidth: size,
      opacity,
      backgroundColor,
      fontSize,
      borderRadius,
      borderCurve: 'continuous'
    }, fonts.regular, styles.container, restStyle],
    ...rest,
    children: children
  });
}
const styles = StyleSheet/* default */.A.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden'
  }
});
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Easing/index.js + 2 modules
var Easing = __webpack_require__(6693);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
var esm_extends = __webpack_require__(8168);
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
var objectWithoutPropertiesLoose = __webpack_require__(8587);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/useMergeRefs/index.js
var useMergeRefs = __webpack_require__(1804);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/canUseDom/index.js
var canUseDom = __webpack_require__(7162);
;// ./node_modules/react-native-web/dist/modules/addEventListener/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */




var emptyFunction = () => {};
function supportsPassiveEvents() {
  var supported = false;
  // Check if browser supports event with passive listeners
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
  if (canUseDom/* default */.A) {
    try {
      var options = {};
      Object.defineProperty(options, 'passive', {
        get() {
          supported = true;
          return false;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (e) {}
  }
  return supported;
}
var canUsePassiveEvents = supportsPassiveEvents();
function getOptions(options) {
  if (options == null) {
    return false;
  }
  return canUsePassiveEvents ? options : Boolean(options.capture);
}

/**
 * Shim generic API compatibility with ReactDOM's synthetic events, without needing the
 * large amount of code ReactDOM uses to do this. Ideally we wouldn't use a synthetic
 * event wrapper at all.
 */
function isPropagationStopped() {
  return this.cancelBubble;
}
function isDefaultPrevented() {
  return this.defaultPrevented;
}
function normalizeEvent(event) {
  event.nativeEvent = event;
  event.persist = emptyFunction;
  event.isDefaultPrevented = isDefaultPrevented;
  event.isPropagationStopped = isPropagationStopped;
  return event;
}

/**
 *
 */
function addEventListener(target, type, listener, options) {
  var opts = getOptions(options);
  var compatListener = e => listener(normalizeEvent(e));
  target.addEventListener(type, compatListener, opts);
  return function removeEventListener() {
    if (target != null) {
      target.removeEventListener(type, compatListener, opts);
    }
  };
}
;// ./node_modules/react-native-web/dist/modules/modality/index.js
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */



var supportsPointerEvent = () => !!(typeof window !== 'undefined' && window.PointerEvent != null);
var activeModality = 'keyboard';
var modality = 'keyboard';
var previousModality;
var previousActiveModality;
var isEmulatingMouseEvents = false;
var listeners = new Set();
var KEYBOARD = 'keyboard';
var MOUSE = 'mouse';
var TOUCH = 'touch';
var BLUR = 'blur';
var CONTEXTMENU = 'contextmenu';
var FOCUS = 'focus';
var KEYDOWN = 'keydown';
var MOUSEDOWN = 'mousedown';
var MOUSEMOVE = 'mousemove';
var MOUSEUP = 'mouseup';
var POINTERDOWN = 'pointerdown';
var POINTERMOVE = 'pointermove';
var SCROLL = 'scroll';
var SELECTIONCHANGE = 'selectionchange';
var TOUCHCANCEL = 'touchcancel';
var TOUCHMOVE = 'touchmove';
var TOUCHSTART = 'touchstart';
var VISIBILITYCHANGE = 'visibilitychange';
var bubbleOptions = {
  passive: true
};
var captureOptions = {
  capture: true,
  passive: true
};
function restoreModality() {
  if (previousModality != null || previousActiveModality != null) {
    if (previousModality != null) {
      modality = previousModality;
      previousModality = null;
    }
    if (previousActiveModality != null) {
      activeModality = previousActiveModality;
      previousActiveModality = null;
    }
    callListeners();
  }
}
function onBlurWindow() {
  previousModality = modality;
  previousActiveModality = activeModality;
  activeModality = KEYBOARD;
  modality = KEYBOARD;
  callListeners();
  // for fallback events
  isEmulatingMouseEvents = false;
}
function onFocusWindow() {
  restoreModality();
}
function onKeyDown(event) {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }
  if (modality !== KEYBOARD) {
    modality = KEYBOARD;
    activeModality = KEYBOARD;
    callListeners();
  }
}
function onVisibilityChange() {
  if (document.visibilityState !== 'hidden') {
    restoreModality();
  }
}
function onPointerish(event) {
  var eventType = event.type;
  if (supportsPointerEvent()) {
    if (eventType === POINTERDOWN) {
      if (activeModality !== event.pointerType) {
        modality = event.pointerType;
        activeModality = event.pointerType;
        callListeners();
      }
      return;
    }
    if (eventType === POINTERMOVE) {
      if (modality !== event.pointerType) {
        modality = event.pointerType;
        callListeners();
      }
      return;
    }
  }
  // Fallback for non-PointerEvent environment
  else {
    if (!isEmulatingMouseEvents) {
      if (eventType === MOUSEDOWN) {
        if (activeModality !== MOUSE) {
          modality = MOUSE;
          activeModality = MOUSE;
          callListeners();
        }
      }
      if (eventType === MOUSEMOVE) {
        if (modality !== MOUSE) {
          modality = MOUSE;
          callListeners();
        }
      }
    }

    // Flag when browser may produce emulated events
    if (eventType === TOUCHSTART) {
      isEmulatingMouseEvents = true;
      if (event.touches && event.touches.length > 1) {
        isEmulatingMouseEvents = false;
      }
      if (activeModality !== TOUCH) {
        modality = TOUCH;
        activeModality = TOUCH;
        callListeners();
      }
      return;
    }

    // Remove flag after emulated events are finished or cancelled, and if an
    // event occurs that cuts short a touch event sequence.
    if (eventType === CONTEXTMENU || eventType === MOUSEUP || eventType === SELECTIONCHANGE || eventType === SCROLL || eventType === TOUCHCANCEL || eventType === TOUCHMOVE) {
      isEmulatingMouseEvents = false;
    }
  }
}
if (canUseDom/* default */.A) {
  // Window events
  addEventListener(window, BLUR, onBlurWindow, bubbleOptions);
  addEventListener(window, FOCUS, onFocusWindow, bubbleOptions);
  // Must be capture phase because 'stopPropagation' might prevent these
  // events bubbling to the document.
  addEventListener(document, KEYDOWN, onKeyDown, captureOptions);
  addEventListener(document, VISIBILITYCHANGE, onVisibilityChange, captureOptions);
  addEventListener(document, POINTERDOWN, onPointerish, captureOptions);
  addEventListener(document, POINTERMOVE, onPointerish, captureOptions);
  // Fallback events
  addEventListener(document, CONTEXTMENU, onPointerish, captureOptions);
  addEventListener(document, MOUSEDOWN, onPointerish, captureOptions);
  addEventListener(document, MOUSEMOVE, onPointerish, captureOptions);
  addEventListener(document, MOUSEUP, onPointerish, captureOptions);
  addEventListener(document, TOUCHCANCEL, onPointerish, captureOptions);
  addEventListener(document, TOUCHMOVE, onPointerish, captureOptions);
  addEventListener(document, TOUCHSTART, onPointerish, captureOptions);
  addEventListener(document, SELECTIONCHANGE, onPointerish, captureOptions);
  addEventListener(document, SCROLL, onPointerish, captureOptions);
}
function callListeners() {
  var value = {
    activeModality,
    modality
  };
  listeners.forEach(listener => {
    listener(value);
  });
}
function getActiveModality() {
  return activeModality;
}
function getModality() {
  return modality;
}
function addModalityListener(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function testOnly_resetActiveModality() {
  isEmulatingMouseEvents = false;
  activeModality = KEYBOARD;
  modality = KEYBOARD;
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/useLayoutEffect/index.js
var useLayoutEffect = __webpack_require__(8425);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/useStable/index.js
var useStable = __webpack_require__(9241);
;// ./node_modules/react-native-web/dist/modules/useEvent/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */




/**
 * This can be used with any event type include custom events.
 *
 * const click = useEvent('click', options);
 * useEffect(() => {
 *   click.setListener(target, onClick);
 *   return () => click.clear();
 * }).
 */
function useEvent(eventType, options) {
  var targetListeners = (0,useStable/* default */.A)(() => new Map());
  var addListener = (0,useStable/* default */.A)(() => {
    return (target, callback) => {
      var removeTargetListener = targetListeners.get(target);
      if (removeTargetListener != null) {
        removeTargetListener();
      }
      if (callback == null) {
        targetListeners.delete(target);
        callback = () => {};
      }
      var removeEventListener = addEventListener(target, eventType, callback, options);
      targetListeners.set(target, removeEventListener);
      return removeEventListener;
    };
  });
  (0,useLayoutEffect/* default */.A)(() => {
    return () => {
      targetListeners.forEach(removeListener => {
        removeListener();
      });
      targetListeners.clear();
    };
  }, [targetListeners]);
  return addListener;
}
;// ./node_modules/react-native-web/dist/modules/useHover/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */





/**
 * Types
 */

/**
 * Implementation
 */

var emptyObject = {};
var opts = {
  passive: true
};
var lockEventType = 'react-gui:hover:lock';
var unlockEventType = 'react-gui:hover:unlock';
var useHover_supportsPointerEvent = () => !!(typeof window !== 'undefined' && window.PointerEvent != null);
function dispatchCustomEvent(target, type, payload) {
  var event = document.createEvent('CustomEvent');
  var _ref = payload || emptyObject,
    _ref$bubbles = _ref.bubbles,
    bubbles = _ref$bubbles === void 0 ? true : _ref$bubbles,
    _ref$cancelable = _ref.cancelable,
    cancelable = _ref$cancelable === void 0 ? true : _ref$cancelable,
    detail = _ref.detail;
  event.initCustomEvent(type, bubbles, cancelable, detail);
  target.dispatchEvent(event);
}

// This accounts for the non-PointerEvent fallback events.
function getPointerType(event) {
  var pointerType = event.pointerType;
  return pointerType != null ? pointerType : getModality();
}
function useHover(targetRef, config) {
  var contain = config.contain,
    disabled = config.disabled,
    onHoverStart = config.onHoverStart,
    onHoverChange = config.onHoverChange,
    onHoverUpdate = config.onHoverUpdate,
    onHoverEnd = config.onHoverEnd;
  var canUsePE = useHover_supportsPointerEvent();
  var addMoveListener = useEvent(canUsePE ? 'pointermove' : 'mousemove', opts);
  var addEnterListener = useEvent(canUsePE ? 'pointerenter' : 'mouseenter', opts);
  var addLeaveListener = useEvent(canUsePE ? 'pointerleave' : 'mouseleave', opts);
  // These custom events are used to implement the "contain" prop.
  var addLockListener = useEvent(lockEventType, opts);
  var addUnlockListener = useEvent(unlockEventType, opts);
  (0,useLayoutEffect/* default */.A)(() => {
    var target = targetRef.current;
    if (target !== null) {
      /**
       * End the hover gesture
       */
      var hoverEnd = function hoverEnd(e) {
        if (onHoverEnd != null) {
          onHoverEnd(e);
        }
        if (onHoverChange != null) {
          onHoverChange(false);
        }
        // Remove the listeners once finished.
        addMoveListener(target, null);
        addLeaveListener(target, null);
      };

      /**
       * Leave element
       */
      var leaveListener = function leaveListener(e) {
        var target = targetRef.current;
        if (target != null && getPointerType(e) !== 'touch') {
          if (contain) {
            dispatchCustomEvent(target, unlockEventType);
          }
          hoverEnd(e);
        }
      };

      /**
       * Move within element
       */
      var moveListener = function moveListener(e) {
        if (getPointerType(e) !== 'touch') {
          if (onHoverUpdate != null) {
            // Not all browsers have these properties
            if (e.x == null) {
              e.x = e.clientX;
            }
            if (e.y == null) {
              e.y = e.clientY;
            }
            onHoverUpdate(e);
          }
        }
      };

      /**
       * Start the hover gesture
       */
      var hoverStart = function hoverStart(e) {
        if (onHoverStart != null) {
          onHoverStart(e);
        }
        if (onHoverChange != null) {
          onHoverChange(true);
        }
        // Set the listeners needed for the rest of the hover gesture.
        if (onHoverUpdate != null) {
          addMoveListener(target, !disabled ? moveListener : null);
        }
        addLeaveListener(target, !disabled ? leaveListener : null);
      };

      /**
       * Enter element
       */
      var enterListener = function enterListener(e) {
        var target = targetRef.current;
        if (target != null && getPointerType(e) !== 'touch') {
          if (contain) {
            dispatchCustomEvent(target, lockEventType);
          }
          hoverStart(e);
          var lockListener = function lockListener(lockEvent) {
            if (lockEvent.target !== target) {
              hoverEnd(e);
            }
          };
          var unlockListener = function unlockListener(lockEvent) {
            if (lockEvent.target !== target) {
              hoverStart(e);
            }
          };
          addLockListener(target, !disabled ? lockListener : null);
          addUnlockListener(target, !disabled ? unlockListener : null);
        }
      };
      addEnterListener(target, !disabled ? enterListener : null);
    }
  }, [addEnterListener, addMoveListener, addLeaveListener, addLockListener, addUnlockListener, contain, disabled, onHoverStart, onHoverChange, onHoverUpdate, onHoverEnd, targetRef]);
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/modules/usePressEvents/index.js + 1 modules
var usePressEvents = __webpack_require__(6533);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var exports_View = __webpack_require__(9176);
;// ./node_modules/react-native-web/dist/exports/Pressable/index.js
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

'use client';



var _excluded = ["children", "delayLongPress", "delayPressIn", "delayPressOut", "disabled", "onBlur", "onContextMenu", "onFocus", "onHoverIn", "onHoverOut", "onKeyDown", "onLongPress", "onPress", "onPressMove", "onPressIn", "onPressOut", "style", "tabIndex", "testOnly_hovered", "testOnly_pressed"];







/**
 * Component used to build display components that should respond to whether the
 * component is currently pressed or not.
 */
function Pressable(props, forwardedRef) {
  var children = props.children,
    delayLongPress = props.delayLongPress,
    delayPressIn = props.delayPressIn,
    delayPressOut = props.delayPressOut,
    disabled = props.disabled,
    onBlur = props.onBlur,
    onContextMenu = props.onContextMenu,
    onFocus = props.onFocus,
    onHoverIn = props.onHoverIn,
    onHoverOut = props.onHoverOut,
    onKeyDown = props.onKeyDown,
    onLongPress = props.onLongPress,
    onPress = props.onPress,
    onPressMove = props.onPressMove,
    onPressIn = props.onPressIn,
    onPressOut = props.onPressOut,
    style = props.style,
    tabIndex = props.tabIndex,
    testOnly_hovered = props.testOnly_hovered,
    testOnly_pressed = props.testOnly_pressed,
    rest = (0,objectWithoutPropertiesLoose/* default */.A)(props, _excluded);
  var _useForceableState = useForceableState(testOnly_hovered === true),
    hovered = _useForceableState[0],
    setHovered = _useForceableState[1];
  var _useForceableState2 = useForceableState(false),
    focused = _useForceableState2[0],
    setFocused = _useForceableState2[1];
  var _useForceableState3 = useForceableState(testOnly_pressed === true),
    pressed = _useForceableState3[0],
    setPressed = _useForceableState3[1];
  var hostRef = (0,react.useRef)(null);
  var setRef = (0,useMergeRefs/* default */.A)(forwardedRef, hostRef);
  var pressConfig = (0,react.useMemo)(() => ({
    delayLongPress,
    delayPressStart: delayPressIn,
    delayPressEnd: delayPressOut,
    disabled,
    onLongPress,
    onPress,
    onPressChange: setPressed,
    onPressStart: onPressIn,
    onPressMove,
    onPressEnd: onPressOut
  }), [delayLongPress, delayPressIn, delayPressOut, disabled, onLongPress, onPress, onPressIn, onPressMove, onPressOut, setPressed]);
  var pressEventHandlers = (0,usePressEvents/* default */.A)(hostRef, pressConfig);
  var onContextMenuPress = pressEventHandlers.onContextMenu,
    onKeyDownPress = pressEventHandlers.onKeyDown;
  useHover(hostRef, {
    contain: true,
    disabled,
    onHoverChange: setHovered,
    onHoverStart: onHoverIn,
    onHoverEnd: onHoverOut
  });
  var interactionState = {
    hovered,
    focused,
    pressed
  };
  var blurHandler = react.useCallback(e => {
    if (e.nativeEvent.target === hostRef.current) {
      setFocused(false);
      if (onBlur != null) {
        onBlur(e);
      }
    }
  }, [hostRef, setFocused, onBlur]);
  var focusHandler = react.useCallback(e => {
    if (e.nativeEvent.target === hostRef.current) {
      setFocused(true);
      if (onFocus != null) {
        onFocus(e);
      }
    }
  }, [hostRef, setFocused, onFocus]);
  var contextMenuHandler = react.useCallback(e => {
    if (onContextMenuPress != null) {
      onContextMenuPress(e);
    }
    if (onContextMenu != null) {
      onContextMenu(e);
    }
  }, [onContextMenu, onContextMenuPress]);
  var keyDownHandler = react.useCallback(e => {
    if (onKeyDownPress != null) {
      onKeyDownPress(e);
    }
    if (onKeyDown != null) {
      onKeyDown(e);
    }
  }, [onKeyDown, onKeyDownPress]);
  var _tabIndex;
  if (tabIndex !== undefined) {
    _tabIndex = tabIndex;
  } else {
    _tabIndex = disabled ? -1 : 0;
  }
  return /*#__PURE__*/react.createElement(exports_View/* default */.A, (0,esm_extends/* default */.A)({}, rest, pressEventHandlers, {
    "aria-disabled": disabled,
    onBlur: blurHandler,
    onContextMenu: contextMenuHandler,
    onFocus: focusHandler,
    onKeyDown: keyDownHandler,
    ref: setRef,
    style: [disabled ? Pressable_styles.disabled : Pressable_styles.active, typeof style === 'function' ? style(interactionState) : style],
    tabIndex: _tabIndex
  }), typeof children === 'function' ? children(interactionState) : children);
}
function useForceableState(forced) {
  var _useState = (0,react.useState)(false),
    bool = _useState[0],
    setBool = _useState[1];
  return [bool || forced, setBool];
}
var Pressable_styles = StyleSheet/* default */.A.create({
  active: {
    cursor: 'pointer',
    touchAction: 'manipulation'
  },
  disabled: {
    pointerEvents: 'box-none'
  }
});
var MemoedPressable = /*#__PURE__*/(0,react.memo)(/*#__PURE__*/(0,react.forwardRef)(Pressable));
MemoedPressable.displayName = 'Pressable';
/* harmony default export */ const exports_Pressable = (MemoedPressable);
;// ./node_modules/@react-navigation/elements/lib/module/PlatformPressable.js









const AnimatedPressable = Animated/* default */.A.createAnimatedComponent(exports_Pressable);
const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_SUPPORTS_RIPPLE = exports_Platform/* default */.A.OS === 'android' && exports_Platform/* default */.A.Version >= ANDROID_VERSION_LOLLIPOP;
const PlatformPressable_useNativeDriver = exports_Platform/* default */.A.OS !== 'web';

/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
function PlatformPressableInternal({
  disabled,
  onPress,
  onPressIn,
  onPressOut,
  android_ripple,
  pressColor,
  pressOpacity = 0.3,
  hoverEffect,
  style,
  children,
  ...rest
}, ref) {
  const {
    dark
  } = (0,lib_module.useTheme)();
  const [opacity] = react.useState(() => new Animated/* default */.A.Value(1));
  const animateTo = (toValue, duration) => {
    if (ANDROID_SUPPORTS_RIPPLE) {
      return;
    }
    Animated/* default */.A.timing(opacity, {
      toValue,
      duration,
      easing: Easing/* default */.A.inOut(Easing/* default */.A.quad),
      useNativeDriver: PlatformPressable_useNativeDriver
    }).start();
  };
  const handlePress = e => {
    if (exports_Platform/* default */.A.OS === 'web' && rest.href !== null) {
      // ignore clicks with modifier keys
      const hasModifierKey = 'metaKey' in e && e.metaKey || 'altKey' in e && e.altKey || 'ctrlKey' in e && e.ctrlKey || 'shiftKey' in e && e.shiftKey;

      // only handle left clicks
      const isLeftClick = 'button' in e ? e.button == null || e.button === 0 : true;

      // let browser handle "target=_blank" etc.
      const isSelfTarget = e.currentTarget && 'target' in e.currentTarget ? [undefined, null, '', 'self'].includes(e.currentTarget.target) : true;
      if (!hasModifierKey && isLeftClick && isSelfTarget) {
        e.preventDefault();
        // call `onPress` only when browser default is prevented
        // this prevents app from handling the click when a link is being opened
        onPress?.(e);
      }
    } else {
      onPress?.(e);
    }
  };
  const handlePressIn = e => {
    animateTo(pressOpacity, 0);
    onPressIn?.(e);
  };
  const handlePressOut = e => {
    animateTo(1, 200);
    onPressOut?.(e);
  };
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(AnimatedPressable, {
    ref: ref,
    accessible: true,
    role: exports_Platform/* default */.A.OS === 'web' && rest.href != null ? 'link' : 'button',
    onPress: disabled ? undefined : handlePress,
    onPressIn: disabled ? undefined : handlePressIn,
    onPressOut: disabled ? undefined : handlePressOut,
    android_ripple: ANDROID_SUPPORTS_RIPPLE && !disabled ? {
      color: pressColor !== undefined ? pressColor : dark ? 'rgba(255, 255, 255, .32)' : 'rgba(0, 0, 0, .32)',
      ...android_ripple
    } : undefined,
    style: [{
      cursor: (exports_Platform/* default */.A.OS === 'web' || exports_Platform/* default */.A.OS === 'ios') && !disabled ?
      // Pointer cursor on web
      // Hover effect on iPad and visionOS
      'pointer' : 'auto',
      opacity: !ANDROID_SUPPORTS_RIPPLE && !disabled ? opacity : 1
    }, style],
    ...rest,
    children: [!disabled ? /*#__PURE__*/(0,jsx_runtime.jsx)(HoverEffect, {
      ...hoverEffect
    }) : null, children]
  });
}
const PlatformPressable_PlatformPressable = /*#__PURE__*/react.forwardRef(PlatformPressableInternal);
PlatformPressable_PlatformPressable.displayName = 'PlatformPressable';
const css = String.raw;
const CLASS_NAME = `__react-navigation_elements_Pressable_hover`;
const CSS_TEXT = css`
  .${CLASS_NAME} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background-color: var(--overlay-color);
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
  }

  a:hover > .${CLASS_NAME}, button:hover > .${CLASS_NAME} {
    opacity: var(--overlay-hover-opacity);
  }

  a:active > .${CLASS_NAME}, button:active > .${CLASS_NAME} {
    opacity: var(--overlay-active-opacity);
  }
`;
const HoverEffect = ({
  color,
  hoverOpacity = 0.08,
  activeOpacity = 0.16
}) => {
  if (exports_Platform/* default */.A.OS !== 'web' || color == null) {
    return null;
  }
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)("style", {
      href: CLASS_NAME,
      precedence: "elements",
      children: CSS_TEXT
    }), /*#__PURE__*/(0,jsx_runtime.jsx)("div", {
      className: CLASS_NAME,
      style: {
        // @ts-expect-error: CSS variables are not typed
        '--overlay-color': color,
        '--overlay-hover-opacity': hoverOpacity,
        '--overlay-active-opacity': activeOpacity
      }
    })]
  });
};
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Text/index.js
var exports_Text = __webpack_require__(8506);
;// ./node_modules/@react-navigation/elements/lib/module/Text.js



// eslint-disable-next-line no-restricted-imports


function Text_Text({
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(exports_Text/* default */.A, {
    ...rest,
    style: [{
      color: colors.text
    }, fonts.regular, style]
  });
}
;// ./node_modules/@react-navigation/elements/lib/module/Button.js










const BUTTON_RADIUS = 40;
function Button(props) {
  if ('screen' in props || 'action' in props) {
    // @ts-expect-error: This is already type-checked by the prop types
    return /*#__PURE__*/_jsx(ButtonLink, {
      ...props
    });
  } else {
    return /*#__PURE__*/_jsx(ButtonBase, {
      ...props
    });
  }
}
function ButtonLink({
  screen,
  params,
  action,
  href,
  ...rest
}) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({
    screen,
    params,
    action,
    href
  });
  return /*#__PURE__*/_jsx(ButtonBase, {
    ...rest,
    ...props
  });
}
function ButtonBase({
  variant = 'tinted',
  color: customColor,
  android_ripple,
  style,
  children,
  ...rest
}) {
  const {
    colors,
    fonts
  } = useTheme();
  const color = customColor ?? colors.primary;
  let backgroundColor;
  let textColor;
  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor = Color(color).fade(0.85).string();
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = Color(color).isDark() ? 'white' : Color(color).darken(0.71).string();
      break;
  }
  return /*#__PURE__*/_jsx(PlatformPressable, {
    ...rest,
    android_ripple: {
      radius: BUTTON_RADIUS,
      color: Color(textColor).fade(0.85).string(),
      ...android_ripple
    },
    pressOpacity: Platform.OS === 'ios' ? undefined : 1,
    hoverEffect: {
      color: textColor
    },
    style: [{
      backgroundColor
    }, Button_styles.button, style],
    children: /*#__PURE__*/_jsx(Text, {
      style: [{
        color: textColor
      }, fonts.regular, Button_styles.text],
      children: children
    })
  });
}
const Button_styles = StyleSheet/* default */.A.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
    borderCurve: 'continuous'
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center'
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/getDefaultSidebarWidth.js


const APPROX_APP_BAR_HEIGHT = 56;
const DEFAULT_DRAWER_WIDTH = 360;
const getDefaultSidebarWidth = ({
  width
}) => {
  /**
   * Default sidebar width is 360dp
   * On screens smaller than 320dp, ideally the drawer would collapse to a tab bar
   * https://m3.material.io/components/navigation-drawer/specs
   */
  if (width - APPROX_APP_BAR_HEIGHT <= 360) {
    return width - APPROX_APP_BAR_HEIGHT;
  }
  return DEFAULT_DRAWER_WIDTH;
};
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/PixelRatio/index.js
var PixelRatio = __webpack_require__(9518);
;// ./node_modules/@react-navigation/elements/lib/module/Header/getDefaultHeaderHeight.js




function getDefaultHeaderHeight(layout, modalPresentation, topInset) {
  let headerHeight;

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = exports_Platform/* default */.A.OS === 'ios' && topInset > 50;
  const statusBarHeight = hasDynamicIsland ? topInset - (5 + 1 / PixelRatio/* default */.A.get()) : topInset;
  const isLandscape = layout.width > layout.height;
  if (exports_Platform/* default */.A.OS === 'ios') {
    if (exports_Platform/* default */.A.isPad || exports_Platform/* default */.A.isTV) {
      if (modalPresentation) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (modalPresentation) {
          headerHeight = 56;
        } else {
          headerHeight = 44;
        }
      }
    }
  } else {
    headerHeight = 64;
  }
  return headerHeight + statusBarHeight;
}
;// ./node_modules/@react-navigation/elements/lib/module/Header/getHeaderTitle.js


function getHeaderTitle(options, fallback) {
  return typeof options.headerTitle === 'string' ? options.headerTitle : options.title !== undefined ? options.title : fallback;
}
// EXTERNAL MODULE: ./node_modules/react-native-safe-area-context/lib/module/SafeAreaContext.js + 1 modules
var SafeAreaContext = __webpack_require__(2168);
// EXTERNAL MODULE: ./node_modules/use-latest-callback/esm.mjs
var esm = __webpack_require__(7147);
// EXTERNAL MODULE: ./node_modules/use-sync-external-store/with-selector.js
var with_selector = __webpack_require__(8418);
;// ./node_modules/@react-navigation/elements/lib/module/useFrameSize.js







const FrameContext = /*#__PURE__*/react.createContext(undefined);
function useFrameSize(selector, throttle) {
  const context = react.useContext(FrameContext);
  if (context == null) {
    throw new Error('useFrameSize must be used within a FrameSizeProvider');
  }
  const value = (0,with_selector.useSyncExternalStoreWithSelector)(throttle ? context.subscribeThrottled : context.subscribe, context.getCurrent, context.getCurrent, selector);
  return value;
}
function FrameSizeProvider({
  initialFrame,
  render
}) {
  const frameRef = react.useRef({
    width: initialFrame.width,
    height: initialFrame.height
  });
  const listeners = react.useRef(new Set());
  const getCurrent = (0,esm/* default */.A)(() => frameRef.current);
  const subscribe = (0,esm/* default */.A)(listener => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  });
  const subscribeThrottled = (0,esm/* default */.A)(listener => {
    const delay = 100; // Throttle delay in milliseconds

    let timer;
    let updated = false;
    let waiting = false;
    const throttledListener = () => {
      clearTimeout(timer);
      updated = true;
      if (waiting) {
        // Schedule a timer to call the listener at the end
        timer = setTimeout(() => {
          if (updated) {
            updated = false;
            listener();
          }
        }, delay);
      } else {
        waiting = true;
        setTimeout(function () {
          waiting = false;
        }, delay);

        // Call the listener immediately at start
        updated = false;
        listener();
      }
    };
    const unsubscribe = subscribe(throttledListener);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  });
  const context = react.useMemo(() => ({
    getCurrent,
    subscribe,
    subscribeThrottled
  }), [subscribe, subscribeThrottled, getCurrent]);
  const onChange = (0,esm/* default */.A)(frame => {
    if (frameRef.current.height === frame.height && frameRef.current.width === frame.width) {
      return;
    }
    frameRef.current = {
      width: frame.width,
      height: frame.height
    };
    listeners.current.forEach(listener => listener());
  });
  const viewRef = react.useRef(null);
  react.useEffect(() => {
    if (exports_Platform/* default */.A.OS === 'web') {
      // We use ResizeObserver on web
      return;
    }
    viewRef.current?.measure((_x, _y, width, height) => {
      onChange({
        width,
        height
      });
    });
  }, [onChange]);
  const onLayout = event => {
    const {
      width,
      height
    } = event.nativeEvent.layout;
    onChange({
      width,
      height
    });
  };
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(FrameContext.Provider, {
    value: context,
    children: [exports_Platform/* default */.A.OS === 'web' ? /*#__PURE__*/(0,jsx_runtime.jsx)(FrameSizeListenerWeb, {
      onChange: onChange
    }) : null, render({
      ref: viewRef,
      onLayout
    })]
  });
}

// FIXME: On the Web, `onLayout` doesn't fire on resize
// So we workaround this by using ResizeObserver
function FrameSizeListenerWeb({
  onChange
}) {
  const elementRef = react.useRef(null);
  react.useEffect(() => {
    if (elementRef.current == null) {
      return;
    }
    const rect = elementRef.current.getBoundingClientRect();
    onChange({
      width: rect.width,
      height: rect.height
    });
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const {
          width,
          height
        } = entry.contentRect;
        onChange({
          width,
          height
        });
      }
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [onChange]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)("div", {
    ref: elementRef,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      pointerEvents: 'none',
      visibility: 'hidden'
    }
  });
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Image/index.js + 2 modules
var Image = __webpack_require__(728);
;// ./node_modules/@react-navigation/elements/lib/module/MaskedView.js


/**
 * Use a stub for MaskedView on all Platforms that don't support it.
 */
function MaskedView({
  children
}) {
  return children;
}
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderButton.js







function HeaderButtonInternal({
  disabled,
  onPress,
  pressColor,
  pressOpacity,
  accessibilityLabel,
  testID,
  style,
  href,
  children
}, ref) {
  return /*#__PURE__*/(0,jsx_runtime.jsx)(PlatformPressable_PlatformPressable, {
    ref: ref,
    disabled: disabled,
    href: href,
    "aria-label": accessibilityLabel,
    testID: testID,
    onPress: onPress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    android_ripple: androidRipple,
    style: [HeaderButton_styles.container, disabled && HeaderButton_styles.disabled, style],
    hitSlop: exports_Platform/* default */.A.select({
      ios: undefined,
      default: {
        top: 16,
        right: 16,
        bottom: 16,
        left: 16
      }
    }),
    children: children
  });
}
const HeaderButton = /*#__PURE__*/react.forwardRef(HeaderButtonInternal);
HeaderButton.displayName = 'HeaderButton';
const androidRipple = {
  borderless: true,
  foreground: exports_Platform/* default */.A.OS === 'android' && exports_Platform/* default */.A.Version >= 23,
  radius: 20
};
const HeaderButton_styles = StyleSheet/* default */.A.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    // Roundness for iPad hover effect
    borderRadius: 10,
    borderCurve: 'continuous'
  },
  disabled: {
    opacity: 0.5
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderIcon.js







function HeaderIcon({
  source,
  style,
  ...rest
}) {
  const {
    colors
  } = (0,lib_module.useTheme)();
  const {
    direction
  } = (0,lib_module.useLocale)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Image/* default */.A, {
    source: source,
    resizeMode: "contain",
    fadeDuration: 0,
    tintColor: colors.text,
    style: [HeaderIcon_styles.icon, direction === 'rtl' && HeaderIcon_styles.flip, style],
    ...rest
  });
}
const ICON_SIZE = exports_Platform/* default */.A.OS === 'ios' ? 21 : 24;
const ICON_MARGIN = exports_Platform/* default */.A.OS === 'ios' ? 8 : 3;
const HeaderIcon_styles = StyleSheet/* default */.A.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: ICON_MARGIN
  },
  flip: {
    transform: 'scaleX(-1)'
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderBackButton.js















function HeaderBackButton({
  disabled,
  allowFontScaling,
  backImage,
  label,
  labelStyle,
  displayMode = exports_Platform/* default */.A.OS === 'ios' ? 'default' : 'minimal',
  onLabelLayout,
  onPress,
  pressColor,
  pressOpacity,
  screenLayout,
  tintColor,
  titleLayout,
  truncatedLabel = 'Back',
  accessibilityLabel = label && label !== 'Back' ? `${label}, back` : 'Go back',
  testID,
  style,
  href
}) {
  const {
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  const {
    direction
  } = (0,lib_module.useLocale)();
  const [labelWidth, setLabelWidth] = react.useState(null);
  const [truncatedLabelWidth, setTruncatedLabelWidth] = react.useState(null);
  const renderBackImage = () => {
    if (backImage) {
      return backImage({
        tintColor: tintColor ?? colors.text
      });
    } else {
      return /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderIcon, {
        source: back_icon,
        tintColor: tintColor,
        style: [HeaderBackButton_styles.icon, displayMode !== 'minimal' && HeaderBackButton_styles.iconWithLabel]
      });
    }
  };
  const renderLabel = () => {
    if (displayMode === 'minimal') {
      return null;
    }
    const availableSpace = titleLayout && screenLayout ? (screenLayout.width - titleLayout.width) / 2 - (ICON_WIDTH + ICON_MARGIN) : null;
    const potentialLabelText = displayMode === 'default' ? label : truncatedLabel;
    const finalLabelText = availableSpace && labelWidth && truncatedLabelWidth ? availableSpace > labelWidth ? potentialLabelText : availableSpace > truncatedLabelWidth ? truncatedLabel : null : potentialLabelText;
    const commonStyle = [fonts.regular, HeaderBackButton_styles.label, labelStyle];
    const hiddenStyle = [commonStyle, {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0
    }];
    const labelElement = /*#__PURE__*/(0,jsx_runtime.jsxs)(exports_View/* default */.A, {
      style: HeaderBackButton_styles.labelWrapper,
      children: [label && displayMode === 'default' ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
        style: hiddenStyle,
        numberOfLines: 1,
        onLayout: e => setLabelWidth(e.nativeEvent.layout.width),
        children: label
      }) : null, truncatedLabel ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
        style: hiddenStyle,
        numberOfLines: 1,
        onLayout: e => setTruncatedLabelWidth(e.nativeEvent.layout.width),
        children: truncatedLabel
      }) : null, finalLabelText ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
        accessible: false,
        onLayout: onLabelLayout,
        style: [tintColor ? {
          color: tintColor
        } : null, commonStyle],
        numberOfLines: 1,
        allowFontScaling: !!allowFontScaling,
        children: finalLabelText
      }) : null]
    });
    if (backImage || exports_Platform/* default */.A.OS !== 'ios') {
      // When a custom backimage is specified, we can't mask the label
      // Otherwise there might be weird effect due to our mask not being the same as the image
      return labelElement;
    }
    return /*#__PURE__*/(0,jsx_runtime.jsx)(MaskedView, {
      maskElement: /*#__PURE__*/(0,jsx_runtime.jsxs)(exports_View/* default */.A, {
        style: [HeaderBackButton_styles.iconMaskContainer,
        // Extend the mask to the center of the screen so that label isn't clipped during animation
        screenLayout ? {
          minWidth: screenLayout.width / 2 - 27
        } : null],
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Image/* default */.A, {
          source: back_icon_mask,
          resizeMode: "contain",
          style: [HeaderBackButton_styles.iconMask, direction === 'rtl' && HeaderBackButton_styles.flip]
        }), /*#__PURE__*/(0,jsx_runtime.jsx)(exports_View/* default */.A, {
          style: HeaderBackButton_styles.iconMaskFillerRect
        })]
      }),
      children: labelElement
    });
  };
  const handlePress = () => {
    if (onPress) {
      requestAnimationFrame(() => onPress());
    }
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderButton, {
    disabled: disabled,
    href: href,
    accessibilityLabel: accessibilityLabel,
    testID: testID,
    onPress: handlePress,
    pressColor: pressColor,
    pressOpacity: pressOpacity,
    style: [HeaderBackButton_styles.container, style],
    children: /*#__PURE__*/(0,jsx_runtime.jsxs)(react.Fragment, {
      children: [renderBackImage(), renderLabel()]
    })
  });
}
const ICON_WIDTH = exports_Platform/* default */.A.OS === 'ios' ? 13 : 24;
const ICON_MARGIN_END = exports_Platform/* default */.A.OS === 'ios' ? 22 : 3;
const HeaderBackButton_styles = StyleSheet/* default */.A.create({
  container: {
    paddingHorizontal: 0,
    minWidth: StyleSheet/* default */.A.hairlineWidth,
    // Avoid collapsing when title is long
    ...exports_Platform/* default */.A.select({
      ios: null,
      default: {
        marginVertical: 3,
        marginHorizontal: 11
      }
    })
  },
  label: {
    fontSize: 17,
    // Title and back label are a bit different width due to title being bold
    // Adjusting the letterSpacing makes them coincide better
    letterSpacing: 0.35
  },
  labelWrapper: {
    // These styles will make sure that the label doesn't fill the available space
    // Otherwise it messes with the measurement of the label
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginEnd: ICON_MARGIN
  },
  icon: {
    width: ICON_WIDTH,
    marginEnd: ICON_MARGIN_END
  },
  iconWithLabel: exports_Platform/* default */.A.OS === 'ios' ? {
    marginEnd: 6
  } : {},
  iconMaskContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  iconMaskFillerRect: {
    flex: 1,
    backgroundColor: '#000'
  },
  iconMask: {
    height: 21,
    width: 13,
    marginStart: -14.5,
    marginVertical: 12,
    alignSelf: 'center'
  },
  flip: {
    transform: 'scaleX(-1)'
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderBackground.js








function HeaderBackground({
  style,
  ...rest
}) {
  const {
    colors,
    dark
  } = (0,lib_module.useTheme)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
    style: [HeaderBackground_styles.container, {
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      ...(exports_Platform/* default */.A.OS === 'ios' && {
        shadowColor: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 1)'
      })
    }, style],
    ...rest
  });
}
const HeaderBackground_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1,
    ...exports_Platform/* default */.A.select({
      android: {
        elevation: 4
      },
      ios: {
        shadowOpacity: 0.3,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet/* default */.A.hairlineWidth
        }
      },
      default: {
        borderBottomWidth: StyleSheet/* default */.A.hairlineWidth
      }
    })
  }
});
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TextInput/index.js
var TextInput = __webpack_require__(5782);
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderSearchBar.js



















const INPUT_TYPE_TO_MODE = {
  text: 'text',
  number: 'numeric',
  phone: 'tel',
  email: 'email'
};
const HeaderSearchBar_useNativeDriver = exports_Platform/* default */.A.OS !== 'web';
function HeaderSearchBarInternal({
  visible,
  inputType,
  autoFocus = true,
  autoCapitalize,
  placeholder = 'Search',
  cancelButtonText = 'Cancel',
  enterKeyHint = 'search',
  onChangeText,
  onClose,
  tintColor,
  style,
  ...rest
}, ref) {
  const navigation = (0,lib_module.useNavigation)();
  const {
    dark,
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  const [value, setValue] = react.useState('');
  const [rendered, setRendered] = react.useState(visible);
  const [visibleAnim] = react.useState(() => new Animated/* default */.A.Value(visible ? 1 : 0));
  const [clearVisibleAnim] = react.useState(() => new Animated/* default */.A.Value(0));
  const visibleValueRef = react.useRef(visible);
  const clearVisibleValueRef = react.useRef(false);
  const inputRef = react.useRef(null);
  react.useEffect(() => {
    // Avoid act warning in tests just by rendering header
    if (visible === visibleValueRef.current) {
      return;
    }
    Animated/* default */.A.timing(visibleAnim, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver: HeaderSearchBar_useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        setRendered(visible);
        visibleValueRef.current = visible;
      }
    });
    return () => {
      visibleAnim.stopAnimation();
    };
  }, [visible, visibleAnim]);
  const hasText = value !== '';
  react.useEffect(() => {
    if (clearVisibleValueRef.current === hasText) {
      return;
    }
    Animated/* default */.A.timing(clearVisibleAnim, {
      toValue: hasText ? 1 : 0,
      duration: 100,
      useNativeDriver: HeaderSearchBar_useNativeDriver
    }).start(({
      finished
    }) => {
      if (finished) {
        clearVisibleValueRef.current = hasText;
      }
    });
  }, [clearVisibleAnim, hasText]);
  const clearText = react.useCallback(() => {
    inputRef.current?.clear();
    inputRef.current?.focus();
    setValue('');
  }, []);
  const onClear = react.useCallback(() => {
    clearText();
    // FIXME: figure out how to create a SyntheticEvent
    // @ts-expect-error: we don't have the native event here
    onChangeText?.({
      nativeEvent: {
        text: ''
      }
    });
  }, [clearText, onChangeText]);
  const cancelSearch = react.useCallback(() => {
    onClear();
    onClose();
  }, [onClear, onClose]);
  react.useEffect(() => navigation?.addListener('blur', cancelSearch), [cancelSearch, navigation]);
  react.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    setText: text => {
      inputRef.current?.setNativeProps({
        text
      });
      setValue(text);
    },
    clearText,
    cancelSearch
  }), [cancelSearch, clearText]);
  if (!visible && !rendered) {
    return null;
  }
  const textColor = tintColor ?? colors.text;
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
    pointerEvents: visible ? 'auto' : 'none',
    "aria-live": "polite",
    "aria-hidden": !visible,
    style: [HeaderSearchBar_styles.container, {
      opacity: visibleAnim
    }, style],
    children: [/*#__PURE__*/(0,jsx_runtime.jsxs)(exports_View/* default */.A, {
      style: HeaderSearchBar_styles.searchbarContainer,
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(HeaderIcon, {
        source: search_icon,
        tintColor: textColor,
        style: HeaderSearchBar_styles.inputSearchIcon
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(TextInput/* default */.A, {
        ...rest,
        ref: inputRef,
        onChange: onChangeText,
        onChangeText: setValue,
        autoFocus: autoFocus,
        autoCapitalize: autoCapitalize === 'systemDefault' ? undefined : autoCapitalize,
        inputMode: INPUT_TYPE_TO_MODE[inputType ?? 'text'],
        enterKeyHint: enterKeyHint,
        placeholder: placeholder,
        placeholderTextColor: color(textColor).alpha(0.5).string(),
        cursorColor: colors.primary,
        selectionHandleColor: colors.primary,
        selectionColor: color(colors.primary).alpha(0.3).string(),
        style: [fonts.regular, HeaderSearchBar_styles.searchbar, {
          backgroundColor: exports_Platform/* default */.A.select({
            ios: dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            default: 'transparent'
          }),
          color: textColor,
          borderBottomColor: color(textColor).alpha(0.2).string()
        }]
      }), exports_Platform/* default */.A.OS === 'ios' ? /*#__PURE__*/(0,jsx_runtime.jsx)(PlatformPressable_PlatformPressable, {
        onPress: onClear,
        style: [{
          opacity: clearVisibleAnim,
          transform: [{
            scale: clearVisibleAnim
          }]
        }, HeaderSearchBar_styles.clearButton],
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(Image/* default */.A, {
          source: clear_icon,
          resizeMode: "contain",
          tintColor: textColor,
          style: HeaderSearchBar_styles.clearIcon
        })
      }) : null]
    }), exports_Platform/* default */.A.OS !== 'ios' ? /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderButton, {
      onPress: () => {
        if (value) {
          onClear();
        } else {
          onClose();
        }
      },
      style: HeaderSearchBar_styles.closeButton,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderIcon, {
        source: close_icon,
        tintColor: textColor
      })
    }) : null, exports_Platform/* default */.A.OS === 'ios' ? /*#__PURE__*/(0,jsx_runtime.jsx)(PlatformPressable_PlatformPressable, {
      onPress: cancelSearch,
      style: HeaderSearchBar_styles.cancelButton,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(Text_Text, {
        style: [fonts.regular, {
          color: tintColor ?? colors.primary
        }, HeaderSearchBar_styles.cancelText],
        children: cancelButtonText
      })
    }) : null]
  });
}
const HeaderSearchBar_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  inputSearchIcon: {
    position: 'absolute',
    opacity: 0.5,
    left: exports_Platform/* default */.A.select({
      ios: 16,
      default: 4
    }),
    top: exports_Platform/* default */.A.select({
      ios: -1,
      default: 17
    }),
    ...exports_Platform/* default */.A.select({
      ios: {
        height: 18,
        width: 18
      },
      default: {}
    })
  },
  closeButton: {
    position: 'absolute',
    opacity: 0.5,
    right: exports_Platform/* default */.A.select({
      ios: 0,
      default: 8
    }),
    top: exports_Platform/* default */.A.select({
      ios: -2,
      default: 17
    })
  },
  clearButton: {
    position: 'absolute',
    right: 0,
    top: -7,
    bottom: 0,
    justifyContent: 'center',
    padding: 8
  },
  clearIcon: {
    height: 16,
    width: 16,
    opacity: 0.5
  },
  cancelButton: {
    alignSelf: 'center',
    top: -4
  },
  cancelText: {
    fontSize: 17,
    marginHorizontal: 12
  },
  searchbarContainer: {
    flex: 1
  },
  searchbar: exports_Platform/* default */.A.select({
    ios: {
      flex: 1,
      fontSize: 17,
      paddingHorizontal: 32,
      marginLeft: 16,
      marginTop: -1,
      marginBottom: 4,
      borderRadius: 8,
      borderCurve: 'continuous'
    },
    default: {
      flex: 1,
      fontSize: 18,
      paddingHorizontal: 36,
      marginRight: 8,
      marginTop: 8,
      marginBottom: 8,
      borderBottomWidth: 1
    }
  })
});
const HeaderSearchBar = /*#__PURE__*/react.forwardRef(HeaderSearchBarInternal);
;// ./node_modules/@react-navigation/elements/lib/module/getNamedContext.js



const contexts = '__react_navigation__elements_contexts';
// We use a global variable to keep our contexts so that we can reuse same contexts across packages
globalThis[contexts] = globalThis[contexts] ?? new Map();
function getNamedContext(name, initialValue) {
  let context = globalThis[contexts].get(name);
  if (context) {
    return context;
  }
  context = /*#__PURE__*/react.createContext(initialValue);
  context.displayName = name;
  globalThis[contexts].set(name, context);
  return context;
}
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderShownContext.js



const HeaderShownContext = getNamedContext('HeaderShownContext', false);
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderTitle.js







function HeaderTitle({
  tintColor,
  style,
  ...rest
}) {
  const {
    colors,
    fonts
  } = (0,lib_module.useTheme)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.Text, {
    role: "heading",
    "aria-level": "1",
    numberOfLines: 1,
    ...rest,
    style: [{
      color: tintColor === undefined ? colors.text : tintColor
    }, exports_Platform/* default */.A.select({
      ios: fonts.bold,
      default: fonts.medium
    }), HeaderTitle_styles.title, style]
  });
}
const HeaderTitle_styles = StyleSheet/* default */.A.create({
  title: exports_Platform/* default */.A.select({
    ios: {
      fontSize: 17
    },
    android: {
      fontSize: 20
    },
    default: {
      fontSize: 18
    }
  })
});
;// ./node_modules/@react-navigation/elements/lib/module/Header/Header.js





















// Width of the screen in split layout on portrait mode on iPad Mini

const IPAD_MINI_MEDIUM_WIDTH = 414;
const warnIfHeaderStylesDefined = styles => {
  Object.keys(styles).forEach(styleProp => {
    const value = styles[styleProp];
    if (styleProp === 'position' && value === 'absolute') {
      console.warn("position: 'absolute' is not supported on headerStyle. If you would like to render content under the header, use the 'headerTransparent' option.");
    } else if (value !== undefined) {
      console.warn(`${styleProp} was given a value of ${value}, this has no effect on headerStyle.`);
    }
  });
};
function Header(props) {
  const insets = (0,SafeAreaContext/* useSafeAreaInsets */.Or)();
  const frame = useFrameSize(size => size, true);
  const {
    colors
  } = (0,lib_module.useTheme)();
  const navigation = (0,lib_module.useNavigation)();
  const isParentHeaderShown = react.useContext(HeaderShownContext);
  const [searchBarVisible, setSearchBarVisible] = react.useState(false);
  const [titleLayout, setTitleLayout] = react.useState(undefined);
  const onTitleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setTitleLayout(titleLayout => {
      if (titleLayout && height === titleLayout.height && width === titleLayout.width) {
        return titleLayout;
      }
      return {
        height,
        width
      };
    });
  };
  const {
    layout = frame,
    modal = false,
    back,
    title,
    headerTitle: customTitle,
    headerTitleAlign = exports_Platform/* default */.A.OS === 'ios' ? 'center' : 'left',
    headerLeft = back ? props => /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderBackButton, {
      ...props
    }) : undefined,
    headerSearchBarOptions,
    headerTransparent,
    headerTintColor,
    headerBackground,
    headerRight,
    headerTitleAllowFontScaling: titleAllowFontScaling,
    headerTitleStyle: titleStyle,
    headerLeftContainerStyle: leftContainerStyle,
    headerRightContainerStyle: rightContainerStyle,
    headerTitleContainerStyle: titleContainerStyle,
    headerBackButtonDisplayMode = exports_Platform/* default */.A.OS === 'ios' ? 'default' : 'minimal',
    headerBackTitleStyle,
    headerBackgroundContainerStyle: backgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerShadowVisible,
    headerPressColor,
    headerPressOpacity,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top
  } = props;
  const defaultHeight = getDefaultHeaderHeight(layout, modal, headerStatusBarHeight);
  const {
    height = defaultHeight,
    maxHeight,
    minHeight,
    backfaceVisibility,
    backgroundColor,
    borderBlockColor,
    borderBlockEndColor,
    borderBlockStartColor,
    borderBottomColor,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderBottomWidth,
    borderColor,
    borderCurve,
    borderEndColor,
    borderEndEndRadius,
    borderEndStartRadius,
    borderEndWidth,
    borderLeftColor,
    borderLeftWidth,
    borderRadius,
    borderRightColor,
    borderRightWidth,
    borderStartColor,
    borderStartEndRadius,
    borderStartStartRadius,
    borderStartWidth,
    borderStyle,
    borderTopColor,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderTopWidth,
    borderWidth,
    boxShadow,
    elevation,
    filter,
    mixBlendMode,
    opacity,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    transform,
    transformOrigin,
    ...unsafeStyles
  } = StyleSheet/* default */.A.flatten(customHeaderStyle || {});
  if (false) // removed by dead control flow
{}
  const safeStyles = {
    backfaceVisibility,
    backgroundColor,
    borderBlockColor,
    borderBlockEndColor,
    borderBlockStartColor,
    borderBottomColor,
    borderBottomEndRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomStartRadius,
    borderBottomWidth,
    borderColor,
    borderCurve,
    borderEndColor,
    borderEndEndRadius,
    borderEndStartRadius,
    borderEndWidth,
    borderLeftColor,
    borderLeftWidth,
    borderRadius,
    borderRightColor,
    borderRightWidth,
    borderStartColor,
    borderStartEndRadius,
    borderStartStartRadius,
    borderStartWidth,
    borderStyle,
    borderTopColor,
    borderTopEndRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderTopStartRadius,
    borderTopWidth,
    borderWidth,
    boxShadow,
    elevation,
    filter,
    mixBlendMode,
    opacity,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    transform,
    transformOrigin
  };

  // Setting a property to undefined triggers default style
  // So we need to filter them out
  // Users can use `null` instead
  for (const styleProp in safeStyles) {
    // @ts-expect-error: typescript wrongly complains that styleProp cannot be used to index safeStyles
    if (safeStyles[styleProp] === undefined) {
      // @ts-expect-error don't need to care about index signature for deletion
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete safeStyles[styleProp];
    }
  }
  const backgroundStyle = {
    ...(headerTransparent && {
      backgroundColor: 'transparent'
    }),
    ...((headerTransparent || headerShadowVisible === false) && {
      borderBottomWidth: 0,
      ...exports_Platform/* default */.A.select({
        android: {
          elevation: 0
        },
        web: {
          boxShadow: 'none'
        },
        default: {
          shadowOpacity: 0
        }
      })
    }),
    ...safeStyles
  };
  const iconTintColor = headerTintColor ?? exports_Platform/* default */.A.select({
    ios: colors.primary,
    default: colors.text
  });
  const leftButton = headerLeft ? headerLeft({
    tintColor: iconTintColor,
    pressColor: headerPressColor,
    pressOpacity: headerPressOpacity,
    displayMode: headerBackButtonDisplayMode,
    titleLayout,
    screenLayout: layout,
    canGoBack: Boolean(back),
    onPress: back ? navigation.goBack : undefined,
    label: back?.title,
    labelStyle: headerBackTitleStyle,
    href: back?.href
  }) : null;
  const rightButton = headerRight ? headerRight({
    tintColor: iconTintColor,
    pressColor: headerPressColor,
    pressOpacity: headerPressOpacity,
    canGoBack: Boolean(back)
  }) : null;
  const headerTitle = typeof customTitle !== 'function' ? props => /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderTitle, {
    ...props
  }) : customTitle;
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
    pointerEvents: "box-none",
    style: [{
      height,
      minHeight,
      maxHeight,
      opacity,
      transform
    }],
    children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
      pointerEvents: "box-none",
      style: [StyleSheet/* default */.A.absoluteFill, backgroundContainerStyle],
      children: headerBackground ? headerBackground({
        style: backgroundStyle
      }) : /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderBackground, {
        pointerEvents:
        // Allow touch through the header when background color is transparent
        headerTransparent && (backgroundStyle.backgroundColor === 'transparent' || color(backgroundStyle.backgroundColor).alpha() === 0) ? 'none' : 'auto',
        style: backgroundStyle
      })
    }), /*#__PURE__*/(0,jsx_runtime.jsx)(exports_View/* default */.A, {
      pointerEvents: "none",
      style: {
        height: headerStatusBarHeight
      }
    }), /*#__PURE__*/(0,jsx_runtime.jsxs)(exports_View/* default */.A, {
      pointerEvents: "box-none",
      style: [Header_styles.content, exports_Platform/* default */.A.OS === 'ios' && frame.width >= IPAD_MINI_MEDIUM_WIDTH ? Header_styles.large : null],
      children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
        pointerEvents: "box-none",
        style: [Header_styles.start, !searchBarVisible && headerTitleAlign === 'center' && Header_styles.expand, {
          marginStart: insets.left
        }, leftContainerStyle],
        children: leftButton
      }), exports_Platform/* default */.A.OS === 'ios' || !searchBarVisible ? /*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [/*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
          pointerEvents: "box-none",
          style: [Header_styles.title, {
            // Avoid the title from going offscreen or overlapping buttons
            maxWidth: headerTitleAlign === 'center' ? layout.width - ((leftButton ? headerBackButtonDisplayMode !== 'minimal' ? 80 : 32 : 16) + (rightButton || headerSearchBarOptions ? 16 : 0) + Math.max(insets.left, insets.right)) * 2 : layout.width - ((leftButton ? 52 : 16) + (rightButton || headerSearchBarOptions ? 52 : 16) + insets.left - insets.right)
          }, headerTitleAlign === 'left' && leftButton ? {
            marginStart: 4
          } : {
            marginHorizontal: 16
          }, titleContainerStyle],
          children: headerTitle({
            children: title,
            allowFontScaling: titleAllowFontScaling,
            tintColor: headerTintColor,
            onLayout: onTitleLayout,
            style: titleStyle
          })
        }), /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
          pointerEvents: "box-none",
          style: [Header_styles.end, Header_styles.expand, {
            marginEnd: insets.right
          }, rightContainerStyle],
          children: [rightButton, headerSearchBarOptions ? /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderButton, {
            tintColor: iconTintColor,
            pressColor: headerPressColor,
            pressOpacity: headerPressOpacity,
            onPress: () => {
              setSearchBarVisible(true);
              headerSearchBarOptions?.onOpen?.();
            },
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderIcon, {
              source: search_icon,
              tintColor: iconTintColor
            })
          }) : null]
        })]
      }) : null, exports_Platform/* default */.A.OS === 'ios' || searchBarVisible ? /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderSearchBar, {
        ...headerSearchBarOptions,
        visible: searchBarVisible,
        onClose: () => {
          setSearchBarVisible(false);
          headerSearchBarOptions?.onClose?.();
        },
        tintColor: headerTintColor,
        style: [exports_Platform/* default */.A.OS === 'ios' ? [StyleSheet/* default */.A.absoluteFill, {
          paddingTop: headerStatusBarHeight ? 0 : 4
        }, {
          backgroundColor: backgroundColor ?? colors.card
        }] : !leftButton && {
          marginStart: 8
        }]
      }) : null]
    })]
  });
}
const Header_styles = StyleSheet/* default */.A.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  large: {
    marginHorizontal: 5
  },
  title: {
    justifyContent: 'center'
  },
  start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  expand: {
    flexGrow: 1,
    flexBasis: 0
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderBackContext.js



const HeaderBackContext = getNamedContext('HeaderBackContext', undefined);
;// ./node_modules/@react-navigation/elements/lib/module/Header/HeaderHeightContext.js



const HeaderHeightContext_HeaderHeightContext = getNamedContext('HeaderHeightContext', undefined);
;// ./node_modules/@react-navigation/elements/lib/module/Header/useHeaderHeight.js




function useHeaderHeight() {
  const height = React.useContext(HeaderHeightContext);
  if (height === undefined) {
    throw new Error("Couldn't find the header height. Are you inside a screen in a navigator with a header?");
  }
  return height;
}
;// ./node_modules/@react-navigation/elements/lib/module/Label/getLabel.js


function getLabel(options, fallback) {
  return options.label !== undefined ? options.label : options.title !== undefined ? options.title : fallback;
}
;// ./node_modules/@react-navigation/elements/lib/module/Label/Label.js





function Label({
  tintColor,
  style,
  ...rest
}) {
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Text_Text, {
    numberOfLines: 1,
    ...rest,
    style: [Label_styles.label, tintColor != null && {
      color: tintColor
    }, style]
  });
}
const Label_styles = StyleSheet/* default */.A.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Lazy.js



/**
 * Render content lazily based on visibility.
 *
 * When enabled:
 * - If content is visible, it will render immediately
 * - If content is not visible, it won't render until it becomes visible
 *
 * Otherwise:
 * - If content is visible, it will render immediately
 * - If content is not visible, it will defer rendering until idle
 *
 * Once rendered, the content remains rendered.
 */
function Lazy({
  enabled,
  visible,
  children
}) {
  const [rendered, setRendered] = React.useState(enabled ? visible : false);
  const shouldRenderInIdle = !(enabled || visible || rendered);
  React.useEffect(() => {
    if (shouldRenderInIdle === false) {
      return;
    }
    const id = requestIdleCallback(() => {
      setRendered(true);
    });
    return () => cancelIdleCallback(id);
  }, [shouldRenderInIdle]);
  if (visible && rendered === false) {
    setRendered(true);
    return children;
  }
  if (rendered) {
    return children;
  }
  return null;
}
;// ./node_modules/@react-navigation/elements/lib/module/MissingIcon.js





function MissingIcon({
  color,
  size,
  style
}) {
  return /*#__PURE__*/(0,jsx_runtime.jsx)(Text_Text, {
    style: [MissingIcon_styles.icon, {
      color,
      fontSize: size
    }, style],
    children: "\u23F7"
  });
}
const MissingIcon_styles = StyleSheet/* default */.A.create({
  icon: {
    backgroundColor: 'transparent'
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/ResourceSavingView.js







const FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container

function ResourceSavingView({
  visible,
  children,
  style,
  ...rest
}) {
  if (Platform.OS === 'web') {
    return /*#__PURE__*/_jsx(View
    // @ts-expect-error: hidden exists on web, but not in React Native
    , {
      hidden: !visible,
      style: [{
        display: visible ? 'flex' : 'none'
      }, ResourceSavingView_styles.container, style],
      pointerEvents: visible ? 'auto' : 'none',
      ...rest,
      children: children
    });
  }
  return /*#__PURE__*/_jsx(View, {
    style: [ResourceSavingView_styles.container, style]
    // box-none doesn't seem to work properly on Android
    ,

    pointerEvents: visible ? 'auto' : 'none',
    children: /*#__PURE__*/_jsx(View, {
      collapsable: false,
      removeClippedSubviews:
      // On iOS & macOS, set removeClippedSubviews to true only when not focused
      // This is an workaround for a bug where the clipped view never re-appears
      Platform.OS === 'ios' || Platform.OS === 'macos' ? !visible : true,
      pointerEvents: visible ? 'auto' : 'none',
      style: visible ? ResourceSavingView_styles.attached : ResourceSavingView_styles.detached,
      children: children
    })
  });
}
const ResourceSavingView_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  attached: {
    flex: 1
  },
  detached: {
    flex: 1,
    top: FAR_FAR_AWAY
  }
});
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Dimensions/index.js
var Dimensions = __webpack_require__(3384);
;// ./node_modules/react-native-safe-area-context/lib/module/InitialWindow.js
const initialWindowMetrics = null;

/**
 * @deprecated
 */
const initialWindowSafeAreaInsets = null;
;// ./node_modules/@react-navigation/elements/lib/module/SafeAreaProviderCompat.js










const {
  width = 0,
  height = 0
} = Dimensions/* default */.A.get('window');

// To support SSR on web, we need to have empty insets for initial values
// Otherwise there can be mismatch between SSR and client output
// We also need to specify empty values to support tests environments
const initialMetrics = exports_Platform/* default */.A.OS === 'web' || initialWindowMetrics == null ? {
  frame: {
    x: 0,
    y: 0,
    width,
    height
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
} : initialWindowMetrics;
function SafeAreaProviderCompat({
  children,
  style
}) {
  const insets = react.useContext(SafeAreaContext/* SafeAreaInsetsContext */.q9);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(FrameSizeProvider, {
    initialFrame: initialMetrics.frame,
    render: ({
      ref,
      onLayout
    }) => {
      if (insets) {
        // If we already have insets, don't wrap the stack in another safe area provider
        // This avoids an issue with updates at the cost of potentially incorrect values
        // https://github.com/react-navigation/react-navigation/issues/174
        return /*#__PURE__*/(0,jsx_runtime.jsx)(exports_View/* default */.A, {
          ref: ref,
          onLayout: onLayout,
          style: [SafeAreaProviderCompat_styles.container, style],
          children: children
        });
      }

      // SafeAreaProvider doesn't forward ref
      // So we only pass onLayout to it
      return /*#__PURE__*/(0,jsx_runtime.jsx)(SafeAreaContext/* SafeAreaProvider */.Oy, {
        initialMetrics: initialMetrics,
        style: style,
        onLayout: onLayout,
        children: children
      });
    }
  });
}
SafeAreaProviderCompat.initialMetrics = initialMetrics;
const SafeAreaProviderCompat_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/Screen.js













function Screen(props) {
  const insets = (0,SafeAreaContext/* useSafeAreaInsets */.Or)();
  const isParentHeaderShown = react.useContext(HeaderShownContext);
  const parentHeaderHeight = react.useContext(HeaderHeightContext_HeaderHeightContext);
  const {
    focused,
    modal = false,
    header,
    headerShown = true,
    headerTransparent,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    navigation,
    route,
    children,
    style
  } = props;
  const defaultHeaderHeight = useFrameSize(size => getDefaultHeaderHeight(size, modal, headerStatusBarHeight));
  const headerRef = react.useRef(null);
  const [headerHeight, setHeaderHeight] = react.useState(defaultHeaderHeight);
  react.useLayoutEffect(() => {
    headerRef.current?.measure((_x, _y, _width, height) => {
      setHeaderHeight(height);
    });
  }, [route.name]);
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(Background, {
    "aria-hidden": !focused,
    style: [Screen_styles.container, style]
    // On Fabric we need to disable collapsing for the background to ensure
    // that we won't render unnecessary views due to the view flattening.
    ,

    collapsable: false,
    children: [headerShown ? /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationContext.Provider, {
      value: navigation,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationRouteContext.Provider, {
        value: route,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(exports_View/* default */.A, {
          ref: headerRef,
          pointerEvents: "box-none",
          onLayout: e => {
            const {
              height
            } = e.nativeEvent.layout;
            setHeaderHeight(height);
          },
          style: [Screen_styles.header, headerTransparent ? Screen_styles.absolute : null],
          children: header
        })
      })
    }) : null, /*#__PURE__*/(0,jsx_runtime.jsx)(exports_View/* default */.A, {
      style: Screen_styles.content,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderShownContext.Provider, {
        value: isParentHeaderShown || headerShown !== false,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderHeightContext_HeaderHeightContext.Provider, {
          value: headerShown ? headerHeight : parentHeaderHeight ?? 0,
          children: children
        })
      })
    })]
  });
}
const Screen_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  header: {
    zIndex: 1
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
;// ./node_modules/@react-navigation/elements/lib/module/index.js
































const Assets = [back_icon, back_icon_mask, search_icon, close_icon, clear_icon];


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

/***/ 8418
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(5160);
} else // removed by dead control flow
{}


/***/ },

/***/ 8444
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8168);
/* harmony import */ var _babel_runtime_helpers_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8587);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6540);
/* harmony import */ var _StyleSheet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3999);
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
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_View__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)({}, rest, {
    ref: ref,
    style: [styles.root, style]
  }));
});
SafeAreaView.displayName = 'SafeAreaView';
var styles = _StyleSheet__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.create({
  root: {
    paddingTop: cssFunction + "(safe-area-inset-top)",
    paddingRight: cssFunction + "(safe-area-inset-right)",
    paddingBottom: cssFunction + "(safe-area-inset-bottom)",
    paddingLeft: cssFunction + "(safe-area-inset-left)"
  }
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SafeAreaView);

/***/ },

/***/ 8507
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(5659);

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

/***/ 8589
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  M: () => (/* binding */ createStackNavigator)
});

// EXTERNAL MODULE: ./node_modules/@react-navigation/native/lib/module/index.js + 103 modules
var lib_module = __webpack_require__(7397);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/@react-navigation/elements/lib/module/index.js + 35 modules
var elements_lib_module = __webpack_require__(7418);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/StyleSheet/index.js + 5 modules
var StyleSheet = __webpack_require__(3999);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/View/index.js
var View = __webpack_require__(9176);
// EXTERNAL MODULE: ./node_modules/react-native-safe-area-context/lib/module/SafeAreaContext.js + 1 modules
var SafeAreaContext = __webpack_require__(2168);
;// ./node_modules/@react-navigation/stack/src/utils/ModalPresentationContext.tsx

const ModalPresentationContext = /*#__PURE__*/react.createContext(false);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// ./node_modules/@react-navigation/stack/src/views/GestureHandler.tsx



const Dummy = ({
  children
}) => /*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
  children: children
});
const PanGestureHandler = Dummy;
const GestureHandlerRootView = View/* default */.A;
const GestureState = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5
};
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Animated/index.js + 45 modules
var Animated = __webpack_require__(8831);
;// ./node_modules/@react-navigation/stack/src/TransitionConfigs/HeaderStyleInterpolators.tsx


const {
  add,
  multiply
} = Animated/* default */.A;

// Width of the screen in split layout on portrait mode on iPad Mini
// Keep in sync with HeaderBackButton.tsx
const IPAD_MINI_MEDIUM_WIDTH = 414;

/**
 * Standard UIKit style animation for the header where the title fades into the back button label.
 */
function forUIKit({
  current,
  next,
  direction,
  layouts
}) {
  const defaultOffset = 100;
  const leftSpacing = 27 + (Platform.OS === 'ios' && layouts.screen.width >= IPAD_MINI_MEDIUM_WIDTH ? 5 // Additional padding on iPad specified in Header.tsx
  : 0);

  // The title and back button title should cross-fade to each other
  // When screen is fully open, the title should be in center, and back title should be on left
  // When screen is closing, the previous title will animate to back title's position
  // And back title will animate to title's position
  // We achieve this by calculating the offsets needed to translate title to back title's position and vice-versa
  const leftLabelOffset = layouts.leftLabel ? (layouts.screen.width - layouts.leftLabel.width) / 2 - leftSpacing : defaultOffset;
  const titleLeftOffset = layouts.title ? (layouts.screen.width - layouts.title.width) / 2 - leftSpacing : defaultOffset;

  // When the current title is animating to right, it is centered in the right half of screen in middle of transition
  // The back title also animates in from this position
  const rightOffset = layouts.screen.width / 4;
  const multiplier = direction === 'rtl' ? -1 : 1;
  const progress = add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  return {
    leftButtonStyle: {
      opacity: progress.interpolate({
        inputRange: [0.3, 1, 1.5],
        outputRange: [0, 1, 0]
      })
    },
    leftLabelStyle: {
      transform: [{
        translateX: multiply(multiplier, progress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [leftLabelOffset, 0, -rightOffset]
        }))
      }]
    },
    rightButtonStyle: {
      opacity: progress.interpolate({
        inputRange: [0.3, 1, 1.5],
        outputRange: [0, 1, 0]
      })
    },
    titleStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.75, 1, 1.5],
        outputRange: [0, 0, 0.1, 1, 0]
      }),
      transform: [{
        translateX: multiply(multiplier, progress.interpolate({
          inputRange: [0.5, 1, 2],
          outputRange: [rightOffset, 0, -titleLeftOffset]
        }))
      }]
    },
    backgroundStyle: {
      transform: [{
        translateX: multiply(multiplier, progress.interpolate({
          inputRange: [0, 1, 2],
          outputRange: [layouts.screen.width, 0, -layouts.screen.width]
        }))
      }]
    }
  };
}

/**
 * Simple fade animation for the header elements.
 */
function forFade({
  current,
  next
}) {
  const progress = add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  });
  return {
    leftButtonStyle: {
      opacity
    },
    rightButtonStyle: {
      opacity
    },
    titleStyle: {
      opacity
    },
    backgroundStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1, 1.9, 2],
        outputRange: [0, 1, 1, 0]
      })
    }
  };
}

/**
 * Simple translate animation to translate the header to left.
 */
function forSlideLeft({
  current,
  next,
  direction,
  layouts: {
    screen
  }
}) {
  const isRTL = direction === 'rtl';
  const progress = add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const translateX = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL ? [-screen.width, 0, screen.width] : [screen.width, 0, -screen.width]
  });
  const transform = [{
    translateX
  }];
  return {
    leftButtonStyle: {
      transform
    },
    rightButtonStyle: {
      transform
    },
    titleStyle: {
      transform
    },
    backgroundStyle: {
      transform
    }
  };
}

/**
 * Simple translate animation to translate the header to right.
 */
function forSlideRight({
  current,
  next,
  direction,
  layouts: {
    screen
  }
}) {
  const isRTL = direction === 'rtl';
  const progress = add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const translateX = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: isRTL ? [screen.width, 0, -screen.width] : [-screen.width, 0, screen.width]
  });
  const transform = [{
    translateX
  }];
  return {
    leftButtonStyle: {
      transform
    },
    rightButtonStyle: {
      transform
    },
    titleStyle: {
      transform
    },
    backgroundStyle: {
      transform
    }
  };
}

/**
 * Simple translate animation to translate the header to slide up.
 */
function forSlideUp({
  current,
  next,
  layouts: {
    header
  }
}) {
  const progress = add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const translateY = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-header.height, 0, -header.height]
  });
  const transform = [{
    translateY
  }];
  return {
    leftButtonStyle: {
      transform
    },
    rightButtonStyle: {
      transform
    },
    titleStyle: {
      transform
    },
    backgroundStyle: {
      transform
    }
  };
}
function forNoAnimation() {
  return {};
}
;// ./node_modules/@react-navigation/stack/src/utils/throttle.tsx
function throttle(func, duration) {
  let timeout;
  return function (...args) {
    if (timeout == null) {
      func.apply(this, args);
      timeout = setTimeout(() => {
        timeout = undefined;
      }, duration);
    }
  };
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Platform/index.js
var exports_Platform = __webpack_require__(7862);
;// ./node_modules/@react-navigation/stack/src/views/Header/HeaderSegment.tsx






function HeaderSegment(props) {
  const {
    direction
  } = (0,lib_module.useLocale)();
  const [leftLabelLayout, setLeftLabelLayout] = react.useState(undefined);
  const [titleLayout, setTitleLayout] = react.useState(undefined);
  const handleTitleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    setTitleLayout(titleLayout => {
      if (titleLayout && height === titleLayout.height && width === titleLayout.width) {
        return titleLayout;
      }
      return {
        height,
        width
      };
    });
  };
  const handleLeftLabelLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    if (leftLabelLayout && height === leftLabelLayout.height && width === leftLabelLayout.width) {
      return;
    }
    setLeftLabelLayout({
      height,
      width
    });
  };
  const {
    progress,
    layout,
    modal,
    onGoBack,
    backHref,
    headerTitle: title,
    headerLeft: left = onGoBack ? props => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderBackButton */.Hm, {
      ...props
    }) : undefined,
    headerRight: right,
    headerBackImage,
    headerBackTitle,
    headerBackButtonDisplayMode = exports_Platform/* default */.A.OS === 'ios' ? 'default' : 'minimal',
    headerBackTruncatedTitle,
    headerBackAccessibilityLabel,
    headerBackTestID,
    headerBackAllowFontScaling,
    headerBackTitleStyle,
    headerTitleContainerStyle,
    headerLeftContainerStyle,
    headerRightContainerStyle,
    headerBackgroundContainerStyle,
    headerStyle: customHeaderStyle,
    headerStatusBarHeight,
    styleInterpolator,
    ...rest
  } = props;
  const defaultHeight = (0,elements_lib_module/* getDefaultHeaderHeight */.Q6)(layout, modal, headerStatusBarHeight);
  const {
    height = defaultHeight
  } = StyleSheet/* default */.A.flatten(customHeaderStyle || {});
  const headerHeight = typeof height === 'number' ? height : defaultHeight;
  const {
    titleStyle,
    leftButtonStyle,
    leftLabelStyle,
    rightButtonStyle,
    backgroundStyle
  } = react.useMemo(() => styleInterpolator({
    current: {
      progress: progress.current
    },
    next: progress.next && {
      progress: progress.next
    },
    direction,
    layouts: {
      header: {
        height: headerHeight,
        width: layout.width
      },
      screen: layout,
      title: titleLayout,
      leftLabel: leftLabelLayout
    }
  }), [styleInterpolator, progress, direction, headerHeight, layout, titleLayout, leftLabelLayout]);
  const headerLeft = left ? props => left({
    ...props,
    href: backHref,
    backImage: headerBackImage,
    accessibilityLabel: headerBackAccessibilityLabel,
    testID: headerBackTestID,
    allowFontScaling: headerBackAllowFontScaling,
    onPress: onGoBack,
    label: headerBackTitle,
    truncatedLabel: headerBackTruncatedTitle,
    labelStyle: [leftLabelStyle, headerBackTitleStyle],
    onLabelLayout: handleLeftLabelLayout,
    screenLayout: layout,
    titleLayout,
    canGoBack: Boolean(onGoBack)
  }) : undefined;
  const headerRight = right ? props => right({
    ...props,
    canGoBack: Boolean(onGoBack)
  }) : undefined;
  const headerTitle = typeof title !== 'function' ? props => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderTitle */.gY, {
    ...props,
    onLayout: handleTitleLayout
  }) : props => title({
    ...props,
    onLayout: handleTitleLayout
  });
  return /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* Header */.Y9, {
    modal: modal,
    layout: layout,
    headerTitle: headerTitle,
    headerLeft: headerLeft,
    headerRight: headerRight,
    headerTitleContainerStyle: [titleStyle, headerTitleContainerStyle],
    headerLeftContainerStyle: [leftButtonStyle, headerLeftContainerStyle],
    headerRightContainerStyle: [rightButtonStyle, headerRightContainerStyle],
    headerBackButtonDisplayMode: headerBackButtonDisplayMode,
    headerBackgroundContainerStyle: [backgroundStyle, headerBackgroundContainerStyle],
    headerStyle: customHeaderStyle,
    headerStatusBarHeight: headerStatusBarHeight,
    ...rest
  });
}
;// ./node_modules/@react-navigation/stack/src/views/Header/Header.tsx








const Header = /*#__PURE__*/react.memo(function Header({
  back,
  layout,
  progress,
  options,
  route,
  navigation,
  styleInterpolator
}) {
  const insets = (0,SafeAreaContext/* useSafeAreaInsets */.Or)();
  let previousTitle;

  // The label for the left back button shows the title of the previous screen
  // If a custom label is specified, we use it, otherwise use previous screen's title
  if (options.headerBackTitle !== undefined) {
    previousTitle = options.headerBackTitle;
  } else if (back) {
    previousTitle = back.title;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const goBack = react.useCallback(throttle(() => {
    if (navigation.isFocused() && navigation.canGoBack()) {
      navigation.dispatch({
        ...lib_module.StackActions.pop(),
        source: route.key
      });
    }
  }, 50), [navigation, route.key]);
  const isModal = react.useContext(ModalPresentationContext);
  const isParentHeaderShown = react.useContext(elements_lib_module/* HeaderShownContext */.q2);
  const statusBarHeight = options.headerStatusBarHeight !== undefined ? options.headerStatusBarHeight : isModal || isParentHeaderShown ? 0 : insets.top;
  return /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderSegment, {
    ...options,
    title: (0,elements_lib_module/* getHeaderTitle */.k1)(options, route.name),
    progress: progress,
    layout: layout,
    modal: isModal,
    headerBackTitle: options.headerBackTitle !== undefined ? options.headerBackTitle : previousTitle,
    headerStatusBarHeight: statusBarHeight,
    onGoBack: back ? goBack : undefined,
    backHref: back ? back.href : undefined,
    styleInterpolator: styleInterpolator
  });
});
;// ./node_modules/@react-navigation/stack/src/views/Header/HeaderContainer.tsx








function HeaderContainer({
  mode,
  scenes,
  layout,
  getPreviousScene,
  getFocusedRoute,
  onContentHeightChange,
  style
}) {
  const focusedRoute = getFocusedRoute();
  const parentHeaderBack = react.useContext(elements_lib_module/* HeaderBackContext */.wW);
  const {
    buildHref
  } = (0,lib_module.useLinkBuilder)();
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    pointerEvents: "box-none",
    style: style,
    children: scenes.slice(-2).map((scene, i, self) => {
      if (mode === 'screen' && i !== self.length - 1 || !scene) {
        return null;
      }
      const {
        header,
        headerMode,
        headerShown = true,
        headerTransparent,
        headerStyleInterpolator
      } = scene.descriptor.options;
      if (headerMode !== mode || !headerShown) {
        return null;
      }
      const isFocused = focusedRoute.key === scene.descriptor.route.key;
      const previousScene = getPreviousScene({
        route: scene.descriptor.route
      });
      let headerBack = parentHeaderBack;
      if (previousScene) {
        const {
          options,
          route
        } = previousScene.descriptor;
        headerBack = previousScene ? {
          title: (0,elements_lib_module/* getHeaderTitle */.k1)(options, route.name),
          href: buildHref(route.name, route.params)
        } : parentHeaderBack;
      }

      // If the screen is next to a headerless screen, we need to make the header appear static
      // This makes the header look like it's moving with the screen
      const previousDescriptor = self[i - 1]?.descriptor;
      const nextDescriptor = self[i + 1]?.descriptor;
      const {
        headerShown: previousHeaderShown = true,
        headerMode: previousHeaderMode
      } = previousDescriptor?.options || {};

      // If any of the next screens don't have a header or header is part of the screen
      // Then we need to move this header offscreen so that it doesn't cover it
      const nextHeaderlessScene = self.slice(i + 1).find(scene => {
        const {
          headerShown: currentHeaderShown = true,
          headerMode: currentHeaderMode
        } = scene?.descriptor.options || {};
        return currentHeaderShown === false || currentHeaderMode === 'screen';
      });
      const {
        gestureDirection: nextHeaderlessGestureDirection
      } = nextHeaderlessScene?.descriptor.options || {};
      const isHeaderStatic = (previousHeaderShown === false || previousHeaderMode === 'screen') &&
      // We still need to animate when coming back from next scene
      // A hacky way to check this is if the next scene exists
      !nextDescriptor || nextHeaderlessScene;
      const props = {
        layout,
        back: headerBack,
        progress: scene.progress,
        options: scene.descriptor.options,
        route: scene.descriptor.route,
        navigation: scene.descriptor.navigation,
        styleInterpolator: mode === 'float' ? isHeaderStatic ? nextHeaderlessGestureDirection === 'vertical' || nextHeaderlessGestureDirection === 'vertical-inverted' ? forSlideUp : nextHeaderlessGestureDirection === 'horizontal-inverted' ? forSlideRight : forSlideLeft : headerStyleInterpolator : forNoAnimation
      };
      return /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationContext.Provider, {
        value: scene.descriptor.navigation,
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(lib_module.NavigationRouteContext.Provider, {
          value: scene.descriptor.route,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
            onLayout: onContentHeightChange ? e => {
              const {
                height
              } = e.nativeEvent.layout;
              onContentHeightChange({
                route: scene.descriptor.route,
                height
              });
            } : undefined,
            pointerEvents: isFocused ? 'box-none' : 'none',
            "aria-hidden": !isFocused,
            style:
            // Avoid positioning the focused header absolutely
            // Otherwise accessibility tools don't seem to be able to find it
            mode === 'float' && !isFocused || headerTransparent ? styles.header : null,
            children: header !== undefined ? header(props) : /*#__PURE__*/(0,jsx_runtime.jsx)(Header, {
              ...props
            })
          })
        })
      }, scene.descriptor.route.key);
    })
  });
}
const styles = StyleSheet/* default */.A.create({
  header: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  }
});
;// ./node_modules/@react-navigation/stack/src/utils/conditional.tsx

const {
  add: conditional_add,
  multiply: conditional_multiply
} = Animated/* default */.A;

/**
 * Use an Animated Node based on a condition. Similar to Reanimated's `cond`.
 *
 * @param condition Animated Node representing the condition, must be 0 or 1, 1 means `true`, 0 means `false`
 * @param main Animated Node to use if the condition is `true`
 * @param fallback Animated Node to use if the condition is `false`
 */
function conditional(condition, main, fallback) {
  // To implement this behavior, we multiply the main node with the condition.
  // So if condition is 0, result will be 0, and if condition is 1, result will be main node.
  // Then we multiple reverse of the condition (0 if condition is 1) with the fallback.
  // So if condition is 0, result will be fallback node, and if condition is 1, result will be 0,
  // This way, one of them will always be 0, and other one will be the value we need.
  // In the end we add them both together, 0 + value we need = value we need
  return conditional_add(conditional_multiply(condition, main), conditional_multiply(condition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  }), fallback));
}
;// ./node_modules/@react-navigation/stack/src/TransitionConfigs/CardStyleInterpolators.tsx



const {
  add: CardStyleInterpolators_add,
  multiply: CardStyleInterpolators_multiply
} = Animated/* default */.A;

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontalIOS({
  current,
  next,
  inverted,
  layouts: {
    screen
  }
}) {
  const translateFocused = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.width, 0],
    extrapolate: 'clamp'
  }), inverted);
  const translateUnfocused = next ? CardStyleInterpolators_multiply(next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screen.width * -0.3],
    extrapolate: 'clamp'
  }), inverted) : 0;
  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.07],
    extrapolate: 'clamp'
  });
  const shadowOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp'
  });
  return {
    cardStyle: {
      transform: [
      // Translation for the animation of the current card
      {
        translateX: translateFocused
      },
      // Translation for the animation of the card on top of this
      {
        translateX: translateUnfocused
      }]
    },
    overlayStyle: {
      opacity: overlayOpacity
    },
    shadowStyle: {
      shadowOpacity
    }
  };
}

/**
 * iOS-style slide in from the left.
 */
function forHorizontalIOSInverted({
  inverted,
  ...rest
}) {
  return forHorizontalIOS({
    ...rest,
    inverted: Animated/* default */.A.multiply(inverted, -1)
  });
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVerticalIOS({
  current,
  inverted,
  layouts: {
    screen
  }
}) {
  const translateY = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
    extrapolate: 'clamp'
  }), inverted);
  return {
    cardStyle: {
      transform: [{
        translateY
      }]
    }
  };
}

/**
 * Standard iOS-style modal animation in iOS 13.
 */
function forModalPresentationIOS({
  index,
  current,
  next,
  inverted,
  layouts: {
    screen
  },
  insets
}) {
  const hasNotchIos = exports_Platform/* default */.A.OS === 'ios' && !exports_Platform/* default */.A.isPad && !exports_Platform/* default */.A.isTV && insets.top > 20;
  const isLandscape = screen.width > screen.height;
  const topOffset = isLandscape ? 0 : 10;
  const statusBarHeight = insets.top;
  const aspectRatio = screen.height / screen.width;
  const progress = CardStyleInterpolators_add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const isFirst = index === 0;
  const translateY = CardStyleInterpolators_multiply(progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [screen.height, isFirst ? 0 : topOffset, (isFirst ? statusBarHeight : 0) - topOffset * aspectRatio]
  }), inverted);
  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0.3, 1, 1]
  });
  const scale = isLandscape ? 1 : progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1, screen.width ? 1 - topOffset * 2 / screen.width : 1]
  });
  const borderRadius = isLandscape ? 0 : isFirst ? progress.interpolate({
    inputRange: [0, 1, 1.0001, 2],
    outputRange: [0, 0, hasNotchIos ? 38 : 0, 10]
  }) : 10;
  return {
    cardStyle: {
      overflow: 'hidden',
      borderCurve: 'continuous',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      // We don't need these for the animation
      // But different border radius for corners improves animation perf
      borderBottomLeftRadius: hasNotchIos ? borderRadius : 0,
      borderBottomRightRadius: hasNotchIos ? borderRadius : 0,
      marginTop: isFirst ? 0 : statusBarHeight,
      marginBottom: isFirst ? 0 : topOffset,
      transform: [{
        translateY
      }, {
        scale
      }]
    },
    overlayStyle: {
      opacity: overlayOpacity
    }
  };
}

/**
 * Standard Android-style fade in from the bottom for Android Oreo.
 */
function forFadeFromBottomAndroid({
  current,
  inverted,
  layouts: {
    screen
  },
  closing
}) {
  const translateY = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height * 0.08, 0],
    extrapolate: 'clamp'
  }), inverted);
  const opacity = conditional(closing, current.progress, current.progress.interpolate({
    inputRange: [0, 0.5, 0.9, 1],
    outputRange: [0, 0.25, 0.7, 1],
    extrapolate: 'clamp'
  }));
  return {
    cardStyle: {
      opacity,
      transform: [{
        translateY
      }]
    }
  };
}

/**
 * Standard Android-style reveal from the bottom for Android Pie.
 */
function forRevealFromBottomAndroid({
  current,
  next,
  inverted,
  layouts: {
    screen
  }
}) {
  const containerTranslateY = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height, 0],
    extrapolate: 'clamp'
  }), inverted);
  const cardTranslateYFocused = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height * (95.9 / 100) * -1, 0],
    extrapolate: 'clamp'
  }), inverted);
  const cardTranslateYUnfocused = next ? CardStyleInterpolators_multiply(next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screen.height * (2 / 100) * -1],
    extrapolate: 'clamp'
  }), inverted) : 0;
  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 0.36, 1],
    outputRange: [0, 0.1, 0.1],
    extrapolate: 'clamp'
  });
  return {
    containerStyle: {
      overflow: 'hidden',
      transform: [{
        translateY: containerTranslateY
      }]
    },
    cardStyle: {
      transform: [{
        translateY: cardTranslateYFocused
      }, {
        translateY: cardTranslateYUnfocused
      }]
    },
    overlayStyle: {
      opacity: overlayOpacity
    }
  };
}

/**
 * Standard Android-style zoom for Android 10.
 */
function forScaleFromCenterAndroid({
  current,
  next,
  closing
}) {
  const progress = CardStyleInterpolators_add(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), next ? next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }) : 0);
  const opacity = progress.interpolate({
    inputRange: [0, 0.75, 0.875, 1, 1.0825, 1.2075, 2],
    outputRange: [0, 0, 1, 1, 1, 1, 0]
  });
  const scale = conditional(closing, current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.925, 1],
    extrapolate: 'clamp'
  }), progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.85, 1, 1.075]
  }));
  return {
    cardStyle: {
      opacity,
      transform: [{
        scale
      }]
    }
  };
}

/**
 * Standard Android-style fade from right for Android 14.
 */
function forFadeFromRightAndroid({
  current,
  next,
  inverted,
  closing
}) {
  const translateFocused = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [96, 0],
    extrapolate: 'clamp'
  }), inverted);
  const translateUnfocused = next ? CardStyleInterpolators_multiply(next.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -96],
    extrapolate: 'clamp'
  }), inverted) : 0;
  const opacity = conditional(closing, current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }), current.progress);
  return {
    cardStyle: {
      opacity,
      transform: [
      // Translation for the animation of the current card
      {
        translateX: translateFocused
      },
      // Translation for the animation of the card on top of this
      {
        translateX: translateUnfocused
      }]
    }
  };
}

/**
 * Standard bottom sheet slide in from the bottom for Android.
 */
function forBottomSheetAndroid({
  current,
  inverted,
  layouts: {
    screen
  },
  closing
}) {
  const translateY = CardStyleInterpolators_multiply(current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [screen.height * 0.8, 0],
    extrapolate: 'clamp'
  }), inverted);
  const opacity = conditional(closing, current.progress, current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }));
  const overlayOpacity = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
    extrapolate: 'clamp'
  });
  return {
    cardStyle: {
      opacity,
      transform: [{
        translateY
      }]
    },
    overlayStyle: {
      opacity: overlayOpacity
    }
  };
}

/**
 * Simple fade animation for dialogs
 */
function forFadeFromCenter({
  current: {
    progress
  }
}) {
  return {
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1]
      })
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp'
      })
    }
  };
}
function CardStyleInterpolators_forNoAnimation() {
  return {};
}
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Easing/index.js + 2 modules
var Easing = __webpack_require__(6693);
;// ./node_modules/@react-navigation/stack/src/TransitionConfigs/TransitionSpecs.tsx

/**
 * Exact values from UINavigationController's animation configuration.
 */
const TransitionIOSSpec = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10
  }
};

/**
 * Configuration for activity open animation from Android Nougat.
 * See http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
 */
const FadeInFromBottomAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 350,
    easing: Easing/* default */.A.out(Easing/* default */.A.poly(5))
  }
};

/**
 * Configuration for activity close animation from Android Nougat.
 * See http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
 */
const FadeOutToBottomAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 150,
    easing: Easing/* default */.A.in(Easing/* default */.A.linear)
  }
};

/**
 * Approximate configuration for activity open animation from Android Pie.
 * See http://aosp.opersys.com/xref/android-9.0.0_r47/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
 */
const RevealFromBottomAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 425,
    // This is super rough approximation of the path used for the curve by android
    // See http://aosp.opersys.com/xref/android-9.0.0_r47/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing/* default */.A.bezier(0.20833, 0.82, 0.25, 1)
  }
};

/**
 * Approximate configuration for activity open animation from Android Q.
 * See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
 */
const ScaleFromCenterAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 400,
    // This is super rough approximation of the path used for the curve by android
    // See http://aosp.opersys.com/xref/android-10.0.0_r2/xref/frameworks/base/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing/* default */.A.bezier(0.20833, 0.82, 0.25, 1)
  }
};

/**
 * Approximate configuration for activity open animation from Android 14.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_open_enter.xml
 */
const FadeInFromRightAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 450,
    // This is super rough approximation of the path used for the curve by android
    // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing/* default */.A.bezier(0.20833, 0.82, 0.25, 1)
  }
};

/**
 * Approximate configuration for activity close animation from Android 14.
 * See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/anim/activity_close_exit.xml
 */
const FadeOutToLeftAndroidSpec = {
  animation: 'timing',
  config: {
    duration: 450,
    // This is super rough approximation of the path used for the curve by android
    // See https://android.googlesource.com/platform/frameworks/base/+/refs/tags/android-14.0.0_r51/core/res/res/interpolator/fast_out_extra_slow_in.xml
    easing: Easing/* default */.A.bezier(0.20833, 0.82, 0.25, 1)
  }
};

/**
 * Configuration for bottom sheet slide in animation from Material Design.
 * See https://github.com/material-components/material-components-android/blob/fd3639092e1ffef9dc11bcedf79f32801d85e898/lib/java/com/google/android/material/bottomsheet/res/anim/mtrl_bottom_sheet_slide_in.xml
 */
const BottomSheetSlideInSpec = {
  animation: 'timing',
  config: {
    duration: 250,
    // See https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/view/animation/AccelerateDecelerateInterpolator.java
    easing: t => Math.cos((t + 1) * Math.PI) / 2.0 + 0.5
  }
};

/**
 * Configuration for bottom sheet slide out animation from Material Design.
 * See https://github.com/material-components/material-components-android/blob/fd3639092e1ffef9dc11bcedf79f32801d85e898/lib/java/com/google/android/material/bottomsheet/res/anim/mtrl_bottom_sheet_slide_in.xml
 */
const BottomSheetSlideOutSpec = {
  animation: 'timing',
  config: {
    duration: 200,
    // See https://android.googlesource.com/platform/frameworks/base/+/master/core/java/android/view/animation/AccelerateInterpolator.java
    easing: t => t === 1.0 ? 1 : Math.pow(t, 2)
  }
};
;// ./node_modules/@react-navigation/stack/src/TransitionConfigs/TransitionPresets.tsx




const ANDROID_VERSION_PIE = 28;
const ANDROID_VERSION_10 = 29;
const ANDROID_VERSION_14 = 34;

/**
 * Standard iOS navigation transition.
 */
const SlideFromRightIOS = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec
  },
  cardStyleInterpolator: forHorizontalIOS,
  headerStyleInterpolator: forFade
};

/**
 * Standard iOS navigation transition for modals.
 */
const ModalSlideFromBottomIOS = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec
  },
  cardStyleInterpolator: forVerticalIOS,
  headerStyleInterpolator: forFade
};

/**
 * Standard iOS modal presentation style (introduced in iOS 13).
 */
const ModalPresentationIOS = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionIOSSpec,
    close: TransitionIOSSpec
  },
  cardStyleInterpolator: forModalPresentationIOS,
  headerStyleInterpolator: forFade
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android < 9 (Oreo).
 */
const FadeFromBottomAndroid = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec
  },
  cardStyleInterpolator: forFadeFromBottomAndroid,
  headerStyleInterpolator: forFade
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 9 (Pie).
 */
const RevealFromBottomAndroid = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: RevealFromBottomAndroidSpec,
    close: RevealFromBottomAndroidSpec
  },
  cardStyleInterpolator: forRevealFromBottomAndroid,
  headerStyleInterpolator: forFade
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 10 (Q).
 */
const ScaleFromCenterAndroid = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: ScaleFromCenterAndroidSpec,
    close: ScaleFromCenterAndroidSpec
  },
  cardStyleInterpolator: forScaleFromCenterAndroid,
  headerStyleInterpolator: forFade
};

/**
 * Standard Android navigation transition when opening or closing an Activity on Android 14.
 */
const FadeFromRightAndroid = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec
  },
  cardStyleInterpolator: forFadeFromRightAndroid,
  headerStyleInterpolator: forFade
};

/**
 * Standard bottom sheet slide transition for Android 10.
 */
const BottomSheetAndroid = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: BottomSheetSlideInSpec,
    close: BottomSheetSlideOutSpec
  },
  cardStyleInterpolator: forBottomSheetAndroid,
  headerStyleInterpolator: forFade
};

/**
 * Fade transition for transparent modals.
 */
const ModalFadeTransition = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: BottomSheetSlideInSpec,
    close: BottomSheetSlideOutSpec
  },
  cardStyleInterpolator: forFadeFromCenter,
  headerStyleInterpolator: forFade
};

/**
 * Default navigation transition for the current platform.
 */
const DefaultTransition = exports_Platform/* default */.A.select({
  ios: SlideFromRightIOS,
  android: Number(exports_Platform/* default */.A.Version) >= ANDROID_VERSION_14 ? FadeFromRightAndroid : Number(exports_Platform/* default */.A.Version) >= ANDROID_VERSION_10 ? ScaleFromCenterAndroid : Number(exports_Platform/* default */.A.Version) >= ANDROID_VERSION_PIE ? RevealFromBottomAndroid : FadeFromBottomAndroid,
  default: ScaleFromCenterAndroid
});

/**
 * Default modal transition for the current platform.
 */
const ModalTransition = exports_Platform/* default */.A.select({
  ios: ModalPresentationIOS,
  default: BottomSheetAndroid
});

/**
 * Slide from left transition.
 */
const SlideFromLeftIOS = {
  ...SlideFromRightIOS,
  cardStyleInterpolator: forHorizontalIOSInverted
};
;// ./node_modules/@react-navigation/stack/src/utils/findLastIndex.tsx
function findLastIndex(array, callback) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (callback(array[i])) {
      return i;
    }
  }
  return -1;
}
;// ./node_modules/@react-navigation/stack/src/utils/getInvertedMultiplier.tsx
function getInvertedMultiplier(gestureDirection, isRTL) {
  switch (gestureDirection) {
    case 'vertical':
      return 1;
    case 'vertical-inverted':
      return -1;
    case 'horizontal':
      return isRTL ? -1 : 1;
    case 'horizontal-inverted':
      return isRTL ? 1 : -1;
  }
}
;// ./node_modules/@react-navigation/stack/src/utils/getDistanceForDirection.tsx

function getDistanceForDirection(layout, gestureDirection, isRTL) {
  const multiplier = getInvertedMultiplier(gestureDirection, isRTL);
  switch (gestureDirection) {
    case 'vertical':
    case 'vertical-inverted':
      return layout.height * multiplier;
    case 'horizontal':
    case 'horizontal-inverted':
      return layout.width * multiplier;
  }
}
;// ./node_modules/@react-navigation/stack/src/utils/getModalRoutesKeys.ts
const getModalRouteKeys = (routes, descriptors) => routes.reduce((acc, route) => {
  const {
    presentation
  } = descriptors[route.key]?.options ?? {};
  if (acc.length && !presentation || presentation === 'modal' || presentation === 'transparentModal') {
    acc.push(route.key);
  }
  return acc;
}, []);
;// ./node_modules/@react-navigation/stack/src/views/Screens.tsx



let Screens;
try {
  Screens = __webpack_require__(5628);
} catch (e) {
  // Ignore
}
const MaybeScreenContainer = ({
  enabled,
  ...rest
}) => {
  if (Screens != null) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(Screens.ScreenContainer, {
      enabled: enabled,
      ...rest
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    ...rest
  });
};
const MaybeScreen = ({
  enabled,
  active,
  ...rest
}) => {
  if (Screens != null) {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(Screens.Screen, {
      enabled: enabled,
      activityState: active,
      ...rest
    });
  }
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    ...rest
  });
};
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/Keyboard/index.js
var Keyboard = __webpack_require__(7068);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/TextInput/index.js
var TextInput = __webpack_require__(5782);
;// ./node_modules/@react-navigation/stack/src/utils/useKeyboardManager.tsx



function useKeyboardManager(isEnabled) {
  // Numeric id of the previously focused text input
  // When a gesture didn't change the tab, we can restore the focused input with this
  const previouslyFocusedTextInputRef = react.useRef(undefined);
  const startTimestampRef = react.useRef(0);
  const keyboardTimeoutRef = react.useRef(undefined);
  const clearKeyboardTimeout = react.useCallback(() => {
    if (keyboardTimeoutRef.current !== undefined) {
      clearTimeout(keyboardTimeoutRef.current);
      keyboardTimeoutRef.current = undefined;
    }
  }, []);
  const onPageChangeStart = react.useCallback(() => {
    if (!isEnabled()) {
      return;
    }
    clearKeyboardTimeout();
    const input = TextInput/* default */.A.State.currentlyFocusedInput();

    // When a page change begins, blur the currently focused input
    input?.blur();

    // Store the id of this input so we can refocus it if change was cancelled
    previouslyFocusedTextInputRef.current = input;

    // Store timestamp for touch start
    startTimestampRef.current = Date.now();
  }, [clearKeyboardTimeout, isEnabled]);
  const onPageChangeConfirm = react.useCallback(force => {
    if (!isEnabled()) {
      return;
    }
    clearKeyboardTimeout();
    if (force) {
      // Always dismiss input, even if we don't have a ref to it
      // We might not have the ref if onPageChangeStart was never called
      // This can happen if page change was not from a gesture
      Keyboard/* default */.A.dismiss();
    } else {
      const input = previouslyFocusedTextInputRef.current;

      // Dismiss the keyboard only if an input was a focused before
      // This makes sure we don't dismiss input on going back and focusing an input
      input?.blur();
    }

    // Cleanup the ID on successful page change
    previouslyFocusedTextInputRef.current = undefined;
  }, [clearKeyboardTimeout, isEnabled]);
  const onPageChangeCancel = react.useCallback(() => {
    if (!isEnabled()) {
      return;
    }
    clearKeyboardTimeout();

    // The page didn't change, we should restore the focus of text input
    const input = previouslyFocusedTextInputRef.current;
    if (input) {
      // If the interaction was super short we should make sure keyboard won't hide again.

      // Too fast input refocus will result only in keyboard flashing on screen and hiding right away.
      // During first ~100ms keyboard will be dismissed no matter what,
      // so we have to make sure it won't interrupt input refocus logic.
      // That's why when the interaction is shorter than 100ms we add delay so it won't hide once again.
      // Subtracting timestamps makes us sure the delay is executed only when needed.
      if (Date.now() - startTimestampRef.current < 100) {
        keyboardTimeoutRef.current = setTimeout(() => {
          input?.focus();
          previouslyFocusedTextInputRef.current = undefined;
        }, 100);
      } else {
        input?.focus();
        previouslyFocusedTextInputRef.current = undefined;
      }
    }
  }, [clearKeyboardTimeout, isEnabled]);
  react.useEffect(() => {
    return () => clearKeyboardTimeout();
  }, [clearKeyboardTimeout]);
  return {
    onPageChangeStart,
    onPageChangeConfirm,
    onPageChangeCancel
  };
}
// EXTERNAL MODULE: ./node_modules/color/index.js
var node_modules_color = __webpack_require__(2520);
var color_default = /*#__PURE__*/__webpack_require__.n(node_modules_color);
// EXTERNAL MODULE: ./node_modules/react-native-web/dist/exports/InteractionManager/index.js + 2 modules
var InteractionManager = __webpack_require__(9819);
// EXTERNAL MODULE: ./node_modules/use-latest-callback/esm.mjs
var esm = __webpack_require__(7147);
;// ./node_modules/@react-navigation/stack/src/utils/CardAnimationContext.tsx

const CardAnimationContext = /*#__PURE__*/react.createContext(undefined);
;// ./node_modules/@react-navigation/stack/src/utils/gestureActivationCriteria.tsx


/**
 * The distance of touch start from the edge of the screen where the gesture will be recognized
 */
const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;
const gestureActivationCriteria = ({
  direction,
  gestureDirection,
  gestureResponseDistance,
  layout
}) => {
  const enableTrackpadTwoFingerGesture = true;
  const distance = gestureResponseDistance !== undefined ? gestureResponseDistance : gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? GESTURE_RESPONSE_DISTANCE_VERTICAL : GESTURE_RESPONSE_DISTANCE_HORIZONTAL;
  if (gestureDirection === 'vertical') {
    return {
      maxDeltaX: 15,
      minOffsetY: 5,
      hitSlop: {
        bottom: -layout.height + distance
      },
      enableTrackpadTwoFingerGesture
    };
  } else if (gestureDirection === 'vertical-inverted') {
    return {
      maxDeltaX: 15,
      minOffsetY: -5,
      hitSlop: {
        top: -layout.height + distance
      },
      enableTrackpadTwoFingerGesture
    };
  } else {
    const hitSlop = -layout.width + distance;
    const invertedMultiplier = getInvertedMultiplier(gestureDirection, direction === 'rtl');
    if (invertedMultiplier === 1) {
      return {
        minOffsetX: 5,
        maxDeltaY: 20,
        hitSlop: {
          right: hitSlop
        },
        enableTrackpadTwoFingerGesture
      };
    } else {
      return {
        minOffsetX: -5,
        maxDeltaY: 20,
        hitSlop: {
          left: hitSlop
        },
        enableTrackpadTwoFingerGesture
      };
    }
  }
};
;// ./node_modules/@react-navigation/stack/src/utils/getShadowStyle.tsx


function getShadowStyle({
  offset,
  radius,
  opacity,
  color = '#000'
}) {
  const result = exports_Platform/* default */.A.select({
    web: {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${color_default()(color).alpha(opacity).toString()}`
    },
    default: {
      shadowOffset: offset,
      shadowRadius: radius,
      shadowColor: color,
      shadowOpacity: opacity
    }
  });
  return result;
}
;// ./node_modules/@react-navigation/stack/src/views/Stack/CardContent.tsx




// This component will render a page which overflows the screen
// if the container fills the body by comparing the size
// This lets the document.body handle scrolling of the content
// It's necessary for mobile browsers to be able to hide address bar on scroll
function CardContent({
  enabled,
  layout,
  style,
  ...rest
}) {
  const [fill, setFill] = react.useState(false);
  react.useEffect(() => {
    if (typeof document === 'undefined' || !document.body) {
      // Only run when DOM is available
      return;
    }
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // Workaround for mobile Chrome, necessary when a navigation happens
    // when the address bar has already collapsed, which resulted in an
    // empty space at the bottom of the page (matching the height of the
    // address bar). To fix this, it's necessary to update the height of
    // the DOM with the current height of the window.
    // See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    const isFullHeight = height === layout.height;
    const id = '__react-navigation-stack-mobile-chrome-viewport-fix';
    let unsubscribe;
    if (isFullHeight && navigator.maxTouchPoints > 0) {
      const style = document.getElementById(id) ?? document.createElement('style');
      style.id = id;
      const updateStyle = () => {
        const vh = window.innerHeight * 0.01;
        style.textContent = [`:root { --vh: ${vh}px; }`, `body { height: calc(var(--vh, 1vh) * 100); }`].join('\n');
      };
      updateStyle();
      if (!document.head.contains(style)) {
        document.head.appendChild(style);
      }
      window.addEventListener('resize', updateStyle);
      unsubscribe = () => {
        window.removeEventListener('resize', updateStyle);
      };
    } else {
      // Remove the workaround if the stack does not occupy the whole
      // height of the page
      document.getElementById(id)?.remove();
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFill(width === layout.width && height === layout.height);
    return unsubscribe;
  }, [layout.height, layout.width]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    ...rest,
    pointerEvents: "box-none",
    style: [enabled && fill ? CardContent_styles.page : CardContent_styles.card, style]
  });
}
const CardContent_styles = StyleSheet/* default */.A.create({
  page: {
    minHeight: '100%'
  },
  card: {
    flex: 1,
    overflow: 'hidden'
  }
});
;// ./node_modules/@react-navigation/stack/src/views/Stack/Card.tsx
















const GESTURE_VELOCITY_IMPACT = 0.3;
const TRUE = 1;
const FALSE = 0;
const useNativeDriver = exports_Platform/* default */.A.OS !== 'web';
const hasOpacityStyle = style => {
  if (style) {
    const flattenedStyle = StyleSheet/* default */.A.flatten(style);
    return 'opacity' in flattenedStyle && flattenedStyle.opacity != null;
  }
  return false;
};
const getAnimateToValue = ({
  closing: isClosing,
  layout: currentLayout,
  gestureDirection: currentGestureDirection,
  direction: currentDirection,
  preloaded: isPreloaded
}) => {
  if (!isClosing && !isPreloaded) {
    return 0;
  }
  return getDistanceForDirection(currentLayout, currentGestureDirection, currentDirection === 'rtl');
};
const defaultOverlay = ({
  style
}) => style ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
  pointerEvents: "none",
  style: [Card_styles.overlay, style]
}) : null;
function Card({
  shadowEnabled = false,
  gestureEnabled = true,
  gestureVelocityImpact = GESTURE_VELOCITY_IMPACT,
  overlay = defaultOverlay,
  animated,
  interpolationIndex,
  opening,
  closing,
  next,
  current,
  gesture,
  layout,
  insets,
  direction,
  pageOverflowEnabled,
  gestureDirection,
  onOpen,
  onClose,
  onTransition,
  onGestureBegin,
  onGestureCanceled,
  onGestureEnd,
  children,
  overlayEnabled,
  gestureResponseDistance,
  transitionSpec,
  preloaded,
  styleInterpolator,
  containerStyle: customContainerStyle,
  contentStyle
}) {
  const [, forceUpdate] = react.useReducer(x => x + 1, 0);
  const didInitiallyAnimate = react.useRef(false);
  const lastToValueRef = react.useRef(undefined);
  const interactionHandleRef = react.useRef(undefined);
  const animationHandleRef = react.useRef(undefined);
  const pendingGestureCallbackRef = react.useRef(undefined);
  const [isClosing] = react.useState(() => new Animated/* default */.A.Value(FALSE));
  const [inverted] = react.useState(() => new Animated/* default */.A.Value(getInvertedMultiplier(gestureDirection, direction === 'rtl')));
  const [layoutAnim] = react.useState(() => ({
    width: new Animated/* default */.A.Value(layout.width),
    height: new Animated/* default */.A.Value(layout.height)
  }));
  const [isSwiping] = react.useState(() => new Animated/* default */.A.Value(FALSE));
  const onStartInteraction = (0,esm/* default */.A)(() => {
    if (interactionHandleRef.current === undefined) {
      interactionHandleRef.current = InteractionManager/* default */.A.createInteractionHandle();
    }
  });
  const onEndInteraction = (0,esm/* default */.A)(() => {
    if (interactionHandleRef.current !== undefined) {
      InteractionManager/* default */.A.clearInteractionHandle(interactionHandleRef.current);
      interactionHandleRef.current = undefined;
    }
  });
  const animate = (0,esm/* default */.A)(({
    closing: isClosingParam,
    velocity
  }) => {
    const toValue = getAnimateToValue({
      closing: isClosingParam,
      layout,
      gestureDirection,
      direction,
      preloaded
    });
    lastToValueRef.current = toValue;
    isClosing.setValue(isClosingParam ? TRUE : FALSE);
    const spec = isClosingParam ? transitionSpec.close : transitionSpec.open;
    const animation = spec.animation === 'spring' ? Animated/* default */.A.spring : Animated/* default */.A.timing;
    clearTimeout(pendingGestureCallbackRef.current);
    if (animationHandleRef.current !== undefined) {
      cancelAnimationFrame(animationHandleRef.current);
    }
    onTransition?.({
      closing: isClosingParam,
      gesture: velocity !== undefined
    });
    const onFinish = () => {
      if (isClosingParam) {
        onClose();
      } else {
        onOpen();
      }
      animationHandleRef.current = requestAnimationFrame(() => {
        if (didInitiallyAnimate.current) {
          // Make sure to re-open screen if it wasn't removed
          forceUpdate();
        }
      });
    };
    if (animated) {
      onStartInteraction();
      animation(gesture, {
        ...spec.config,
        velocity,
        toValue,
        useNativeDriver,
        isInteraction: false
      }).start(({
        finished
      }) => {
        onEndInteraction();
        clearTimeout(pendingGestureCallbackRef.current);
        if (finished) {
          onFinish();
        }
      });
    } else {
      onFinish();
    }
  });
  const onGestureStateChange = (0,esm/* default */.A)(({
    nativeEvent
  }) => {
    switch (nativeEvent.state) {
      case GestureState.ACTIVE:
        isSwiping.setValue(TRUE);
        onStartInteraction();
        onGestureBegin?.();
        break;
      case GestureState.CANCELLED:
      case GestureState.FAILED:
        {
          isSwiping.setValue(FALSE);
          onEndInteraction();
          const velocity = gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? nativeEvent.velocityY : nativeEvent.velocityX;
          animate({
            closing,
            velocity
          });
          onGestureCanceled?.();
          break;
        }
      case GestureState.END:
        {
          isSwiping.setValue(FALSE);
          let distance;
          let translation;
          let velocity;
          if (gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted') {
            distance = layout.height;
            translation = nativeEvent.translationY;
            velocity = nativeEvent.velocityY;
          } else {
            distance = layout.width;
            translation = nativeEvent.translationX;
            velocity = nativeEvent.velocityX;
          }
          const shouldClose = (translation + velocity * gestureVelocityImpact) * getInvertedMultiplier(gestureDirection, direction === 'rtl') > distance / 2 ? velocity !== 0 || translation !== 0 : closing;
          animate({
            closing: shouldClose,
            velocity
          });
          if (shouldClose) {
            // We call onClose with a delay to make sure that the animation has already started
            // This will make sure that the state update caused by this doesn't affect start of animation
            pendingGestureCallbackRef.current = setTimeout(() => {
              onClose();

              // Trigger an update after we dispatch the action to remove the screen
              // This will make sure that we check if the screen didn't get removed so we can cancel the animation
              forceUpdate();
            }, 32);
          }
          onGestureEnd?.();
          break;
        }
    }
  });
  react.useLayoutEffect(() => {
    layoutAnim.width.setValue(layout.width);
    layoutAnim.height.setValue(layout.height);
    inverted.setValue(getInvertedMultiplier(gestureDirection, direction === 'rtl'));
  }, [gestureDirection, direction, inverted, layoutAnim.width, layoutAnim.height, layout.width, layout.height]);
  const previousPropsRef = react.useRef(null);
  react.useEffect(() => {
    return () => {
      onEndInteraction();
      if (animationHandleRef.current) {
        cancelAnimationFrame(animationHandleRef.current);
      }
      clearTimeout(pendingGestureCallbackRef.current);
    };

    // We only want to clean up the animation on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const timeoutRef = react.useRef(null);
  react.useEffect(() => {
    if (preloaded) {
      return;
    }
    if (!didInitiallyAnimate.current) {
      // Animate the card in on initial mount
      // Wrap in setTimeout to ensure animation starts after
      // rending of the screen is done. This is especially important
      // in the new architecture
      // cf., https://github.com/react-navigation/react-navigation/issues/12401
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        didInitiallyAnimate.current = true;
        animate({
          closing
        });
      }, 0);
    } else {
      const previousOpening = previousPropsRef.current?.opening;
      const previousToValue = previousPropsRef.current ? getAnimateToValue(previousPropsRef.current) : null;
      const toValue = getAnimateToValue({
        closing,
        layout,
        gestureDirection,
        direction,
        preloaded
      });
      if (previousToValue !== toValue || lastToValueRef.current !== toValue) {
        // We need to trigger the animation when route was closed
        // The route might have been closed by a `POP` action or by a gesture
        // When route was closed due to a gesture, the animation would've happened already
        // It's still important to trigger the animation so that `onClose` is called
        // If `onClose` is not called, cleanup step won't be performed for gestures
        animate({
          closing
        });
      } else if (typeof previousOpening === 'boolean' && opening && !previousOpening) {
        // This can happen when screen somewhere below in the stack comes into focus via rearranging
        // Also reset the animated value to make sure that the animation starts from the beginning
        gesture.setValue(getDistanceForDirection(layout, gestureDirection, direction === 'rtl'));
        animate({
          closing
        });
      }
    }
    previousPropsRef.current = {
      opening,
      closing,
      layout,
      gestureDirection,
      direction,
      preloaded
    };
  }, [animate, closing, direction, gesture, gestureDirection, layout, opening, preloaded]);
  const interpolationProps = react.useMemo(() => ({
    index: interpolationIndex,
    current: {
      progress: current
    },
    next: next && {
      progress: next
    },
    closing: isClosing,
    swiping: isSwiping,
    inverted,
    layouts: {
      screen: layout
    },
    insets: {
      top: insets.top,
      right: insets.right,
      bottom: insets.bottom,
      left: insets.left
    }
  }), [interpolationIndex, current, next, isClosing, isSwiping, inverted, layout, insets.top, insets.right, insets.bottom, insets.left]);
  const {
    containerStyle,
    cardStyle,
    overlayStyle,
    shadowStyle
  } = react.useMemo(() => styleInterpolator(interpolationProps), [styleInterpolator, interpolationProps]);
  const onGestureEvent = react.useMemo(() => gestureEnabled ? Animated/* default */.A.event([{
    nativeEvent: gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted' ? {
      translationY: gesture
    } : {
      translationX: gesture
    }
  }], {
    useNativeDriver
  }) : undefined, [gesture, gestureDirection, gestureEnabled]);
  const {
    backgroundColor
  } = StyleSheet/* default */.A.flatten(contentStyle || {});
  const isTransparent = typeof backgroundColor === 'string' ? color_default()(backgroundColor).alpha() === 0 : false;
  return /*#__PURE__*/(0,jsx_runtime.jsxs)(CardAnimationContext.Provider, {
    value: interpolationProps,
    children: [exports_Platform/* default */.A.OS !== 'web' ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
      style: {
        // This is a dummy style that doesn't actually change anything visually.
        // Animated needs the animated value to be used somewhere, otherwise things don't update properly.
        // If we disable animations and hide header, it could end up making the value unused.
        // So we have this dummy style that will always be used regardless of what else changed.
        opacity: current
      }
      // Make sure that this view isn't removed. If this view is removed, our style with animated value won't apply
      ,
      collapsable: false
    }) : null, overlayEnabled ? /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
      pointerEvents: "box-none",
      style: StyleSheet/* default */.A.absoluteFill,
      children: overlay({
        style: overlayStyle
      })
    }) : null, /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
      pointerEvents: "box-none",
      style: [Card_styles.container, containerStyle, customContainerStyle],
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(PanGestureHandler, {
        enabled: layout.width !== 0 && gestureEnabled,
        onGestureEvent: onGestureEvent,
        onHandlerStateChange: onGestureStateChange,
        ...gestureActivationCriteria({
          layout,
          direction,
          gestureDirection,
          gestureResponseDistance
        }),
        children: /*#__PURE__*/(0,jsx_runtime.jsxs)(Animated/* default */.A.View, {
          pointerEvents: "box-none",
          needsOffscreenAlphaCompositing: hasOpacityStyle(cardStyle),
          style: [Card_styles.container, cardStyle],
          children: [shadowEnabled && shadowStyle && !isTransparent ? /*#__PURE__*/(0,jsx_runtime.jsx)(Animated/* default */.A.View, {
            pointerEvents: "none",
            style: [Card_styles.shadow, gestureDirection === 'horizontal' ? [Card_styles.shadowHorizontal, Card_styles.shadowStart] : gestureDirection === 'horizontal-inverted' ? [Card_styles.shadowHorizontal, Card_styles.shadowEnd] : gestureDirection === 'vertical' ? [Card_styles.shadowVertical, Card_styles.shadowTop] : [Card_styles.shadowVertical, Card_styles.shadowBottom], {
              backgroundColor
            }, shadowStyle]
          }) : null, /*#__PURE__*/(0,jsx_runtime.jsx)(CardContent, {
            enabled: pageOverflowEnabled,
            layout: layout,
            style: contentStyle,
            children: children
          })]
        })
      })
    })]
  });
}

const Card_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000'
  },
  shadow: {
    position: 'absolute'
  },
  shadowHorizontal: {
    top: 0,
    bottom: 0,
    width: 3,
    ...getShadowStyle({
      offset: {
        width: -1,
        height: 1
      },
      radius: 5,
      opacity: 0.3
    })
  },
  shadowStart: {
    start: 0
  },
  shadowEnd: {
    end: 0
  },
  shadowVertical: {
    start: 0,
    end: 0,
    height: 3,
    ...getShadowStyle({
      offset: {
        width: 1,
        height: -1
      },
      radius: 5,
      opacity: 0.3
    })
  },
  shadowTop: {
    top: 0
  },
  shadowBottom: {
    bottom: 0
  }
});
;// ./node_modules/@react-navigation/stack/src/views/Stack/CardA11yWrapper.tsx





const CardA11yWrapper = /*#__PURE__*/react.forwardRef(({
  focused,
  active,
  animated,
  isNextScreenTransparent,
  detachCurrentScreen,
  children
}, ref) => {
  // Manage this in separate component to avoid re-rendering card during gestures
  // Otherwise the gesture animation will be interrupted as state hasn't updated yet
  const [inert, setInert] = react.useState(false);
  react.useImperativeHandle(ref, () => ({
    setInert
  }), []);
  const isHidden = !animated && isNextScreenTransparent === false && detachCurrentScreen !== false && !focused;
  return /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
    "aria-hidden": !focused,
    pointerEvents: (animated ? inert : !focused) ? 'none' : 'box-none',
    style: [StyleSheet/* default */.A.absoluteFill, {
      // This is necessary to avoid unfocused larger pages increasing scroll area
      // The issue can be seen on the web when a smaller screen is pushed over a larger one
      overflow: active ? undefined : 'hidden',
      // We use visibility on web
      display: exports_Platform/* default */.A.OS !== 'web' && isHidden ? 'none' : 'flex',
      // Hide unfocused screens when animation isn't enabled
      // This is also necessary for a11y on web
      // @ts-expect-error visibility is only available on web
      visibility: isHidden ? 'hidden' : 'visible'
    }]
    // Make sure this view is not removed on the new architecture, as it causes focus loss during navigation on Android.
    // This can happen when the view flattening results in different trees - due to `overflow` style changing in a parent.
    ,
    collapsable: false,
    children: children
  });
});
CardA11yWrapper.displayName = 'CardA11yWrapper';
;// ./node_modules/@react-navigation/stack/src/views/Stack/CardContainer.tsx










const EPSILON = 0.1;
function CardContainerInner({
  interpolationIndex,
  index,
  active,
  opening,
  closing,
  gesture,
  focused,
  modal,
  getPreviousScene,
  getFocusedRoute,
  hasAbsoluteFloatHeader,
  headerHeight,
  onHeaderHeightChange,
  isParentHeaderShown,
  isNextScreenTransparent,
  detachCurrentScreen,
  layout,
  onCloseRoute,
  onOpenRoute,
  onGestureCancel,
  onGestureEnd,
  onGestureStart,
  onTransitionEnd,
  onTransitionStart,
  preloaded,
  renderHeader,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene
}) {
  const wrapperRef = react.useRef(null);
  const {
    direction
  } = (0,lib_module.useLocale)();
  const parentHeaderHeight = react.useContext(elements_lib_module/* HeaderHeightContext */.SF);
  const {
    onPageChangeStart,
    onPageChangeCancel,
    onPageChangeConfirm
  } = useKeyboardManager(react.useCallback(() => {
    const {
      options,
      navigation
    } = scene.descriptor;
    return navigation.isFocused() && options.keyboardHandlingEnabled !== false;
  }, [scene.descriptor]));
  const handleOpen = () => {
    const {
      route
    } = scene.descriptor;
    onTransitionEnd({
      route
    }, false);
    onOpenRoute({
      route
    });
  };
  const handleClose = () => {
    const {
      route
    } = scene.descriptor;
    onTransitionEnd({
      route
    }, true);
    onCloseRoute({
      route
    });
  };
  const handleGestureBegin = () => {
    const {
      route
    } = scene.descriptor;
    onPageChangeStart();
    onGestureStart({
      route
    });
  };
  const handleGestureCanceled = () => {
    const {
      route
    } = scene.descriptor;
    onPageChangeCancel();
    onGestureCancel({
      route
    });
  };
  const handleGestureEnd = () => {
    const {
      route
    } = scene.descriptor;
    onGestureEnd({
      route
    });
  };
  const handleTransition = ({
    closing,
    gesture
  }) => {
    wrapperRef.current?.setInert(closing);
    const {
      route
    } = scene.descriptor;
    if (!gesture) {
      onPageChangeConfirm?.(true);
    } else if (active && closing) {
      onPageChangeConfirm?.(false);
    } else {
      onPageChangeCancel?.();
    }
    onTransitionStart?.({
      route
    }, closing);
  };
  const insets = {
    top: safeAreaInsetTop,
    right: safeAreaInsetRight,
    bottom: safeAreaInsetBottom,
    left: safeAreaInsetLeft
  };
  const {
    colors
  } = (0,lib_module.useTheme)();
  react.useEffect(() => {
    const listener = scene.progress.next?.addListener?.(({
      value
    }) => {
      wrapperRef.current?.setInert(value > EPSILON);
    });
    return () => {
      if (listener) {
        scene.progress.next?.removeListener?.(listener);
      }
    };
  }, [scene.progress.next]);
  const {
    presentation,
    animation,
    cardOverlay,
    cardOverlayEnabled,
    cardShadowEnabled,
    cardStyle,
    cardStyleInterpolator,
    gestureDirection,
    gestureEnabled,
    gestureResponseDistance,
    gestureVelocityImpact,
    headerMode,
    headerShown,
    transitionSpec
  } = scene.descriptor.options;
  const {
    buildHref
  } = (0,lib_module.useLinkBuilder)();
  const previousScene = getPreviousScene({
    route: scene.descriptor.route
  });
  let backTitle;
  let href;
  if (previousScene) {
    const {
      options,
      route
    } = previousScene.descriptor;
    backTitle = (0,elements_lib_module/* getHeaderTitle */.k1)(options, route.name);
    href = buildHref(route.name, route.params);
  }
  const canGoBack = previousScene != null;
  const headerBack = react.useMemo(() => {
    if (canGoBack) {
      return {
        href,
        title: backTitle
      };
    }
    return undefined;
  }, [canGoBack, backTitle, href]);
  const animated = animation !== 'none';
  return /*#__PURE__*/(0,jsx_runtime.jsx)(CardA11yWrapper, {
    ref: wrapperRef,
    focused: focused,
    active: active,
    animated: animated,
    isNextScreenTransparent: isNextScreenTransparent,
    detachCurrentScreen: detachCurrentScreen,
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(Card, {
      animated: animated,
      interpolationIndex: interpolationIndex,
      gestureDirection: gestureDirection,
      layout: layout,
      insets: insets,
      direction: direction,
      gesture: gesture,
      current: scene.progress.current,
      next: scene.progress.next,
      opening: opening,
      closing: closing,
      onOpen: handleOpen,
      onClose: handleClose,
      overlay: cardOverlay,
      overlayEnabled: cardOverlayEnabled,
      shadowEnabled: cardShadowEnabled,
      onTransition: handleTransition,
      onGestureBegin: handleGestureBegin,
      onGestureCanceled: handleGestureCanceled,
      onGestureEnd: handleGestureEnd,
      gestureEnabled: index === 0 ? false : gestureEnabled,
      gestureResponseDistance: gestureResponseDistance,
      gestureVelocityImpact: gestureVelocityImpact,
      transitionSpec: transitionSpec,
      styleInterpolator: cardStyleInterpolator,
      pageOverflowEnabled: headerMode !== 'float' && presentation !== 'modal',
      preloaded: preloaded,
      containerStyle: hasAbsoluteFloatHeader && headerMode !== 'screen' ? {
        marginTop: headerHeight
      } : null,
      contentStyle: [{
        backgroundColor: presentation === 'transparentModal' ? 'transparent' : colors.background
      }, cardStyle],
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
        style: CardContainer_styles.container,
        children: /*#__PURE__*/(0,jsx_runtime.jsxs)(ModalPresentationContext.Provider, {
          value: modal,
          children: [headerMode !== 'float' ? renderHeader({
            mode: 'screen',
            layout,
            scenes: [previousScene, scene],
            getPreviousScene,
            getFocusedRoute,
            onContentHeightChange: onHeaderHeightChange,
            style: CardContainer_styles.header
          }) : null, /*#__PURE__*/(0,jsx_runtime.jsx)(View/* default */.A, {
            style: CardContainer_styles.scene,
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderBackContext */.wW.Provider, {
              value: headerBack,
              children: /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderShownContext */.q2.Provider, {
                value: isParentHeaderShown || headerShown !== false,
                children: /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderHeightContext */.SF.Provider, {
                  value: headerShown !== false ? headerHeight : parentHeaderHeight ?? 0,
                  children: scene.descriptor.render()
                })
              })
            })
          })]
        })
      })
    })
  });
}
const CardContainer = /*#__PURE__*/react.memo(CardContainerInner);
const CardContainer_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  header: {
    zIndex: 1
  },
  scene: {
    flex: 1
  }
});
;// ./node_modules/@react-navigation/stack/src/views/Stack/CardStack.tsx














const NAMED_TRANSITIONS_PRESETS = {
  default: DefaultTransition,
  fade: ModalFadeTransition,
  fade_from_bottom: FadeFromBottomAndroid,
  fade_from_right: FadeFromRightAndroid,
  none: DefaultTransition,
  reveal_from_bottom: RevealFromBottomAndroid,
  scale_from_center: ScaleFromCenterAndroid,
  slide_from_left: SlideFromLeftIOS,
  slide_from_right: SlideFromRightIOS,
  slide_from_bottom: exports_Platform/* default */.A.select({
    ios: ModalSlideFromBottomIOS,
    default: BottomSheetAndroid
  })
};
const CardStack_EPSILON = 1e-5;
const STATE_INACTIVE = 0;
const STATE_TRANSITIONING_OR_BELOW_TOP = 1;
const STATE_ON_TOP = 2;
const FALLBACK_DESCRIPTOR = Object.freeze({
  options: {}
});
const getInterpolationIndex = (scenes, index) => {
  const {
    cardStyleInterpolator
  } = scenes[index].descriptor.options;

  // Start from current card and count backwards the number of cards with same interpolation
  let interpolationIndex = 0;
  for (let i = index - 1; i >= 0; i--) {
    const cardStyleInterpolatorCurrent = scenes[i]?.descriptor.options.cardStyleInterpolator;
    if (cardStyleInterpolatorCurrent !== cardStyleInterpolator) {
      break;
    }
    interpolationIndex++;
  }
  return interpolationIndex;
};
const getIsModalPresentation = cardStyleInterpolator => {
  return cardStyleInterpolator === forModalPresentationIOS ||
  // Handle custom modal presentation interpolators as well
  cardStyleInterpolator.name === 'forModalPresentationIOS';
};
const getIsModal = (scene, interpolationIndex, isParentModal) => {
  if (isParentModal) {
    return true;
  }
  const {
    cardStyleInterpolator
  } = scene.descriptor.options;
  const isModalPresentation = getIsModalPresentation(cardStyleInterpolator);
  const isModal = isModalPresentation && interpolationIndex !== 0;
  return isModal;
};
const getHeaderHeights = (scenes, insets, isParentHeaderShown, isParentModal, layout, previous) => {
  return scenes.reduce((acc, curr, index) => {
    const {
      headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
      headerStyle
    } = curr.descriptor.options;
    const style = StyleSheet/* default */.A.flatten(headerStyle || {});
    const height = 'height' in style && typeof style.height === 'number' ? style.height : previous[curr.route.key];
    const interpolationIndex = getInterpolationIndex(scenes, index);
    const isModal = getIsModal(curr, interpolationIndex, isParentModal);
    acc[curr.route.key] = typeof height === 'number' ? height : (0,elements_lib_module/* getDefaultHeaderHeight */.Q6)(layout, isModal, headerStatusBarHeight);
    return acc;
  }, {});
};
const getDistanceFromOptions = (layout, options, isRTL) => {
  if (options?.gestureDirection) {
    return getDistanceForDirection(layout, options.gestureDirection, isRTL);
  }
  const defaultGestureDirection = options?.presentation === 'modal' ? ModalTransition.gestureDirection : DefaultTransition.gestureDirection;
  const gestureDirection = options?.animation ? NAMED_TRANSITIONS_PRESETS[options?.animation]?.gestureDirection : defaultGestureDirection;
  return getDistanceForDirection(layout, gestureDirection, isRTL);
};
const getProgressFromGesture = (gesture, layout, options, isRTL) => {
  const distance = getDistanceFromOptions({
    // Make sure that we have a non-zero distance, otherwise there will be incorrect progress
    // This causes blank screen on web if it was previously inside container with display: none
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height)
  }, options, isRTL);
  if (distance > 0) {
    return gesture.interpolate({
      inputRange: [0, distance],
      outputRange: [1, 0]
    });
  }
  return gesture.interpolate({
    inputRange: [distance, 0],
    outputRange: [0, 1]
  });
};
function getDefaultAnimation(animation) {
  // Disable screen transition animation by default on web, windows and macos to match the native behavior
  const excludedPlatforms = exports_Platform/* default */.A.OS !== 'web' && exports_Platform/* default */.A.OS !== 'windows' && exports_Platform/* default */.A.OS !== 'macos';
  return animation ?? (excludedPlatforms ? 'default' : 'none');
}
function getAnimationEnabled(animation) {
  return getDefaultAnimation(animation) !== 'none';
}
class CardStack extends react.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.routes === state.routes && props.descriptors === state.descriptors) {
      return null;
    }
    const gestures = [...props.routes, ...props.state.preloadedRoutes].reduce((acc, curr) => {
      const descriptor = props.descriptors[curr.key] || props.preloadedDescriptors[curr.key];
      const {
        animation
      } = descriptor?.options || {};
      acc[curr.key] = state.gestures[curr.key] || new Animated/* default */.A.Value(props.openingRouteKeys.includes(curr.key) && getAnimationEnabled(animation) || props.state.preloadedRoutes.includes(curr) ? getDistanceFromOptions(state.layout, descriptor?.options, props.direction === 'rtl') : 0);
      return acc;
    }, {});
    const modalRouteKeys = getModalRouteKeys([...props.routes, ...props.state.preloadedRoutes], {
      ...props.descriptors,
      ...props.preloadedDescriptors
    });
    const scenes = [...props.routes, ...props.state.preloadedRoutes].map((route, index, self) => {
      // For preloaded screens, we don't care about the previous and the next screen
      const isPreloaded = props.state.preloadedRoutes.includes(route);
      const previousRoute = isPreloaded ? undefined : self[index - 1];
      const nextRoute = isPreloaded ? undefined : self[index + 1];
      const oldScene = state.scenes[index];
      const currentGesture = gestures[route.key];
      const previousGesture = previousRoute ? gestures[previousRoute.key] : undefined;
      const nextGesture = nextRoute ? gestures[nextRoute.key] : undefined;
      const descriptor = (isPreloaded ? props.preloadedDescriptors : props.descriptors)[route.key] || state.descriptors[route.key] || (oldScene ? oldScene.descriptor : FALLBACK_DESCRIPTOR);
      const nextOptions = nextRoute && (props.descriptors[nextRoute?.key] || state.descriptors[nextRoute?.key])?.options;
      const previousOptions = previousRoute && (props.descriptors[previousRoute?.key] || state.descriptors[previousRoute?.key])?.options;

      // When a screen is not the last, it should use next screen's transition config
      // Many transitions also animate the previous screen, so using 2 different transitions doesn't look right
      // For example combining a slide and a modal transition would look wrong otherwise
      // With this approach, combining different transition styles in the same navigator mostly looks right
      // This will still be broken when 2 transitions have different idle state (e.g. modal presentation),
      // but the majority of the transitions look alright
      const optionsForTransitionConfig = index !== self.length - 1 && nextOptions && nextOptions?.presentation !== 'transparentModal' ? nextOptions : descriptor.options;

      // Assume modal if there are already modal screens in the stack
      // or current screen is a modal when no presentation is specified
      const isModal = modalRouteKeys.includes(route.key);
      const animation = getDefaultAnimation(optionsForTransitionConfig.animation);
      const isAnimationEnabled = getAnimationEnabled(animation);
      const transitionPreset = animation !== 'default' ? NAMED_TRANSITIONS_PRESETS[animation] : optionsForTransitionConfig.presentation === 'transparentModal' ? ModalFadeTransition : optionsForTransitionConfig.presentation === 'modal' || isModal ? ModalTransition : DefaultTransition;
      const {
        gestureEnabled = exports_Platform/* default */.A.OS === 'ios' && isAnimationEnabled,
        gestureDirection = transitionPreset.gestureDirection,
        transitionSpec = transitionPreset.transitionSpec,
        cardStyleInterpolator = isAnimationEnabled ? transitionPreset.cardStyleInterpolator : CardStyleInterpolators_forNoAnimation,
        headerStyleInterpolator = transitionPreset.headerStyleInterpolator,
        cardOverlayEnabled = exports_Platform/* default */.A.OS !== 'ios' && optionsForTransitionConfig.presentation !== 'transparentModal' || getIsModalPresentation(cardStyleInterpolator)
      } = optionsForTransitionConfig;
      const headerMode = descriptor.options.headerMode ?? (!(optionsForTransitionConfig.presentation === 'modal' || optionsForTransitionConfig.presentation === 'transparentModal' || nextOptions?.presentation === 'modal' || nextOptions?.presentation === 'transparentModal' || getIsModalPresentation(cardStyleInterpolator)) && exports_Platform/* default */.A.OS === 'ios' && descriptor.options.header === undefined ? 'float' : 'screen');
      const isRTL = props.direction === 'rtl';
      const scene = {
        route,
        descriptor: {
          ...descriptor,
          options: {
            ...descriptor.options,
            animation,
            cardOverlayEnabled,
            cardStyleInterpolator,
            gestureDirection,
            gestureEnabled,
            headerStyleInterpolator,
            transitionSpec,
            headerMode
          }
        },
        progress: {
          current: getProgressFromGesture(currentGesture, state.layout, descriptor.options, isRTL),
          next: nextGesture && nextOptions?.presentation !== 'transparentModal' ? getProgressFromGesture(nextGesture, state.layout, nextOptions, isRTL) : undefined,
          previous: previousGesture ? getProgressFromGesture(previousGesture, state.layout, previousOptions, isRTL) : undefined
        },
        __memo: [state.layout, descriptor, nextOptions, previousOptions, currentGesture, nextGesture, previousGesture]
      };
      if (oldScene && scene.__memo.every((it, i) => {
        // @ts-expect-error: we haven't added __memo to the annotation to prevent usage elsewhere
        return oldScene.__memo[i] === it;
      })) {
        return oldScene;
      }
      return scene;
    });
    let activeStates = state.activeStates;
    if (props.routes.length !== state.routes.length) {
      let activeScreensLimit = 1;
      for (let i = props.routes.length - 1; i >= 0; i--) {
        const {
          options
        } = scenes[i].descriptor;
        const {
          // By default, we don't want to detach the previous screen of the active one for modals
          detachPreviousScreen = options.presentation === 'transparentModal' ? false : getIsModalPresentation(options.cardStyleInterpolator) ? i !== findLastIndex(scenes, scene => {
            const {
              cardStyleInterpolator
            } = scene.descriptor.options;
            return cardStyleInterpolator === forModalPresentationIOS || cardStyleInterpolator?.name === 'forModalPresentationIOS';
          }) : true
        } = options;
        if (detachPreviousScreen === false) {
          activeScreensLimit++;
        } else {
          // Check at least last 2 screens before stopping
          // This will make sure that screen isn't detached when another screen is animating on top of the transparent one
          // e.g. opaque -> transparent -> opaque
          if (i <= props.routes.length - 2) {
            break;
          }
        }
      }
      activeStates = props.routes.map((_, index, self) => {
        // The activity state represents state of the screen:
        // 0 - inactive, the screen is detached
        // 1 - transitioning or below the top screen, the screen is mounted but interaction is disabled
        // 2 - on top of the stack, the screen is mounted and interaction is enabled
        let activityState;
        const lastActiveState = state.activeStates[index];
        const activeAfterTransition = index >= self.length - activeScreensLimit;
        if (lastActiveState === STATE_INACTIVE && !activeAfterTransition) {
          // screen was inactive before and it will still be inactive after the transition
          activityState = STATE_INACTIVE;
        } else {
          const sceneForActivity = scenes[self.length - 1];
          const outputValue = index === self.length - 1 ? STATE_ON_TOP // the screen is on top after the transition
          : activeAfterTransition ? STATE_TRANSITIONING_OR_BELOW_TOP // the screen should stay active after the transition, it is not on top but is in activeLimit
          : STATE_INACTIVE; // the screen should be active only during the transition, it is at the edge of activeLimit

          activityState = sceneForActivity ? sceneForActivity.progress.current.interpolate({
            inputRange: [0, 1 - CardStack_EPSILON, 1],
            outputRange: [1, 1, outputValue],
            extrapolate: 'clamp'
          }) : STATE_TRANSITIONING_OR_BELOW_TOP;
        }
        return activityState;
      });
    }
    return {
      routes: props.routes,
      scenes,
      gestures,
      descriptors: props.descriptors,
      activeStates,
      headerHeights: getHeaderHeights(scenes, props.insets, props.isParentHeaderShown, props.isParentModal, state.layout, state.headerHeights)
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      scenes: [],
      gestures: {},
      layout: elements_lib_module/* SafeAreaProviderCompat */.ge.initialMetrics.frame,
      descriptors: this.props.descriptors,
      activeStates: [],
      // Used when card's header is null and mode is float to make transition
      // between screens with headers and those without headers smooth.
      // This is not a great heuristic here. We don't know synchronously
      // on mount what the header height is so we have just used the most
      // common cases here.
      headerHeights: {}
    };
  }
  handleLayout = e => {
    const {
      height,
      width
    } = e.nativeEvent.layout;
    const layout = {
      width,
      height
    };
    this.setState((state, props) => {
      if (height === state.layout.height && width === state.layout.width) {
        return null;
      }
      return {
        layout,
        headerHeights: getHeaderHeights(state.scenes, props.insets, props.isParentHeaderShown, props.isParentModal, layout, state.headerHeights)
      };
    });
  };
  handleHeaderLayout = ({
    route,
    height
  }) => {
    this.setState(({
      headerHeights
    }) => {
      const previousHeight = headerHeights[route.key];
      if (previousHeight === height) {
        return null;
      }
      return {
        headerHeights: {
          ...headerHeights,
          [route.key]: height
        }
      };
    });
  };
  getFocusedRoute = () => {
    const {
      state
    } = this.props;
    return state.routes[state.index];
  };
  getPreviousScene = ({
    route
  }) => {
    const {
      getPreviousRoute
    } = this.props;
    const {
      scenes
    } = this.state;
    const previousRoute = getPreviousRoute({
      route
    });
    if (previousRoute) {
      const previousScene = scenes.find(scene => scene.descriptor.route.key === previousRoute.key);
      return previousScene;
    }
    return undefined;
  };
  render() {
    const {
      insets,
      state,
      routes,
      openingRouteKeys,
      closingRouteKeys,
      onOpenRoute,
      onCloseRoute,
      renderHeader,
      isParentHeaderShown,
      isParentModal,
      onTransitionStart,
      onTransitionEnd,
      onGestureStart,
      onGestureEnd,
      onGestureCancel,
      detachInactiveScreens = exports_Platform/* default */.A.OS === 'web' || exports_Platform/* default */.A.OS === 'android' || exports_Platform/* default */.A.OS === 'ios'
    } = this.props;
    const {
      scenes,
      layout,
      gestures,
      activeStates,
      headerHeights
    } = this.state;
    const focusedRoute = state.routes[state.index];
    const focusedHeaderHeight = headerHeights[focusedRoute.key];
    const isFloatHeaderAbsolute = this.state.scenes.slice(-2).some(scene => {
      const options = scene.descriptor.options ?? {};
      const {
        headerMode,
        headerTransparent,
        headerShown = true
      } = options;
      if (headerTransparent || headerShown === false || headerMode === 'screen') {
        return true;
      }
      return false;
    });
    return /*#__PURE__*/(0,jsx_runtime.jsxs)(View/* default */.A, {
      style: CardStack_styles.container,
      children: [renderHeader({
        mode: 'float',
        layout,
        scenes,
        getPreviousScene: this.getPreviousScene,
        getFocusedRoute: this.getFocusedRoute,
        onContentHeightChange: this.handleHeaderLayout,
        style: [CardStack_styles.floating, isFloatHeaderAbsolute && [
        // Without this, the header buttons won't be touchable on Android when headerTransparent: true
        {
          height: focusedHeaderHeight
        }, CardStack_styles.absolute]]
      }), /*#__PURE__*/(0,jsx_runtime.jsx)(MaybeScreenContainer, {
        enabled: detachInactiveScreens,
        style: CardStack_styles.container,
        onLayout: this.handleLayout,
        children: [...routes, ...state.preloadedRoutes].map((route, index) => {
          const focused = focusedRoute.key === route.key;
          const gesture = gestures[route.key];
          const scene = scenes[index];
          // It is possible that for a short period the route appears in both arrays.
          // Particularly, if the screen is removed with `retain`, then it needs a moment to execute the animation.
          // However, due to the router action, it immediately populates the `preloadedRoutes` array.
          // Practically, the logic below takes care that it is rendered only once.
          const isPreloaded = state.preloadedRoutes.includes(route) && !routes.includes(route);
          if (state.preloadedRoutes.includes(route) && routes.includes(route) && index >= routes.length) {
            return null;
          }
          const {
            headerShown = true,
            headerTransparent,
            freezeOnBlur,
            autoHideHomeIndicator
          } = scene.descriptor.options;
          const safeAreaInsetTop = insets.top;
          const safeAreaInsetRight = insets.right;
          const safeAreaInsetBottom = insets.bottom;
          const safeAreaInsetLeft = insets.left;
          const headerHeight = headerShown !== false ? headerHeights[route.key] : 0;

          // Start from current card and count backwards the number of cards with same interpolation
          const interpolationIndex = getInterpolationIndex(scenes, index);
          const isModal = getIsModal(scene, interpolationIndex, isParentModal);
          const isNextScreenTransparent = scenes[index + 1]?.descriptor.options.presentation === 'transparentModal';
          const detachCurrentScreen = scenes[index + 1]?.descriptor.options.detachPreviousScreen !== false;
          const activityState = isPreloaded ? STATE_INACTIVE : activeStates[index];
          return /*#__PURE__*/(0,jsx_runtime.jsx)(MaybeScreen, {
            style: [StyleSheet/* default */.A.absoluteFill],
            enabled: detachInactiveScreens,
            active: activityState,
            freezeOnBlur: freezeOnBlur,
            shouldFreeze: activityState === STATE_INACTIVE && !isPreloaded,
            homeIndicatorHidden: autoHideHomeIndicator,
            pointerEvents: "box-none",
            children: /*#__PURE__*/(0,jsx_runtime.jsx)(CardContainer, {
              index: index,
              interpolationIndex: interpolationIndex,
              modal: isModal,
              active: index === routes.length - 1,
              focused: focused,
              opening: openingRouteKeys.includes(route.key),
              closing: closingRouteKeys.includes(route.key),
              layout: layout,
              gesture: gesture,
              scene: scene,
              safeAreaInsetTop: safeAreaInsetTop,
              safeAreaInsetRight: safeAreaInsetRight,
              safeAreaInsetBottom: safeAreaInsetBottom,
              safeAreaInsetLeft: safeAreaInsetLeft,
              onGestureStart: onGestureStart,
              onGestureCancel: onGestureCancel,
              onGestureEnd: onGestureEnd,
              headerHeight: headerHeight,
              isParentHeaderShown: isParentHeaderShown,
              onHeaderHeightChange: this.handleHeaderLayout,
              getPreviousScene: this.getPreviousScene,
              getFocusedRoute: this.getFocusedRoute,
              hasAbsoluteFloatHeader: isFloatHeaderAbsolute && !headerTransparent,
              renderHeader: renderHeader,
              onOpenRoute: onOpenRoute,
              onCloseRoute: onCloseRoute,
              onTransitionStart: onTransitionStart,
              onTransitionEnd: onTransitionEnd,
              isNextScreenTransparent: isNextScreenTransparent,
              detachCurrentScreen: detachCurrentScreen,
              preloaded: isPreloaded
            })
          }, route.key);
        })
      })]
    });
  }
}
const CardStack_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0
  },
  floating: {
    zIndex: 1
  }
});
;// ./node_modules/@react-navigation/stack/src/views/Stack/StackView.tsx











const GestureHandlerWrapper = GestureHandlerRootView ?? View/* default */.A;

/**
 * Compare two arrays with primitive values as the content.
 * We need to make sure that both values and order match.
 */
const isArrayEqual = (a, b) => a.length === b.length && a.every((it, index) => Object.is(it, b[index]));
class StackView extends react.Component {
  static getDerivedStateFromProps(props, state) {
    // If there was no change in routes, we don't need to compute anything
    if ((props.state.routes === state.previousRoutes || isArrayEqual(props.state.routes.map(r => r.key), state.previousRoutes.map(r => r.key))) && state.routes.length) {
      let routes = state.routes;
      let previousRoutes = state.previousRoutes;
      let descriptors = props.descriptors;
      let previousDescriptors = state.previousDescriptors;
      if (props.descriptors !== state.previousDescriptors) {
        descriptors = state.routes.reduce((acc, route) => {
          acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
          return acc;
        }, {});
        previousDescriptors = props.descriptors;
      }
      if (props.state.routes !== state.previousRoutes) {
        // if any route objects have changed, we should update them
        const map = props.state.routes.reduce((acc, route) => {
          acc[route.key] = route;
          return acc;
        }, {});
        routes = state.routes.map(route => map[route.key] || route);
        previousRoutes = props.state.routes;
      }
      return {
        routes,
        previousRoutes,
        descriptors,
        previousDescriptors
      };
    }

    // Here we determine which routes were added or removed to animate them
    // We keep a copy of the route being removed in local state to be able to animate it

    let routes = props.state.index < props.state.routes.length - 1 ?
    // Remove any extra routes from the state
    // The last visible route should be the focused route, i.e. at current index
    props.state.routes.slice(0, props.state.index + 1) : props.state.routes;

    // Now we need to determine which routes were added and removed
    const {
      previousRoutes
    } = state;
    let {
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys
    } = state;
    const previousFocusedRoute = previousRoutes[previousRoutes.length - 1];
    const nextFocusedRoute = routes[routes.length - 1];
    const isAnimationEnabled = key => {
      const descriptor = props.descriptors[key] || state.descriptors[key];
      return getAnimationEnabled(descriptor?.options.animation);
    };
    const getAnimationTypeForReplace = key => {
      const descriptor = props.descriptors[key] || state.descriptors[key];
      return descriptor.options.animationTypeForReplace ?? 'push';
    };
    if (previousFocusedRoute && previousFocusedRoute.key !== nextFocusedRoute.key) {
      // We only need to animate routes if the focused route changed
      // Animating previous routes won't be visible coz the focused route is on top of everything

      if (previousRoutes.some(r => r.key === nextFocusedRoute.key) && !routes.some(r => r.key === previousFocusedRoute.key)) {
        // The previously focused route was removed, and the new focused route was already present
        // We treat this as a pop

        if (isAnimationEnabled(previousFocusedRoute.key) && !closingRouteKeys.includes(previousFocusedRoute.key)) {
          closingRouteKeys = [...closingRouteKeys, previousFocusedRoute.key];

          // Sometimes a route can be closed before the opening animation finishes
          // So we also need to remove it from the opening list
          openingRouteKeys = openingRouteKeys.filter(key => key !== previousFocusedRoute.key);
          replacingRouteKeys = replacingRouteKeys.filter(key => key !== previousFocusedRoute.key);

          // Keep a copy of route being removed in the state to be able to animate it
          routes = [...routes, previousFocusedRoute];
        }
      } else {
        // A route has come to the focus, we treat this as a push
        // A replace or rearranging can also trigger this
        // The animation should look like push

        if (isAnimationEnabled(nextFocusedRoute.key) && !openingRouteKeys.includes(nextFocusedRoute.key)) {
          // In this case, we need to animate pushing the focused route
          // We don't care about animating any other added routes because they won't be visible
          openingRouteKeys = [...openingRouteKeys, nextFocusedRoute.key];
          closingRouteKeys = closingRouteKeys.filter(key => key !== nextFocusedRoute.key);
          replacingRouteKeys = replacingRouteKeys.filter(key => key !== nextFocusedRoute.key);
          if (!routes.some(r => r.key === previousFocusedRoute.key)) {
            // The previous focused route isn't present in state, we treat this as a replace

            openingRouteKeys = openingRouteKeys.filter(key => key !== previousFocusedRoute.key);
            if (getAnimationTypeForReplace(nextFocusedRoute.key) === 'pop') {
              closingRouteKeys = [...closingRouteKeys, previousFocusedRoute.key];

              // By default, new routes have a push animation, so we add it to `openingRouteKeys` before
              // But since user configured it to animate the old screen like a pop, we need to add this without animation
              // So remove it from `openingRouteKeys` which will remove the animation
              openingRouteKeys = openingRouteKeys.filter(key => key !== nextFocusedRoute.key);

              // Keep the route being removed at the end to animate it out
              routes = [...routes, previousFocusedRoute];
            } else {
              replacingRouteKeys = [...replacingRouteKeys, previousFocusedRoute.key];
              closingRouteKeys = closingRouteKeys.filter(key => key !== previousFocusedRoute.key);

              // Keep the old route in the state because it's visible under the new route, and removing it will feel abrupt
              // We need to insert it just before the focused one (the route being pushed)
              // After the push animation is completed, routes being replaced will be removed completely
              routes = routes.slice();
              routes.splice(routes.length - 1, 0, previousFocusedRoute);
            }
          }
        }
      }
    } else if (replacingRouteKeys.length || closingRouteKeys.length) {
      // Keep the routes we are closing or replacing if animation is enabled for them
      routes = routes.slice();
      routes.splice(routes.length - 1, 0, ...state.routes.filter(({
        key
      }) => isAnimationEnabled(key) ? replacingRouteKeys.includes(key) || closingRouteKeys.includes(key) : false));
    }
    if (!routes.length) {
      throw new Error('There should always be at least one route in the navigation state.');
    }
    const descriptors = routes.reduce((acc, route) => {
      acc[route.key] = props.descriptors[route.key] || state.descriptors[route.key];
      return acc;
    }, {});
    return {
      routes,
      previousRoutes: props.state.routes,
      previousDescriptors: props.descriptors,
      openingRouteKeys,
      closingRouteKeys,
      replacingRouteKeys,
      descriptors
    };
  }
  state = {
    routes: [],
    previousRoutes: [],
    previousDescriptors: {},
    openingRouteKeys: [],
    closingRouteKeys: [],
    replacingRouteKeys: [],
    descriptors: {}
  };
  getPreviousRoute = ({
    route
  }) => {
    const {
      closingRouteKeys,
      replacingRouteKeys
    } = this.state;
    const routes = this.state.routes.filter(r => r.key === route.key || !closingRouteKeys.includes(r.key) && !replacingRouteKeys.includes(r.key));
    const index = routes.findIndex(r => r.key === route.key);
    return routes[index - 1];
  };
  renderHeader = props => {
    return /*#__PURE__*/(0,jsx_runtime.jsx)(HeaderContainer, {
      ...props
    });
  };
  handleOpenRoute = ({
    route
  }) => {
    const {
      state,
      navigation
    } = this.props;
    const {
      closingRouteKeys,
      replacingRouteKeys
    } = this.state;
    if (closingRouteKeys.some(key => key === route.key) && replacingRouteKeys.every(key => key !== route.key) && state.routeNames.includes(route.name) && !state.routes.some(r => r.key === route.key)) {
      // If route isn't present in current state, but was closing, assume that a close animation was cancelled
      // So we need to add this route back to the state
      navigation.dispatch(state => {
        const routes = [...state.routes.filter(r => r.key !== route.key), route];
        return lib_module.CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1
        });
      });
    } else {
      this.setState(state => ({
        routes: state.replacingRouteKeys.length ? state.routes.filter(r => !state.replacingRouteKeys.includes(r.key)) : state.routes,
        openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
        closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key),
        replacingRouteKeys: []
      }));
    }
  };
  handleCloseRoute = ({
    route
  }) => {
    const {
      state,
      navigation
    } = this.props;
    if (state.routes.some(r => r.key === route.key)) {
      // If a route exists in state, trigger a pop
      // This will happen in when the route was closed from the card component
      // e.g. When the close animation triggered from a gesture ends
      navigation.dispatch({
        ...lib_module.StackActions.pop(),
        source: route.key,
        target: state.key
      });
    } else {
      // We need to clean up any state tracking the route and pop it immediately
      this.setState(state => ({
        routes: state.routes.filter(r => r.key !== route.key),
        openingRouteKeys: state.openingRouteKeys.filter(key => key !== route.key),
        closingRouteKeys: state.closingRouteKeys.filter(key => key !== route.key)
      }));
    }
  };
  handleTransitionStart = ({
    route
  }, closing) => this.props.navigation.emit({
    type: 'transitionStart',
    data: {
      closing
    },
    target: route.key
  });
  handleTransitionEnd = ({
    route
  }, closing) => this.props.navigation.emit({
    type: 'transitionEnd',
    data: {
      closing
    },
    target: route.key
  });
  handleGestureStart = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureStart',
      target: route.key
    });
  };
  handleGestureEnd = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureEnd',
      target: route.key
    });
  };
  handleGestureCancel = ({
    route
  }) => {
    this.props.navigation.emit({
      type: 'gestureCancel',
      target: route.key
    });
  };
  render() {
    const {
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      descriptors: _,
      ...rest
    } = this.props;
    const {
      routes,
      descriptors,
      openingRouteKeys,
      closingRouteKeys
    } = this.state;
    const preloadedDescriptors = state.preloadedRoutes.reduce((acc, route) => {
      acc[route.key] = acc[route.key] || this.props.describe(route, true);
      return acc;
    }, {});
    return /*#__PURE__*/(0,jsx_runtime.jsx)(GestureHandlerWrapper, {
      style: StackView_styles.container,
      children: /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* SafeAreaProviderCompat */.ge, {
        children: /*#__PURE__*/(0,jsx_runtime.jsx)(SafeAreaContext/* SafeAreaInsetsContext */.q9.Consumer, {
          children: insets => /*#__PURE__*/(0,jsx_runtime.jsx)(ModalPresentationContext.Consumer, {
            children: isParentModal => /*#__PURE__*/(0,jsx_runtime.jsx)(elements_lib_module/* HeaderShownContext */.q2.Consumer, {
              children: isParentHeaderShown => /*#__PURE__*/(0,jsx_runtime.jsx)(CardStack, {
                insets: insets,
                isParentHeaderShown: isParentHeaderShown,
                isParentModal: isParentModal,
                getPreviousRoute: this.getPreviousRoute,
                routes: routes,
                openingRouteKeys: openingRouteKeys,
                closingRouteKeys: closingRouteKeys,
                onOpenRoute: this.handleOpenRoute,
                onCloseRoute: this.handleCloseRoute,
                onTransitionStart: this.handleTransitionStart,
                onTransitionEnd: this.handleTransitionEnd,
                renderHeader: this.renderHeader,
                state: state,
                descriptors: descriptors,
                onGestureStart: this.handleGestureStart,
                onGestureEnd: this.handleGestureEnd,
                onGestureCancel: this.handleGestureCancel,
                preloadedDescriptors: preloadedDescriptors,
                ...rest
              })
            })
          })
        })
      })
    });
  }
}
const StackView_styles = StyleSheet/* default */.A.create({
  container: {
    flex: 1
  }
});
;// ./node_modules/@react-navigation/stack/src/navigators/createStackNavigator.tsx




function StackNavigator({
  id,
  initialRouteName,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  ...rest
}) {
  const {
    direction
  } = (0,lib_module.useLocale)();
  const {
    state,
    describe,
    descriptors,
    navigation,
    NavigationContent
  } = (0,lib_module.useNavigationBuilder)(lib_module.StackRouter, {
    id,
    initialRouteName,
    UNSTABLE_routeNamesChangeBehavior,
    children,
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_router
  });
  react.useEffect(() =>
  // @ts-expect-error: there may not be a tab navigator in parent
  navigation.addListener?.('tabPress', e => {
    const isFocused = navigation.isFocused();

    // Run the operation in the next frame so we're sure all listeners have been run
    // This is necessary to know if preventDefault() has been called
    requestAnimationFrame(() => {
      if (state.index > 0 && isFocused && !e.defaultPrevented) {
        // When user taps on already focused tab and we're inside the tab,
        // reset the stack to replicate native behaviour
        navigation.dispatch({
          ...lib_module.StackActions.popToTop(),
          target: state.key
        });
      }
    });
  }), [navigation, state.index, state.key]);
  return /*#__PURE__*/(0,jsx_runtime.jsx)(NavigationContent, {
    children: /*#__PURE__*/(0,jsx_runtime.jsx)(StackView, {
      ...rest,
      direction: direction,
      state: state,
      describe: describe,
      descriptors: descriptors,
      navigation: navigation
    })
  });
}
function createStackNavigator(config) {
  return (0,lib_module.createNavigatorFactory)(StackNavigator)(config);
}

/***/ },

/***/ 8854
(module, __unused_webpack_exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(8156);
var swizzle = __webpack_require__(9872);
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

/***/ 9872
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isArrayish = __webpack_require__(3496);

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


/***/ }

}]);
//# sourceMappingURL=bundle.web.7486deff48bb2d5fe9b1.js.map