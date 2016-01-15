function EditorWall(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new Wall(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorWall.prototype = new EditorBase();
EditorWall.prototype.constructor = EditorWall;