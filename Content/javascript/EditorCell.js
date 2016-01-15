function EditorCell(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.powerSource = null;
    this.gerbilCount = 0;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));
    this.editables.push(new Editable('gerbilCount', paramTypes.integer));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        var cell = new Cell(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            parseInt(this.height) * editorScale,
            this.powerSource, 
            this.gerbilCount);
        return cell;
    }
}
EditorCell.prototype = new EditorBase();
EditorCell.prototype.constructor = EditorCell;