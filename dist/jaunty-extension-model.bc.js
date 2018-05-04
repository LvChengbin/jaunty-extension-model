(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Model = factory());
}(this, (function () { 'use strict';

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var asyncFunction = (function (fn) {
  return {}.toString.call(fn) === '[object AsyncFunction]';
});

var isFunction = (function (fn) {
  return {}.toString.call(fn) === '[object Function]' || asyncFunction(fn);
});

var isString = (function (str) {
  return typeof str === 'string' || str instanceof String;
});

var regexp = (function (reg) {
  return {}.toString.call(reg) === '[object RegExp]';
});

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.__listeners = new Map();
  }

  _createClass(EventEmitter, [{
    key: "alias",
    value: function alias(name, to) {
      this[name] = this[to].bind(this);
    }
  }, {
    key: "on",
    value: function on(evt, handler) {
      var listeners = this.__listeners;
      var handlers = listeners.get(evt);

      if (!handlers) {
        handlers = new Set();
        listeners.set(evt, handlers);
      }

      handlers.add(handler);
      return this;
    }
  }, {
    key: "once",
    value: function once(evt, handler) {
      var _this = this;

      var _handler = function _handler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(_this, args);

        _this.removeListener(evt, _handler);
      };

      return this.on(evt, _handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(evt, handler) {
      var listeners = this.__listeners;
      var handlers = listeners.get(evt);
      handlers && handlers.delete(handler);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(evt) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var handlers = this.__listeners.get(evt);

      if (!handlers) return false;
      handlers.forEach(function (handler) {
        return handler.call.apply(handler, [_this2].concat(args));
      });
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(rule) {
      var checker;

      if (isString(rule)) {
        checker = function checker(name) {
          return rule === name;
        };
      } else if (isFunction(rule)) {
        checker = rule;
      } else if (regexp(rule)) {
        checker = function checker(name) {
          rule.lastIndex = 0;
          return rule.test(name);
        };
      }

      var listeners = this.__listeners;
      listeners.forEach(function (value, key) {
        checker(key) && listeners.delete(key);
      });
      return this;
    }
  }]);

  return EventEmitter;
}();

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
        setTimeout(function () {
          if (--remaining === 0) resolve(res);
        }, 0);
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

function isUndefined () {
  return arguments.length > 0 && typeof arguments[0] === 'undefined';
}

function config() {
  return {
    promises: [],
    results: [],
    index: 0,
    steps: [],
    busy: false,
    promise: Promise$1.resolve()
  };
}
/**
 * new Sequence( false, [] )
 * new Sequence( [] )
 */


var Sequence =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Sequence, _EventEmitter);

  function Sequence(steps) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Sequence);

    _this = _possibleConstructorReturn(this, (Sequence.__proto__ || Object.getPrototypeOf(Sequence)).call(this));
    _this.__resolve = null;
    _this.running = false;
    _this.suspended = false;
    _this.suspendTimeout = null;
    _this.interval = options.interval || 0;
    Object.assign(_assertThisInitialized(_this), config());
    steps && _this.append(steps);
    options.autorun !== false && setTimeout(function () {
      _this.run();
    }, 0);
    return _this;
  }
  /**
   * to append new steps to the sequence
   */


  _createClass(Sequence, [{
    key: "append",
    value: function append(steps) {
      var dead = this.index >= this.steps.length;

      if (isFunction(steps)) {
        this.steps.push(steps);
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step2 = _step.value;
            this.steps.push(_step2);
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
      }

      this.running && dead && this.next(true);
    }
  }, {
    key: "go",
    value: function go(n) {
      if (isUndefined(n)) return;
      this.index = n;

      if (this.index > this.steps.length) {
        this.index = this.steps.length;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      Object.assign(this, config());
    }
  }, {
    key: "next",
    value: function next() {
      var _this2 = this;

      var inner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!inner && this.running) {
        console.warn('Please do not call next() while the sequence is running.');
        return Promise$1.reject(new Sequence.Error({
          errno: 2,
          errmsg: 'Cannot call next during the sequence is running.'
        }));
      }
      /**
       * If there is a step that is running,
       * return the promise instance of the running step.
       */


      if (this.busy || this.suspended) return this.promise;
      /**
       * If already reached the end of the sequence,
       * return a rejected promise instance with a false as its reason.
       */

      if (!this.steps[this.index]) {
        return Promise$1.reject(new Sequence.Error({
          errno: 1,
          errmsg: 'no more step can be executed.'
        }));
      }

      this.busy = true;
      return this.promise = this.promise.then(function () {
        var step = _this2.steps[_this2.index];
        var promise;

        try {
          promise = step(_this2.results[_this2.results.length - 1], _this2.index, _this2.results);
          /**
           * if the step function doesn't return a promise instance,
           * create a resolved promise instance with the returned value as its value
           */

          if (!isPromise(promise)) {
            promise = Promise$1.resolve(promise);
          }
        } catch (e) {
          promise = Promise$1.reject(e);
        }

        return promise.then(function (value) {
          var result = {
            status: Sequence.SUCCEEDED,
            index: _this2.index,
            value: value,
            time: +new Date()
          };

          _this2.results.push(result);

          _this2.emit('success', result, _this2.index, _this2);

          return result;
        }).catch(function (reason) {
          var result = {
            status: Sequence.FAILED,
            index: _this2.index,
            reason: reason,
            time: +new Date()
          };

          _this2.results.push(result);

          _this2.emit('failed', result, _this2.index, _this2);

          return result;
        }).then(function (result) {
          _this2.index++;
          _this2.busy = false;

          if (!_this2.steps[_this2.index]) {
            _this2.emit('end', _this2.results, _this2);
          } else {
            setTimeout(function () {
              _this2.running && _this2.next(true);
            }, _this2.interval);
          }

          return result;
        });
      });
    }
  }, {
    key: "run",
    value: function run() {
      if (this.running) return;
      this.running = true;
      this.next(true);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
    }
  }, {
    key: "suspend",
    value: function suspend() {
      var _this3 = this;

      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
      this.suspended = true;
      this.suspendTimeout && clearTimeout(this.suspendTimeout);
      this.suspendTimeout = setTimeout(function () {
        _this3.suspended = false;
        _this3.running && _this3.next(true);
      }, duration);
    }
  }]);

  return Sequence;
}(EventEmitter);

Sequence.SUCCEEDED = 1;
Sequence.FAILED = 0;

Sequence.all = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!steps.length) {
    return Promise$1.resolve([]);
  }

  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve, reject) {
    sequence.on('end', function (results) {
      resolve(results);
    });
    sequence.on('failed', function () {
      sequence.stop();
      reject(sequence.results);
    });
  });
};

Sequence.chain = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!steps.length) {
    return Promise$1.resolve([]);
  }

  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve) {
    sequence.on('end', function (results) {
      resolve(results);
    });
  });
};

Sequence.any = function (steps) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!steps.length) {
    return Promise$1.reject([]);
  }

  var sequence = new Sequence(steps, {
    interval: interval
  });
  return new Promise$1(function (resolve, reject) {
    sequence.on('success', function () {
      resolve(sequence.results);
      sequence.stop();
    });
    sequence.on('end', function () {
      reject(sequence.results);
    });
  });
};

Sequence.Error =
/*#__PURE__*/
function () {
  function _class(options) {
    _classCallCheck(this, _class);

    Object.assign(this, options);
  }

  return _class;
}();

var EventEmitter$1 =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.__listeners = {};
  }

  _createClass(EventEmitter, [{
    key: "alias",
    value: function alias(name, to) {
      this[name] = this[to].bind(this);
    }
  }, {
    key: "on",
    value: function on(evt, handler) {
      var listeners = this.__listeners;
      listeners[evt] ? listeners[evt].push(handler) : listeners[evt] = [handler];
      return this;
    }
  }, {
    key: "once",
    value: function once(evt, handler) {
      var _this = this;

      var _handler = function _handler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(_this, args);

        _this.removeListener(evt, _handler);
      };

      return this.on(evt, _handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(evt, handler) {
      var listeners = this.__listeners,
          handlers = listeners[evt];

      if (!handlers || !handlers.length) {
        return this;
      }

      for (var i = 0; i < handlers.length; i += 1) {
        handlers[i] === handler && (handlers[i] = null);
      }

      setTimeout(function () {
        for (var _i = 0; _i < handlers.length; _i += 1) {
          handlers[_i] || handlers.splice(_i--, 1);
        }
      }, 0);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(evt) {
      var handlers = this.__listeners[evt];

      if (handlers) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        for (var i = 0, l = handlers.length; i < l; i += 1) {
          var _handlers$i;

          handlers[i] && (_handlers$i = handlers[i]).call.apply(_handlers$i, [this].concat(args));
        }

        return true;
      }

      return false;
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(rule) {
      var checker;

      if (isString(rule)) {
        checker = function checker(name) {
          return rule === name;
        };
      } else if (isFunction(rule)) {
        checker = rule;
      } else if (regexp(rule)) {
        checker = function checker(name) {
          rule.lastIndex = 0;
          return rule.test(name);
        };
      }

      var listeners = this.__listeners;

      for (var attr in listeners) {
        if (checker(attr)) {
          listeners[attr] = null;
          delete listeners[attr];
        }
      }
    }
  }]);

  return EventEmitter;
}();

var Resource =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Resource, _EventEmitter);

  function Resource(resource) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Resource);

    _this = _possibleConstructorReturn(this, (Resource.__proto__ || Object.getPrototypeOf(Resource)).call(this));
    if (resource instanceof Resource) return _possibleConstructorReturn(_this, resource);
    _this.desc = null;
    _this.async = false;
    Object.assign(_assertThisInitialized(_this), options);
    _this.resource = resource;
    _this.response = null;
    _this.error = false;
    _this.status = 'loading';
    _this.__ready = new Promise$1(function (resolve, reject) {
      if (isFunction(resource.$ready)) {
        resource.$ready(resolve);
      } else if (isPromise(resource)) {
        resource.then(function (res) {
          resolve(_this.response = res);
        }).catch(function (reason) {
          reject(reason);
        });
      } else {
        resolve(resource);
      }
    }).then(function (res) {
      _this.status = 'complete';

      _this.emit('load');

      return res;
    }).catch(function (reason) {
      _this.status = 'error';
      _this.error = reason;

      _this.emit('error');
    });
    return _this;
  }

  _createClass(Resource, [{
    key: "ready",
    value: function ready(f) {
      var _this2 = this;

      return f ? this.__ready.then(function () {
        return f.call(_this2);
      }) : this.__ready;
    }
  }]);

  return Resource;
}(EventEmitter$1);

