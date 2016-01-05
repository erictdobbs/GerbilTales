function Button(x, y, width, height) {
    SpriteBase.call(this, x + width/2, y + height/2);
    this.width = width;
    this.height = height;
        
    this.color = new Color(100, 128, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.pushers = 0;
    this.neededPush = 3;
    this.power = 0;

    this.executeRules = function () {
        this.pushers = this.getCumulativeRiders();

        var powerDelta = this.pushers.length / this.neededPush * 0.01;
        this.power += powerDelta;
        if (this.power > this.pushers.length / this.neededPush) this.power = this.pushers.length / this.neededPush;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (this.pushers.length) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.centerText(this.pushers.length + "/" + this.neededPush, this.x, this.pushers.map(function (a) { return a.getTop() - a.height }).min());
        }

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Button.prototype = new SpriteBase();
Button.prototype.constructor = Button;