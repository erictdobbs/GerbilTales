﻿function Cannonball(x, y, width, height, directionOfMotion, speed) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.width = width;
    this.height = height;
    this.solid = true;
    this.speed = speed;

    this.direction = directionOfMotion;

    this.deadly = true;
    
    this.executeRules = function () {
        if (this.direction == direction.right) this.x += this.speed;
        if (this.direction == direction.left) this.x -= this.speed;
        if (this.direction == direction.down) this.y += this.speed;
        if (this.direction == direction.up) this.y -= this.speed;

        if (this.getSpritesOverlappingCenter().any(function (s) { return !(s instanceof Cannon || s instanceof Gerbil) })) {
            this.kill();
        }
    };

    this.imageSource = document.getElementById("Cannonball");

    this.draw = function () {
        this.camera.drawImage(this.imageSource, 0, 0, this.imageSource.width, this.imageSource.height, this.getLeft(), this.getTop(), this.width, this.height);
    }
}
Cannonball.prototype = new SpriteBase();
Cannonball.prototype.constructor = Cannonball;