var Error$1 =
/*#__PURE__*/
function (_window$Error) {
  _inherits(Error, _window$Error);

  function Error(message) {
    var _this;

    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Error);

    _this = _possibleConstructorReturn(this, (Error.__proto__ || Object.getPrototypeOf(Error)).call(this, message));

    if (message instanceof Error) {
      Object.assign(message, init);
      return _possibleConstructorReturn(_this, message);
    }

    if (message instanceof window.Error) {
      var error = new Error(message.message, init);
      error.stack = message.stack;
      error.fileName = message.fileName;
      error.lineNumber = message.lineNumber;
      error.columnNumber = message.columnNumber;
      return _possibleConstructorReturn(_this, error);
    }

    if (window.Error.captureStackTrace) {
      window.Error.captureStackTrace(_assertThisInitialized(_this), Error);
    }

    _this.name = 'JauntyError';
    Object.assign(_assertThisInitialized(_this), init);
    return _this;
  }

  return Error;
}(window.Error);

var aliases = ['alias', 'on', 'once', 'removeListener', 'emit', 'removeAllListeners'];

var Base =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Base, _EventEmitter);

  function Base() {
    var _this2;

    var _this;

    _classCallCheck(this, Base);

    _this = _possibleConstructorReturn(this, (Base.__proto__ || Object.getPrototypeOf(Base)).call(this));

    for (var _i = 0; _i < aliases.length; _i++) {
      var alias = aliases[_i];

      _this.alias('$' + alias, alias);
    }

    _this.$status = 'created';
    _this.__ready = new Promise$1(function (r) {
      return _this.__resolve = r;
    });
    Promise$1.resolve((_this2 = _this).__preinit.apply(_this2, arguments)).then(function () {
      _this.__construct();
    });
    return _this;
  }

  _createClass(Base, [{
    key: "__construct",
    value: function __construct() {
      var _this3 = this;

      this.__resources = [];
      var resources = [];
      return Sequence.all([function () {
        return _this3.__init();
      }, function () {
        var list = [];
        var properties = Object.getOwnPropertyNames(Object.getPrototypeOf(_this3));
        properties.push.apply(properties, _toConsumableArray(Object.keys(_this3)));
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _property = _step.value;

            if (/^__init[A-Z].*/.test(_property) && isFunction(_this3[_property])) {
              list.push(_this3[_property]());
            }
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

        return Promise$1.all(list);
      }, function () {
        return isFunction(_this3.init) ? _this3.init() : true;
      }, function () {
        var list = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this3.__resources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _resource = _step2.value;
            resources.push(_resource.ready());
            _resource.async || list.push(_resource.ready());
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

        return Promise$1.all(list);
      }]).catch(function (results) {
        var reason = results[results.length - 1].reason;

        _this3.__setStatus('error', reason);

        throw new Error$1('Failed while initializing.', {
          reason: reason
        });
      }).then(function () {
        _this3.__setStatus('ready');

        _this3.__resolve();

        isFunction(_this3.action) && _this3.action();
      }).then(function () {
        Promise$1.all(resources).then(function () {
          return _this3.__setStatus('loaded');
        });
      });
    }
  }, {
    key: "__preinit",
    value: function __preinit() {}
  }, {
    key: "__init",
    value: function __init() {}
  }, {
    key: "__setStatus",
    value: function __setStatus(status, data) {
      this.$status = status;
      this.$emit(status, data);
    }
  }, {
    key: "$ready",
    value: function $ready(f) {
      var _this4 = this;

      return f ? this.__ready.then(function () {
        return f.call(_this4, _this4);
      }) : this.__ready;
    }
  }, {
    key: "$resource",
    value: function $resource(resource) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!resource) return this.__resources;
      resource = new Resource(resource, options);

      this.__resources.push(resource);

      return resource;
    }
  }, {
    key: "$reload",
    value: function $reload() {
      return this.__construct();
    }
  }]);

  return Base;
}(EventEmitter);

var id = 0;

var Extension =
/*#__PURE__*/
function (_Base) {
  _inherits(Extension, _Base);

  function Extension(init) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Extension);

    return _possibleConstructorReturn(this, (Extension.__proto__ || Object.getPrototypeOf(Extension)).call(this, init, config));
  }

  _createClass(Extension, [{
    key: "__preinit",
    value: function __preinit(init, config) {
      var _this = this;

      Object.assign(this, init || {});
      this.__id = id++;
      this.$name = config.name || '';
      this.$type = config.type || '';
      this.$package = config.package || null;

      if (this.$package) {
        this.$package.on('destruct', function () {
          isFunction(_this.$destruct) && _this.$destruct();
        });
      }
    }
  }, {
    key: "$signal",
    value: function $signal(signal, params) {
      if (!this.$package) {
        console.error();
      }

      this.$package.signal(params);
    }
  }, {
    key: "$mount",
    value: function $mount(name) {
      var _$package;

      if (this.$package) {
        console.error();
      }

      if (!name) {
        name = "#anonymous-".concat(this.$type || 'extension', "-mount-").concat(id++, "-id++");
      }

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_$package = this.$package).$mount.apply(_$package, [name].concat(args));
    }
  }]);

  return Extension;
}(Base);

var isNumber = (function (n) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if ({}.toString.call(n).toLowerCase() === '[object number]') {
    return true;
  }

  if (strict) return false;
  return !isNaN(parseFloat(n)) && isFinite(n) && !/\.$/.test(n);
});

var integer = (function (n) {
  var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (isNumber(n, true)) return n % 1 === 0;
  if (strict) return false;

  if (isString(n)) {
    if (n === '-0') return true;
    return n.indexOf('.') < 0 && String(parseInt(n)) === n;
  }

  return false;
});

var EventEmitter$2 =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this.__listeners = new Map();
  }

  _createClass(EventEmitter, [{
    key: "alias",
    value: function alias(name, to) {
      this[name] = this[to].bind(this);
    }
  }, {
    key: "on",
    value: function on(evt, handler) {
      var listeners = this.__listeners;
      var handlers = listeners.get(evt);

      if (!handlers) {
        handlers = new Set();
        listeners.set(evt, handlers);
      }

      handlers.add(handler);
      return this;
    }
  }, {
    key: "once",
    value: function once(evt, handler) {
      var _this = this;

      var _handler = function _handler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        handler.apply(_this, args);

        _this.removeListener(evt, _handler);
      };

      return this.on(evt, _handler);
    }
  }, {
    key: "removeListener",
    value: function removeListener(evt, handler) {
      var listeners = this.__listeners;
      var handlers = listeners.get(evt);
      handlers && handlers.delete(handler);
      return this;
    }
  }, {
    key: "emit",
    value: function emit(evt) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var handlers = this.__listeners.get(evt);

      if (!handlers) return false;
      handlers.forEach(function (handler) {
        return handler.call.apply(handler, [_this2].concat(args));
      });
    }
  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(rule) {
      var checker;

      if (isString(rule)) {
        checker = function checker(name) {
          return rule === name;
        };
      } else if (isFunction(rule)) {
        checker = rule;
      } else if (regexp(rule)) {
        checker = function checker(name) {
          rule.lastIndex = 0;
          return rule.test(name);
        };
      }

      var listeners = this.__listeners;
      listeners.forEach(function (value, key) {
        checker(key) && listeners.delete(key);
      });
      return this;
    }
  }]);

  return EventEmitter;
}();

var eventcenter = new EventEmitter$2();
var collector = {
  records: [],
  collecting: false,
  start: function start() {
    this.records = [];
    this.collecting = true;
  },
  stop: function stop() {
    this.collecting = false;
    return this.records;
  },
  add: function add(data) {
    this.collecting && this.records.push(data);
  }
};
function isSubset(obj, container) {
  if (!obj || _typeof(obj) !== 'object') return false;

  for (var prop in container) {
    var item = container[prop];

    if (item === obj) {
      return true;
    }

    if (item && _typeof(item) === 'object') {
      var res = isSubset(obj, item);

      if (res) {
        return true;
      }
    }
  }

  return false;
}

var ec = new EventEmitter$2();
/**
 * caches for storing expressions.
 * Map( {
 *      expression : fn
 * } )
 */

var caches = new Map();
/**
 * for storing the old values of each expression.
 * Map( {
 *      observer : Map( {
 *          expression/function : value
 *      } )
 * } )
 */

var values = new Map();
/**
 * a Set for storing all callback functions
 */

var callbacks = new Set();
/**
 * a map for storing the relations between observers, expressions, setters, handlers and callbacks.
 * Map( {
 *      observer : Map( {
 *          expression/function : Map( {
 *              handler : [ { setter, callback } ]
 *          } )
 *      } )
 * } );
 */

var handlers = new Map();
/**
 * To do some preparations while adding a new observer.
 */

eventcenter.on('add-observer', function (observer) {
  if (!values.get(observer)) {
    values.set(observer, new Map());
  }

  if (!handlers.get(observer)) {
    handlers.set(observer, new Map());
  }
});
/**
 * Processes after deleting an observer.
 */

