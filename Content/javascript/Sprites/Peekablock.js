function EditorPeekablock(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.powerSource = null;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new Peekablock(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.powerSource);
    }
}
EditorPeekablock.prototype = new EditorBase();
EditorPeekablock.prototype.constructor = EditorPeekablock;

editorObjectTypes.push(
    { name: 'Peekablock', type: EditorPeekablock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
);


function Peekablock(x, y, width, height, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.powerSource = powerSource;

    this.color = new Color(100, 100, 128, 1.0);
    this.transparentColor = new Color(100, 100, 128, 0.4);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
        var isOn = false;
        if (this.powerSource) isOn = this.powerSource.power > 0;
        this.solid = isOn;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        if (!this.solid) gameViewContext.fillStyle = this.transparentColor.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Peekablock.prototype = new SpriteBase();
Peekablock.prototype.constructor = Peekablock;