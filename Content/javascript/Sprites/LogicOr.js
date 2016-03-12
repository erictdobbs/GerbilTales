function EditorLogicOr(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.input1 = null;
    this.input2 = null;
    this.isPowerSource = true;
    this.visible = true;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('input1', paramTypes.powerSource));
    this.editables.push(new Editable('input2', paramTypes.powerSource));
    this.editables.push(new Editable('visible', paramTypes.boolean));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new LogicOr(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input1, this.input2);
        logicSprite.visible = this.visible;
        return logicSprite;
    }
}
EditorLogicOr.prototype = new EditorBase();
EditorLogicOr.prototype.constructor = EditorLogicOr;

editorObjectTypes.push(
    { name: 'LogicOr', type: EditorLogicOr, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);

function LogicOr(x, y, width, height, input1, input2) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.visible = true;

    this.input1 = input1;
    this.input2 = input2;

    this.color = new Color(100, 128, 100, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.power = 0;

    this.executeRules = function () {
        if (this.input1 && this.input2) this.power = [this.input1.power, this.input2.power].max();
        else if (this.input1) this.power = this.input1.power;
        else if (this.input2) this.power = this.input2.power;
        else this.power = 0;
    };

    this.draw = function () {
        if (mode == gameMode.edit || this.visible) {
            gameViewContext.fillStyle = this.color.toString();
            this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
            gameViewContext.strokeStyle = this.borderColor.toString();
            gameViewContext.lineWidth = 3;
            this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

            gameViewContext.lineWidth = 6;
            var x1 = this.getLeft() + this.width / 4;
            var x2 = this.getRight() - this.width / 4;
            var y1 = this.getTop() + this.height / 4;
            var y2 = this.getBottom() - this.height / 4;

            gameViewContext.beginPath();
            this.camera.moveTo(x1, this.y);
            this.camera.lineTo(this.x, y2);
            this.camera.lineTo(x2, this.y);
            this.camera.lineTo(this.x, y1);
            this.camera.lineTo(x1, this.y);
            gameViewContext.stroke();
        }
    }
}
LogicOr.prototype = new SpriteBase();
LogicOr.prototype.constructor = LogicOr;