eventcenter.on('destroy-observer', function (observer) {
  var map = handlers.get(observer);
  map.forEach(function (hmap) {
    hmap.forEach(function (value) {
      if (!value.length) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _item = _step.value;
          ec.removeListener(_item.setter, _item.callback);
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

      callbacks.delete(value[0].callback);
    });
  });
  handlers.set(observer, new Map());
  values.set(observer, new Map());
});
/**
 * while setting new data into an object in an observer, or deleting properties of objects in observers,
 * all callback function should be executed again to check if the changes would effect any expressions.
 */

eventcenter.on('set-value', function () {
  callbacks.forEach(function (cb) {
    return cb();
  });
});
/**
 * to delete relevent data of a setter of an observer, for releasing useless memory.
 */

var deleteSetterFromObserver = function deleteSetterFromObserver(observer, setter) {
  var ob = handlers.get(observer);
  if (!ob) return;
  ob.forEach(function (val) {
    val.forEach(function (value) {
      for (var i = 0, l = value.length; i < l; i += 1) {
        var item = value[i];

        if (item.setter === setter) {
          ec.removeListener(setter, item.callback);
          callbacks.delete(item.callback);
          value.splice(i--, 1);
          l--;
        }
      }
    });
  });
};
/**
 * to remove useless listeners for release memory.
 */


var gc = function gc(obj, keys) {
  if (!obj || _typeof(obj) !== 'object') return;
  handlers.forEach(function (v, observer) {
    if (isSubset(obj, observer)) return;

    if (!keys) {
      keys = Object.keys(obj);
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _key = _step2.value;
        var descriptor = Object.getOwnPropertyDescriptor(obj, _key);
        var setter = descriptor && descriptor.set;
        if (!setter) continue;
        deleteSetterFromObserver(observer, setter);
        var item = obj[_key];

        if (item && _typeof(item) === 'object') {
          gc(item);
        }
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

eventcenter.on('overwrite-object', function (val, old) {
  gc(old);
});
eventcenter.on('delete-property', function (deleted, setter) {
  callbacks.forEach(function (cb) {
    return cb();
  });
  setter && handlers.forEach(function (v, observer) {
    deleteSetterFromObserver(observer, setter);
  });
  gc(deleted);
});
/**
 * @function expression
 * To convert the expression to a function.
 *
 * @param {Function|String} exp
 */

function expression(exp) {
  return new Function('s', 'try{with(s)return ' + exp + '}catch(e){return null}');
}
/**
 * @function setValue
 * To store a new value for an expression of an observer and to return the old value
 *
 * @param {Observer} observer
 * @param {Function|String} exp
 * @param {*} value
 */


function setValue(observer, exp, value) {
  var oldvalue;
  var map = values.get(observer);
  oldvalue = map.get(exp);

  if (value !== oldvalue) {
    map.set(exp, value);
  }

  return oldvalue;
}

function setHandler(observer, exp, handler, setter, callback) {
  var expressions = handlers.get(observer);
  var map = expressions.get(exp);

  if (!map) {
    map = new Map();
    map.set(handler, [{
      setter: setter,
      callback: callback
    }]);
    expressions.set(exp, map);
    return;
  }

  var list = map.get(handler);

  if (!list) {
    map.set(handler, [{
      setter: setter,
      callback: callback
    }]);
  }

  var exists = false;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _item2 = _step3.value;

      if (_item2.setter === setter && _item2.callback === callback) {
        exists = true;
        break;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  if (!exists) {
    list.push({
      setter: setter,
      callback: callback
    });
  }
}
/**
 * @function watch
 * To watch changes of an expression or a function of an observer.
 */


function watch(observer, exp, handler) {
  var _cb2, setters, fn;

  if (isFunction(exp)) {
    fn = exp;

    _cb2 = function cb() {
      collector.start();
      var value = fn(observer);
      var setters = collector.stop();
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = setters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _setter = _step4.value;
          ec.on(_setter, _cb2);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (isPromise(value)) {
        value.then(function (val) {
          var oldvalue = setValue(observer, fn, val);

          if (oldvalue !== val) {
            handler(val, oldvalue, observer);
          }
        });
      } else {
        var oldvalue = setValue(observer, fn, value);

        if (oldvalue !== value) {
          handler(value, oldvalue, observer);
        }
      }
    };
  } else {
    fn = caches.get(exp);

    if (!fn) {
      fn = expression(exp);
      caches.set(exp, fn);
    }

    _cb2 = function _cb() {
      var value;
      collector.start();
      value = fn(observer);
      var setters = collector.stop();
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = setters[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _setter2 = _step5.value;
          ec.on(_setter2, _cb2);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      var oldvalue = setValue(observer, exp, value);

      if (oldvalue !== value) {
        handler(value, oldvalue, observer, exp);
      }
    };
  }

  collector.start();
  var value = fn(observer);
  setters = collector.stop();

  if (isPromise(value)) {
    value.then(function (val) {
      return setValue(observer, exp, val);
    });
  } else {
    setValue(observer, exp, value);
  }
  /**
   * add the callback function to callbacks map, so that while changing data with Observer.set or Observer.delete all the callback functions should be executed.
   */


  callbacks.add(_cb2);
  /**
   * while start to watch a non-exists path in an observer,
   * no setters would be collected by collector, and it would make an lonely callback function in callbacks map
   * which cannot be found by handler, so, it cannot be removed while calling Observer.unwatch.
   * To add a handler with its setter is null can resolve this issue.
   */

  setHandler(observer, exp, handler, null, _cb2);
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = setters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var _setter3 = _step6.value;
      ec.on(_setter3, _cb2);
      setHandler(observer, exp, handler, _setter3, _cb2);
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}

function unwatch(observer, exp, handler) {
  var map = handlers.get(observer);
  if (!map) return;
  map = map.get(exp);
  if (!map) return;
  var list = map.get(handler);
  if (!list) return;
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = list[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var _item3 = _step7.value;
      ec.removeListener(_item3.setter, _item3.callback);
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  map.delete(handler);
  callbacks.delete(list[0].callback);
}

function calc(observer, exp) {
  return expression(exp)(observer);
}

/** 
 * @file to convert an object to an observer instance.
 */

var getKeys = Object.keys;
var isArray = Array.isArray;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var defineProperty = Object.defineProperty;
var setPrototypeOf = Object.setPrototypeOf;
var proto = Array.prototype;
var arrMethods = Object.create(proto);
/**
 * methods which would mutate the array on which it is called.
 *
 * Array.prototype.fill
 * Array.prototype.push
 * Array.prototype.pop
 * Array.prototype.shift
 * Array.prototype.unshift
 * Array.prototype.splice
 * Array.prototype.sort
 * Array.prototype.reverse
 */

['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill'].forEach(function (method) {
  var original = proto[method];
  defineProperty(arrMethods, method, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: function value() {
      var args = Array.prototype.slice.call(arguments);
      var result = original.apply(this, args);
      var inserted, deleted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          deleted = result;
          break;

        case 'fill':
          inserted = args[0];
          break;

        case 'pop':
        case 'shift':
          deleted = [result];
          break;
      }

      if (deleted) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = deleted[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _item = _step.value;

            if (_item && _typeof(_item) === 'object') {
              eventcenter.emit('delete-property', _item);
            }
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
      }

      if (inserted) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = inserted[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _item3 = _step2.value;

            if (_item3 && _typeof(_item3) === 'object') {
              traverse(_item3);
            }
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
      }

      this.__fake_setter ? ec.emit(this.__fake_setter) : ec.emit(this.__setter);
      return result;
    }
  });
  defineProperty(arrMethods, '$set', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: function value(i, v) {
      if (i >= this.length) {
        this.length = +i + 1;
      }

      return this.splice(i, 1, v)[0];
    }
  });
  defineProperty(arrMethods, '$get', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: function value(i) {
      var setter = this.__fake_setter;
      setter && collector.add(setter);
      return this[i];
    }
  });
  defineProperty(arrMethods, '$length', {
    enumerable: false,
    writable: true,
    configurable: true,
    value: function value(i) {
      this.length = i;
      this.__fake_setter ? ec.emit(this.__fake_setter) : ec.emit(this.__setter);
    }
  });
});

function isObserverSetter(func) {
  return func.name === 'OBSERVER_SETTER' || /^function\s+OBSERVER_SETTER\(\)/.test(func.toString());
}
/**
 * @function translate
 * To translate an property of an object to GETTER and SETTER.
 *
 * @param {Object} obj The object which will be translated
 * @param {String} key The name of the property
 * @param {*} val The value of the property
 * @param {String} path The path in the observer of the property
 * @param {Observer} observer
 */


function translate(obj, key, val) {
  var descriptor = getOwnPropertyDescriptor(obj, key);
  /**
   * if the configurable of the property is false,
   * the property cannot be translated
   */

  if (descriptor && !descriptor.configurable) {
    return;
  }

  var setter = descriptor && descriptor.set;
  /**
   * The property has already transformed by Observer.
   * to add the observer and path into the map.
   */

  if (setter && isObserverSetter(setter)) {
    /**
     * while translating a property of an object multiple times with different values,
     * The same setter should be used but to set the value to the new value.
     */
    return obj[key] = val;
  }

  var getter = descriptor && descriptor.get;

  var set = function OBSERVER_SETTER(v) {
    var value = getter ? getter.call(obj) : val;
    /**
     * Setting the same value will not call the setter.
     */

    if (v === value) return;

    if (setter) {
      setter.call(obj, v);
    } else {
      val = v;
      /**
       * if the new value is an object, to set the new value with Observer.set method.
       * it should be set to all observers which are using this object.
       */

      if (v && _typeof(v) === 'object') {
        traverse(v);
      }

      if (value && _typeof(value) === 'object') {
        eventcenter.emit('overwrite-object', v, value);
      }
    }

    ec.emit(set);
  };

  var get = function OBSERVER_GETTER() {
    collector.add(set);
    return getter ? getter.call(obj) : val;
  };

  defineProperty(obj, key, {
    enumerable: descriptor ? descriptor.enumerable : true,
    configurable: true,
    set: set,
    get: get
  });

  if (isArray(val)) {
    defineProperty(val, '__setter', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: set
    });
  }
}
/**
 * @function traverse
 * To traverse and translate an object.
 *
 * @param {Object} obj
 * @param {Observer} observer
 * @param {String} base
 */


function traverse(obj) {
  var isarr = isArray(obj);

  if (isarr) {
    setPrototypeOf(obj, arrMethods);

    for (var i = 0, l = obj.length; i < l; i += 1) {
      var item = obj[i];

      if (item && _typeof(item) === 'object') {
        traverse(item);
      }
    }
  }

  var keys = getKeys(obj);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _key = _step3.value;
      var val = obj[_key]; // to skip translating the indexes of array

      if (isarr && integer(_key) && _key >= 0 && _key < obj.length) continue;
      translate(obj, _key, val);

      if (val && _typeof(val) === 'object') {
        traverse(val);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

var Observer = {
  create: function create(obj, proto) {
    if (obj.__observer) return obj;
    defineProperty(obj, '__observer', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: true
    });

    if (isArray(obj)) {
      defineProperty(obj, '__fake_setter', {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function OBSERVER_SETTER() {}
      });
    }

    traverse(obj);

    if (proto) {
      setPrototypeOf(obj, proto);
    }

    eventcenter.emit('add-observer', obj);
    return obj;
  },

  /**
   * @method set
   * To set a new property to an object
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} value
   */
  set: function set(obj, key, value) {
    /**
     * if the object is an array and the key is a integer, set the value with [].$set
     */
    if (isArray(obj) && integer(key, true)) {
      return obj.$set(key, value);
    }

    var old = obj[key];

    if (old && _typeof(old) === 'object') {
      ec.emit('overwrite-object', value, old);
    }

    var isobj = value && _typeof(value) === 'object';
    /**
     * to add the property to the specified object and to translate it to the format of observer.
     */

    translate(obj, key, value);
    /**
     * if the value is an object, to traverse the object with all paths in all observers
     */

    if (isobj) {
      traverse(value);
    }

    eventcenter.emit('set-value', obj, key, value, old);
  },

  /**
   * @function delete
   * To delete an property from
   *
   * - delete all relevant data, storing in each map, for both the specified property and its sub/descandant object.
   * -
   */
  delete: function _delete(obj, key) {
    var old = obj[key];
    var descriptor = Object.getOwnPropertyDescriptor(obj, key);
    var setter = descriptor && descriptor.set;
    delete obj[key];
    eventcenter.emit('delete-property', old, setter);
  },

  /**
   * @function translated 
   * to check if the property in the object has been translated to observer setter and getter
   *
   * @param {Object|Array} obj
   * @param {String|Integer} key The property name
   *
   */
  translated: function translated(obj, key) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (descriptor && !descriptor.configurable) {
      return false;
    }

    var setter = descriptor && descriptor.set;
    return !!(setter && isObserverSetter(setter));
  },
  is: function is(observer) {
    return observer.__observer || false;
  },
  watch: function watch$$1(observer, exp, handler) {
    watch(observer, exp, handler);
  },
  unwatch: function unwatch$$1(observer, exp, handler) {
    unwatch(observer, exp, handler);
  },
  calc: function calc$$1(observer, exp) {
    return calc(observer, exp);
  },
  replace: function replace(observer, data) {
    var _arr = Object.keys(observer);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];

      if (!data.hasOwnProperty(key)) {
        Observer.delete(observer, key);
      }
    }

    var _arr2 = Object.keys(data);

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
      var _key2 = _arr2[_i2];

      if (observer.hasOwnProperty(_key2)) {
        observer[_key2] = data[_key2];
      } else {
        Observer.set(observer, _key2, data[_key2]);
      }
    }

    return observer;
  },
  destroy: function destroy(observer) {
    eventcenter.emit('destroy-observer', observer);
  }
};

