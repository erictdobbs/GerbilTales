function Fan(x, y, width, height, powerSource) {
    SpriteBase.call(this, x + width/2, y + height/2);
    this.width = width;
    this.height = height;
    this.range = 300;

    this.powerSource = powerSource;

    this.fanParticles = []
    for (var i = 0; i < 9; i++) this.fanParticles.push(new FanParticle(this, Math.random() * this.width, 16 * i));
    
    this.color = new Color(100, 128, 128, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);

    this.executeRules = function () {
        this.cameraFocus = this.powerSource.cameraFocus;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] instanceof Gerbil) {
                if (sprites[i].getBottom() <= this.getTop() &&
                    sprites[i].getRight() > this.getLeft() &&
                    sprites[i].getLeft() < this.getRight()) {
                    sprites[i].dy -= this.getFanStrength(sprites[i].y);
                    sprites[i].dy -= Math.random() * 0.2;
                    if (sprites[i].getBottom() == this.getTop()) sprites[i].y -= 1;
                }
            }
        }
    };

    this.getPower = function () {
        if (this.powerSource) return this.powerSource.power;
        return 0;
    }

    this.getFanStrength = function(y) {
        return (this.range - (this.y - y)) / this.range * this.getPower() / 2;
    }

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        if (debugMode) {
            gameViewContext.font = "20px monospace";
            gameViewContext.fillStyle = this.borderColor.toString();
            this.camera.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
        }

        for (var i = 0; i < this.fanParticles.length; i++) this.fanParticles[i].draw();
    }
}
Fan.prototype = new SpriteBase();
Fan.prototype.constructor = Fan;

function FanParticle(fan, x, y) {
    this.fan = fan;
    this.x = x;
    this.y = y;
    this.dy = 0;

    this.draw = function () {
        var fanStrength = this.fan.getFanStrength(this.y);
        this.dy = (10 * fanStrength) - 1;
        this.y -= this.dy;
        if (this.y > this.fan.range / 2) {
            this.y = 0;
            this.x = this.fan.width * Math.random();
        }

        var fanColor = this.fan.borderColor;
        var alpha = Math.pow(this.fan.getPower() * (this.fan.range - this.y) / this.fan.range, 0.4);
        if (alpha > 1.0) alpha = 1.0;
        this.color = new Color(fanColor.r, fanColor.g, fanColor.b, alpha);
        gameViewContext.strokeStyle = this.color.toString();
        this.fan.camera.strokeRect(this.fan.getLeft() + this.x, this.fan.getTop() - this.y, 1, 1);
    }
}