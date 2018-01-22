/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mosaic = __webpack_require__(1);

var _mosaic2 = _interopRequireDefault(_mosaic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function drawImageToCanvas(imageUrl) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.crossOrigin = 'Annoymous';
        image.onload = function () {
            canvas.width = this.width;
            canvas.height = this.height;

            ctx.drawImage(this, 0, 0, this.width, this.height);

            resolve(ctx);
        };

        image.src = imageUrl;
    });
}

drawImageToCanvas('https://raw.githubusercontent.com/zhengsk/image-masaic/master/src/images/demo.jpg').then(function (ctx) {
    var mosaic = new _mosaic2.default(ctx);

    var MouseEvents = {
        init: function init() {
            mosaic.context.canvas.addEventListener('mousedown', MouseEvents.mousedown);
        },
        mousedown: function mousedown() {
            mosaic.context.canvas.addEventListener('mousemove', MouseEvents.mousemove);
            document.addEventListener('mouseup', MouseEvents.mouseup);
        },
        mousemove: function mousemove(e) {
            if (e.shiftKey) {
                mosaic.eraseTileByPoint(e.layerX, e.layerY);
                return;
            }
            mosaic.drawTileByPoint(e.layerX, e.layerY);
        },
        mouseup: function mouseup() {
            mosaic.context.canvas.removeEventListener('mousemove', MouseEvents.mousemove);
            document.removeEventListener('mouseup', MouseEvents.mouseup);
        }
    };
    MouseEvents.init();

    document.querySelector('#drawAll').addEventListener('click', function () {
        mosaic.drawAllTiles();
    });

    document.querySelector('#clearAll').addEventListener('click', function () {
        mosaic.eraseAllTiles();
    });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * {
 *  context,
 *  imageData,
 *  width,
 *  height,
 *  tileWidth,
 *  tileHeight,
 *  tileRowSize,
 *  tileColumnSize,
 *  tiles: [{
 *      row,
 *      column,
 *      pixelWidth,
 *      pixelHeight,
 *      data,
 *      color,
 *      isFilled,
 *  }, ...]
 * }
 */
var Mosaic = function () {
    function Mosaic(context) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            _ref$tileWidth = _ref.tileWidth,
            tileWidth = _ref$tileWidth === undefined ? 10 : _ref$tileWidth,
            _ref$tileHeight = _ref.tileHeight,
            tileHeight = _ref$tileHeight === undefined ? 10 : _ref$tileHeight,
            _ref$brushSize = _ref.brushSize,
            brushSize = _ref$brushSize === undefined ? 3 : _ref$brushSize;

        _classCallCheck(this, Mosaic);

        var canvas = context.canvas;


        this.context = context;
        this.brushSize = brushSize;

        this.width = canvas.width;
        this.height = canvas.height;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        var width = this.width,
            height = this.height;


        this.imageData = context.getImageData(0, 0, width, height).data;
        this.tileRowSize = Math.ceil(height / this.tileHeight);
        this.tileColumnSize = Math.ceil(width / this.tileWidth);

        this.tiles = []; // All image tiles.

        // Set tiles.
        for (var i = 0; i < this.tileRowSize; i++) {
            for (var j = 0; j < this.tileColumnSize; j++) {
                var tile = {
                    row: i,
                    column: j,
                    pixelWidth: tileWidth,
                    pixelHeight: tileHeight
                };

                if (j === this.column - 1) {
                    // Last column
                    tile.pixelWidth = width - j * tileWidth;
                }

                if (i === this.row - 1) {
                    // Last row
                    tile.pixelHeight = height - i * tileHeight;
                }

                // Set tile data;
                var data = [];
                var pixelPosition = this.width * 4 * this.tileHeight * tile.row + tile.column * this.tileWidth * 4;
                for (var _i = 0, _j = tile.pixelHeight; _i < _j; _i++) {
                    var position = pixelPosition + this.width * 4 * _i;
                    data.push.apply(data, this.imageData.slice(position, position + tile.pixelWidth * 4));
                };
                tile.data = data;

                this.tiles.push(tile);
            }
        }
    }

    _createClass(Mosaic, [{
        key: "drawTile",
        value: function drawTile(tiles) {
            var _this = this;

            tiles = [].concat(tiles);
            tiles.forEach(function (tile) {
                if (tile.isFilled) {
                    return false; // Already filled.
                }

                if (!tile.color) {
                    var dataLen = tile.data.length;
                    var r = 0,
                        g = 0,
                        b = 0,
                        a = 0;
                    for (var i = 0; i < dataLen; i += 4) {
                        r += tile.data[i];
                        g += tile.data[i + 1];
                        b += tile.data[i + 2];
                        a += tile.data[i + 3];
                    }

                    // Set tile color.
                    var pixelLen = dataLen / 4;
                    tile.color = {
                        r: parseInt(r / pixelLen, 10),
                        g: parseInt(g / pixelLen, 10),
                        b: parseInt(b / pixelLen, 10),
                        a: parseInt(a / pixelLen, 10)
                    };
                }

                var color = tile.color;
                _this.context.fillStyle = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a / 255 + ")";

                var x = tile.column * _this.tileWidth;
                var y = tile.row * _this.tileHeight;
                var w = tile.pixelWidth;
                var h = tile.pixelHeight;

                _this.context.clearRect(x, y, w, h); // Clear.
                _this.context.fillRect(x, y, w, h); // Draw.

                tile.isFilled = true;
            });
        }
    }, {
        key: "drawTileByPoint",
        value: function drawTileByPoint(x, y) {
            var tile = this.getTilesByPoint(x, y);
            this.drawTile(tile);
        }
    }, {
        key: "getTilesByPoint",
        value: function getTilesByPoint(x, y) {
            var isBrushSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var tiles = [];

            if (isBrushSize) {
                var brushSize = this.brushSize;
                var startRow = Math.max(0, Math.floor(y / this.tileHeight) - Math.floor(brushSize / 2));
                var startColumn = Math.max(0, Math.floor(x / this.tileWidth) - Math.floor(brushSize / 2));

                var endRow = Math.min(this.tileRowSize, startRow + brushSize);
                var endColumn = Math.min(this.tileColumnSize, startColumn + brushSize);

                // Get tiles.
                while (startRow < endRow) {
                    var column = startColumn;
                    while (column < endColumn) {
                        tiles.push(this.tiles[startRow * this.tileColumnSize + column]);
                        column += 1;
                    }
                    startRow += 1;
                }
            }
            return tiles;
        }
    }, {
        key: "drawAllTiles",
        value: function drawAllTiles() {
            this.drawTile(this.tiles);
        }
    }, {
        key: "eraseTile",
        value: function eraseTile(tiles) {
            var _this2 = this;

            [].concat(tiles).forEach(function (tile) {
                var x = tile.column * _this2.tileWidth;
                var y = tile.row * _this2.tileHeight;
                var w = tile.pixelWidth;
                var h = tile.pixelHeight;

                var imgData = _this2.context.createImageData(w, h);

                tile.data.forEach(function (val, i) {
                    imgData.data[i] = val;
                });

                _this2.context.clearRect(x, y, w, h); // Clear.
                _this2.context.putImageData(imgData, x, y); // Draw.

                tile.isFilled = false;
            });
        }
    }, {
        key: "eraseTileByPoint",
        value: function eraseTileByPoint(x, y) {
            var tile = this.getTilesByPoint(x, y);
            this.eraseTile(tile);
        }
    }, {
        key: "eraseAllTiles",
        value: function eraseAllTiles(tiles) {
            this.eraseTile(this.tiles);
        }
    }]);

    return Mosaic;
}();

exports.default = Mosaic;

/***/ })
/******/ ]);