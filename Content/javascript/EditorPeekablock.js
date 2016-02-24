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