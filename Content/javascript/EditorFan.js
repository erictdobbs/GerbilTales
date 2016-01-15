function EditorFan(x, y, width) {
    EditorBase.call(this, x, y, width, 1);

    this.powerSource = null;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new LeftAnchor(this));
    this.anchors.push(new RightAnchor(this));
    
    this.createSprite = function () {
        var fan = new Fan(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            editorScale,
            this.powerSource);
        return fan;
    }
}
EditorFan.prototype = new EditorBase();
EditorFan.prototype.constructor = EditorFan;