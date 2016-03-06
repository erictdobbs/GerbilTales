function EditorSpikeBlock(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new SpikeBlock(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorSpikeBlock.prototype = new EditorBase();
EditorSpikeBlock.prototype.constructor = EditorSpikeBlock;

editorObjectTypes.push(
    { name: 'Spike Block', type: EditorSpikeBlock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);


function SpikeBlock(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.color = new Color(255, 100, 128, 1.0);
    this.borderColor = new Color(150, 80, 80, 1.0);

    this.executeRules = function () {
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;

        var x1 = this.getLeft();
        var x2 = (this.getLeft() + this.x) / 2;
        var x3 = this.x;
        var x4 = (this.getRight() + this.x) / 2;
        var x5 = this.getRight();
        var y1 = this.getTop();
        var y2 = (this.getTop() + this.y) / 2;
        var y3 = this.y;
        var y4 = (this.getBottom() + this.y) / 2;
        var y5 = this.getBottom();

        var points1 = [{ x: x3, y: y1 },
                      { x: x1, y: y3 },
                      { x: x3, y: y5 },
                      { x: x5, y: y3 }];
        var points2 = [{ x: x1, y: y1 },
                      { x: x2, y: y3 },
                      { x: x1, y: y5 },
                      { x: x3, y: y4 },
                      { x: x5, y: y5 },
                      { x: x4, y: y3 },
                      { x: x5, y: y1 },
                      { x: x3, y: y2 }];
        this.camera.drawPolygon(points1);
        this.camera.drawPolygon(points2);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
SpikeBlock.prototype = new SpriteBase();
SpikeBlock.prototype.constructor = SpikeBlock;