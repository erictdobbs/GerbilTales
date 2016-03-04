function EditorCoin(x, y) {
    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new Coin(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale);
    }
}
EditorCoin.prototype = new EditorBase();
EditorCoin.prototype.constructor = EditorCoin;