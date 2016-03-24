function EditorCannon(x, y, width, height) {
    this.name = "Cannon";
    this.description = "When powered, fires gerbil-sized cannonballs at the specified interval.";

    this.speed = 3;
    this.direction = direction.right;
    this.ticksPerShot = 150;
    this.powerSource = null;

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('speed', paramTypes.decimal, ValidateMin1));
    this.editables.push(new Editable('direction', paramTypes.direction));
    this.editables.push(new Editable('ticksPerShot', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('powerSource', paramTypes.powerSource));

    this.anchors = [new CenterAnchor(this)];
    
    this.createSprite = function () {
        return new Cannon(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale,
            this.direction, this.speed, this.ticksPerShot, this.powerSource);
    }
}
EditorCannon.prototype = new EditorBase();
EditorCannon.prototype.constructor = EditorCannon;

editorObjectTypes.push(
    { name: 'Cannon', type: EditorCannon, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } }
);


function Cannon(x, y, width, height, dir, speed, ticksPerShot, powerSource) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.direction = dir;
    this.speed = speed;
    this.ticksPerShot = ticksPerShot;
    this.timer = 0;
    this.powerSource = powerSource;

    this.solid = true;

    this.color = new Color(255, 100, 128, 1.0);
    this.borderColor = new Color(150, 80, 80, 1.0);

    this.executeRules = function () {
        var isOn = false;
        if (this.powerSource) isOn = this.powerSource.power > 0;
        if (isOn) this.timer++;
        if (this.timer > this.ticksPerShot) {
            this.timer = 0;
            sprites.push(new Cannonball(x, y, 12, 12, this.direction, this.speed));
        }
    };

    this.imageSource = document.getElementById("Cannon");

    this.color = new Color(100, 255, 128, 1.0);
    this.draw = function () {
        var x = (this.direction == direction.right ? 0 : 16);
        console.log(x, this.direction, direction.right);
        this.camera.drawImage(this.imageSource, x, 0, editorScale, editorScale, this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getBottom() - 1, (this.width) * (this.timer / this.ticksPerShot), 1);
    }
}
Cannon.prototype = new SpriteBase();
Cannon.prototype.constructor = Cannon;