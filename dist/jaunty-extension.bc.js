(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@jaunty/extension'), require('@lvchengbin/biu'), require('@lvchengbin/observer')) :
	typeof define === 'function' && define.amd ? define(['@jaunty/extension', '@lvchengbin/biu', '@lvchengbin/observer'], factory) :
	(global.Extension = factory(global.Extension,global.biu,global.Observer));
}(this, (function (Extension,biu,Observer) { 'use strict';

Extension = Extension && Extension.hasOwnProperty('default') ? Extension['default'] : Extension;
biu = biu && biu.hasOwnProperty('default') ? biu['default'] : biu;
Observer = Observer && Observer.hasOwnProperty('default') ? Observer['default'] : Observer;

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match) {
  // 21.1.3.11 String.prototype.match(regexp)
  return [function match(regexp) {
    var O = defined(this);
    var fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  }, $match];
});

var dP = require('./_object-dp').f;

var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name'; // 19.2.4.2 name

NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function get() {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {
  assign: require('./_object-assign')
});

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined ? fn.call(searchValue, O, replaceValue) : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split) {
  var isRegExp = require('./_is-regexp');

  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';

  if ('abbc'[$SPLIT](/(b)*/)[1] == 'c' || 'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 || 'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 || '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 || '.'[$SPLIT](/()()/)[LENGTH] > 1 || ''[$SPLIT](/.?/)[LENGTH]) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it

    $split = function $split(separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return []; // If `separator` is not a regex, use native split

      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0; // Make `global` and avoid `lastIndex` issues by working with a copy

      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i; // Doesn't need flags gy, but they don't hurt

      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);

      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];

        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index)); // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func

          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) {
              if (arguments[i] === undefined) match[i] = undefined;
            }
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }

        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }

      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));

      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    }; // Chakra, V8

  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function $split(separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  } // 21.1.3.17 String.prototype.split(separator, limit)


  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});

var _typeof$1 = require("\0rollupPluginBabelHelpers").typeof;

var global = require('./_global');

var has = require('./_has');

var DESCRIPTORS = require('./_descriptors');

var $export$1 = require('./_export');

var redefine = require('./_redefine');

var META = require('./_meta').KEY;

var $fails = require('./_fails');

var shared = require('./_shared');

var setToStringTag = require('./_set-to-string-tag');

var uid = require('./_uid');

var wks = require('./_wks');

var wksExt = require('./_wks-ext');

var wksDefine = require('./_wks-define');

var enumKeys = require('./_enum-keys');

var isArray = require('./_is-array');

var anObject = require('./_an-object');

var isObject = require('./_is-object');

var toIObject = require('./_to-iobject');

var toPrimitive = require('./_to-primitive');

var createDesc = require('./_property-desc');

var _create = require('./_object-create');

var gOPNExt = require('./_object-gopn-ext');

var $GOPD = require('./_object-gopd');

var $DP = require('./_object-dp');

var $keys = require('./_object-keys');

var gOPD = $GOPD.f;
var dP$1 = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;

var _stringify = $JSON && $JSON.stringify;

var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP$1({}, 'a', {
    get: function get() {
      return dP$1(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto) dP$1(ObjectProto, key, protoDesc);
} : dP$1;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);

  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && _typeof$1($Symbol.iterator) == 'symbol' ? function (it) {
  return _typeof$1(it) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);

  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP$1(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, {
        enumerable: createDesc(0, false)
      });
    }

    return setSymbolDesc(it, key, D);
  }

  return dP$1(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;

  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }

  return it;
};

var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }

  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }

  return result;
}; // 19.4.1.1 Symbol([description])


if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);

    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };

    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, {
      configurable: true,
      set: $set
    });
    return wrap(tag);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });
  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export$1($export$1.G + $export$1.W + $export$1.F * !USE_NATIVE, {
  Symbol: $Symbol
});

for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
  wks(es6Symbols[j++]);
}

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
  wksDefine(wellKnownSymbols[k++]);
}

$export$1($export$1.S + $export$1.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

    for (var key in SymbolRegistry) {
      if (SymbolRegistry[key] === sym) return key;
    }
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});
$export$1($export$1.S + $export$1.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
}); // 24.3.2 JSON.stringify(value [, replacer [, space]])