var url = (function (url) {
  if (!isString(url)) return false;
  if (!/^(https?|ftp):\/\//i.test(url)) return false;
  var a = document.createElement('a');
  a.href = url;
  return /^(https?|ftp):/i.test(a.protocol);
});

function supportIterator() {
  try {
    return !!Symbol.iterator;
  } catch (e) {
    return false;
  }
}

var decode = function decode(str) {
  return decodeURIComponent(String(str).replace(/\+/g, ' '));
};

var URLSearchParams =
/*#__PURE__*/
function () {
  function URLSearchParams(init) {
    _classCallCheck(this, URLSearchParams);

    if (window.URLSearchParams) {
      return new window.URLSearchParams(init);
    } else {
      this.dict = [];
      if (!init) return;

      if (URLSearchParams.prototype.isPrototypeOf(init)) {
        return new URLSearchParams(init.toString());
      }

      if (Array.isArray(init)) {
        throw new TypeError('Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.');
      }

      if (typeof init === 'string') {
        if (init.charAt(0) === '?') {
          init = init.slice(1);
        }

        var pairs = init.split(/&+/);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _item = _step.value;

            var index = _item.indexOf('=');

            this.append(index > -1 ? _item.slice(0, index) : _item, index > -1 ? _item.slice(index + 1) : '');
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

        return;
      }

      for (var attr in init) {
        this.append(attr, init[attr]);
      }
    }
  }

  _createClass(URLSearchParams, [{
    key: "append",
    value: function append(name, value) {
      this.dict.push([decode(name), decode(value)]);
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var dict = this.dict;

      for (var i = 0, l = dict.length; i < l; i += 1) {
        if (dict[i][0] == name) {
          dict.splice(i, 1);
          i--;
          l--;
        }
      }
    }
  }, {
    key: "get",
    value: function get(name) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.dict[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item2 = _step2.value;

          if (_item2[0] == name) {
            return _item2[1];
          }
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

      return null;
    }
  }, {
    key: "getAll",
    value: function getAll(name) {
      var res = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.dict[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _item3 = _step3.value;

          if (_item3[0] == name) {
            res.push(_item3[1]);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return res;
    }
  }, {
    key: "has",
    value: function has(name) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this.dict[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _item4 = _step4.value;

          if (_item4[0] == name) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return false;
    }
  }, {
    key: "set",
    value: function set(name, value) {
      var set = false;

      for (var i = 0, l = this.dict.length; i < l; i += 1) {
        var item = this.dict[i];

        if (item[0] == name) {
          if (set) {
            this.dict.splice(i, 1);
            i--;
            l--;
          } else {
            item[1] = String(value);
            set = true;
          }
        }
      }
    }
  }, {
    key: "sort",
    value: function sort() {
      this.dict.sort(function (a, b) {
        var nameA = a[0].toLowerCase();
        var nameB = b[0].toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }
  }, {
    key: "entries",
    value: function entries() {
      var dict = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.dict[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _item5 = _step5.value;
          dict.push([_item5[0], _item5[1]]);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return !supportIterator() ? dict : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = dict.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "keys",
    value: function keys() {
      var keys = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.dict[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _item6 = _step6.value;
          keys.push(_item6[0]);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return !supportIterator() ? keys : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = keys.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "values",
    value: function values() {
      var values = [];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.dict[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _item7 = _step7.value;
          values.push(_item7[1]);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      return !supportIterator() ? values : _defineProperty({}, Symbol.iterator, function () {
        return {
          next: function next() {
            var value = values.shift();
            return {
              done: value === undefined,
              value: value
            };
          }
        };
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      var pairs = [];
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.dict[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var _item8 = _step8.value;
          pairs.push(encodeURIComponent(_item8[0]) + '=' + encodeURIComponent(_item8[1]));
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return pairs.join('&');
    }
  }]);

  return URLSearchParams;
}();

var attrs = ['href', 'origin', 'host', 'hash', 'hostname', 'pathname', 'port', 'protocol', 'search', 'username', 'password', 'searchParams'];

var URL$1 =
/*#__PURE__*/
function () {
  function URL(path, base) {
    _classCallCheck(this, URL);

    if (window.URL) {
      var url$$1 = new window.URL(path, base);

      if (!('searchParams' in url$$1)) {
        url$$1.searchParams = new URLSearchParams(url$$1.search);
      }

      return url$$1;
    } else {
      if (URL.prototype.isPrototypeOf(path)) {
        return new URL(path.href);
      }

      if (URL.prototype.isPrototypeOf(base)) {
        return new URL(path, base.href);
      }

      path = String(path);

      if (base !== undefined) {
        if (!url(base)) {
          throw new TypeError('Failed to construct "URL": Invalid base URL');
        }

        if (/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
          base = null;
        }
      } else {
        if (!/^[a-zA-Z][0-9a-zA-Z.-]*:/.test(path)) {
          throw new TypeError('Failed to construct "URL": Invalid URL');
        }
      }

      if (base) {
        base = new URL(base);

        if (path.charAt(0) === '/' && path.charAt(1) === '/') {
          path = base.protocol + path;
        } else if (path.charAt(0) === '/') {
          path = base.origin + path;
        } else {
          var pathname = base.pathname;

          if (pathname.charAt(pathname.length - 1) === '/') {
            path = base.origin + pathname + path;
          } else {
            path = base.origin + pathname.replace(/\/[^/]+\/?$/, '') + '/' + path;
          }
        }
      }

      var dotdot = /([^/])\/[^/]+\/\.\.\//;
      var dot = /\/\.\//g;
      path = path.replace(dot, '/');

      while (path.match(dotdot)) {
        path = path.replace(dotdot, '$1/');
      }

      var node = document.createElement('a');
      node.href = path;

      for (var _i = 0; _i < attrs.length; _i++) {
        var attr = attrs[_i];
        this[attr] = attr in node ? node[attr] : '';
      }

      this.searchParams = new URLSearchParams(this.search);
    }
  }

  _createClass(URL, [{
    key: "toString",
    value: function toString() {
      return this.href;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.href;
    }
  }]);

  return URL;
}();

var id$1 = 0;
var prefix = 'biu_jsonp_callback_' + +new Date() + '_' + Math.random().toString().substr(2);

function createScriptTag(src, id) {
  var target = document.getElementsByTagName('script')[0] || document.head.firstChild;
  var script = document.createElement('script');
  script.src = src;
  script.id = id;
  return target.parentNode.insertBefore(script, target);
}

function jsonp(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var params = options.data || {};
  var callback = prefix + '_' + id$1++;
  var r1, r2;
  var promise = new Promise$1(function (resolve, reject) {
    r1 = resolve;
    r2 = reject;
  });
  params.callback || (params.callback = callback);
  var querystring = new URLSearchParams(params).toString();
  url += (url.indexOf('?') >= 0 ? '&' : '?') + querystring;

  window[params.callback] = function (response) {
    r1(response);
    window[params.callback] = null;
    delete window[params.callback];
    var script = document.getElementById(params.callback);
    script && script.parentNode.removeChild(script);
  };

  var script = createScriptTag(url, params.callback);
  script.addEventListener('error', function (e) {
    r2(e);
  });
  return promise;
}

function isURLSearchParams(obj) {
  if (window.URLSearchParams.prototype.isPrototypeOf(obj)) return true;
  return URLSearchParams.prototype.isPrototypeOf(obj);
}

function mergeParams(dest, src) {
  if (!isURLSearchParams(dest)) {
    dest = new URLSearchParams(dest);
  }

  if (!src) return dest;

  if (isURLSearchParams(src)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = src.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;
        dest.append(_item[0], _item[1]);
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
  } else {
    var keys = Object.keys(src);

    for (var _i = 0; _i < keys.length; _i++) {
      var _item2 = keys[_i];
      dest.append(_item2, src[_item2]);
    }
  }

  return dest;
}

var isArguments = (function (obj) {
  return {}.toString.call(obj) === '[object Arguments]';
});

var isArray$1 = (function (obj) {
  return Array.isArray(obj);
});

var arrowFunction = (function (fn) {
  if (!isFunction(fn)) return false;
  return /^(?:function)?\s*\(?[\w\s,]*\)?\s*=>/.test(fn.toString());
});

var isBoolean = (function (s) {
  return typeof s === 'boolean';
});

var isDate = (function (date) {
  return {}.toString.call(date) === '[object Date]';
});

var email = (function (str) {
  return /^(([^#$%&*!+-/=?^`{|}~<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(str);
});

var isObject = (function (obj) {
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj);
});

var empty = (function (obj) {
  if (isArray$1(obj) || isString(obj)) {
    return !obj.length;
  }

  if (isObject(obj)) {
    return !Object.keys(obj).length;
  }

  return !obj;
});

var error = (function (e) {
  return {}.toString.call(e) === '[object Error]';
});

var isFalse = (function (obj) {
  var generalized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (isBoolean(obj) || !generalized) return !obj;

  if (isString(obj)) {
    return ['false', 'no', '0', '', 'nay', 'n', 'disagree'].indexOf(obj.toLowerCase()) > -1;
  }

  return !obj;
});

var iterable = (function (obj) {
  try {
    return isFunction(obj[Symbol.iterator]);
  } catch (e) {
    return false;
  }
});

// https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/test/data/jquery-1.9.1.js#L480
var plainObject = (function (obj) {
  if (!isObject(obj)) {
    return false;
  }

  try {
    if (obj.constructor && !{}.hasOwnProperty.call(obj, 'constructor') && !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
  } catch (e) {
    return false;
  }

  var key;

  for (key in obj) {} // eslint-disable-line


  return key === undefined || {}.hasOwnProperty.call(obj, key);
});

var isTrue = (function (obj) {
  var generalized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (isBoolean(obj) || !generalized) return !!obj;

  if (isString(obj)) {
    return ['true', 'yes', 'ok', '1', 'yea', 'yep', 'y', 'agree'].indexOf(obj.toLowerCase()) > -1;
  }

  return !!obj;
});

var node = (function (s) {
  return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === 'object' ? s instanceof Node : s && _typeof(s) === 'object' && typeof s.nodeType === 'number' && typeof s.nodeName === 'string';
});

var textNode = (function (node$$1) {
  return node(node$$1) && node$$1.nodeType === 3;
});

var elementNode = (function (node$$1) {
  return node(node$$1) && node$$1.nodeType === 1;
});

var isWindow = (function (obj) {
  return obj && obj === obj.window;
});

var is = {
  arguments: isArguments,
  array: isArray$1,
  arrowFunction: arrowFunction,
  asyncFunction: asyncFunction,
  boolean: isBoolean,
  date: isDate,
  email: email,
  empty: empty,
  error: error,
  false: isFalse,
  function: isFunction,
  integer: integer,
  iterable: iterable,
  number: isNumber,
  object: isObject,
  plainObject: plainObject,
  promise: isPromise,
  regexp: regexp,
  string: isString,
  true: isTrue,
  undefined: isUndefined,
  url: url,
  node: node,
  textNode: textNode,
  elementNode: elementNode,
  window: isWindow
};

var Response =
/*#__PURE__*/
function () {
  function Response(_ref) {
    var _ref$status = _ref.status,
        status = _ref$status === void 0 ? 200 : _ref$status,
        _ref$statusText = _ref.statusText,
        statusText = _ref$statusText === void 0 ? 'OK' : _ref$statusText,
        _ref$url = _ref.url,
        url = _ref$url === void 0 ? '' : _ref$url,
        _ref$body = _ref.body,
        body = _ref$body === void 0 ? null : _ref$body,
        _ref$headers = _ref.headers,
        headers = _ref$headers === void 0 ? {} : _ref$headers;

    _classCallCheck(this, Response);

    if (!is.string(body)) {
      return new TypeError('Response body must be a string "' + body + '"');
    }

    Object.assign(this, {
      body: body,
      status: status,
      statusText: statusText,
      url: url,
      headers: headers,
      ok: status >= 200 && status < 300 || status === 304
    });
  }

  _createClass(Response, [{
    key: "text",
    value: function text() {
      return Promise.resolve(this.body);
    }
  }, {
    key: "json",
    value: function json() {
      try {
        var json = JSON.parse(this.body);
        return Promise.resolve(json);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }, {
    key: "uncompress",
    value: function uncompress() {}
  }, {
    key: "compress",
    value: function compress() {}
  }]);

  return Response;
}();

var ajax = (function (url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var data = options.data,
      params = options.params,
      timeout = options.timeout,
      _options$asynchronous = options.asynchronous,
      asynchronous = _options$asynchronous === void 0 ? true : _options$asynchronous,
      _options$method = options.method,
      method = _options$method === void 0 ? 'GET' : _options$method,
      _options$headers = options.headers,
      headers = _options$headers === void 0 ? {} : _options$headers,
      onprogress = options.onprogress,
      _options$credentials = options.credentials,
      credentials = _options$credentials === void 0 ? 'omit' : _options$credentials,
      _options$responseType = options.responseType,
      responseType = _options$responseType === void 0 ? 'text' : _options$responseType,
      _options$xhr = options.xhr,
      xhr = _options$xhr === void 0 ? new XMLHttpRequest() : _options$xhr;
  method = method.toUpperCase();
  xhr.timeout = timeout;
  return new Promise$1(function (resolve, reject) {
    xhr.withCredentials = credentials === 'include';

    var onreadystatechange = function onreadystatechange() {
      if (xhr.readyState != 4) return;
      if (xhr.status === 0) return;
      var response = new Response({
        body: responseType !== 'text' ? xhr.response : xhr.responseText,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders()
      });
      resolve(response);
      xhr = null;
    };

    url = new URL$1(url, location.href);
    mergeParams(url.searchParams, params);
    xhr.open(method, url.href, asynchronous);

    xhr.onerror = function (e) {
      reject(e);
      xhr = null;
    };

    xhr.ontimeout = function () {
      reject('Timeout');
      xhr = null;
    };

    if (isFunction(onprogress)) {
      xhr.onprogress = onprogress;
    }

    var isFormData = FormData.prototype.isPrototypeOf(data);

    for (var key in headers) {
      if ((isUndefined(data) || isFormData) && key.toLowerCase() === 'content-type') {
        // if the data is undefined or it is an instance of FormData
        // let the client to set "Content-Type" in header
        continue;
      }

      xhr.setRequestHeader(key, headers[key]);
    }

    asynchronous && (xhr.onreadystatechange = onreadystatechange);
    xhr.send(isUndefined(data) ? null : data);
    asynchronous || onreadystatechange();
  });
});

var md5 = (function () {
  var safe_add = function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
  };

  var bit_rol = function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  };

  var md5_cmn = function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
  };

  var md5_ff = function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn(b & c | ~b & d, a, b, x, s, t);
  };

  var md5_gg = function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn(b & d | c & ~d, a, b, x, s, t);
  };

  var md5_hh = function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  };

  var md5_ii = function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
  };
  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */


  var binl_md5 = function binl_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
    var a = 1732584193,
        b = -271733879,
        c = -1732584194,
        d = 271733878;

    for (var i = 0, l = x.length; i < l; i += 16) {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;
      a = md5_ff(a, b, c, d, x[i], 7, -680876936);
      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5_gg(b, c, d, a, x[i], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5_hh(d, a, b, c, x[i], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5_ii(a, b, c, d, x[i], 6, -198630844);
      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }

    return [a, b, c, d];
  };
  /*
   * Convert an array of little-endian words to a string
   */


  var binl2rstr = function binl2rstr(input) {
    var output = '';

    for (var i = 0, l = input.length * 32; i < l; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
    }

    return output;
  };
  /*
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */


  var rstr2binl = function rstr2binl(input) {
    var output = Array.from({
      length: input.length >> 2
    }).map(function () {
      return 0;
    });

    for (var i = 0, l = input.length; i < l * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
    }

    return output;
  };

  var rstr_md5 = function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
  };

  var str2rstr_utf8 = function str2rstr_utf8(input) {
    return window.unescape(encodeURIComponent(input));
  };

  return function (string) {
    var output = '';
    var hex_tab = '0123456789abcdef';
    var input = rstr_md5(str2rstr_utf8(string));

    for (var i = 0, l = input.length; i < l; i += 1) {
      var x = input.charCodeAt(i);
      output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }

    return output;
  };
})();

var Storage =
/*#__PURE__*/
function () {
  function Storage(name) {
    _classCallCheck(this, Storage);

    if (!name) {
      throw new TypeError("Expect a name for the storage, but a(n) ".concat(name, " is given."));
    }

    this.name = "#LC-STORAGE-V-1.0#".concat(name, "#");
    var abstracts = ['set', 'get', 'delete', 'clear', 'keys'];

    for (var _i = 0; _i < abstracts.length; _i++) {
      var method = abstracts[_i];

      if (!isFunction(this[method])) {
        throw new TypeError("The method \"".concat(method, "\" must be declared in every class extends from Cache"));
      }
    }
  }

  _createClass(Storage, [{
    key: "format",
    value: function format(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var string = true;

      if (!isString(data)) {
        string = false;
        data = JSON.stringify(data);
      }

      var input = {
        data: data,
        type: options.type || 'localcache',
        mime: options.mime || 'text/plain',
        string: string,
        priority: options.priority === undefined ? 50 : options.priority,
        ctime: options.ctime || +new Date(),
        lifetime: options.lifetime || 0
      };

      if (options.extra) {
        input.extra = JSON.stringify(options.extra);
      }

      if (options.md5) {
        input.md5 = md5(data);
      }

      if (options.cookie) {
        input.cookie = md5(document.cookie);
      }

      return input;
    }
  }, {
    key: "validate",
    value: function validate(data) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var result = true;

      if (data.lifetime) {
        if (new Date() - data.ctime >= data.lifetime) {
          result = false;
        }
      }

      if (data.cookie) {
        if (data.cookie !== md5(document.cookie)) {
          result = false;
        }
      }

      if (data.md5 && options.md5) {
        if (data.md5 !== options.md5) {
          result = false;
        }

        if (md5(data.data) !== options.md5) {
          result = false;
        }
      }

      if (options.validate) {
        return options.validate(data, result);
      }

      return result;
    }
  }, {
    key: "clean",
    value: function clean(check) {
      var _this = this;

      return this.keys().then(function (keys) {
        var steps = [];

        var _loop = function _loop(key) {
          steps.push(function () {
            return _this.get(key).then(function (data) {
              if (check(data, key) === true) {
                return _this.delete(key);
              }
            });
          });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            _loop(key);
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

        return Sequence.chain(steps).then(function (results) {
          var removed = [];
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = results[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _result = _step2.value;

              if (_result.status === Sequence.FAILED) {
                removed.push(keys[_result.index]);
              }
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

          return removed;
        });
      });
    }
  }, {
    key: "output",
    value: function output(data, storage) {
      if (!storage) {
        console.error('Storage type is required.');
      }

      if (!data.string) {
        data.data = JSON.parse(data.data);
      }

      if (data.extra) {
        data.extra = JSON.parse(data.extra);
      }

      data.storage = storage;
      return data;
    }
  }]);

  return Storage;
}();

var Memory =
/*#__PURE__*/
function (_Storage) {
  _inherits(Memory, _Storage);

  function Memory(name) {
    var _this;

    _classCallCheck(this, Memory);

    _this = _possibleConstructorReturn(this, (Memory.__proto__ || Object.getPrototypeOf(Memory)).call(this, name));
    _this.data = {};
    return _this;
  }

  _createClass(Memory, [{
    key: "set",
    value: function set(key, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);
      this.data[key] = data;
      return Promise$1.resolve(data);
    }
  }, {
    key: "get",
    value: function get(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data = this.data[key];
      if (!data) return Promise$1.reject();

      if (this.validate(data, options) === false) {
        options.autodelete !== false && this.delete(key);
        return Promise$1.reject();
      }

      return Promise$1.resolve(this.output(data, 'page'));
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      this.data[key] = null;
      delete this.data[key];
      return Promise$1.resolve();
    }
  }, {
    key: "keys",
    value: function keys() {
      return Promise$1.resolve(Object.keys(this.data));
    }
  }, {
    key: "clear",
    value: function clear() {
      this.data = {};
      return Promise$1.resolve();
    }
  }]);

  return Memory;
}(Storage);

var SessionStorage =
/*#__PURE__*/
function (_Storage) {
  _inherits(SessionStorage, _Storage);

  function SessionStorage(name) {
    _classCallCheck(this, SessionStorage);

    return _possibleConstructorReturn(this, (SessionStorage.__proto__ || Object.getPrototypeOf(SessionStorage)).call(this, name));
  }

  _createClass(SessionStorage, [{
    key: "set",
    value: function set(key, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);

      try {
        sessionStorage.setItem(this.name + key, JSON.stringify(data));
        return Promise$1.resolve(data);
      } catch (e) {
        return Promise$1.reject(e);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var data;

      try {
        data = JSON.parse(sessionStorage.getItem(this.name + key));
        if (!data) return Promise$1.reject();

        if (this.validate(data, options) === false) {
          options.autodelete !== false && this.delete(key);
          return Promise$1.reject();
        }
      } catch (e) {
        this.delete(key);
        return Promise$1.reject();
      }

      return Promise$1.resolve(this.output(data, 'session'));
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      sessionStorage.removeItem(this.name + key);
      return Promise$1.resolve();
    }
  }, {
    key: "clear",
    value: function clear() {
      sessionStorage.clear();
      return Promise$1.resolve();
    }
  }, {
    key: "keys",
    value: function keys() {
      var keys = [];
      var name = this.name;
      var l = this.name.length;

      for (var key in sessionStorage) {
        if (key.indexOf(name)) continue;
        keys.push(key.substr(l));
      }

      return Promise$1.resolve(keys);
    }
  }]);

  return SessionStorage;
}(Storage);

var IDB =
/*#__PURE__*/
function (_Storage) {
  _inherits(IDB, _Storage);

  function IDB(name) {
    var _this;

    _classCallCheck(this, IDB);

    _this = _possibleConstructorReturn(this, (IDB.__proto__ || Object.getPrototypeOf(IDB)).call(this, name));
    _this.idb = null;
    _this.ready = _this.open().then(function () {
      _this.idb.onerror = function (e) {
        console.warn('IDB Error', e);
      };

      return _this.idb;
    });
    return _this;
  }

  _createClass(IDB, [{
    key: "open",
    value: function open() {
      var _this2 = this;

      var request = window.indexedDB.open(this.name);
      return new Promise(function (resolve, reject) {
        request.onsuccess = function (e) {
          _this2.idb = e.target.result;
          resolve(e);
        };

        request.onerror = function (e) {
          reject(e);
        };

        request.onupgradeneeded = function (e) {
          _this2.onupgradeneeded(e);
        };
      });
    }
  }, {
    key: "onupgradeneeded",
    value: function onupgradeneeded(e) {
      var os = e.target.result.createObjectStore('storage', {
        keyPath: 'key'
      });
      os.createIndex('key', 'key', {
        unique: true
      });
      os.createIndex('data', 'data', {
        unique: false
      });
      os.createIndex('type', 'type', {
        unique: false
      });
      os.createIndex('string', 'string', {
        unique: false
      });
      os.createIndex('ctime', 'ctime', {
        unique: false
      });
      os.createIndex('md5', 'md5', {
        unique: false
      });
      os.createIndex('lifetime', 'lifetime', {
        unique: false
      });
      os.createIndex('cookie', 'cookie', {
        unique: false
      });
      os.createIndex('priority', 'priority', {
        unique: false
      });
      os.createIndex('extra', 'extra', {
        unique: false
      });
      os.createIndex('mime', 'mime', {
        unique: false
      });
    }
  }, {
    key: "store",
    value: function store() {
      var write = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.idb.transaction(['storage'], write ? 'readwrite' : 'readonly').objectStore('storage');
    }
  }, {
    key: "set",
    value: function set(key, data) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      data = this.format(data, options);
      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this3.store(true); // don't manipulate the origin data


          var request = store.put(Object.assign({
            key: key
          }, data));

          request.onsuccess = function () {
            resolve(data);
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _this4 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this4.store(true);

          var request = store.delete(key);

          request.onsuccess = function () {
            resolve();
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this5.store();

          var request = store.get(key);

          request.onsuccess = function () {
            var data = request.result;

            if (!data) {
              return reject();
            }

            if (_this5.validate(data, options) === false) {
              options.autodelete !== false && _this5.delete(key);
              return reject();
            }

            delete data.key;
            resolve(_this5.output(data, 'persistent'));
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this6 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this6.store(true);

          var request = store.clear();

          request.onsuccess = function () {
            resolve();
          };

          request.onerror = function (e) {
            reject(e);
          };
        });
      });
    }
  }, {
    key: "keys",
    value: function keys() {
      var _this7 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          var store = _this7.store();

          if (store.getAllKeys) {
            var request = store.getAllKeys();

            request.onsuccess = function () {
              resolve(request.result);
            };

            request.onerror = function () {
              reject();
            };
          } else {
            try {
              var _request = store.openCursor();

              var keys = [];

              _request.onsuccess = function () {
                var cursor = _request.result;

                if (!cursor) {
                  resolve(keys);
                  return;
                }

                keys.push(cursor.key);
                cursor.continue();
              };
            } catch (e) {
              reject(e);
            }
          }
        });
      });
    }
  }]);

  return IDB;
}(Storage);

var Persistent = Storage;

if (window.indexedDB) {
  Persistent = IDB;
}

var Persistent$1 = Persistent;

/**
 * please don't change the order of items in this array.
 */

var LocalCache =
/*#__PURE__*/
function () {
  function LocalCache(name) {
    _classCallCheck(this, LocalCache);

    if (!name) {
      throw new TypeError('Expect a name for your storage');
    }

    this.page = new Memory(name);
    this.session = new SessionStorage(name);
    this.persistent = new Persistent$1(name);
    this.clean();
  }

  _createClass(LocalCache, [{
    key: "set",
    value: function set(key, data, options) {
      var _this = this;

      var steps = [];

      var _loop = function _loop(mode) {
        if (!options[mode]) return "continue";
        var opts = options[mode];
        if (opts === false) return "continue";

        if (!isObject(opts)) {
          opts = {};
        }

        if (!isUndefined(options.type)) {
          opts.type = options.type;
        }

        if (!isUndefined(options.extra)) {
          opts.extra = options.extra;
        }

        if (!isUndefined(options.mime)) {
          opts.mime = options.mime;
        }

        steps.push(function () {
          return _this[mode].set(key, data, opts);
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = LocalCache.STORAGES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var mode = _step.value;

          var _ret = _loop(mode);

          if (_ret === "continue") continue;
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

      if (!steps.length) {
        throw new TypeError("You must specify at least one storage mode in [".concat(LocalCache.STORAGES.join(', '), "]"));
      }

      return Sequence.all(steps).then(function () {
        return data;
      });
    }
  }, {
    key: "get",
    value: function get(key, modes) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (isObject(modes)) {
        modes = LocalCache.STORAGES;
        options = modes;
      }

      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop2 = function _loop2(mode) {
        if (!_this2[mode]) {
          throw new TypeError("Unexcepted storage mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this2[mode].get(key, options);
        });
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = modes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var mode = _step2.value;

          _loop2(mode);
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

      return Sequence.any(steps).then(function (results) {
        var result = results[results.length - 1];
        var value = result.value;
        var store = false;
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = LocalCache.STORAGES[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _item = _step3.value;

            if (options[_item] && _item !== value.storage) {
              store = true;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        if (!store) return value;
        var opts = Object.assign(value, options, _defineProperty({}, value.storage, false));
        return _this2.set(key, value.data, opts).then(function () {
          return value;
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(key, modes) {
      var _this3 = this;

      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop3 = function _loop3(mode) {
        if (!_this3[mode]) {
          throw new TypeError("Unexcepted mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this3[mode].delete(key);
        });
      };

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = modes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var mode = _step4.value;

          _loop3(mode);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return Sequence.all(steps);
    }
  }, {
    key: "clear",
    value: function clear(modes) {
      var _this4 = this;

      modes || (modes = LocalCache.STORAGES);
      var steps = [];

      var _loop4 = function _loop4(mode) {
        if (!_this4[mode]) {
          throw new TypeError("Unexcepted mode \"".concat(mode, "\", excepted one of: ").concat(LocalCache.STORAGES.join(', ')));
        }

        steps.push(function () {
          return _this4[mode].clear();
        });
      };

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = modes[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var mode = _step5.value;

          _loop4(mode);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return Sequence.all(steps);
    }
  }, {
    key: "clean",
    value: function clean() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var check = function check(data, key) {
        var remove = false;
        var priority = options.priority,
            length = options.length,
            ctime = options.ctime,
            type = options.type;

        if (!isUndefined(priority)) {
          if (data.priority < priority) {
            remove = true;
          }
        }

        if (!remove && !isUndefined(length)) {
          var content = data.data;

          if (isNumber(length)) {
            if (content.length >= length) {
              remove = true;
            }
          } else if (Array.isArray(length)) {
            if (content.length >= length[0] && content.length <= length[1]) {
              remove = true;
            }
          }
        }

        if (!remove && !isUndefined(ctime)) {
          if (isDate(ctime) || isNumber(ctime)) {
            if (data.ctime < +ctime) {
              remove = true;
            }
          } else if (Array.isArray(ctime)) {
            if (data.ctime > ctime[0] && data.ctime < ctime[1]) {
              remove = true;
            }
          }
        }

        if (!remove) {
          if (Array.isArray(type)) {
            if (type.indexOf(data.type) > -1) {
              remove = true;
            }
          } else if (type == data.type) {
            remove = true;
          }
        }

        if (!remove && isFunction(options.remove)) {
          if (options.remove(data, key) === true) {
            remove = true;
          }
        }

        return remove;
      };

      var steps = [];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = LocalCache.STORAGES[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _mode = _step6.value;
          steps.push(this[_mode].clean(check));
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      return Promise.all(steps);
    }
  }]);

  return LocalCache;
}();

LocalCache.STORAGES = ['page', 'session', 'persistent'];

var localcache = new LocalCache('BIU-REQUEST-VERSION-1.0.0');

function set(key, data, options) {
  var url = new URL(key);
  url.searchParams.sort();
  return localcache.set(url.toString(), data, options);
}

function get(key) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var url = new URL(key);
  url.searchParams.sort();
  url = url.toString();
  return localcache.get(url, LocalCache.STORAGES, options).then(function (result) {
    var response = new Response({
      url: url,
      body: result.data,
      status: 200,
      statusText: 'From LocalCache',
      headers: {
        'Content-Type': result.mime
      }
    });
    return response;
  });
}

var lc = {
  localcache: localcache,
  set: set,
  get: get
};

function resJSON(xhr) {
  return /^application\/json;/i.test(xhr.getResponseHeader('content-type'));
}

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (options.auth) {
    if (!options.headers) {
      options.headers = {};
    }

    var username = options.auth.username || '';
    var password = options.auth.password || '';
    options.headers.Authorization = 'Basic ' + btoa(username + ':' + password);
  }

  options.xhr || (options.xhr = new XMLHttpRequest());
  return ajax(url, options).then(function (response) {
    var status = response.status;

    if (status < 200 || status >= 300) {
      throw response;
    }

    if (options.fullResponse) {
      return response;
    }

    if (options.rawBody) {
      return response.body;
    }

    if (resJSON(options.xhr) || options.type === 'json') {
      return response.json();
    }

    return response.body;
  });
}

function get$1(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options = options,
      _options$cache = _options.cache,
      cache = _options$cache === void 0 ? false : _options$cache,
      _options$fullResponse = _options.fullResponse,
      fullResponse = _options$fullResponse === void 0 ? false : _options$fullResponse,
      _options$rawBody = _options.rawBody,
      rawBody = _options$rawBody === void 0 ? false : _options$rawBody,
      _options$localcache = _options.localcache,
      localcache = _options$localcache === void 0 ? false : _options$localcache;
  options = Object.assign({}, options, {
    method: 'GET'
  });
  url = new URL$1(url, location.href);
  mergeParams(url.searchParams, options.params);
  options.params = {};

  if (cache === false) {
    options.params['_' + +new Date()] = '_';
  }

  if (!localcache) {
    return request(url, options);
  }

  return lc.get(url, localcache).catch(function () {
    options.fullResponse = true;
    options.xhr || (options.xhr = new XMLHttpRequest());
    return request(url, options).then(function (response) {
      var isJSON = resJSON(options.xhr) || options.type === 'json';

      if (!localcache.mime) {
        if (isJSON) {
          localcache.mime = 'application/json';
        } else {
          localcache.mime = response.headers['Content-Type'] || 'text/plain';
        }
      }

      return lc.set(url.toString(), response.body, localcache).then(function () {
        if (fullResponse) {
          return response;
        }

        if (rawBody) {
          return response.body;
        }

        if (isJSON) {
          return response.json();
        }

        return response.body;
      });
    });
  });
}

function post(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options.method = 'POST';
  var _options$contentType = options.contentType,
      contentType = _options$contentType === void 0 ? true : _options$contentType;

  if (!options.headers) {
    options.headers = {};
  }

  if (contentType && !options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  }

  return request(url, options);
}

var biu = {
  request: request,
  get: get$1,
  post: post,
  ajax: ajax,
  jsonp: jsonp
};

var Model =
/*#__PURE__*/
function (_Extension) {
  _inherits(Model, _Extension);

  function Model(init) {
    var _this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, init, Object.assign({
      type: 'extension-model'
    }, config)));
    _this.validators || (_this.validators = {});
    _this.validations || (_this.validations = {});
    _this.data || (_this.data = {});
    _this.expose || (_this.expose = []);
    _this.$validators = {};
    _this.__watch_handlers = new Map();

    if (_this.$data) {
      Observer.destroy(_this.$data);
    }

    if (_this.$props) {
      Observer.destroy(_this.$props);
    }

    _this.$props = Observer.create(defaultProps(), Observer.create(_this.__methods()));
    _this.$data = Observer.create({}, _this.$props);
    return _this;
  }

  _createClass(Model, [{
    key: "__init",
    value: function __init() {
      var _this2 = this;

      this.__initial = null;
      this.__triedSubmitting = false;
      this.$on('ready', function () {
        _this2.$props.$ready = true;
      });
    }
  }, {
    key: "__loadData",
    value: function __loadData() {
      if (this.url) {
        return biu.get(this.url, {
          params: this.params || null,
          storage: this.storage || false
        });
      }

      if (this.data && isFunction(this.data)) {
        return Promise$1.resolve(this.data());
      }

      return Promise$1.resolve(this.data || {});
    }
  }, {
    key: "__initData",
    value: function __initData() {
      var _this3 = this;

      return this.__loadData().then(function (data) {
        _this3.$assign(data);

        try {
          _this3.__initial = JSON.stringify(_this3.$data);
        } catch (e) {
          console.warn(e);
        }
      }).catch(function (reason) {
        var error = new Error$1('Failed to initialize model data.', {
          reason: reason
        });
        _this3.$props.$failed = error;
        throw error;
      });
    }
  }, {
    key: "__initValidations",
    value: function __initValidations() {
      var _this4 = this;

      var promises = [];
      var validators = this.validators;
      var $validation = defaultValidationProps();

      for (var name in validators) {
        if (validators.hasOwnProperty(name)) {
          promises.push(this.$validator(name, validators[name]));
        }
      }

      var validations = this.validations;

      var _loop = function _loop(key) {
        var item = validations[key];
        $validation[key] = defaultValidationProps();
        $validation[key].path = item.path || (item.path = key);
        $validation[key].$validator = item.$validator = _this4.__makeValidator(key, item);
        if (!item.on) item.on = 'submitted';

        _this4.$watch(function () {
          var rules = Object.keys($validation[key].$errors);

          for (var _i = 0; _i < rules.length; _i++) {
            var rule = rules[_i];

            if ($validation[key].$errors[rule]) {
              return true;
            }
          }

          return false;
        }, function (val) {
          var $validation = _this4.$props.$validation;
          $validation[key].$error = val;

          if (val === true) {
            $validation.$error = true;
            return;
          }

          for (var attr in $validation) {
            if ($validation[attr].$error === true) {
              $validation.$error = true;
              return;
            }
          }

          $validation.$error = false;
        });

        _this4.$watch(function () {
          return $validation[key].$validating;
        }, function (val) {
          if (val === true) {
            $validation.$validating = true;
            return;
          }

          for (var _key in $validation) {
            if (_key.charAt(0) === '$') continue;

            if ($validation[_key].$validating) {
              $validation.$validation = true;
              return;
            }
          }

          $validation.$validating = false;
        });

        var exp = function exp() {
          return JSON.stringify(_this4.$data) !== _this4.__initial;
        };

        var handler = function handler(v) {
          if (v === false) {
            _this4.$unwatch(exp, handler);

            _this4.$props.$validation.$pristine = false;
          }
        };

        _this4.$watch(exp, handler);

        switch (item.on) {
          case 'submit':
          case 3:
            break;

          case 'change':
          case 1:
            _this4.$watch(item.path, item.$validator);

            break;

          case 'submitted':
          case 2:
          default:
            _this4.$watch(item.path, function () {
              if (_this4.__triedSubmitting) {
                item.$validator.apply(item, arguments);
              }
            });

        }
      };

      for (var key in validations) {
        _loop(key);
      }

      Observer.set(this.$props, '$validation', $validation);
      return Promise$1.all(promises);
    }
  }, {
    key: "__makeValidator",
    value: function __makeValidator(name, bound) {
      var _this5 = this;

      return function (val) {
        var props = _this5.$props;
        var validation = props.$validation;
        var errors = validation[name].$errors;
        var steps = [];
        validation[name].$validating = true;

        if (isUndefined(val)) {
          val = Observer.calc(_this5.$data, bound.path);
        }

        var _loop2 = function _loop2(key) {
          var rule = bound.rules[key];
          var func = void 0;
          var args = [val];

          if (isFunction(_this5.$validators[key])) {
            func = _this5.$validators[key];
            args.push.apply(args, _toConsumableArray(isArray$1(rule) ? rule : [rule]));
          } else {
            func = rule;
          }

          if (isFunction(func)) {
            steps.push(function () {
              var _func;

              var result = (_func = func).call.apply(_func, [_this5].concat(args));

              if (isPromise(result)) {
                result.then(function (v) {
                  if (v === false) {
                    Observer.set(errors, key, true);
                    throw false;
                  }

                  Observer.set(errors, key, v === false);
                  return true;
                }).catch(function () {
                  Observer.set(errors, key, true);
                  throw false;
                });
              }

              if (result === false) {
                Observer.set(errors, key, true);
                return true;
              }

              Observer.set(errors, key, false);
              throw false;
            });
          } else {
            console.warn("Invalide validator \"".concat(rule, "\"."));
          }
        };

        for (var key in bound.rules) {
          _loop2(key);
        }

        return Sequence.all(steps).then(function () {
          validation[name].$validating = false;
          validation[name].$checked = true;
        }).catch(function (e) {
          validation[name].$validating = false;
          validation[name].$checked = true;
          throw e;
        });
      };
    }
  }, {
    key: "__methods",
    value: function __methods() {
      var methods = {};
      var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).concat(['$reload'], Object.keys(this));
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key2 = _step.value;
          if (_key2.charAt(0) !== '$' && this.expose.indexOf(_key2) < 0) continue;
          var item = this[_key2];
          Object.defineProperty(methods, _key2, {
            value: isFunction(item) ? item.bind(this) : item
          });
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

      return methods;
    }
  }, {
    key: "$validator",
    value: function $validator(name, handler) {
      var _this6 = this;

      if (isPromise(handler)) {
        return handler.then(function (res) {
          _this6.$validators[name] = isFunction(res.expose) ? res.expose() : res;
        });
      }

      if (isString(handler)) {
        console.log(handler);
      }

      this.$validators[name] = handler;
      return Promise$1.resolve(handler);
    }
  }, {
    key: "$watch",
    value: function $watch(exp, handler) {
      var _this7 = this;

      var wrapedHandler = function wrapedHandler() {
        for (var _len = arguments.length, args = new Array(_len), _key3 = 0; _key3 < _len; _key3++) {
          args[_key3] = arguments[_key3];
        }

        handler.call.apply(handler, [_this7].concat(args));
      };

      this.__watch_handlers.set(handler, wrapedHandler);

      Observer.watch(this.$data, exp, wrapedHandler);
    }
  }, {
    key: "$unwatch",
    value: function $unwatch(exp, handler) {
      var wrapedHandler = this.__watch_handlers.get(handler);

      if (wrapedHandler) {
        Observer.unwatch(this.$data, exp, wrapedHandler);

        this.__watch_handlers.delete(handler);
      }
    }
    /**
     * $assign( value )
     * $assign( key, value )
     * $assign( dest, key, value );
     */

  }, {
    key: "$assign",
    value: function $assign() {
      if (arguments.length === 1) {
        return Observer.replace.apply(Observer, [this.$data].concat(Array.prototype.slice.call(arguments)));
      }

      if (arguments.length === 2) {
        return Observer.set.apply(Observer, [this.$data].concat(Array.prototype.slice.call(arguments)));
      }

      if (arguments.length === 3) {
        return Observer.set.apply(Observer, arguments);
      }
    }
  }, {
    key: "$delete",
    value: function $delete() {
      Observer.delete.apply(Observer, arguments);
    }
  }, {
    key: "$reset",
    value: function $reset() {
      if (this.__initial) {
        try {
          this.$assign(JSON.parse(this.__initial));
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }, {
    key: "$refresh",
    value: function $refresh() {
      var _this8 = this;

      return this.__loadData().then(function (data) {
        _this8.$assign(data);

        try {
          _this8.__initial = JSON.stringify(_this8.$data);
        } catch (e) {
          console.warn(e);
        }
      }).catch(function (reason) {
        var error = new Error$1('Failed while refreshing data', {
          reason: reason,
          model: _this8,
          name: 'JauntyExtensionModelError'
        });
        _this8.$props.$failed = error;
        throw error;
      });
    }
  }, {
    key: "$request",
    value: function $request(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var props = this.$props;
      props.$requesting = true;
      return biu.request(url, options).then(function (res) {
        props.$requesting = false;
        props.$error = false;
        props.$response = res;
        return res;
      }).catch(function (reason) {
        props.$requesting = false;
        props.$error = reason;
        props.$response = reason;
        throw reason;
      });
    }
  }, {
    key: "$post",
    value: function $post(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options.method = 'POST';
      return this.$request(url, options);
    }
  }, {
    key: "$get",
    value: function $get(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options.method = 'GET';
      return this.$request(url, options);
    }
  }, {
    key: "$submit",
    value: function $submit() {
      var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'submit';
      var allowMultipleSubmission = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var props = this.$props;
      this.__triedSubmitting = true;

      if (!allowMultipleSubmission && props.$submitting) {
        return Promise$1.reject(new Error$1('Multiple submitting'));
      }

      if (this.$validate() === false) {
        return Promise$1.reject({});
      }

      props.$submitting = props.$requesting = true;
      var res;

      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key4 = 2; _key4 < _len2; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      if (isFunction(method)) {
        res = method.call.apply(method, [this].concat(args));
      } else {
        if (!isFunction(this[method])) {
          console.error("Cannot find method \"".concat(method, "\"."));
        }

        res = this[method].apply(this, args);
      }

      if (isPromise(res)) {
        return res.then(function (response) {
          props.$error = false;
          props.$response = response;
          props.$submitting = props.$requesting = false;
        }).catch(function (reason) {
          var error = new Error$1('Failed while submitting.', {
            reason: reason
          });
          props.$submitting = props.$requesting = false;
          props.$error = error;
          props.$response = reason;
          throw error;
        });
      }

      if (res === false) {
        props.$submitting = props.$requesting = false;
        props.$error = true;
        return Promise$1.reject(new Error$1('Failed while submitting'));
      }

      props.$error = false;
      props.$submitting = props.$requesting = false;
      return Promise$1.resolve(res);
    }
  }, {
    key: "$validate",
    value: function $validate(name) {
      var promises = [];
      var validation = this.$props.$validation;

      if (name) {
        if (!validation[name]) {
          console.warn("No validator named \"".concat(name, "\"."));
          return Promise$1.resolve();
        }

        return validation[name].$validator.call(this);
      }

      if (validation) {
        for (var attr in validation) {
          if (attr.charAt(0) === '$') continue;
          var item = validation[attr];
          promises.push(item.$validator.call(this));
        }
      }

      return Promise$1.all(promises).then(function () {
        validation.$error = false;
      }).catch(function () {
        validation.$error = true;
      });
    }
  }, {
    key: "$destruct",
    value: function $destruct() {}
  }]);

  return Model;
}(Extension);

function defaultProps() {
  return {
    $ready: false,
    $failed: false,
    $submitting: false,
    $requesting: false,
    $error: false,
    $response: null
  };
}

function defaultValidationProps() {
  return {
    $validating: false,
    $checked: false,
    $pristine: true,
    $error: false,
    $errors: {}
  };
}

return Model;

})));
