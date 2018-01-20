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
    constructor(context, { tileWidth = 50, tileHeight = 50 } = {}) {
        const { canvas } = context;

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
                console.info(pixelPosition + this.width * 4 * i, pixelPosition + this.width * 4 * i + tile.pixelWidth * 4);
                data.push.apply(data, imageData.slice(pixelPosition + this.width * 4 * i, pixelPosition + this.width * 4 * i + tile.pixelWidth * 4));
            };

            tile.data = data;
        });
    }

    drawTile(tile) {
        if (!tile.color) {
            let r = 0, g = 0, b = 0, a = 0;

            for (let i = 0, len = tile.data.length; i < len; i++) {
                for (let m = 0, n = tile.data[i].length; m < n; m += 4) {
                    r += tile.data[i];
                    g += tile.data[i + 1];
                    b += tile.data[i + 2];
                    a += tile.data[i + 3];
                }
            }

            tile.color = [
                parseInt(r / tile.data.length * tile.pixelWidth, 10),
                parseInt(g / tile.data.length * tile.pixelWidth, 10),
                parseInt(b / tile.data.length * tile.pixelWidth, 10),
                parseInt(a / tile.data.length * tile.pixelWidth, 10),
            ];
        }

        console.info(`#${tile.color[0].toString(16)}${tile.color[1].toString(16)}${tile.color[2].toString(16)}`);
        this.context.fillStyle=`#${tile.color[0].toString(16)}${tile.color[1].toString(16)}${tile.color[2].toString(16)}`;
        this.context.fillRect(tile.column * this.tileHeight, tile.row * this.tileWidth,  tile.pixelWidth, tile.pixelHeight);
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
    //     console.info(x);
    //     masaic.drawTile(masaic.tiles[x]);
    //     x++;
    // }, 1);

    const draw = () => {
        if (masaic.tiles[x]) {
            console.info(x);
            masaic.drawTile(masaic.tiles[x]);
            x++;
            draw();
        } else {
            console.timeEnd('xx');
        }
    };

    setTimeout(() => {
        console.time('xx');
        window.requestAnimationFrame(draw);
    }, 2000);

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

});