$JSON && $export$1($export$1.S + $export$1.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols

  return _stringify([S]) != '[null]' || _stringify({
    a: S
  }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;

    while (arguments.length > i) {
      args.push(arguments[i++]);
    }

    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

    if (!isArray(replacer)) replacer = function replacer(key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
}); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

setToStringTag(global.JSON, 'JSON', true);

var $iterators = require('./es6.array.iterator');

var getKeys$1 = require('./_object-keys');

var redefine$1 = require('./_redefine');

var global$1 = require('./_global');

var hide = require('./_hide');

var Iterators = require('./_iterators');

var wks$1 = require('./_wks');

var ITERATOR = wks$1('iterator');
var TO_STRING_TAG = wks$1('toStringTag');
var ArrayValues = Iterators.Array;
var DOMIterables = {
  CSSRuleList: true,
  // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true,
  // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true,
  // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys$1(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME$1 = collections[i];
  var explicit = DOMIterables[NAME$1];
  var Collection = global$1[NAME$1];
  var proto = Collection && Collection.prototype;
  var key;

  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME$1);
    Iterators[NAME$1] = ArrayValues;
    if (explicit) for (key in $iterators) {
      if (!proto[key]) redefine$1(proto, key, $iterators[key], true);
    }
  }
}

var isAsyncFunction = (function (fn) {
  return {}.toString.call(fn) === '[object AsyncFunction]';
});

var isFunction = (function (fn) {
  return {}.toString.call(fn) === '[object Function]' || isAsyncFunction(fn);
});

var isPromise = (function (p) {
  return p && isFunction(p.then);
});

var Promise$1 =
/*#__PURE__*/
function () {
  function Promise(fn) {
    _classCallCheck(this, Promise);

    if (!(this instanceof Promise)) {
      throw new TypeError(this + ' is not a promise ');
    }

    if (!isFunction(fn)) {
      throw new TypeError('Promise resolver ' + fn + ' is not a function');
    }

    this['[[PromiseStatus]]'] = 'pending';
    this['[[PromiseValue]]'] = null;
    this['[[PromiseThenables]]'] = [];

    try {
      fn(promiseResolve.bind(null, this), promiseReject.bind(null, this));
    } catch (e) {
      if (this['[[PromiseStatus]]'] === 'pending') {
        promiseReject.bind(null, this)(e);
      }
    }
  }

  _createClass(Promise, [{
    key: "then",
    value: function then(resolved, rejected) {
      var promise = new Promise(function () {});
      this['[[PromiseThenables]]'].push({
        resolve: isFunction(resolved) ? resolved : null,
        reject: isFunction(rejected) ? rejected : null,
        called: false,
        promise: promise
      });
      if (this['[[PromiseStatus]]'] !== 'pending') promiseExecute(this);
      return promise;
    }
  }, {
    key: "catch",
    value: function _catch(reject) {
      return this.then(null, reject);
    }
  }]);

  return Promise;
}();

Promise$1.resolve = function (value) {
  if (!isFunction(this)) {
    throw new TypeError('Promise.resolve is not a constructor');
  }
  /**
   * @todo
   * check if the value need to return the resolve( value )
   */


  return new Promise$1(function (resolve) {
    resolve(value);
  });
};

Promise$1.reject = function (reason) {
  if (!isFunction(this)) {
    throw new TypeError('Promise.reject is not a constructor');
  }

  return new Promise$1(function (resolve, reject) {
    reject(reason);
  });
};

