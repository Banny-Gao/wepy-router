'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withRouter = exports.routerMinx = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _wepy = require('wepy');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CATCHEPAGES = [],
    TIMER = null,
    ROUTER = null; /* eslint-disable no-unused-vars */
/* eslint-disable one-var */

var ROUTERTYPE = ['switchTab', 'navigateTo', 'reLaunch', 'redirectTo', 'navigateBack'];
var indentUperCase = function indentUperCase(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
};
var getPathName = function getPathName(path) {
  return path.replace(/(?:\w+\/)*(?:(\w+))/, function (str, $1) {
    return indentUperCase($1);
  });
};
var getPages = function getPages() {
  var pages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var firstName = root ? getPathName(root) : '';
  return pages.map(function (p) {
    var path = root ? '/' + root + '/' + p : '/' + p;
    var lastName = getPathName(p);
    return {
      path: path,
      name: firstName + lastName,
      type: type
    };
  });
};
var getSubPackages = function getSubPackages() {
  var subPackages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (subPackages.length === 0) return [];
  return subPackages.reduce(function (result, pagesInfo) {
    var root = pagesInfo.root,
        pages = pagesInfo.pages;

    var pagesArr = getPages(pages, root);
    result.push.apply(result, (0, _toConsumableArray3.default)(pagesArr));
    return result;
  }, []);
};
var tabBarValidate = function tabBarValidate() {
  var pages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var tabPages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return pages.map(function (page) {
    var pagePath = page.path;
    var isTab = tabPages.some(function (tabPage) {
      var tabPath = '/' + tabPage.pagePath;
      return tabPath === pagePath;
    });
    if (isTab) page.type = 0;
    return page;
  });
};
var findRoutesIndex = function findRoutesIndex(arr, value, key) {
  return arr.findIndex(function (page) {
    return page[key] === value;
  });
};
var judgeNullObj = function judgeNullObj(obj) {
  if (obj === null) return true;
  if (Object.prototype.toString.call(obj) !== '[object Object]') throw TypeError('query is not a object');
  return (0, _stringify2.default)(obj) === '{}';
};
var littleJudgeObjEqual = function littleJudgeObjEqual(a, b) {
  // 判断两个未知的变量是否相等
  if (a === null || b === null) return a === b;
  var typeA = Object.prototype.toString.call(a),
      typeB = Object.prototype.toString.call(b);
  if (typeA !== typeB) return false;
  if ((typeof a === 'undefined' ? 'undefined' : (0, _typeof3.default)(a)) !== 'object') return a === b;
  var aProps = (0, _getOwnPropertyNames2.default)(a),
      bProps = (0, _getOwnPropertyNames2.default)(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  return aProps.every(function (prop) {
    if (bProps.indexOf(prop) === -1) return false;
    return littleJudgeObjEqual(a[prop], b[prop]);
  });
};
var dataToQuery = function dataToQuery() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var objArr = (0, _entries2.default)(data);
  return objArr.reduce(function (result, _ref, index) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    val = (0, _stringify2.default)(val);
    var p = index === objArr.length - 1 ? key + '=' + val : key + '=' + val + '&';
    result += p;
    return result;
  }, '?').replace(/"/g, '');
};
var getCatchePages = function getCatchePages() {
  var cat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var cur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return cur.reduce(function (r, v) {
    var i = r.findIndex(function (ite) {
      return littleJudgeObjEqual(ite, v);
    });
    if (i !== -1) r.splice(i, 1);
    r.push(v);
    return r;
  }, cat);
};
var setCatchePages = function setCatchePages() {
  clearTimeout(TIMER);
  TIMER = setTimeout(function () {
    // eslint-disable-next-line no-undef
    var catchePages = getCurrentPages().map(function (page) {
      return {
        options: page.options,
        route: page.route
      };
    });
    global.a = CATCHEPAGES = getCatchePages(CATCHEPAGES, catchePages);
    // console.log(CATCHEPAGES)
  }, 1000);
};

