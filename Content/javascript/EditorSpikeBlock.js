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