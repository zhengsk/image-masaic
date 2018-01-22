import Mosaic from './scripts/mosaic';

function drawImageToCanvas(imageUrl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Annoymous'
        image.onload = function() {
            canvas.width = this.width;
            canvas.height = this.height;

            ctx.drawImage(this, 0, 0, this.width, this.height);

            resolve(ctx);
        }

        image.src = imageUrl;
    });
}

drawImageToCanvas('https://raw.githubusercontent.com/zhengsk/image-masaic/master/src/images/demon.jpg').then(ctx => {
    const mosaic =  new Mosaic(ctx);

    const MouseEvents = {
        init() {
            mosaic.context.canvas.addEventListener('mousedown', MouseEvents.mousedown);
        },

        mousedown() {
            mosaic.context.canvas.addEventListener('mousemove', MouseEvents.mousemove);
            document.addEventListener('mouseup', MouseEvents.mouseup);
        },

        mousemove(e) {
            if (e.shiftKey) {
                mosaic.eraseTileByPoint(e.layerX, e.layerY);
                return;
            }
            mosaic.drawTileByPoint(e.layerX, e.layerY);
        },

        mouseup() {
            mosaic.context.canvas.removeEventListener('mousemove', MouseEvents.mousemove);
            document.removeEventListener('mouseup', MouseEvents.mouseup);
        }
    }
    MouseEvents.init();

    document.querySelector('#drawAll').addEventListener('click', () => {
        mosaic.drawAllTiles();
    });

    document.querySelector('#clearAll').addEventListener('click', () => {
        mosaic.eraseAllTiles();
    });

});

