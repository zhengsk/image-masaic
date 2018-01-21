/**
 * {
 *  context,
 *  tileWidth,
 *  tileHeight,
 *  width,
 *  height,
 *  imageData,
 *  tileRowSize,
 *  tileColumnSize,
 *  tiles: [{
 *      row,
 *      column,
 *      pixelWidth,
 *      pixelHeight,
 *      data,
 *      color,
 *  }, ...]
 * }
 */
class Masaic {
    constructor(context, { tileWidth = 20, tileHeight = 20, brushSize = 1 } = {}) {
        const { canvas } = context;
        this.brushSize = brushSize;
        this.context = context;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = canvas.width;
        this.height = canvas.height;

        const { width, height } = this;
        this.imageData = context.getImageData(0, 0, width, height).data;
        this.tileRowSize = Math.ceil(height / this.tileHeight);
        this.tileColumnSize = Math.ceil(width / this.tileWidth);

        this.tiles = []; // All image tiles.

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

                this.tiles.push(tile);
            }
        }

        this.setTilesData();
    }

    setTilesData() {
        const imageData = this.imageData;
        this.tiles.forEach(tile => {
            const data = [];
            for (let i = 0, j = tile.pixelHeight; i < j; i++) {
                const pixelPosition = this.width * 4 * this.tileHeight * tile.row + tile.column * this.tileWidth * 4;
                data.push.apply(data, imageData.slice(pixelPosition + this.width * 4 * i, pixelPosition + this.width * 4 * i + tile.pixelWidth * 4));
            };

            tile.data = data;
        });
    }

    drawTile(tile) {
        const tiles = [].concat(tile);
        tiles.forEach((tile) => {
            if (!tile.color) {
                console.info('xxx');
                let r = 0, g = 0, b = 0, a = 0;
                let w = 0;
                for (let i = 0, len = tile.data.length; i < len; i += 4) {
                    r += tile.data[i];
                    g += tile.data[i + 1];
                    b += tile.data[i + 2];
                    a += tile.data[i + 3];
                }

                tile.color = [
                    parseInt(r / tile.data.length / 4, 10),
                    parseInt(g / tile.data.length / 4, 10),
                    parseInt(b / tile.data.length / 4, 10),
                    parseInt(a / tile.data.length / 4, 10),
                ];

                // console.info(tile.color);
            }

            // console.info(`#${tile.color[0].toString(16)}${tile.color[1].toString(16)}${tile.color[2].toString(16)}`);
            this.context.fillStyle=`#${tile.color[0].toString(16)}${tile.color[1].toString(16)}${tile.color[2].toString(16)}`;
            this.context.fillRect(tile.column * this.tileHeight, tile.row * this.tileWidth,  tile.pixelWidth, tile.pixelHeight);
        });
    }

    drawTileByPoint(x, y) {
        const tile = this.getTilesByPoint(x, y);
        this.drawTile(tile);
    }

    getTilesByPoint(x, y, extend = true) {
        const tiles = [];
        let column = Math.floor(x / this.tileWidth);
        let row = Math.floor(y / this.tileHeight);

        tiles.push(this.tiles[row * this.tileColumnSize + column]);

        if (extend) {
            let brushSize = this.brushSize;
            while (brushSize > 0) {
                column = Math.min(Math.floor(x / this.tileWidth) + extend, this.tileColumnSize - 1);
                row = Math.min(Math.floor(y / this.tileHeight), this.tileRowSize - 1);
                tiles.push(this.tiles[row * this.tileColumnSize + column]);

                column = Math.min(Math.floor(x / this.tileWidth) - extend, this.tileColumnSize - 1);
                row = Math.min(Math.floor(y / this.tileHeight), this.tileRowSize - 1);
                tiles.push(this.tiles[row * this.tileColumnSize + column]);

                column = Math.min(Math.floor(x / this.tileWidth), this.tileColumnSize - 1);
                row = Math.min(Math.floor(y / this.tileHeight) + extend, this.tileRowSize - 1);
                tiles.push(this.tiles[row * this.tileColumnSize + column]);

                column = Math.min(Math.floor(x / this.tileWidth), this.tileColumnSize - 1);
                row = Math.min(Math.floor(y / this.tileHeight) - extend, this.tileRowSize - 1);
                tiles.push(this.tiles[row * this.tileColumnSize + column]);

                brushSize -= 1;
            }
        }
        console.info(tiles.length)
        return tiles;
    }

}


function drawImageToCanvas(imageUrl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;

            ctx.drawImage(this, 0, 0, this.width, this.height);

            resolve(ctx);
        }

        image.src = imageUrl;
    });
}

drawImageToCanvas('./image/meinv.jpeg').then(ctx => {
    window.masaic =  new Masaic(ctx);

    let x = 0;
    // setInterval(() => {
    //     console.info(`row: ${masaic.tiles[x].row},column: ${masaic.tiles[x].column}`);
    //     masaic.drawTile(masaic.tiles[x]);
    //     x++;
    // }, 100);

    // const draw = () => {
    //     if (masaic.tiles[x]) {
    //         // console.info(x);
    //         masaic.drawTile(masaic.tiles[x]);
    //         x++;
    //         draw();
    //     } else {
    //         // console.timeEnd('xx');
    //     }
    // };

    // setTimeout(() => {
    //     // console.time('xx');
    //     window.requestAnimationFrame(draw);
    // }, 2000);

    // console.time('xx');
    // while(masaic.tiles[x]) {
    //     masaic.drawTile(masaic.tiles[x]);
    //     ++x;
    // }
    // console.timeEnd('xx');

    // setTimeout(() => {
    //     console.time('xx');
    //     while(masaic.tiles[x]) {
    //         masaic.drawTile(masaic.tiles[x]);
    //         ++x;
    //     }
    //     console.timeEnd('xx');
    // }, 2000);

    const MouseEvents = {
        bind() {
            masaic.context.canvas.addEventListener('mousedown', MouseEvents.mousedown);
        },

        mousedown() {
            masaic.context.canvas.addEventListener('mousemove', MouseEvents.mousemove);
            masaic.context.canvas.addEventListener('mouseup', MouseEvents.mouseup);
        },

        mousemove(e) {
            masaic.drawTileByPoint(e.layerX, e.layerY);
        },

        mouseup() {
            masaic.context.canvas.removeEventListener('mousemove', MouseEvents.mousemove);
            masaic.context.canvas.removeEventListener('mouseup', MouseEvents.mouseup);
        }
    }
    MouseEvents.bind();


});