Promise$1.all = function (promises) {
  var rejected = false;
  var res = [];
  return new Promise$1(function (resolve, reject) {
    var remaining = 0;

    var then = function then(p, i) {
      if (!isPromise(p)) {
        p = Promise$1.resolve(p);
      }

      p.then(function (value) {
        res[i] = value;

        if (--remaining === 0) {
          resolve(res);
        }
      }, function (reason) {
        if (!rejected) {
          reject(reason);
          rejected = true;
        }
      });
    };

    var i = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = promises[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _promise = _step.value;
        remaining++;
        then(_promise, i++);
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

    if (!i) {
      resolve(res);
    }
  });
};

Promise$1.race = function (promises) {
  var resolved = false;
  var rejected = false;
  return new Promise$1(function (resolve, reject) {
    function onresolved(value) {
      if (!resolved && !rejected) {
        resolve(value);
        resolved = true;
      }
    }

    function onrejected(reason) {
      if (!resolved && !rejected) {
        reject(reason);
        rejected = true;
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = promises[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _promise2 = _step2.value;

        if (!isPromise(_promise2)) {
          _promise2 = Promise$1.resolve(_promise2);
        }

        _promise2.then(onresolved, onrejected);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  });
};

function promiseExecute(promise) {
  var thenable, p;
  if (promise['[[PromiseStatus]]'] === 'pending') return;
  if (!promise['[[PromiseThenables]]'].length) return;

  var then = function then(p, t) {
    p.then(function (value) {
      promiseResolve(t.promise, value);
    }, function (reason) {
      promiseReject(t.promise, reason);
    });
  };

  while (promise['[[PromiseThenables]]'].length) {
    thenable = promise['[[PromiseThenables]]'].shift();
    if (thenable.called) continue;
    thenable.called = true;

    if (promise['[[PromiseStatus]]'] === 'resolved') {
      if (!thenable.resolve) {
        promiseResolve(thenable.promise, promise['[[PromiseValue]]']);
        continue;
      }

      try {
        p = thenable.resolve.call(null, promise['[[PromiseValue]]']);
      } catch (e) {
        then(Promise$1.reject(e), thenable);
        continue;
      }

      if (p && (typeof p === 'function' || _typeof(p) === 'object') && p.then) {
        then(p, thenable);
        continue;
      }
    } else {
      if (!thenable.reject) {
        promiseReject(thenable.promise, promise['[[PromiseValue]]']);
        continue;
      }

      try {
        p = thenable.reject.call(null, promise['[[PromiseValue]]']);
      } catch (e) {
        then(Promise$1.reject(e), thenable);
        continue;
      }

      if ((typeof p === 'function' || _typeof(p) === 'object') && p.then) {
        then(p, thenable);
        continue;
      }
    }

    promiseResolve(thenable.promise, p);
  }

  return promise;
}

function promiseResolve(promise, value) {
  if (!(promise instanceof Promise$1)) {
    return new Promise$1(function (resolve) {
      resolve(value);
    });
  }

  if (promise['[[PromiseStatus]]'] !== 'pending') return;

  if (value === promise) {
    /**
     * thie error should be thrown, defined ES6 standard
     * it would be thrown in Chrome but not in Firefox or Safari
     */
    throw new TypeError('Chaining cycle detected for promise #<Promise>');
  }

  if (value !== null && (typeof value === 'function' || _typeof(value) === 'object')) {
    var then;

    try {
      then = value.then;
    } catch (e) {
      return promiseReject(promise, e);
    }

    if (typeof then === 'function') {
      then.call(value, promiseResolve.bind(null, promise), promiseReject.bind(null, promise));
      return;
    }
  }

  promise['[[PromiseStatus]]'] = 'resolved';
  promise['[[PromiseValue]]'] = value;
  promiseExecute(promise);
}

function promiseReject(promise, value) {
  if (!(promise instanceof Promise$1)) {
    return new Promise$1(function (resolve, reject) {
      reject(value);
    });
  }

  promise['[[PromiseStatus]]'] = 'rejected';
  promise['[[PromiseValue]]'] = value;
  promiseExecute(promise);
}

var protos = ['$reload', '$refresh', '$assign', '$submit', '$load', '$delete', '$update'];

function pack(data, model) {
  if (_typeof(data) !== 'object') {
    console.warn('[J WARN] Model: model data is not an object', data, model);
    return data;
  }

  var methods = {};
  var keys = protos.concat(Object.keys(model));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _key2 = _step.value;
      var item = model[_key2];
      methods[_key2] = isFunction(item) ? item.bind(model) : item;
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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _key3 = _step2.value;
      if (_key3.charAt(0) !== '$' && model.expose.indexOf(_key3) < 0) continue;
      if (data.hasOwnProperty(_key3)) continue;
      Object.defineProperty(data, _key3, {
        value: methods[_key3]
      });
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return Observer.create(data);
}

function defaultStatus() {
  return {
    $valid: false,
    $checked: false,
    $modified: false,
    $dirty: false,
    $pristine: false,
    $error: false,
    $errors: {}
  };
}

var Model =
/*#__PURE__*/
function (_Extension) {
  _inherits(Model, _Extension);

  function Model(init) {
    var _this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, init, Object.assign({
      type: 'model'
    }, config)));
    _this.data || (_this.data = {});
    _this.expose || (_this.expose = []); // for storing the real data

    _this.$data = {}; // a property for stroing a snapshot

    _this.__snapshot = {}; // a property for stroing the initial data

    _this.__initial = null;
    _this.__boundValidation = false;
    _this.__specialProperties = null;
    _this.__triedSubmit = false;
    return _this;
  }

  _createClass(Model, [{
    key: "__init",
    value: function __init() {
      var _this2 = this;

      return this.__initData().then(function () {
        try {
          _this2.__initial = JSON.stringify(_this2.$data);
        } catch (e) {
          console.warn(e);
        }

        _this2.__bindSpecialProperties();
      });
    }
  }, {
    key: "__initData",
    value: function __initData() {
      var _this3 = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (data) {
        this.$data = pack(data, this);
        return Promise$1.resolve();
      }

      var params;

      if (this.api) {
        this.url = this.api.url;
        params = this.api.param || null;
      }

      if (this.url) {
        return biu.get(this.url, {
          params: params,
          storage: this.storage || false
        }).then(function (response) {
          _this3.$data = pack(response, _this3);
        }).catch(function (e) {
          console.error(e);
        });
      } else if (this.data) {
        if (isFunction(this.data)) {
          var p = this.data();

          if (isPromise(p)) {
            return p.then(function (response) {
              _this3.$data = pack(response, _this3);
            });
          } else {
            this.$data = pack(p || {}, this);
          }
        } else if (isPromise(this.data)) {
          return this.data.then(function (response) {
            _this3.$data = pack(response, _this3);
          });
        } else {
          if (this.__initial) {
            this.$reset();
          } else {
            this.$data = pack(this.data, this);
          }
        }
      } else {
        this.$data = pack({}, this);
      }

      return Promise$1.resolve();
    }
  }, {
    key: "__bindSpecialProperties",
    value: function __bindSpecialProperties() {
      var _this4 = this;

      var properties = {
        $ready: true,
        $loading: false,
        $failed: false,
        $error: false,
        $submitting: false,
        $requesting: false,
        $response: null,
        $validateion: defaultStatus()
      };

      var makeChangeAfterSubmitHandler = function makeChangeAfterSubmitHandler(item) {
        return function () {
          if (_this4.__triedSubmit) {
            item.__validator.apply(item, arguments);
          }
        };
      };

      if (this.validations) {
        var keys = Object.keys(this.validations);

        for (var _i = 0; _i < keys.length; _i++) {
          var key = keys[_i];
          var item = this.validations[key];
          properties.$validation[key] = defaultStatus();

          if (!this.__boundValidation) {
            item.__validator = this.__validator(key, item);
            item.path || (item.path = key);

            switch (item.on) {
              case 'change':
              case 1:
                this.$watch(item.path, item.__validator);
                break;

              case 'change-after-submit':
              case 2:
                this.$watch(item.path, makeChangeAfterSubmitHandler(item));
                break;

              default:
                break;
            }
          }
        }
      }
    }
  }, {
    key: "__validator",
    value: function __validator(name, bound) {
      var _this5 = this;

      return function () {
        var validation = _this5.$data.$validation;
        if (!validation) return true;
        var res = true;
        var val = getDataByPath(_this5.$data, bound.path);

        for (var keys = getKeys(bound), i = keys.length - 1; i >= 0; i--) {
          var key = keys[i];
          if (key.charAt(0) === '_' && key.charAt(1) === '_') continue;
          var item = bound[key];
          var error = void 0;

          if (isFunction(item)) {
            error = !item.call(_this5, val);
          } else if (isFunction(Validate[key])) {
            error = !Validate[key](val, bound[key]);
          } else {
            continue;
          }

          error && (res = false);

          _this5.$assign(validation[name].$errors, _defineProperty({}, key, error));
        }

        if (bound.hasOwnProperty('method')) {
          if (!bound.method.call(_this5, val)) {
            res = false;
            validation[name].$errors.method = true;
          }

          validation[name].$errors.method = false;
        }

        validation[name].$valid = res;
        return !(validation[name].$error = !res);
      };
    }
  }]);

  return Model;
}(Extension);

return Model;

})));
