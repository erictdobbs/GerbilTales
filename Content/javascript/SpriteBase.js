var drawHitboxes = false;

var camera = new Camera(400, 300);

function SpriteBase(x, y) {
    this.camera = camera;
    this.active = true;
    this.solid = true;

    this.cameraFocus = false;

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

    this.getIndex = function () {
        return sprites.indexOf(this);
    }

    this.getTop = function () { return this.y - this.height / 2; }
    this.getBottom = function () { return this.y + this.height/2; }
    this.getLeft = function () { return this.x - this.width / 2; }
    this.getRight = function () { return this.x + this.width / 2; }
    this.setTop = function (y) { this.y = y + this.height / 2; }
    this.setBottom = function (y) { this.y = y - this.height / 2; }
    this.setLeft = function (x) { this.x = x + this.width / 2; }
    this.setRight = function (x) { this.x = x - this.width / 2; }

    this.isMouseOver = function () {
        return mouseX <= this.getRight() &&
            mouseX >= this.getLeft() &&
            mouseY <= this.getBottom() &&
            mouseY >= this.getTop();
    }

    this.doesOverlapSprite = function (sprite) {
        if (this.getLeft() > sprite.getRight()) return false;
        if (this.getRight() < sprite.getLeft()) return false;
        if (this.getTop() > sprite.getBottom()) return false;
        if (this.getBottom() < sprite.getTop()) return false;
        return true;
    }

    this.blockMovement = function (lockHorizontal) {
        this.riding = null;
        this.isStanding = false;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] == this) continue;
            if (sprites[i] == this.container) continue;
            if (!sprites[i].solid) continue;
            if (this.doesOverlapSprite(sprites[i])) {
                var xOff = this.x - sprites[i].x;
                var yOff = this.y - sprites[i].y;
                var blockedHoriz = Math.abs(xOff) + (sprites[i].height - sprites[i].width) / 2 >= Math.abs(yOff);
                if (blockedHoriz) {
                    if (lockHorizontal) continue;
                    if (this.x > sprites[i].x) {
                        if (this.dx < 0) this.dx = 0;
                        this.setLeft(sprites[i].getRight());
                    }
                    else {
                        if (this.dx > 0) this.dx = 0;
                        this.setRight(sprites[i].getLeft());
                    }
                }
                else {
                    if (keyboardState.isKeyPressed(keyboardState.key.S) && sprites[i] instanceof Gerbil && this instanceof Gerbil) continue;
                    if (this.y < sprites[i].y) {
                        this.isStanding = true;
                        this.riding = sprites[i];
                        this.setBottom(sprites[i].getTop());
                        this.dy = sprites[i].dy;
                    } else {
                        if (sprites[i] instanceof Wall || sprites[i] instanceof Scale) this.setTop(sprites[i].getBottom());
                        if (this.dy < 0) this.dy = 0;
                    }
                }
            }
        }
    }

    this.getCumulativeRiders = function () {
        var ret = [];
        for (var i = 0; i < sprites.length; i++) if (this === sprites[i].riding) {
            ret.push(sprites[i]);
            ret.pushArray(sprites[i].getCumulativeRiders());
        }
        return ret.distinct();
    }
}