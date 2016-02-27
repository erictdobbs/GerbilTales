function EditorLogicAnd(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.input1 = null;
    this.input2 = null;
    this.isPowerSource = true;
    this.visible = true;

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));
    this.editables.push(new Editable('input1', paramTypes.powerSource));
    this.editables.push(new Editable('input2', paramTypes.powerSource));
    this.editables.push(new Editable('visible', paramTypes.boolean));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var logicSprite = new LogicAnd(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.input1, this.input2);
        logicSprite.visible = this.visible;
        return logicSprite;
    }
}
EditorLogicAnd.prototype = new EditorBase();
EditorLogicAnd.prototype.constructor = EditorLogicAnd;