function EditorWheel(x, y, radius) {
    EditorBase.call(this, x, y, radius * 2, radius*2);

    this.isPowerSource = true;
    this.radius = radius;
    this.maxRunners = 3;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('radius', paramTypes.integer));
    this.editables.push(new Editable('maxRunners', paramTypes.integer));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new RadiusAnchor(this));
    
    this.createSprite = function () {
        var wheel = new Wheel(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.radius * 2) * editorScale);
        wheel.maxRunners = this.maxRunners;
        return wheel;
    }
}
EditorWheel.prototype = new EditorBase();
EditorWheel.prototype.constructor = EditorWheel;