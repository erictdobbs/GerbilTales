var drawHitboxes = false;

function SpriteBase(x, y) {
    this.active = true;

    this.x = x;
    this.y = y;
    this.height = 16;
    this.width = 16;

    this.dx = 0;
    this.dy = 0;

    this.weight = 1;

    this.spriteClasses = [];
    this.shadowColor = "white";
    this.shadowBlur = 0;

    this.executeRules = function () { };

    this.prepareDraw = function () {
        gameViewContext.shadowBlur = this.shadowBlur;
        gameViewContext.shadowColor = this.shadowColor;
    }

    this.draw = function () {
        if (!this.active) return;
    }

    this.kill = function () {
        if (this.onKill) this.onKill();
        this.active = false;
    }

    this.delete = function () {
        sprites.splice(sprites.indexOf(this), 1);
    }

    this.getTop = function () { return this.y - this.height / 2; }
    this.getBottom = function () { return this.y + this.height/2; }
    this.getLeft = function () { return this.x - this.width / 2; }
    this.getRight = function () { return this.x + this.width / 2; }
    this.setTop = function (y) { this.y = y + this.height / 2; }
    this.setBottom = function (y) { this.y = y - this.height / 2; }
    this.setLeft = function (x) { this.x = x + this.width / 2; }
    this.setRight = function (x) { this.x = x - this.width / 2; }

    this.doesOverlapSprite = function (sprite) {
        if (this.getLeft() > sprite.getRight()) return false;
        if (this.getRight() < sprite.getLeft()) return false;
        if (this.getTop() > sprite.getBottom()) return false;
        if (this.getBottom() < sprite.getTop()) return false;
        return true;
    }

    //this.getRidingSprites = function () {
    //    var me = this;
    //    return sprites.filter(function (sprite) {
    //        return sprite.getBottom() == me.getTop() &&
    //            sprite.getLeft() < me.getRight() &&
    //            sprite.getRight() > me.getLeft();
    //    });
    //}

    //this.getSupportingSprites = function () {
    //    var me = this;
    //    return sprites.filter(function (sprite) {
    //        return sprite.getTop() == me.getBottom() &&
    //            sprite.getLeft() < me.getRight() &&
    //            sprite.getRight() > me.getLeft();
    //    });
    //}

    this.getCumulativeRiders = function () {
        var ret = [];
        //var riders = this.getRidingSprites();
        //for (var i = 0; i < riders.length; i++) {
        //    var supporters = riders[i].getSupportingSprites();
        //    if (supporters.every()) {
        //        ret.push(riders[i]);
        //        var cumulativeRiders = riders[i].getCumulativeRiders
        //    }
        //    ret += (riders[i].weight + riders[i].getCumulativeRiders()) / supporters.length;
        //}

        for (var i = 0; i < sprites.length; i++) if (this === sprites[i].riding) {
            ret.push(sprites[i]);
            ret.pushArray(sprites[i].getCumulativeRiders());
        }
        return ret.distinct();
    }
}