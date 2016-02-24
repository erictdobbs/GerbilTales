function Clock(x, y, diameter) {
    SpriteBase.call(this, x, y);
    this.width = diameter;
    this.height = diameter;
        
    this.poweredColor = new Color(50, 192, 50, 1.0);
    this.color = new Color(128, 192, 192, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.solid = false;

    this.power = 1;
    this.timeOn = 30;
    this.timeOff = 30;

    this.currentTimeCounter = 0;

    this.executeRules = function () {
        if (this.currentTimeCounter >= this.timeOn) {
            this.power = 0;
        }
        if (this.currentTimeCounter >= this.timeOn + this.timeOff) {
            this.power = 1;
            this.currentTimeCounter %= (this.timeOn + this.timeOff);
        }
        this.currentTimeCounter++;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        

        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.fill();
        gameViewContext.fillStyle = this.poweredColor.toString();
        gameViewContext.beginPath();
        this.camera.moveTo(this.x, this.y);
        this.camera.arc(this.x, this.y, this.width / 2, 3 * Math.PI / 2, 3 * Math.PI / 2 + (2 * Math.PI) * (this.timeOn / (this.timeOn + this.timeOff)), false);
        this.camera.lineTo(this.x, this.y);
        gameViewContext.closePath();
        gameViewContext.fill();

        var theta = (-0.25 + (this.currentTimeCounter / (this.timeOn + this.timeOff))) * Math.PI * 2;
        var radius = this.width / 2;
        this.camera.drawLine(this.x, this.y, this.x + radius * Math.cos(theta), this.y + radius * Math.sin(theta));
        gameViewContext.beginPath();
        this.camera.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.closePath();
        gameViewContext.stroke();
        
        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }
    }
}
Clock.prototype = new SpriteBase();
Clock.prototype.constructor = Clock;