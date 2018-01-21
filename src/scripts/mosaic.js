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
class Mosaic {
    constructor(context, { tileWidth = 20, tileHeight = 20, brushSize = 3 } = {}) {
        const { canvas } = context;

        this.context = context;
        this.brushSize = brushSize;

        this.width = canvas.width;
        this.height = canvas.height;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        const { width, height } = this;

        this.imageData = context.getImageData(0, 0, width, height).data;
        this.tileRowSize = Math.ceil(height / this.tileHeight);
        this.tileColumnSize = Math.ceil(width / this.tileWidth);

        this.tiles = []; // All image tiles.

        // Set tiles.
        for (let i = 0; i < this.tileRowSize; i++) {
            for (let j = 0; j < this.tileColumnSize; j++) {
                const tile = {
                    row: i,
                    column: j,
                    pixelWidth: tileWidth,
                    pixelHeight: tileHeight,
                };

                if (j === this.column - 1) { // Last column
                    tile.pixelWidth = width - (j * tileWidth);
                }

                if (i === this.row - 1) { // Last row
                    tile.pixelHeight = height - (i * tileHeight);
                }

                // Set tile data;
                const data = [];
                const pixelPosition = this.width * 4 * this.tileHeight * tile.row + tile.column * this.tileWidth * 4;
                for (let i = 0, j = tile.pixelHeight; i < j; i++) {
                    const position = pixelPosition + this.width * 4 * i;
                    data.push.apply(data, this.imageData.slice(position, position + tile.pixelWidth * 4));
                };
                tile.data = data;

                this.tiles.push(tile);
            }
        }
    }

    drawTile(tiles) {
        tiles = [].concat(tiles);
        tiles.forEach((tile) => {
            if (tile.isFilled) {
                return false; // Already filled.
            }

            if (!tile.color) {
                let dataLen = tile.data.length;
                let r = 0, g = 0, b = 0, a = 0;
                for (let i = 0; i < dataLen; i += 4) {
                    r += tile.data[i];
                    g += tile.data[i + 1];
                    b += tile.data[i + 2];
                    a += tile.data[i + 3];
                }

                // Set tile color.
                let pixelLen = dataLen / 4;
                tile.color = {
                    r: parseInt(r / pixelLen, 10),
                    g: parseInt(g / pixelLen, 10),
                    b: parseInt(b / pixelLen, 10),
                    a: parseInt(a / pixelLen, 10),
                };
            }

            const color = tile.color;
            this.context.fillStyle=`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;

            const x = tile.column * this.tileWidth;
            const y = tile.row * this.tileHeight;
            const w = tile.pixelWidth;
            const h = tile.pixelHeight;

            this.context.clearRect(x, y, w, h); // Clear.
            this.context.fillRect(x, y, w, h); // Draw.

            tile.isFilled = true;
        });
    }

    drawTileByPoint(x, y) {
        const tile = this.getTilesByPoint(x, y);
        this.drawTile(tile);
    }

    eraseTileByPoint(x, y) {
        const tile = this.getTilesByPoint(x, y);
        this.eraseTile(tile);
    }

    getTilesByPoint(x, y, isBrushSize = true) {
        const tiles = [];

        if (isBrushSize) {
            let brushSize = this.brushSize;
            let startRow = Math.max(0, Math.floor(y / this.tileHeight) - Math.floor(brushSize / 2));
            let startColumn = Math.max(0, Math.floor(x / this.tileWidth) - Math.floor(brushSize / 2));

            let endRow = Math.min(this.tileRowSize, startRow + brushSize);
            let endColumn = Math.min(this.tileColumnSize, startColumn + brushSize);

            // Get tiles.
            while (startRow < endRow) {
                let column = startColumn;
                while (column < endColumn) {
                    tiles.push(this.tiles[startRow * this.tileColumnSize + column]);
                    column += 1;
                }
                startRow += 1;
            }
        }
        return tiles;
    }

    drawAllTiles() {
        this.drawTile(this.tiles);
    }

    eraseTile(tiles) {
        [].concat(tiles).forEach((tile) => {
            const x = tile.column * this.tileWidth;
            const y = tile.row * this.tileHeight;
            const w = tile.pixelWidth;
            const h = tile.pixelHeight;

            var imgData = this.context.createImageData(w, h);

            tile.data.forEach((val, i) => {
                imgData.data[i] = val;
            })

            this.context.clearRect(x, y, w, h); // Clear.
            this.context.putImageData(imgData, x, y); // Draw.

            tile.isFilled = false;
        });
    }

    eraseAllTiles(tiles) {
        this.eraseTile(this.tiles);
    }
}

export default Mosaic;