function EditorCannon(x, y, width, height) {
    this.name = "Cannon";
    this.description = "When powered, fires gerbil-sized cannonballs.";

    this.speed = 3;
    this.direction = direction.right;
    this.powerSource = null;

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('speed', paramTypes.decimal, ValidateMin1));
    this.editables.push(new Editable('direction', paramTypes.direction));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new Cannon(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.direction, this.speed, this.powerSource);
    }
}
EditorCannon.prototype = new EditorBase();
EditorCannon.prototype.constructor = EditorCannon;

editorObjectTypes.push(
    { name: 'Cannon', type: EditorCannon, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);


function Cannon(x, y, width, height, dir, speed, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.direction = dir;
    this.speed = speed;
    this.isPowered = false;
    this.powerSource = powerSource;

    this.solid = true;

    this.executeRules = function () {
        var isPowered = false;
        if (this.powerSource) isPowered = this.powerSource.power > 0;
        if (!this.isPowered && isPowered) {
            sprites.push(new Cannonball(this.x - 12 / 2, this.y - 12 / 2, 12, 12, this.direction, this.speed));
        }
        this.isPowered = isPowered;
    };

    this.imageSource = document.getElementById("Cannon");

    this.color = new Color(100, 255, 128, 1.0);
    this.draw = function () {
        var x = (this.direction / 90 * 16);
        this.camera.drawImage(this.imageSource, x, 0, editorScale, editorScale, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
Cannon.prototype = new SpriteBase();
Cannon.prototype.constructor = Cannon;