var Router = function () {
  function Router() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Router);

    this._init = function () {
      Router.$wepy = _wepy2.default;
      _wepy2.default.$router = ROUTER = _this;
      setCatchePages();
    };

    var _config$pages = config.pages,
        pages = _config$pages === undefined ? [] : _config$pages,
        _config$subPackages = config.subPackages,
        subPackages = _config$subPackages === undefined ? [] : _config$subPackages,
        _config$tabBar = config.tabBar,
        tabBar = _config$tabBar === undefined ? {} : _config$tabBar;

    var routes = [].concat((0, _toConsumableArray3.default)(getPages(pages)), (0, _toConsumableArray3.default)(getSubPackages(subPackages)));
    var tabBarPages = tabBar.list || [];
    this.$routes = tabBarValidate(routes, tabBarPages);
    this._init();
  }

  (0, _createClass3.default)(Router, [{
    key: 'push',
    value: function push(urlInfo) {
      var _this2 = this;

      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var reLaunch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      return new _promise2.default(function (resolve, reject) {
        var path = void 0,
            name = void 0,
            type = 1;
        if (Object.prototype.toString.call(urlInfo) === '[object Object]') {
          path = urlInfo.path || '';
          query = urlInfo.query || {};
          name = urlInfo.name || '';
          reLaunch = urlInfo.reLaunch ? Boolean(urlInfo.reLaunch) : false;
        }
        if (typeof urlInfo === 'string') {
          path = urlInfo;
        }
        if (path) {
          var i = findRoutesIndex(_this2.$routes, path, 'path');
          if (i !== -1) type = _this2.$routes[i].type;
        }
        if (!path && name) {
          var _i = findRoutesIndex(_this2.$routes, name, 'name');
          if (_i !== -1) {
            type = _this2.$routes[_i].type;
            path = _this2.$routes[_i].path;
          }
        }
        if (reLaunch) type = 2;
        Router._routerTo(type, path, query, resolve, reject);
      });
    }
  }, {
    key: 'go',
    value: function go() {
      var _this3 = this;

      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof +num !== 'number') throw Error('param must be a number');
      return new _promise2.default(function (resolve, reject) {
        if (num < 0 && num % 1 === 0) {
          Router._routerTo(4, Math.abs(num), {}, resolve, reject);
        }
        if (num > 0 && num % 1 === 0) {
          // eslint-disable-next-line no-undef
          var from = getCurrentPages().reverse()[0],
              fromIndex = CATCHEPAGES.findIndex(function (item) {
            return item.route === from.route;
          });
          var sum = fromIndex + num,
              toIndex = sum > CATCHEPAGES.length - -1 ? CATCHEPAGES.length - 1 : sum,
              to = CATCHEPAGES[toIndex];
          if (judgeNullObj(query)) {
            query = (0, _keys2.default)(to.options).reduce(function (o, key) {
              o[key] = JSON.parse(to.options[key]);
              return o;
            }, {});
          }
          var url = '/' + to.route;
          _this3.push(url, query).then(resolve).catch(reject);
        }
      });
    }
  }], [{
    key: '_routerTo',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(type, url, query, resolve, reject) {
        var _Router$$wepy$routerH;

        var key, currentPages, routerHandler;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                key = 'url';

                if (!(type === 1)) {
                  _context.next = 7;
                  break;
                }

                // eslint-disable-next-line no-undef
                currentPages = getCurrentPages();

                if (!(currentPages.length > 9)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return new _promise2.default(function (resolve) {
                  Router.$wepy.showModal({
                    title: '提示',
                    content: '因小程序页面栈层级限制，点击确定关闭当前页跳转到下一页？',
                    success: function success(res) {
                      if (res.confirm) resolve(3);
                    }
                  });
                });

              case 6:
                type = _context.sent;

              case 7:
                if (!judgeNullObj(query) && type !== 4 && type !== 0) {
                  url += dataToQuery(query);
                }
                if (type === 4) {
                  key = 'delta';
                  url = url || 0;
                }
                routerHandler = ROUTERTYPE[type];

                Router.$wepy[routerHandler]((_Router$$wepy$routerH = {}, (0, _defineProperty3.default)(_Router$$wepy$routerH, key, url), (0, _defineProperty3.default)(_Router$$wepy$routerH, 'success', function success(e) {
                  if (type !== 4) setCatchePages();
                  resolve(e);
                }), (0, _defineProperty3.default)(_Router$$wepy$routerH, 'fail', reject), _Router$$wepy$routerH));

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _routerTo(_x15, _x16, _x17, _x18, _x19) {
        return _ref3.apply(this, arguments);
      }

      return _routerTo;
    }()
  }]);
  return Router;
}();

exports.default = Router;

var routerMinx = function (_wepy$mixin) {
  (0, _inherits3.default)(routerMinx, _wepy$mixin);

  function routerMinx() {
    (0, _classCallCheck3.default)(this, routerMinx);
    return (0, _possibleConstructorReturn3.default)(this, (routerMinx.__proto__ || (0, _getPrototypeOf2.default)(routerMinx)).apply(this, arguments));
  }

  (0, _createClass3.default)(routerMinx, [{
    key: 'onLoad',
    value: function onLoad() {
      // console.log(ROUTER)
      if (ROUTER) this.$router = ROUTER;
    }
  }]);
  return routerMinx;
}(_wepy2.default.mixin);

var withRouter = function withRouter(target) {
  // console.log(ROUTER)
  if (ROUTER) target.$router = ROUTER;
};

exports.routerMinx = routerMinx;
exports.withRouter = withRouter;