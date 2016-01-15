function EditorGerbilSpawn(x, y, width, height) {
    EditorBase.call(this, x, y, width, height);

    this.maxGerbils = 5;
    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer));
    this.editables.push(new Editable('height', paramTypes.integer));
    this.editables.push(new Editable('maxGerbils', paramTypes.integer));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new GerbilSpawn(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width) * editorScale,
            parseInt(this.height) * editorScale,
            this.maxGerbils);
    }
}
EditorGerbilSpawn.prototype = new EditorBase();
EditorGerbilSpawn.prototype.constructor = EditorGerbilSpawn;