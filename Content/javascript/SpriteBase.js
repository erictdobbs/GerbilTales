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

    this.applyGravity = function (alternateGravityConstant) {
        var gravity = 0.2;
        if (alternateGravityConstant != null) gravity = alternateGravityConstant;

        if (this.dy < 5) {
            this.dy += gravity;
            if (this.dy > 5) this.dy = 5;
        }


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
        return this.camera.getMouseX() <= this.getRight() &&
            this.camera.getMouseX() >= this.getLeft() &&
            this.camera.getMouseY() <= this.getBottom() &&
            this.camera.getMouseY() >= this.getTop();
    }

    this.doesOverlapSprite = function (sprite) {
        if (this.getLeft() > sprite.getRight()) return false;
        if (this.getRight() < sprite.getLeft()) return false;
        if (this.getTop() > sprite.getBottom()) return false;
        if (this.getBottom() < sprite.getTop()) return false;
        return true;
    }

    this.blockMovement = function (lockHorizontal) {
        var blocked = [];
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
                        blocked.push(sprites[i]);
                    }
                    else {
                        if (this.dx > 0) this.dx = 0;
                        this.setRight(sprites[i].getLeft());
                        blocked.push(sprites[i]);
                    }
                }
                else {
                    if (keyboardState.isDownPressed() && sprites[i] instanceof Gerbil && this instanceof Gerbil) continue;
                    if (this.y < sprites[i].y) {
                        this.isStanding = true;
                        this.riding = sprites[i];
                        this.setBottom(sprites[i].getTop());
                        this.dy = sprites[i].dy;
                        blocked.push(sprites[i]);
                    } else {
                        if (sprites[i] instanceof Wall /*|| sprites[i] instanceof Scale*/) this.setTop(sprites[i].getBottom());
                        if (this.dy < 0) this.dy = 0;
                        blocked.push(sprites[i]);
                    }
                }
            }
        }
        return blocked;
    }

    this.getCumulativeRiders = function () {
        var ret = [];
        for (var i = 0; i < sprites.length; i++) if (this === sprites[i].riding) {
            ret.push(sprites[i]);
            ret.pushArray(sprites[i].getCumulativeRiders());
        }
        return ret.distinct();
    }

    this.findSolidPoint = function(sprites, dir) {
        // Finds first solid sprite in provided direction
        // Will not detect some solids thinner than one tile
        // Returns coordinate and sprite {x,y,sprite}
        // Searches from center of this sprite

        var intersected = [];
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] == this) continue;
            if (this.doesOverlapSprite(sprites[i])) {
                if (sprites[i].solid) intersected.push(sprites[i]);
            }
        }
        var ret = null;
        if (dir == direction.right) {
            var hit = sprites.min(function (spr) { return spr.getLeft(); });
            if (hit) ret = { x: hit.getLeft(), y: this.y, sprite: hit };
        } else if (dir == direction.up) {
            var hit = sprites.min(function (spr) { return spr.getBottom(); });
            if (hit) ret = { x: this.x, y: hit.getBottom(), sprite: hit };
        } else if (dir == direction.left) {
            var hit = sprites.min(function (spr) { return spr.getRight(); });
            if (hit) ret = { x: hit.getRight(), y: this.y, sprite: hit };
        } else if (dir == direction.down) {
            var hit = sprites.min(function (spr) { return spr.getTop(); });
            if (hit) ret = { x: this.x, y: hit.getTop(), sprite: hit };
        }
        return ret;
    }
}

var direction = {
    right: 0,
    up: 90,
    left: 180,
    down: 270
}