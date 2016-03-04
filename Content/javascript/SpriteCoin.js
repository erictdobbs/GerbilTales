function Coin(x, y) {
    SpriteBase.call(this, x, y);

    this.solid = false;

    this.executeRules = function () {

    };

    this.frame = 0;
    this.frameCounter = 0;
    this.ticksPerFrame = 4;
    this.imageSource = document.getElementById("Coin");
    this.draw = function () {
        this.frameCounter++;
        if (this.frameCounter >= this.ticksPerFrame) {
            this.frameCounter = 0;
            this.frame++;
        }
        var frameX = this.frame % 4;
        var frameY = (parseInt(this.frame / 4)) % 2;
        this.camera.drawImage(this.imageSource, frameX * 16, frameY * 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
    }

}
Coin.prototype = new SpriteBase();
Coin.prototype.constructor = Coin;