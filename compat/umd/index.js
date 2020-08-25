(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@absinthe/socket')) :
	typeof define === 'function' && define.amd ? define(['exports', '@absinthe/socket'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AbsintheSocketApolloLink = {}, global.socket));
}(this, (function (exports, socket) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document) && isObject(document.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	var slice = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$1(this);
	  var partArgs = slice.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true }, {
	  bind: functionBind
	});

	function _newArrowCheck(innerThis, boundThis) {
	  if (innerThis !== boundThis) {
	    throw new TypeError("Cannot instantiate an arrow function");
	  }
	}

	var newArrowCheck = _newArrowCheck;

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	var genericMessage = "Invariant Violation";
	var _a = Object.setPrototypeOf, setPrototypeOf = _a === void 0 ? function (obj, proto) {
	    obj.__proto__ = proto;
	    return obj;
	} : _a;
	var InvariantError = /** @class */ (function (_super) {
	    __extends(InvariantError, _super);
	    function InvariantError(message) {
	        if (message === void 0) { message = genericMessage; }
	        var _this = _super.call(this, typeof message === "number"
	            ? genericMessage + ": " + message + " (see https://github.com/apollographql/invariant-packages)"
	            : message) || this;
	        _this.framesToPop = 1;
	        _this.name = genericMessage;
	        setPrototypeOf(_this, InvariantError.prototype);
	        return _this;
	    }
	    return InvariantError;
	}(Error));
	function invariant(condition, message) {
	    if (!condition) {
	        throw new InvariantError(message);
	    }
	}
	function wrapConsoleMethod(method) {
	    return function () {
	        return console[method].apply(console, arguments);
	    };
	}
	(function (invariant) {
	    invariant.warn = wrapConsoleMethod("warn");
	    invariant.error = wrapConsoleMethod("error");
	})(invariant || (invariant = {}));
	// Code that uses ts-invariant with rollup-plugin-invariant may want to
	// import this process stub to avoid errors evaluating process.env.NODE_ENV.
	// However, because most ESM-to-CJS compilers will rewrite the process import
	// as tsInvariant.process, which prevents proper replacement by minifiers, we
	// also attempt to define the stub globally when it is not already defined.
	var processStub = { env: {} };
	if (typeof process === "object") {
	    processStub = process;
	}
	else
	    try {
	        // Using Function to evaluate this assignment in global scope also escapes
	        // the strict mode of the current module, thereby allowing the assignment.
	        // Inspired by https://github.com/facebook/regenerator/pull/369.
	        Function("stub", "process = stub")(processStub);
	    }
	    catch (atLeastWeTried) {
	        // The assignment can fail if a Content Security Policy heavy-handedly
	        // forbids Function usage. In those environments, developers should take
	        // extra care to replace process.env.NODE_ENV in their production builds,
	        // or define an appropriate global.process polyfill.
	    }

	// istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
	var nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;

	function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
	var MAX_ARRAY_LENGTH = 10;
	var MAX_RECURSIVE_DEPTH = 2;
	/**
	 * Used to print values in error messages.
	 */

	function inspect(value) {
	  return formatValue(value, []);
	}

	function formatValue(value, seenValues) {
	  switch (_typeof(value)) {
	    case 'string':
	      return JSON.stringify(value);

	    case 'function':
	      return value.name ? "[function ".concat(value.name, "]") : '[function]';

	    case 'object':
	      if (value === null) {
	        return 'null';
	      }

	      return formatObjectValue(value, seenValues);

	    default:
	      return String(value);
	  }
	}

	function formatObjectValue(value, previouslySeenValues) {
	  if (previouslySeenValues.indexOf(value) !== -1) {
	    return '[Circular]';
	  }

	  var seenValues = [].concat(previouslySeenValues, [value]);
	  var customInspectFn = getCustomFn(value);

	  if (customInspectFn !== undefined) {
	    // $FlowFixMe(>=0.90.0)
	    var customValue = customInspectFn.call(value); // check for infinite recursion

	    if (customValue !== value) {
	      return typeof customValue === 'string' ? customValue : formatValue(customValue, seenValues);
	    }
	  } else if (Array.isArray(value)) {
	    return formatArray(value, seenValues);
	  }

	  return formatObject(value, seenValues);
	}

	function formatObject(object, seenValues) {
	  var keys = Object.keys(object);

	  if (keys.length === 0) {
	    return '{}';
	  }

	  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
	    return '[' + getObjectTag(object) + ']';
	  }

	  var properties = keys.map(function (key) {
	    var value = formatValue(object[key], seenValues);
	    return key + ': ' + value;
	  });
	  return '{ ' + properties.join(', ') + ' }';
	}

	function formatArray(array, seenValues) {
	  if (array.length === 0) {
	    return '[]';
	  }

	  if (seenValues.length > MAX_RECURSIVE_DEPTH) {
	    return '[Array]';
	  }

	  var len = Math.min(MAX_ARRAY_LENGTH, array.length);
	  var remaining = array.length - len;
	  var items = [];

	  for (var i = 0; i < len; ++i) {
	    items.push(formatValue(array[i], seenValues));
	  }

	  if (remaining === 1) {
	    items.push('... 1 more item');
	  } else if (remaining > 1) {
	    items.push("... ".concat(remaining, " more items"));
	  }

	  return '[' + items.join(', ') + ']';
	}

	function getCustomFn(object) {
	  var customInspectFn = object[String(nodejsCustomInspectSymbol)];

	  if (typeof customInspectFn === 'function') {
	    return customInspectFn;
	  }

	  if (typeof object.inspect === 'function') {
	    return object.inspect;
	  }
	}

	function getObjectTag(object) {
	  var tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');

	  if (tag === 'Object' && typeof object.constructor === 'function') {
	    var name = object.constructor.name;

	    if (typeof name === 'string' && name !== '') {
	      return name;
	    }
	  }

	  return tag;
	}

	function invariant$1(condition, message) {
	  var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

	  if (!booleanCondition) {
	    throw new Error(message != null ? message : 'Unexpected invariant triggered.');
	  }
	}

	/**
	 * The `defineInspect()` function defines `inspect()` prototype method as alias of `toJSON`
	 */

	function defineInspect(classObject) {
	  var fn = classObject.prototype.toJSON;
	  typeof fn === 'function' || invariant$1(0);
	  classObject.prototype.inspect = fn; // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2317')

	  if (nodejsCustomInspectSymbol) {
	    classObject.prototype[nodejsCustomInspectSymbol] = fn;
	  }
	}

	/**
	 * Contains a range of UTF-8 character offsets and token references that
	 * identify the region of the source from which the AST derived.
	 */
	var Location = /*#__PURE__*/function () {
	  /**
	   * The character offset at which this Node begins.
	   */

	  /**
	   * The character offset at which this Node ends.
	   */

	  /**
	   * The Token at which this Node begins.
	   */

	  /**
	   * The Token at which this Node ends.
	   */

	  /**
	   * The Source document the AST represents.
	   */
	  function Location(startToken, endToken, source) {
	    this.start = startToken.start;
	    this.end = endToken.end;
	    this.startToken = startToken;
	    this.endToken = endToken;
	    this.source = source;
	  }

	  var _proto = Location.prototype;

	  _proto.toJSON = function toJSON() {
	    return {
	      start: this.start,
	      end: this.end
	    };
	  };

	  return Location;
	}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

	defineInspect(Location);
	/**
	 * Represents a range of characters represented by a lexical token
	 * within a Source.
	 */

	var Token = /*#__PURE__*/function () {
	  /**
	   * The kind of Token.
	   */

	  /**
	   * The character offset at which this Node begins.
	   */

	  /**
	   * The character offset at which this Node ends.
	   */

	  /**
	   * The 1-indexed line number on which this Token appears.
	   */

	  /**
	   * The 1-indexed column number at which this Token begins.
	   */

	  /**
	   * For non-punctuation tokens, represents the interpreted value of the token.
	   */

	  /**
	   * Tokens exist as nodes in a double-linked-list amongst all tokens
	   * including ignored tokens. <SOF> is always the first node and <EOF>
	   * the last.
	   */
	  function Token(kind, start, end, line, column, prev, value) {
	    this.kind = kind;
	    this.start = start;
	    this.end = end;
	    this.line = line;
	    this.column = column;
	    this.value = value;
	    this.prev = prev;
	    this.next = null;
	  }

	  var _proto2 = Token.prototype;

	  _proto2.toJSON = function toJSON() {
	    return {
	      kind: this.kind,
	      value: this.value,
	      line: this.line,
	      column: this.column
	    };
	  };

	  return Token;
	}(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

	defineInspect(Token);
	/**
	 * @internal
	 */

	function isNode(maybeNode) {
	  return maybeNode != null && typeof maybeNode.kind === 'string';
	}
	/**
	 * The list of all possible AST node types.
	 */

	/**
	 * A visitor is provided to visit, it contains the collection of
	 * relevant functions to be called during the visitor's traversal.
	 */

	var QueryDocumentKeys = {
	  Name: [],
	  Document: ['definitions'],
	  OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
	  VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
	  Variable: ['name'],
	  SelectionSet: ['selections'],
	  Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
	  Argument: ['name', 'value'],
	  FragmentSpread: ['name', 'directives'],
	  InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
	  FragmentDefinition: ['name', // Note: fragment variable definitions are experimental and may be changed
	  // or removed in the future.
	  'variableDefinitions', 'typeCondition', 'directives', 'selectionSet'],
	  IntValue: [],
	  FloatValue: [],
	  StringValue: [],
	  BooleanValue: [],
	  NullValue: [],
	  EnumValue: [],
	  ListValue: ['values'],
	  ObjectValue: ['fields'],
	  ObjectField: ['name', 'value'],
	  Directive: ['name', 'arguments'],
	  NamedType: ['name'],
	  ListType: ['type'],
	  NonNullType: ['type'],
	  SchemaDefinition: ['description', 'directives', 'operationTypes'],
	  OperationTypeDefinition: ['type'],
	  ScalarTypeDefinition: ['description', 'name', 'directives'],
	  ObjectTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
	  FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
	  InputValueDefinition: ['description', 'name', 'type', 'defaultValue', 'directives'],
	  InterfaceTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
	  UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
	  EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
	  EnumValueDefinition: ['description', 'name', 'directives'],
	  InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
	  DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
	  SchemaExtension: ['directives', 'operationTypes'],
	  ScalarTypeExtension: ['name', 'directives'],
	  ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
	  InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
	  UnionTypeExtension: ['name', 'directives', 'types'],
	  EnumTypeExtension: ['name', 'directives', 'values'],
	  InputObjectTypeExtension: ['name', 'directives', 'fields']
	};
	var BREAK = Object.freeze({});
	/**
	 * visit() will walk through an AST using a depth-first traversal, calling
	 * the visitor's enter function at each node in the traversal, and calling the
	 * leave function after visiting that node and all of its child nodes.
	 *
	 * By returning different values from the enter and leave functions, the
	 * behavior of the visitor can be altered, including skipping over a sub-tree of
	 * the AST (by returning false), editing the AST by returning a value or null
	 * to remove the value, or to stop the whole traversal by returning BREAK.
	 *
	 * When using visit() to edit an AST, the original AST will not be modified, and
	 * a new version of the AST with the changes applied will be returned from the
	 * visit function.
	 *
	 *     const editedAST = visit(ast, {
	 *       enter(node, key, parent, path, ancestors) {
	 *         // @return
	 *         //   undefined: no action
	 *         //   false: skip visiting this node
	 *         //   visitor.BREAK: stop visiting altogether
	 *         //   null: delete this node
	 *         //   any value: replace this node with the returned value
	 *       },
	 *       leave(node, key, parent, path, ancestors) {
	 *         // @return
	 *         //   undefined: no action
	 *         //   false: no action
	 *         //   visitor.BREAK: stop visiting altogether
	 *         //   null: delete this node
	 *         //   any value: replace this node with the returned value
	 *       }
	 *     });
	 *
	 * Alternatively to providing enter() and leave() functions, a visitor can
	 * instead provide functions named the same as the kinds of AST nodes, or
	 * enter/leave visitors at a named key, leading to four permutations of the
	 * visitor API:
	 *
	 * 1) Named visitors triggered when entering a node of a specific kind.
	 *
	 *     visit(ast, {
	 *       Kind(node) {
	 *         // enter the "Kind" node
	 *       }
	 *     })
	 *
	 * 2) Named visitors that trigger upon entering and leaving a node of
	 *    a specific kind.
	 *
	 *     visit(ast, {
	 *       Kind: {
	 *         enter(node) {
	 *           // enter the "Kind" node
	 *         }
	 *         leave(node) {
	 *           // leave the "Kind" node
	 *         }
	 *       }
	 *     })
	 *
	 * 3) Generic visitors that trigger upon entering and leaving any node.
	 *
	 *     visit(ast, {
	 *       enter(node) {
	 *         // enter any node
	 *       },
	 *       leave(node) {
	 *         // leave any node
	 *       }
	 *     })
	 *
	 * 4) Parallel visitors for entering and leaving nodes of a specific kind.
	 *
	 *     visit(ast, {
	 *       enter: {
	 *         Kind(node) {
	 *           // enter the "Kind" node
	 *         }
	 *       },
	 *       leave: {
	 *         Kind(node) {
	 *           // leave the "Kind" node
	 *         }
	 *       }
	 *     })
	 */

	function visit(root, visitor) {
	  var visitorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : QueryDocumentKeys;

	  /* eslint-disable no-undef-init */
	  var stack = undefined;
	  var inArray = Array.isArray(root);
	  var keys = [root];
	  var index = -1;
	  var edits = [];
	  var node = undefined;
	  var key = undefined;
	  var parent = undefined;
	  var path = [];
	  var ancestors = [];
	  var newRoot = root;
	  /* eslint-enable no-undef-init */

	  do {
	    index++;
	    var isLeaving = index === keys.length;
	    var isEdited = isLeaving && edits.length !== 0;

	    if (isLeaving) {
	      key = ancestors.length === 0 ? undefined : path[path.length - 1];
	      node = parent;
	      parent = ancestors.pop();

	      if (isEdited) {
	        if (inArray) {
	          node = node.slice();
	        } else {
	          var clone = {};

	          for (var _i2 = 0, _Object$keys2 = Object.keys(node); _i2 < _Object$keys2.length; _i2++) {
	            var k = _Object$keys2[_i2];
	            clone[k] = node[k];
	          }

	          node = clone;
	        }

	        var editOffset = 0;

	        for (var ii = 0; ii < edits.length; ii++) {
	          var editKey = edits[ii][0];
	          var editValue = edits[ii][1];

	          if (inArray) {
	            editKey -= editOffset;
	          }

	          if (inArray && editValue === null) {
	            node.splice(editKey, 1);
	            editOffset++;
	          } else {
	            node[editKey] = editValue;
	          }
	        }
	      }

	      index = stack.index;
	      keys = stack.keys;
	      edits = stack.edits;
	      inArray = stack.inArray;
	      stack = stack.prev;
	    } else {
	      key = parent ? inArray ? index : keys[index] : undefined;
	      node = parent ? parent[key] : newRoot;

	      if (node === null || node === undefined) {
	        continue;
	      }

	      if (parent) {
	        path.push(key);
	      }
	    }

	    var result = void 0;

	    if (!Array.isArray(node)) {
	      if (!isNode(node)) {
	        throw new Error("Invalid AST Node: ".concat(inspect(node), "."));
	      }

	      var visitFn = getVisitFn(visitor, node.kind, isLeaving);

	      if (visitFn) {
	        result = visitFn.call(visitor, node, key, parent, path, ancestors);

	        if (result === BREAK) {
	          break;
	        }

	        if (result === false) {
	          if (!isLeaving) {
	            path.pop();
	            continue;
	          }
	        } else if (result !== undefined) {
	          edits.push([key, result]);

	          if (!isLeaving) {
	            if (isNode(result)) {
	              node = result;
	            } else {
	              path.pop();
	              continue;
	            }
	          }
	        }
	      }
	    }

	    if (result === undefined && isEdited) {
	      edits.push([key, node]);
	    }

	    if (isLeaving) {
	      path.pop();
	    } else {
	      var _visitorKeys$node$kin;

	      stack = {
	        inArray: inArray,
	        index: index,
	        keys: keys,
	        edits: edits,
	        prev: stack
	      };
	      inArray = Array.isArray(node);
	      keys = inArray ? node : (_visitorKeys$node$kin = visitorKeys[node.kind]) !== null && _visitorKeys$node$kin !== void 0 ? _visitorKeys$node$kin : [];
	      index = -1;
	      edits = [];

	      if (parent) {
	        ancestors.push(parent);
	      }

	      parent = node;
	    }
	  } while (stack !== undefined);

	  if (edits.length !== 0) {
	    newRoot = edits[edits.length - 1][1];
	  }

	  return newRoot;
	}
	/**
	 * Given a visitor instance, if it is leaving or not, and a node kind, return
	 * the function the visitor runtime should call.
	 */

	function getVisitFn(visitor, kind, isLeaving) {
	  var kindVisitor = visitor[kind];

	  if (kindVisitor) {
	    if (!isLeaving && typeof kindVisitor === 'function') {
	      // { Kind() {} }
	      return kindVisitor;
	    }

	    var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;

	    if (typeof kindSpecificVisitor === 'function') {
	      // { Kind: { enter() {}, leave() {} } }
	      return kindSpecificVisitor;
	    }
	  } else {
	    var specificVisitor = isLeaving ? visitor.leave : visitor.enter;

	    if (specificVisitor) {
	      if (typeof specificVisitor === 'function') {
	        // { enter() {}, leave() {} }
	        return specificVisitor;
	      }

	      var specificKindVisitor = specificVisitor[kind];

	      if (typeof specificKindVisitor === 'function') {
	        // { enter: { Kind() {} }, leave: { Kind() {} } }
	        return specificKindVisitor;
	      }
	    }
	  }
	}

	function getOperationName(doc) {
	    return (doc.definitions
	        .filter(function (definition) {
	        return definition.kind === 'OperationDefinition' && definition.name;
	    })
	        .map(function (x) { return x.name.value; })[0] || null);
	}

	var Observable_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Observable = void 0;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

	function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

	// === Symbol Support ===
	var hasSymbols = function () {
	  return typeof Symbol === 'function';
	};

	var hasSymbol = function (name) {
	  return hasSymbols() && Boolean(Symbol[name]);
	};

	var getSymbol = function (name) {
	  return hasSymbol(name) ? Symbol[name] : '@@' + name;
	};

	if (hasSymbols() && !hasSymbol('observable')) {
	  Symbol.observable = Symbol('observable');
	}

	var SymbolIterator = getSymbol('iterator');
	var SymbolObservable = getSymbol('observable');
	var SymbolSpecies = getSymbol('species'); // === Abstract Operations ===

	function getMethod(obj, key) {
	  var value = obj[key];
	  if (value == null) return undefined;
	  if (typeof value !== 'function') throw new TypeError(value + ' is not a function');
	  return value;
	}

	function getSpecies(obj) {
	  var ctor = obj.constructor;

	  if (ctor !== undefined) {
	    ctor = ctor[SymbolSpecies];

	    if (ctor === null) {
	      ctor = undefined;
	    }
	  }

	  return ctor !== undefined ? ctor : Observable;
	}

	function isObservable(x) {
	  return x instanceof Observable; // SPEC: Brand check
	}

	function hostReportError(e) {
	  if (hostReportError.log) {
	    hostReportError.log(e);
	  } else {
	    setTimeout(function () {
	      throw e;
	    });
	  }
	}

	function enqueue(fn) {
	  Promise.resolve().then(function () {
	    try {
	      fn();
	    } catch (e) {
	      hostReportError(e);
	    }
	  });
	}

	function cleanupSubscription(subscription) {
	  var cleanup = subscription._cleanup;
	  if (cleanup === undefined) return;
	  subscription._cleanup = undefined;

	  if (!cleanup) {
	    return;
	  }

	  try {
	    if (typeof cleanup === 'function') {
	      cleanup();
	    } else {
	      var unsubscribe = getMethod(cleanup, 'unsubscribe');

	      if (unsubscribe) {
	        unsubscribe.call(cleanup);
	      }
	    }
	  } catch (e) {
	    hostReportError(e);
	  }
	}

	function closeSubscription(subscription) {
	  subscription._observer = undefined;
	  subscription._queue = undefined;
	  subscription._state = 'closed';
	}

	function flushSubscription(subscription) {
	  var queue = subscription._queue;

	  if (!queue) {
	    return;
	  }

	  subscription._queue = undefined;
	  subscription._state = 'ready';

	  for (var i = 0; i < queue.length; ++i) {
	    notifySubscription(subscription, queue[i].type, queue[i].value);
	    if (subscription._state === 'closed') break;
	  }
	}

	function notifySubscription(subscription, type, value) {
	  subscription._state = 'running';
	  var observer = subscription._observer;

	  try {
	    var m = getMethod(observer, type);

	    switch (type) {
	      case 'next':
	        if (m) m.call(observer, value);
	        break;

	      case 'error':
	        closeSubscription(subscription);
	        if (m) m.call(observer, value);else throw value;
	        break;

	      case 'complete':
	        closeSubscription(subscription);
	        if (m) m.call(observer);
	        break;
	    }
	  } catch (e) {
	    hostReportError(e);
	  }

	  if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
	}

	function onNotify(subscription, type, value) {
	  if (subscription._state === 'closed') return;

	  if (subscription._state === 'buffering') {
	    subscription._queue.push({
	      type: type,
	      value: value
	    });

	    return;
	  }

	  if (subscription._state !== 'ready') {
	    subscription._state = 'buffering';
	    subscription._queue = [{
	      type: type,
	      value: value
	    }];
	    enqueue(function () {
	      return flushSubscription(subscription);
	    });
	    return;
	  }

	  notifySubscription(subscription, type, value);
	}

	var Subscription =
	/*#__PURE__*/
	function () {
	  function Subscription(observer, subscriber) {
	    _classCallCheck(this, Subscription);

	    // ASSERT: observer is an object
	    // ASSERT: subscriber is callable
	    this._cleanup = undefined;
	    this._observer = observer;
	    this._queue = undefined;
	    this._state = 'initializing';
	    var subscriptionObserver = new SubscriptionObserver(this);

	    try {
	      this._cleanup = subscriber.call(undefined, subscriptionObserver);
	    } catch (e) {
	      subscriptionObserver.error(e);
	    }

	    if (this._state === 'initializing') this._state = 'ready';
	  }

	  _createClass(Subscription, [{
	    key: "unsubscribe",
	    value: function unsubscribe() {
	      if (this._state !== 'closed') {
	        closeSubscription(this);
	        cleanupSubscription(this);
	      }
	    }
	  }, {
	    key: "closed",
	    get: function () {
	      return this._state === 'closed';
	    }
	  }]);

	  return Subscription;
	}();

	var SubscriptionObserver =
	/*#__PURE__*/
	function () {
	  function SubscriptionObserver(subscription) {
	    _classCallCheck(this, SubscriptionObserver);

	    this._subscription = subscription;
	  }

	  _createClass(SubscriptionObserver, [{
	    key: "next",
	    value: function next(value) {
	      onNotify(this._subscription, 'next', value);
	    }
	  }, {
	    key: "error",
	    value: function error(value) {
	      onNotify(this._subscription, 'error', value);
	    }
	  }, {
	    key: "complete",
	    value: function complete() {
	      onNotify(this._subscription, 'complete');
	    }
	  }, {
	    key: "closed",
	    get: function () {
	      return this._subscription._state === 'closed';
	    }
	  }]);

	  return SubscriptionObserver;
	}();

	var Observable =
	/*#__PURE__*/
	function () {
	  function Observable(subscriber) {
	    _classCallCheck(this, Observable);

	    if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');
	    if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');
	    this._subscriber = subscriber;
	  }

	  _createClass(Observable, [{
	    key: "subscribe",
	    value: function subscribe(observer) {
	      if (typeof observer !== 'object' || observer === null) {
	        observer = {
	          next: observer,
	          error: arguments[1],
	          complete: arguments[2]
	        };
	      }

	      return new Subscription(observer, this._subscriber);
	    }
	  }, {
	    key: "forEach",
	    value: function forEach(fn) {
	      var _this = this;

	      return new Promise(function (resolve, reject) {
	        if (typeof fn !== 'function') {
	          reject(new TypeError(fn + ' is not a function'));
	          return;
	        }

	        function done() {
	          subscription.unsubscribe();
	          resolve();
	        }

	        var subscription = _this.subscribe({
	          next: function (value) {
	            try {
	              fn(value, done);
	            } catch (e) {
	              reject(e);
	              subscription.unsubscribe();
	            }
	          },
	          error: reject,
	          complete: resolve
	        });
	      });
	    }
	  }, {
	    key: "map",
	    value: function map(fn) {
	      var _this2 = this;

	      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
	      var C = getSpecies(this);
	      return new C(function (observer) {
	        return _this2.subscribe({
	          next: function (value) {
	            try {
	              value = fn(value);
	            } catch (e) {
	              return observer.error(e);
	            }

	            observer.next(value);
	          },
	          error: function (e) {
	            observer.error(e);
	          },
	          complete: function () {
	            observer.complete();
	          }
	        });
	      });
	    }
	  }, {
	    key: "filter",
	    value: function filter(fn) {
	      var _this3 = this;

	      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
	      var C = getSpecies(this);
	      return new C(function (observer) {
	        return _this3.subscribe({
	          next: function (value) {
	            try {
	              if (!fn(value)) return;
	            } catch (e) {
	              return observer.error(e);
	            }

	            observer.next(value);
	          },
	          error: function (e) {
	            observer.error(e);
	          },
	          complete: function () {
	            observer.complete();
	          }
	        });
	      });
	    }
	  }, {
	    key: "reduce",
	    value: function reduce(fn) {
	      var _this4 = this;

	      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
	      var C = getSpecies(this);
	      var hasSeed = arguments.length > 1;
	      var hasValue = false;
	      var seed = arguments[1];
	      var acc = seed;
	      return new C(function (observer) {
	        return _this4.subscribe({
	          next: function (value) {
	            var first = !hasValue;
	            hasValue = true;

	            if (!first || hasSeed) {
	              try {
	                acc = fn(acc, value);
	              } catch (e) {
	                return observer.error(e);
	              }
	            } else {
	              acc = value;
	            }
	          },
	          error: function (e) {
	            observer.error(e);
	          },
	          complete: function () {
	            if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));
	            observer.next(acc);
	            observer.complete();
	          }
	        });
	      });
	    }
	  }, {
	    key: "concat",
	    value: function concat() {
	      var _this5 = this;

	      for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
	        sources[_key] = arguments[_key];
	      }

	      var C = getSpecies(this);
	      return new C(function (observer) {
	        var subscription;
	        var index = 0;

	        function startNext(next) {
	          subscription = next.subscribe({
	            next: function (v) {
	              observer.next(v);
	            },
	            error: function (e) {
	              observer.error(e);
	            },
	            complete: function () {
	              if (index === sources.length) {
	                subscription = undefined;
	                observer.complete();
	              } else {
	                startNext(C.from(sources[index++]));
	              }
	            }
	          });
	        }

	        startNext(_this5);
	        return function () {
	          if (subscription) {
	            subscription.unsubscribe();
	            subscription = undefined;
	          }
	        };
	      });
	    }
	  }, {
	    key: "flatMap",
	    value: function flatMap(fn) {
	      var _this6 = this;

	      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
	      var C = getSpecies(this);
	      return new C(function (observer) {
	        var subscriptions = [];

	        var outer = _this6.subscribe({
	          next: function (value) {
	            if (fn) {
	              try {
	                value = fn(value);
	              } catch (e) {
	                return observer.error(e);
	              }
	            }

	            var inner = C.from(value).subscribe({
	              next: function (value) {
	                observer.next(value);
	              },
	              error: function (e) {
	                observer.error(e);
	              },
	              complete: function () {
	                var i = subscriptions.indexOf(inner);
	                if (i >= 0) subscriptions.splice(i, 1);
	                completeIfDone();
	              }
	            });
	            subscriptions.push(inner);
	          },
	          error: function (e) {
	            observer.error(e);
	          },
	          complete: function () {
	            completeIfDone();
	          }
	        });

	        function completeIfDone() {
	          if (outer.closed && subscriptions.length === 0) observer.complete();
	        }

	        return function () {
	          subscriptions.forEach(function (s) {
	            return s.unsubscribe();
	          });
	          outer.unsubscribe();
	        };
	      });
	    }
	  }, {
	    key: SymbolObservable,
	    value: function () {
	      return this;
	    }
	  }], [{
	    key: "from",
	    value: function from(x) {
	      var C = typeof this === 'function' ? this : Observable;
	      if (x == null) throw new TypeError(x + ' is not an object');
	      var method = getMethod(x, SymbolObservable);

	      if (method) {
	        var observable = method.call(x);
	        if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');
	        if (isObservable(observable) && observable.constructor === C) return observable;
	        return new C(function (observer) {
	          return observable.subscribe(observer);
	        });
	      }

	      if (hasSymbol('iterator')) {
	        method = getMethod(x, SymbolIterator);

	        if (method) {
	          return new C(function (observer) {
	            enqueue(function () {
	              if (observer.closed) return;
	              var _iteratorNormalCompletion = true;
	              var _didIteratorError = false;
	              var _iteratorError = undefined;

	              try {
	                for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                  var _item = _step.value;
	                  observer.next(_item);
	                  if (observer.closed) return;
	                }
	              } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion && _iterator.return != null) {
	                    _iterator.return();
	                  }
	                } finally {
	                  if (_didIteratorError) {
	                    throw _iteratorError;
	                  }
	                }
	              }

	              observer.complete();
	            });
	          });
	        }
	      }

	      if (Array.isArray(x)) {
	        return new C(function (observer) {
	          enqueue(function () {
	            if (observer.closed) return;

	            for (var i = 0; i < x.length; ++i) {
	              observer.next(x[i]);
	              if (observer.closed) return;
	            }

	            observer.complete();
	          });
	        });
	      }

	      throw new TypeError(x + ' is not observable');
	    }
	  }, {
	    key: "of",
	    value: function of() {
	      for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        items[_key2] = arguments[_key2];
	      }

	      var C = typeof this === 'function' ? this : Observable;
	      return new C(function (observer) {
	        enqueue(function () {
	          if (observer.closed) return;

	          for (var i = 0; i < items.length; ++i) {
	            observer.next(items[i]);
	            if (observer.closed) return;
	          }

	          observer.complete();
	        });
	      });
	    }
	  }, {
	    key: SymbolSpecies,
	    get: function () {
	      return this;
	    }
	  }]);

	  return Observable;
	}();

	exports.Observable = Observable;

	if (hasSymbols()) {
	  Object.defineProperty(Observable, Symbol('extensions'), {
	    value: {
	      symbol: SymbolObservable,
	      hostReportError: hostReportError
	    },
	    configurable: true
	  });
	}
	});

	var zenObservable = Observable_1.Observable;

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	}

	/* global window */

	var root;

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = symbolObservablePonyfill(root);

	zenObservable.prototype['@@observable'] = function () { return this; };

	function iterateObserversSafely(observers, method, argument) {
	    var observersWithMethod = [];
	    observers.forEach(function (obs) { return obs[method] && observersWithMethod.push(obs); });
	    observersWithMethod.forEach(function (obs) { return obs[method](argument); });
	}

	function isPromiseLike(value) {
	    return value && typeof value.then === "function";
	}
	var Concast = (function (_super) {
	    __extends(Concast, _super);
	    function Concast(sources) {
	        var _this = _super.call(this, function (observer) {
	            _this.addObserver(observer);
	            return function () { return _this.removeObserver(observer); };
	        }) || this;
	        _this.observers = new Set();
	        _this.promise = new Promise(function (resolve, reject) {
	            _this.resolve = resolve;
	            _this.reject = reject;
	        });
	        _this.handlers = {
	            next: function (result) {
	                if (_this.sub !== null) {
	                    _this.latest = ["next", result];
	                    iterateObserversSafely(_this.observers, "next", result);
	                }
	            },
	            error: function (error) {
	                if (_this.sub !== null) {
	                    if (_this.sub)
	                        _this.sub.unsubscribe();
	                    _this.sub = null;
	                    _this.latest = ["error", error];
	                    _this.reject(error);
	                    iterateObserversSafely(_this.observers, "error", error);
	                }
	            },
	            complete: function () {
	                if (_this.sub !== null) {
	                    var value = _this.sources.shift();
	                    if (!value) {
	                        _this.sub = null;
	                        if (_this.latest &&
	                            _this.latest[0] === "next") {
	                            _this.resolve(_this.latest[1]);
	                        }
	                        else {
	                            _this.resolve();
	                        }
	                        iterateObserversSafely(_this.observers, "complete");
	                    }
	                    else if (isPromiseLike(value)) {
	                        value.then(function (obs) { return _this.sub = obs.subscribe(_this.handlers); });
	                    }
	                    else {
	                        _this.sub = value.subscribe(_this.handlers);
	                    }
	                }
	            },
	        };
	        _this.cancel = function (reason) {
	            _this.reject(reason);
	            _this.sources = [];
	            _this.handlers.complete();
	        };
	        _this.promise.catch(function (_) { });
	        if (isPromiseLike(sources)) {
	            sources.then(function (iterable) { return _this.start(iterable); }, _this.handlers.error);
	        }
	        else {
	            _this.start(sources);
	        }
	        return _this;
	    }
	    Concast.prototype.start = function (sources) {
	        if (this.sub !== void 0)
	            return;
	        this.sources = Array.from(sources);
	        this.handlers.complete();
	    };
	    Concast.prototype.addObserver = function (observer) {
	        if (!this.observers.has(observer)) {
	            if (this.latest) {
	                var nextOrError = this.latest[0];
	                var method = observer[nextOrError];
	                if (method) {
	                    method.call(observer, this.latest[1]);
	                }
	                if (this.sub === null &&
	                    nextOrError === "next" &&
	                    observer.complete) {
	                    observer.complete();
	                }
	            }
	            this.observers.add(observer);
	        }
	    };
	    Concast.prototype.removeObserver = function (observer, quietly) {
	        if (this.observers.delete(observer) &&
	            this.observers.size < 1) {
	            if (quietly)
	                return;
	            if (this.sub) {
	                this.sub.unsubscribe();
	                this.reject(new Error("Observable cancelled prematurely"));
	            }
	            this.sub = null;
	        }
	    };
	    Concast.prototype.cleanup = function (callback) {
	        var _this = this;
	        var called = false;
	        var once = function () {
	            if (!called) {
	                called = true;
	                _this.observers.delete(observer);
	                callback();
	            }
	        };
	        var observer = {
	            next: once,
	            error: once,
	            complete: once,
	        };
	        this.addObserver(observer);
	    };
	    return Concast;
	}(zenObservable));
	if (typeof Symbol === "function" && Symbol.species) {
	    Object.defineProperty(Concast, Symbol.species, {
	        value: zenObservable,
	    });
	}

	function validateOperation(operation) {
	    var OPERATION_FIELDS = [
	        'query',
	        'operationName',
	        'variables',
	        'extensions',
	        'context',
	    ];
	    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
	        var key = _a[_i];
	        if (OPERATION_FIELDS.indexOf(key) < 0) {
	            throw process.env.NODE_ENV === "production" ? new InvariantError(25) : new InvariantError("illegal argument: " + key);
	        }
	    }
	    return operation;
	}

	function createOperation(starting, operation) {
	    var context = __assign({}, starting);
	    var setContext = function (next) {
	        if (typeof next === 'function') {
	            context = __assign(__assign({}, context), next(context));
	        }
	        else {
	            context = __assign(__assign({}, context), next);
	        }
	    };
	    var getContext = function () { return (__assign({}, context)); };
	    Object.defineProperty(operation, 'setContext', {
	        enumerable: false,
	        value: setContext,
	    });
	    Object.defineProperty(operation, 'getContext', {
	        enumerable: false,
	        value: getContext,
	    });
	    return operation;
	}

	function transformOperation(operation) {
	    var transformedOperation = {
	        variables: operation.variables || {},
	        extensions: operation.extensions || {},
	        operationName: operation.operationName,
	        query: operation.query,
	    };
	    if (!transformedOperation.operationName) {
	        transformedOperation.operationName =
	            typeof transformedOperation.query !== 'string'
	                ? getOperationName(transformedOperation.query) || undefined
	                : '';
	    }
	    return transformedOperation;
	}

	function passthrough(op, forward) {
	    return (forward ? forward(op) : zenObservable.of());
	}
	function toLink(handler) {
	    return typeof handler === 'function' ? new ApolloLink(handler) : handler;
	}
	function isTerminating(link) {
	    return link.request.length <= 1;
	}
	var LinkError = (function (_super) {
	    __extends(LinkError, _super);
	    function LinkError(message, link) {
	        var _this = _super.call(this, message) || this;
	        _this.link = link;
	        return _this;
	    }
	    return LinkError;
	}(Error));
	var ApolloLink = (function () {
	    function ApolloLink(request) {
	        if (request)
	            this.request = request;
	    }
	    ApolloLink.empty = function () {
	        return new ApolloLink(function () { return zenObservable.of(); });
	    };
	    ApolloLink.from = function (links) {
	        if (links.length === 0)
	            return ApolloLink.empty();
	        return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
	    };
	    ApolloLink.split = function (test, left, right) {
	        var leftLink = toLink(left);
	        var rightLink = toLink(right || new ApolloLink(passthrough));
	        if (isTerminating(leftLink) && isTerminating(rightLink)) {
	            return new ApolloLink(function (operation) {
	                return test(operation)
	                    ? leftLink.request(operation) || zenObservable.of()
	                    : rightLink.request(operation) || zenObservable.of();
	            });
	        }
	        else {
	            return new ApolloLink(function (operation, forward) {
	                return test(operation)
	                    ? leftLink.request(operation, forward) || zenObservable.of()
	                    : rightLink.request(operation, forward) || zenObservable.of();
	            });
	        }
	    };
	    ApolloLink.execute = function (link, operation) {
	        return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || zenObservable.of());
	    };
	    ApolloLink.concat = function (first, second) {
	        var firstLink = toLink(first);
	        if (isTerminating(firstLink)) {
	            process.env.NODE_ENV === "production" || invariant.warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
	            return firstLink;
	        }
	        var nextLink = toLink(second);
	        if (isTerminating(nextLink)) {
	            return new ApolloLink(function (operation) {
	                return firstLink.request(operation, function (op) { return nextLink.request(op) || zenObservable.of(); }) || zenObservable.of();
	            });
	        }
	        else {
	            return new ApolloLink(function (operation, forward) {
	                return (firstLink.request(operation, function (op) {
	                    return nextLink.request(op, forward) || zenObservable.of();
	                }) || zenObservable.of());
	            });
	        }
	    };
	    ApolloLink.prototype.split = function (test, left, right) {
	        return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
	    };
	    ApolloLink.prototype.concat = function (next) {
	        return ApolloLink.concat(this, next);
	    };
	    ApolloLink.prototype.request = function (operation, forward) {
	        throw process.env.NODE_ENV === "production" ? new InvariantError(22) : new InvariantError('request is not implemented');
	    };
	    ApolloLink.prototype.onError = function (reason) {
	        throw reason;
	    };
	    ApolloLink.prototype.setOnError = function (fn) {
	        this.onError = fn;
	        return this;
	    };
	    return ApolloLink;
	}());

	/**
	 * Produces the value of a block string from its parsed raw value, similar to
	 * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
	 *
	 * This implements the GraphQL spec's BlockStringValue() static algorithm.
	 *
	 * @internal
	 */
	/**
	 * Print a block string in the indented block form by adding a leading and
	 * trailing blank line. However, if a block string starts with whitespace and is
	 * a single-line, adding a leading blank line would strip that whitespace.
	 *
	 * @internal
	 */


	function printBlockString(value) {
	  var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  var preferMultipleLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	  var isSingleLine = value.indexOf('\n') === -1;
	  var hasLeadingSpace = value[0] === ' ' || value[0] === '\t';
	  var hasTrailingQuote = value[value.length - 1] === '"';
	  var hasTrailingSlash = value[value.length - 1] === '\\';
	  var printAsMultipleLines = !isSingleLine || hasTrailingQuote || hasTrailingSlash || preferMultipleLines;
	  var result = ''; // Format a multi-line block quote to account for leading space.

	  if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
	    result += '\n' + indentation;
	  }

	  result += indentation ? value.replace(/\n/g, '\n' + indentation) : value;

	  if (printAsMultipleLines) {
	    result += '\n';
	  }

	  return '"""' + result.replace(/"""/g, '\\"""') + '"""';
	}

	/**
	 * Converts an AST into a string, using one set of reasonable
	 * formatting rules.
	 */

	function print(ast) {
	  return visit(ast, {
	    leave: printDocASTReducer
	  });
	} // TODO: provide better type coverage in future

	var printDocASTReducer = {
	  Name: function Name(node) {
	    return node.value;
	  },
	  Variable: function Variable(node) {
	    return '$' + node.name;
	  },
	  // Document
	  Document: function Document(node) {
	    return join(node.definitions, '\n\n') + '\n';
	  },
	  OperationDefinition: function OperationDefinition(node) {
	    var op = node.operation;
	    var name = node.name;
	    var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
	    var directives = join(node.directives, ' ');
	    var selectionSet = node.selectionSet; // Anonymous queries with no directives or variable definitions can use
	    // the query short form.

	    return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
	  },
	  VariableDefinition: function VariableDefinition(_ref) {
	    var variable = _ref.variable,
	        type = _ref.type,
	        defaultValue = _ref.defaultValue,
	        directives = _ref.directives;
	    return variable + ': ' + type + wrap(' = ', defaultValue) + wrap(' ', join(directives, ' '));
	  },
	  SelectionSet: function SelectionSet(_ref2) {
	    var selections = _ref2.selections;
	    return block(selections);
	  },
	  Field: function Field(_ref3) {
	    var alias = _ref3.alias,
	        name = _ref3.name,
	        args = _ref3.arguments,
	        directives = _ref3.directives,
	        selectionSet = _ref3.selectionSet;
	    return join([wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'), join(directives, ' '), selectionSet], ' ');
	  },
	  Argument: function Argument(_ref4) {
	    var name = _ref4.name,
	        value = _ref4.value;
	    return name + ': ' + value;
	  },
	  // Fragments
	  FragmentSpread: function FragmentSpread(_ref5) {
	    var name = _ref5.name,
	        directives = _ref5.directives;
	    return '...' + name + wrap(' ', join(directives, ' '));
	  },
	  InlineFragment: function InlineFragment(_ref6) {
	    var typeCondition = _ref6.typeCondition,
	        directives = _ref6.directives,
	        selectionSet = _ref6.selectionSet;
	    return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
	  },
	  FragmentDefinition: function FragmentDefinition(_ref7) {
	    var name = _ref7.name,
	        typeCondition = _ref7.typeCondition,
	        variableDefinitions = _ref7.variableDefinitions,
	        directives = _ref7.directives,
	        selectionSet = _ref7.selectionSet;
	    return (// Note: fragment variable definitions are experimental and may be changed
	      // or removed in the future.
	      "fragment ".concat(name).concat(wrap('(', join(variableDefinitions, ', '), ')'), " ") + "on ".concat(typeCondition, " ").concat(wrap('', join(directives, ' '), ' ')) + selectionSet
	    );
	  },
	  // Value
	  IntValue: function IntValue(_ref8) {
	    var value = _ref8.value;
	    return value;
	  },
	  FloatValue: function FloatValue(_ref9) {
	    var value = _ref9.value;
	    return value;
	  },
	  StringValue: function StringValue(_ref10, key) {
	    var value = _ref10.value,
	        isBlockString = _ref10.block;
	    return isBlockString ? printBlockString(value, key === 'description' ? '' : '  ') : JSON.stringify(value);
	  },
	  BooleanValue: function BooleanValue(_ref11) {
	    var value = _ref11.value;
	    return value ? 'true' : 'false';
	  },
	  NullValue: function NullValue() {
	    return 'null';
	  },
	  EnumValue: function EnumValue(_ref12) {
	    var value = _ref12.value;
	    return value;
	  },
	  ListValue: function ListValue(_ref13) {
	    var values = _ref13.values;
	    return '[' + join(values, ', ') + ']';
	  },
	  ObjectValue: function ObjectValue(_ref14) {
	    var fields = _ref14.fields;
	    return '{' + join(fields, ', ') + '}';
	  },
	  ObjectField: function ObjectField(_ref15) {
	    var name = _ref15.name,
	        value = _ref15.value;
	    return name + ': ' + value;
	  },
	  // Directive
	  Directive: function Directive(_ref16) {
	    var name = _ref16.name,
	        args = _ref16.arguments;
	    return '@' + name + wrap('(', join(args, ', '), ')');
	  },
	  // Type
	  NamedType: function NamedType(_ref17) {
	    var name = _ref17.name;
	    return name;
	  },
	  ListType: function ListType(_ref18) {
	    var type = _ref18.type;
	    return '[' + type + ']';
	  },
	  NonNullType: function NonNullType(_ref19) {
	    var type = _ref19.type;
	    return type + '!';
	  },
	  // Type System Definitions
	  SchemaDefinition: addDescription(function (_ref20) {
	    var directives = _ref20.directives,
	        operationTypes = _ref20.operationTypes;
	    return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
	  }),
	  OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
	    var operation = _ref21.operation,
	        type = _ref21.type;
	    return operation + ': ' + type;
	  },
	  ScalarTypeDefinition: addDescription(function (_ref22) {
	    var name = _ref22.name,
	        directives = _ref22.directives;
	    return join(['scalar', name, join(directives, ' ')], ' ');
	  }),
	  ObjectTypeDefinition: addDescription(function (_ref23) {
	    var name = _ref23.name,
	        interfaces = _ref23.interfaces,
	        directives = _ref23.directives,
	        fields = _ref23.fields;
	    return join(['type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
	  }),
	  FieldDefinition: addDescription(function (_ref24) {
	    var name = _ref24.name,
	        args = _ref24.arguments,
	        type = _ref24.type,
	        directives = _ref24.directives;
	    return name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + ': ' + type + wrap(' ', join(directives, ' '));
	  }),
	  InputValueDefinition: addDescription(function (_ref25) {
	    var name = _ref25.name,
	        type = _ref25.type,
	        defaultValue = _ref25.defaultValue,
	        directives = _ref25.directives;
	    return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
	  }),
	  InterfaceTypeDefinition: addDescription(function (_ref26) {
	    var name = _ref26.name,
	        interfaces = _ref26.interfaces,
	        directives = _ref26.directives,
	        fields = _ref26.fields;
	    return join(['interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
	  }),
	  UnionTypeDefinition: addDescription(function (_ref27) {
	    var name = _ref27.name,
	        directives = _ref27.directives,
	        types = _ref27.types;
	    return join(['union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
	  }),
	  EnumTypeDefinition: addDescription(function (_ref28) {
	    var name = _ref28.name,
	        directives = _ref28.directives,
	        values = _ref28.values;
	    return join(['enum', name, join(directives, ' '), block(values)], ' ');
	  }),
	  EnumValueDefinition: addDescription(function (_ref29) {
	    var name = _ref29.name,
	        directives = _ref29.directives;
	    return join([name, join(directives, ' ')], ' ');
	  }),
	  InputObjectTypeDefinition: addDescription(function (_ref30) {
	    var name = _ref30.name,
	        directives = _ref30.directives,
	        fields = _ref30.fields;
	    return join(['input', name, join(directives, ' '), block(fields)], ' ');
	  }),
	  DirectiveDefinition: addDescription(function (_ref31) {
	    var name = _ref31.name,
	        args = _ref31.arguments,
	        repeatable = _ref31.repeatable,
	        locations = _ref31.locations;
	    return 'directive @' + name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + (repeatable ? ' repeatable' : '') + ' on ' + join(locations, ' | ');
	  }),
	  SchemaExtension: function SchemaExtension(_ref32) {
	    var directives = _ref32.directives,
	        operationTypes = _ref32.operationTypes;
	    return join(['extend schema', join(directives, ' '), block(operationTypes)], ' ');
	  },
	  ScalarTypeExtension: function ScalarTypeExtension(_ref33) {
	    var name = _ref33.name,
	        directives = _ref33.directives;
	    return join(['extend scalar', name, join(directives, ' ')], ' ');
	  },
	  ObjectTypeExtension: function ObjectTypeExtension(_ref34) {
	    var name = _ref34.name,
	        interfaces = _ref34.interfaces,
	        directives = _ref34.directives,
	        fields = _ref34.fields;
	    return join(['extend type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
	  },
	  InterfaceTypeExtension: function InterfaceTypeExtension(_ref35) {
	    var name = _ref35.name,
	        interfaces = _ref35.interfaces,
	        directives = _ref35.directives,
	        fields = _ref35.fields;
	    return join(['extend interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
	  },
	  UnionTypeExtension: function UnionTypeExtension(_ref36) {
	    var name = _ref36.name,
	        directives = _ref36.directives,
	        types = _ref36.types;
	    return join(['extend union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
	  },
	  EnumTypeExtension: function EnumTypeExtension(_ref37) {
	    var name = _ref37.name,
	        directives = _ref37.directives,
	        values = _ref37.values;
	    return join(['extend enum', name, join(directives, ' '), block(values)], ' ');
	  },
	  InputObjectTypeExtension: function InputObjectTypeExtension(_ref38) {
	    var name = _ref38.name,
	        directives = _ref38.directives,
	        fields = _ref38.fields;
	    return join(['extend input', name, join(directives, ' '), block(fields)], ' ');
	  }
	};

	function addDescription(cb) {
	  return function (node) {
	    return join([node.description, cb(node)], '\n');
	  };
	}
	/**
	 * Given maybeArray, print an empty string if it is null or empty, otherwise
	 * print all items together separated by separator if provided
	 */


	function join(maybeArray) {
	  var _maybeArray$filter$jo;

	  var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
	  return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter(function (x) {
	    return x;
	  }).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : '';
	}
	/**
	 * Given array, print each item on its own line, wrapped in an
	 * indented "{ }" block.
	 */


	function block(array) {
	  return array && array.length !== 0 ? '{\n' + indent(join(array, '\n')) + '\n}' : '';
	}
	/**
	 * If maybeString is not null or empty, then wrap with start and end, otherwise
	 * print an empty string.
	 */


	function wrap(start, maybeString) {
	  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	  return maybeString ? start + maybeString + end : '';
	}

	function indent(maybeString) {
	  return maybeString && '  ' + maybeString.replace(/\n/g, '\n  ');
	}

	function isMultiline(string) {
	  return string.indexOf('\n') !== -1;
	}

	function hasMultilineItems(maybeArray) {
	  return maybeArray && maybeArray.some(isMultiline);
	}

	var Fun = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.flip = flip;
	exports.constant = constant;
	exports.on = on;
	exports.compose = compose;
	exports.pipe = pipe;
	exports.curry = curry;
	// eslint-disable-line no-redeclare

	// Flips the order of the arguments to a function of two arguments.
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare

	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare

	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	function flip(f) {
	  return function (b, a) {
	    return f(a, b);
	  };
	}

	// Returns its first argument and ignores its second.
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare
	// eslint-disable-line no-redeclare

	function constant(a) {
	  return function () {
	    return a;
	  };
	}

	// The `on` function is used to change the domain of a binary operator.
	function on(o, f) {
	  return function (x, y) {
	    return o(f(x), f(y));
	  };
	}

	function compose() {
	  var _this = this;

	  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
	    fns[_key] = arguments[_key];
	  }

	  // eslint-disable-line no-redeclare
	  var len = fns.length - 1;
	  return function (x) {
	    var y = x;
	    for (var _i = len; _i > -1; _i--) {
	      y = fns[_i].call(_this, y);
	    }
	    return y;
	  };
	}

	function pipe() {
	  var _this2 = this;

	  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    fns[_key2] = arguments[_key2];
	  }

	  // eslint-disable-line no-redeclare
	  var len = fns.length - 1;
	  return function (x) {
	    var y = x;
	    for (var _i2 = 0; _i2 <= len; _i2++) {
	      y = fns[_i2].call(_this2, y);
	    }
	    return y;
	  };
	}

	function curried(f, length, acc) {
	  return function () {
	    var combined = acc.concat(Array.prototype.slice.call(arguments));
	    return combined.length >= length ? f.apply(this, combined) : curried(f, length, combined);
	  };
	}

	function curry(f) {
	  // eslint-disable-line no-redeclare
	  return curried(f, f.length, []);
	}
	});

	var _this = undefined;

	var unobserveOrCancelIfNeeded = function unobserveOrCancelIfNeeded(absintheSocket, notifier, observer) {
	  newArrowCheck(this, _this);

	  if (notifier && observer) {
	    socket.unobserveOrCancel(absintheSocket, notifier, observer);
	  }
	}.bind(undefined);

	var notifierToObservable = function notifierToObservable(absintheSocket, onError, onStart) {
	  var _this2 = this;

	  newArrowCheck(this, _this);

	  return function (notifier) {
	    newArrowCheck(this, _this2);

	    return socket.toObservable(absintheSocket, notifier, {
	      onError: onError,
	      onStart: onStart,
	      unsubscribe: unobserveOrCancelIfNeeded
	    });
	  }.bind(this);
	}.bind(undefined);

	var getRequest = function getRequest(_ref) {
	  newArrowCheck(this, _this);

	  var query = _ref.query,
	      variables = _ref.variables;
	  return {
	    operation: print(query),
	    variables: variables
	  };
	}.bind(undefined);
	/**
	 * Creates a terminating ApolloLink to request operations using given
	 * AbsintheSocket instance
	 */


	var createAbsintheSocketLink = function createAbsintheSocketLink(absintheSocket, onError, onStart) {
	  var _this3 = this;

	  newArrowCheck(this, _this);

	  return new ApolloLink(Fun.compose(notifierToObservable(absintheSocket, onError, onStart), function (request) {
	    newArrowCheck(this, _this3);

	    return socket.send(absintheSocket, request);
	  }.bind(this), getRequest));
	}.bind(undefined);

	exports.createAbsintheSocketLink = createAbsintheSocketLink;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
