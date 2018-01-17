class Masaic {
    constructor(context, { tileWidth = 50, tileHeight = 50 } = {}) {
        const { canvas } = context;

        this.context = context;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.width = canvas.width;
        this.height = canvas.height;

        const { width, height } = canvas;
        this.imageData = context.getImageData(0, 0, width, height).data;

        this.tiles = []; // All image tiles.

        for (let i = 0, row = Math.ceil(height / this.tileHeight); i < row; i++) {
            for (let j = 0, column = Math.ceil(width / this.tileWidth); j < column; j++) {

                const tile = {
                    row: i,
                    column: j,
                    pixelWidth: tileWidth,
                    pixelHeight: tileHeight,
                };

                if (j === column - 1) { // Last column
                    tile.pixelWidth = width - (j * tileWidth);
                }

                if (i === row - 1) { // Last row
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
                const pixelPosition = i * this.width + tile.column * this.tilewidth;
                data.push(imageData.slice(pixelPosition, pixelPosition + tile.pixelWidth));
            };

            tile.data = data;
        });
    }

    drawTile(tile) {
        this.context.fillStyle="#0000ff";
        this.context.fillRect(tile.row * this.tileWidth, tile.column * this.tileWidth, tile.pixelWidth, tile.pixelHeight);
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
    })
}

drawImageToCanvas('./image/meinv.jpeg').then(ctx => {
    window.masaic =  new Masaic(ctx);
});


