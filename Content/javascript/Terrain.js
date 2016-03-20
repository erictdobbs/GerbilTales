
function Terrain(imageSource, tileTypes) {
    this.imageSource = imageSource;
    this.tileTypes = tileTypes;

    this.getTileLocation = function (tileType, x, y) {
        var tiles = this.tileTypes[tileType];
        var tile = this.tileTypes[tileType][0];
        if (tiles.length != 1) {
            // use x,y coords to get deterministic random value
            var mapping = Math.abs(parseInt(Math.sin(x * 200 + y) * 100) / 100);
            var chanceTiles = tiles.filter(function (t) { return t.frequency });
            var defaultTiles = tiles.filter(function (t) { return !t.frequency });
            var chance = 0;
            var specialTileFound = false;
            for (var i = 0; i < chanceTiles.length; i++) {
                chance += chanceTiles[i].frequency;
                if (mapping <= chance) {
                    tile = chanceTiles[i];
                    specialTileFound = true;
                    break;
                }
            }
            if (!specialTileFound) tile = defaultTiles.rand();
        }
        return { x: tile.x * editorScale, y: tile.y * editorScale };
    }

    this.drawTile = function (sprite, tileLocationString, x, y) {
        var tileLocation = this.getTileLocation(tileLocationString, x, y);
        sprite.camera.drawImage(sprite.imageSource, tileLocation.x, tileLocation.y, editorScale, editorScale, x, y, editorScale, editorScale);
    }

    this.draw = function (sprite) {
        if (sprite.width == editorScale) {
            if (sprite.height == editorScale) {
                this.drawTile(sprite, "block", sprite.getLeft(), sprite.getTop());
            } else {
                this.drawTile(sprite, "topVerticalWedge", sprite.getLeft(), sprite.getTop());
                this.drawTile(sprite, "bottomVerticalWedge", sprite.getLeft(), sprite.getBottom() - editorScale);
                for (var i = sprite.getTop() + editorScale; i < sprite.getBottom() - editorScale; i += editorScale) {
                    this.drawTile(sprite, "centerVerticalWedge", sprite.getLeft(), i);
                }
            }
        } else if (sprite.height == editorScale) {
            this.drawTile(sprite, "leftHorizontalWedge", sprite.getLeft(), sprite.getTop());
            this.drawTile(sprite, "rightHorizontalWedge", sprite.getRight() - editorScale, sprite.getTop());
            for (var i = sprite.getLeft() + editorScale; i < sprite.getRight() - editorScale; i += editorScale) {
                this.drawTile(sprite, "centerHorizontalWedge", i, sprite.getTop());
            }
        } else {
            for (var i = sprite.getLeft() + editorScale; i < sprite.getRight() - editorScale; i += editorScale) {
                this.drawTile(sprite, "top", i, sprite.getTop());
                this.drawTile(sprite, "bottom", i, sprite.getBottom() - editorScale);
                for (var j = sprite.getTop() + editorScale; j < sprite.getBottom() - editorScale; j += editorScale) {
                    this.drawTile(sprite, "center", i, j);
                }
            }
            for (var j = sprite.getTop() + editorScale; j < sprite.getBottom() - editorScale; j += editorScale) {
                this.drawTile(sprite, "left", sprite.getLeft(), j);
                this.drawTile(sprite, "right", sprite.getRight() - editorScale, j);
            }
            this.drawTile(sprite, "topLeft", sprite.getLeft(), sprite.getTop());
            this.drawTile(sprite, "topRight", sprite.getRight() - editorScale, sprite.getTop());
            this.drawTile(sprite, "bottomLeft", sprite.getLeft(), sprite.getBottom() - editorScale);
            this.drawTile(sprite, "bottomRight", sprite.getRight() - editorScale, sprite.getBottom() - editorScale);
        }
    }
}

function GrassyTerrain() {
    var imageSource = document.getElementById("TerrainGrassy");
    var tileTypes = {
        topLeft: [{ x: 0, y: 0 }],
        top: [{ x: 1, y: 0 }, { x: 5, y: 1, frequency: 0.2 }],
        topRight: [{ x: 2, y: 0 }],
        left: [{ x: 0, y: 1 }],
        center: [{ x: 1, y: 1 }],
        right: [{ x: 2, y: 1 }],
        bottomLeft: [{ x: 0, y: 2 }],
        bottom: [{ x: 1, y: 2 }],
        bottomRight: [{ x: 2, y: 2 }],
        leftHorizontalWedge: [{ x: 4, y: 0 }],
        centerHorizontalWedge: [{ x: 5, y: 0 }],
        rightHorizontalWedge: [{ x: 6, y: 0 }],
        topVerticalWedge: [{ x: 3, y: 0 }],
        centerVerticalWedge: [{ x: 3, y: 1 }],
        bottomVerticalWedge: [{ x: 3, y: 2 }],
        block: [{x:4, y:1}]
    };
    Terrain.call(this, imageSource, tileTypes);
}
GrassyTerrain.prototype = new Terrain();
GrassyTerrain.prototype.constructor = GrassyTerrain;