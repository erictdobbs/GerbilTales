function EditorLogicNot(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.input = null;
    this.isPowerSource = true;
    this.visible = true;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));
    this.editables.push(new Editable('input', paramTypes.powerSource));
    this.editables.push(new Editable('visible', paramTypes.boolean));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new LogicNot(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input);
        logicSprite.visible = this.visible;
        return logicSprite;
    }
}
EditorLogicNot.prototype = new EditorBase();
EditorLogicNot.prototype.constructor = EditorLogicNot;