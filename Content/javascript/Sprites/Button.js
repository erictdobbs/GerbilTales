function EditorButton(x, y, width) {
    EditorBase.call(this, x, y, width, 1);

    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('neededPush', paramTypes.integer, ValidateMin1));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new LeftAnchor(this));
    this.anchors.push(new RightAnchor(this));
    
    this.createSprite = function () {
        var button = new Button(parseInt(this.tileX) * editorScale,
            (parseInt(this.tileY) + 0.5) * editorScale,
            parseInt(this.width) * editorScale,
            editorScale/2);
        return button;
    }
}
EditorButton.prototype = new EditorBase();
EditorButton.prototype.constructor = EditorButton;

editorObjectTypes.push(
    { name: 'Button', type: EditorButton, add: function (tileX, tileY) { return new this.type(tileX, tileY, 3); } }
);

function Button(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.color = new Color(100, 128, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.pushers = 0;
    this.neededPush = 3;
    this.power = 0;

    this.executeRules = function () {
        this.pushers = this.getCumulativeRiders();

        var powerDelta = this.pushers.length / this.neededPush * 0.01;
        this.power += powerDelta;
        if (this.power > this.pushers.length / this.neededPush) this.power = this.pushers.length / this.neededPush;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (this.pushers.length) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.centerText(this.pushers.length + "/" + this.neededPush, this.x, this.pushers.map(function (a) { return a.getTop() - a.height }).min());
        }

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Button.prototype = new SpriteBase();
Button.prototype.constructor = Button;