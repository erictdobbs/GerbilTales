function EditorClock(x, y, radius) {
    EditorBase.call(this, x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.timeOn = 30;
    this.timeOff = 30;
    this.startingTick = 0;

    this.isPowerSource = true;
    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('timeOn', paramTypes.integer));
    this.editables.push(new Editable('timeOff', paramTypes.integer));
    this.editables.push(new Editable('startingTick', paramTypes.integer));

    this.anchors.push(new CenterAnchor(this));
    this.anchors.push(new RadiusAnchor(this));
    
    this.createSprite = function () {
        var clock = new Clock(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.radius * 2) * editorScale);
        clock.timeOff = this.timeOff;
        clock.timeOn = this.timeOn;
        clock.currentTimeCounter = this.startingTick;
        return clock;
    }
}
EditorClock.prototype = new EditorBase();
EditorClock.prototype.constructor = EditorClock;