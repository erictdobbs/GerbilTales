function Scale(x, y, width, height) {
    SpriteBase.call(this, x + width / 2, y + height / 2);
    this.originalY = this.y;
    this.targetDy = 0;
    this.minY = 90;

    this.width = width;
    this.height = height;

    this.weight = 5;
    this.ridingWeight = 0;
    this.paired = null;
    
    this.color = new Color(128, 128, 160, 1.0);
    this.borderColor = new Color(100, 100, 100, 1.0);

    this.executeRules = function () {
        var riders = this.getCumulativeRiders();
        var sumWeight = 0;
        for (var i = 0; i < riders.length; i++) sumWeight += riders[i].weight;
        this.ridingWeight = sumWeight;
        this.targetDy = (this.ridingWeight - (this.paired ? this.paired.ridingWeight : 0)) / 10;
        if (this.targetDy == 0 && this.ridingWeight == 0) {
            this.targetDy = (this.originalY - this.y) / 5;
            if (Math.abs(this.targetDy) > .25) this.targetDy = this.targetDy > 0 ? .25 : -.25;
        }
        this.dy = (4*this.dy + this.targetDy) / 5;
        this.y += this.dy;
        for (var i = 0; i < riders.length; i++) riders[i].y += this.dy;
    };

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        gameViewContext.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

        gameViewContext.font = "20px monospace";
        gameViewContext.fillStyle = this.borderColor.toString();
        gameViewContext.fillText(sprites.indexOf(this), this.x - 11, this.y + 5);

        gameViewContext.fillText(this.ridingWeight, this.x - 11, this.getTop() - 20);

        if (this.paired && this.paired.x > this.x) {
            var drawX = this.x;
            var drawY = this.getTop() - 30;
            while (drawY > this.minY) {
                gameViewContext.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawY -= 30;
            }
            drawX += (this.minY - drawY);
            drawY = this.minY;
            while (drawX < this.paired.x) {
                gameViewContext.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawX += 30;
            }
            drawY += (drawX - this.paired.x);
            drawX = this.paired.x;
            while (drawY < this.paired.getTop()) {
                gameViewContext.strokeRect(drawX - 6, drawY - 6, 12, 12);
                drawY += 30;
            }
        }

    }

    this.pair = function (sprite) {
        if (this.paired) this.paired.paired = null;
        this.paired = sprite;
        sprite.paired = this;
    }
}
Scale.prototype = new SpriteBase();
Scale.prototype.constructor = Scale;