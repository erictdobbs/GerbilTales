function EditorWall(x, y, width, height) {
    this.name = "Wall";
    this.description = "Your basic solid object";

    EditorBase.call(this, x, y, width, height);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));
    this.editables.push(new Editable('width', paramTypes.integer, ValidateMin1));
    this.editables.push(new Editable('height', paramTypes.integer, ValidateMin1));

    this.anchors = ResizerAnchorSet(this);
    
    this.createSprite = function () {
        return new Wall(parseInt(this.tileX) * editorScale,
            parseInt(this.tileY) * editorScale,
            parseInt(this.width + this.tileX - parseInt(this.tileX)) * editorScale,
            parseInt(this.height + this.tileY - parseInt(this.tileY)) * editorScale);
    }
}
EditorWall.prototype = new EditorBase();
EditorWall.prototype.constructor = EditorWall;

editorObjectTypes.push(
    { name: 'Wall', type: EditorWall, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } }
);


function Wall(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;

    this.color = new Color(100, 100, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
    };

    this.imageSource = document.getElementById("TerrainGrassy");

    this.terrain = new GrassyTerrain();

    this.draw = function () {
        //gameViewContext.fillStyle = this.color.toString();
        //this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        //gameViewContext.strokeStyle = this.borderColor.toString();
        //gameViewContext.lineWidth = 3;
        //this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }

        this.terrain.draw(this);

        //for (var i = this.getLeft() + editorScale; i < this.getRight() - editorScale; i += editorScale) {
        //    this.camera.drawImage(this.imageSource, 16, 0, editorScale, editorScale, i, this.getTop(), editorScale, editorScale);
        //    this.camera.drawImage(this.imageSource, 16, 32, editorScale, editorScale, i, this.getBottom() - editorScale, editorScale, editorScale);
        //    for (var j = this.getTop() + editorScale; j < this.getBottom() - editorScale; j += editorScale) {
        //        this.camera.drawImage(this.imageSource, 16, 16, editorScale, editorScale, i, j, editorScale, editorScale);
        //    }
        //}
        //for (var j = this.getTop() + editorScale; j < this.getBottom() - editorScale; j += editorScale) {
        //    this.camera.drawImage(this.imageSource, 0, 16, editorScale, editorScale, this.getLeft(), j, editorScale, editorScale);
        //    this.camera.drawImage(this.imageSource, 32, 16, editorScale, editorScale, this.getRight() - editorScale, j, editorScale, editorScale);
        //}
        //this.camera.drawImage(this.imageSource, 0, 0, editorScale, editorScale, this.getLeft(), this.getTop(), editorScale, editorScale);
        //this.camera.drawImage(this.imageSource, 32, 0, editorScale, editorScale, this.getRight() - editorScale, this.getTop(), editorScale, editorScale);
        //this.camera.drawImage(this.imageSource, 0, 32, editorScale, editorScale, this.getLeft(), this.getBottom() - editorScale, editorScale, editorScale);
        //this.camera.drawImage(this.imageSource, 32, 32, editorScale, editorScale, this.getRight() - editorScale, this.getBottom() - editorScale, editorScale, editorScale);

    }
}
Wall.prototype = new SpriteBase();
Wall.prototype.constructor = Wall;