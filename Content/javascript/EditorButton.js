function EditorButton(x, y, width) {
    EditorBase.call(this, x, y, width, 1);

    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('neededPush', paramTypes.integer));

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