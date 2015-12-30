function Wheel(x, y, diameter) {
    SpriteBase.call(this, x, y);
    this.width = diameter;
    this.height = diameter;
    this.maxRunners = 3;
    this.runners = [];
    this.power = 0;
    
    this.color = new Color(192, 192, 128, 0.7);
    this.borderColor = new Color(100, 100, 80, 1.0);
    this.isClicked = false;

    this.executeRules = function () {
        if (!this.isClicked && keyboardState.isKeyPressed(keyboardState.key.S) && this.runners.length > 0) {
            this.isClicked = true;
            this.runners[0].wheel = null;
            this.runners[0].setRight(this.getLeft() - 1);
            this.runners[0].dx = -3;
            this.runners.splice(0, 1);
        }
        if (!keyboardState.isKeyPressed(keyboardState.key.S)) {
            this.isClicked = false;
        }

        for (var i = 0; i < this.runners.length; i++) this.updateRunner(this.runners[i]);
        this.power += this.runners.length * 0.0003;
        if (this.power > this.runners.length / this.maxRunners) this.power = this.runners.length / this.maxRunners;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] instanceof Gerbil && this.doesOverlapSprite(sprites[i])) {
                if (sprites[i].wheel == null && this.runners.length < this.maxRunners) {
                    this.runners.push(sprites[i]);
                    sprites[i].x = this.x + (Math.random() - 0.5) * this.width / 3;
                    sprites[i].y = this.y;
                    sprites[i].dx = 0.2;
                    sprites[i].dy = 0;
                    sprites[i].wheel = this;
                    return;
                }
            }
        }
    };

    this.updateRunner = function (runner) {
        runner.x += runner.dx;
        runner.y += runner.dy;
        var radius = this.width / 2 - 8;
        var minX = this.x - this.width / 3;
        if (runner.x < minX) {
            runner.x += 2;
            runner.y -= 2;
            runner.dx = 2 + Math.random() * 3;
            runner.dy = -3;
        }
        var maxX = this.x + radius;
        if (runner.x > maxX) runner.x = maxX;
        var maxY = this.y + Math.pow(-Math.pow(this.x - runner.x, 2) + Math.pow(radius, 2), 0.5);
        if (runner.y > maxY) {
            runner.y = maxY;
            runner.dy = 0;
            runner.dx = -5 * this.power * (runner.y - this.y) / radius;
        }
        var maxY = this.y + radius;
        if (runner.y > maxY) runner.y = maxY;
        runner.dy += 0.4;
    }

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.beginPath();
        gameViewContext.arc(this.x, this.y, this.width/2, 0, 2 * Math.PI);
        //gameViewContext.fill();
        gameViewContext.stroke();

        //gameViewContext.fillStyle = this.color.toString();
        //gameViewContext.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        //gameViewContext.strokeStyle = this.borderColor.toString();
        //gameViewContext.lineWidth = 3;
        //gameViewContext.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        gameViewContext.font = "20px monospace";
        gameViewContext.fillStyle = this.borderColor.toString();
        gameViewContext.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);
    }
}
Wheel.prototype = new SpriteBase();
Wheel.prototype.constructor = Wheel;