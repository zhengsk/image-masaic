# image-mosaic

Set mosaic to image by canvas. [Demon Page](https://zhengsk.github.io/image-masaic/dist/index.html)

## Install
```
npm install image-mosaic
```

## Usage
```javascript
    import Mosaic from 'image-mosaic';

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');

    const mosaic =  new Mosaic(ctx, {
        tileWidth: 10,
        tileHeight: 10,
        brushSize: 3,
    });

    // Mosaic on full image.
    mosaic.drawAllTiles();
```


# Instance property

```javascript
{
    context, // canvas context.
    imageData, // canvas image data.
    width, // canvas width.
    height, // canvas height.
    tileWidth,
    tileHeight,
    tileRowSize, // tile count in a row.
    tileColumnSize, // tile count in a column.
    tiles: [ // tiles.
        {
            row, // tile row position.
            column, // tile column position.
            pixelWidth, // tile pixel number.
            pixelHeight, // tile pixel number.
            data, // tile data.
            color,
            isFilled,
        }, ...
    ]
}
```


# Methods

```js
    mosaic.drawTile(tiles);

    mosaic.drawTileByPoint(x, y);

    mosaic.getTilesByPoint(x, y, isBrushSize);

    mosaic.drawAllTiles();

    mosaic.eraseTile(tiles);

    mosaic.eraseTileByPoint(x, y, isBrushSize);

    mosaic.eraseAllTiles();
```


![Demon image](https://raw.githubusercontent.com/zhengsk/image-masaic/master/src/images/demo.gif)
