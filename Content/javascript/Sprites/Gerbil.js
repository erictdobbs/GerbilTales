function EditorGerbil(x, y) {
    this.name = "Gerbil";
    this.description = "It's a gerbil!";

    EditorBase.call(this, x, y, 1, 1);

    this.editables.push(new Editable('tileX', paramTypes.integer));
    this.editables.push(new Editable('tileY', paramTypes.integer));

    this.anchors = [new CenterAnchor(this)];

    this.createSprite = function () {
        return new Gerbil((0.5 + parseInt(this.tileX)) * editorScale,
            (0.5 + parseInt(this.tileY)) * editorScale);
    }
}
EditorGerbil.prototype = new EditorBase();
EditorGerbil.prototype.constructor = EditorGerbil;

editorObjectTypes.push(
    { name: 'Gerbil', type: EditorGerbil, add: function (tileX, tileY) { return new this.type(tileX, tileY); } }
);



function GerbilX() {
    var numGerbils = 0;
    var xSum = 0;
    for (var i = 0; i < sprites.length; i++) if (sprites[i] instanceof Gerbil && sprites[i].container == null) {
        numGerbils++;
        xSum += sprites[i].x;
    }
    var center = xSum / numGerbils;
    return center;
}
function GerbilY() {
    var numGerbils = 0;
    var ySum = 0;
    for (var i = 0; i < sprites.length; i++) if (sprites[i] instanceof Gerbil && sprites[i].container == null) {
        numGerbils++;
        ySum += sprites[i].y;
    }
    var center = ySum / numGerbils;
    return center;
}

function Gerbil(x, y) {
    SpriteBase.call(this, x, y);

    this.isDead = false;
    this.deadTimer = 0;

    this.speed = Math.random() / 3 + 2.5;
    this.speedResetCounter = 0;
    this.frameCount = 0;
    this.cameraFocus = true;

    this.moveDirection = 0;
    this.climbCooldownTimer = 0;
    this.climbCounter = 0;

    this.color = new Color(192, 192, 128, 1.0);
    this.borderColor = new Color(100, 100, 80, 1.0);
    this.riding = null;
    this.container = null;

    this.isStanding = false;

    this.killGerbil = function () {
        this.isDead = true;
        this.solid = false;
        this.dx = 0;
        this.dy = -1;
    }

    this.executeRules = function () {
        if (this.isDead) {
            this.deadTimer++;
            this.x += this.dx;
            this.y += this.dy;

            if (this.deadTimer > 120) this.kill();
            return;
        }
        this.handleInput();
        this.cameraFocus = (this.container === null);

        if (this.dy >= 3) {
            var maxY = sprites.filter(function (spr) { return !(spr instanceof Gerbil); }).max(function (spr) { return spr.y; }).y;
            if (this.y > maxY + 300) {
                this.killGerbil();
                return;
            }
        }

        if (!this.container || this.container instanceof Cell) {
            this.applyGravity();

            this.speedResetCounter -= 1;
            if (this.speedResetCounter <= 0) {
                this.speed = Math.random() / 3 + 2.5;
                this.speedResetCounter = 100 + Math.random() * 100;
            }

            if (this.moveDirection) this.dx = this.speed * this.moveDirection;
            if (this.moveDirection == 0) this.dx *= 0.8;
            this.dy *= 0.99;

            this.handleSpriteInteractions();

            this.climb();

            this.x += this.dx;
            this.y += this.dy;
        }
    };

    this.handleSpriteInteractions = function () {
        var blocked = [];
        this.riding = null;
        this.isStanding = false;
        for (var i = sprites.length - 1; i >= 0; i--) {
            if (sprites[i] == this) continue;
            if (sprites[i] == this.container) continue;
            if (!sprites[i].solid && !sprites[i].deadly && !(sprites[i] instanceof Coin)) continue;
            if (this.doesOverlapSprite(sprites[i])) {
                if (sprites[i] instanceof Coin) {
                    sprites[i].kill();
                    continue;
                }
                var xOff = this.x - sprites[i].x;
                var yOff = this.y - sprites[i].y;
                var blockedHoriz = Math.abs(xOff) + (sprites[i].height - sprites[i].width) / 2 >= Math.abs(yOff);

                if (blockedHoriz) {
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
                        if (sprites[i].onStomp) {
                            sprites[i].onStomp(this);
                            continue;
                        } else {
                            this.isStanding = true;
                            this.riding = sprites[i];
                            this.setBottom(sprites[i].getTop());
                            this.dy = sprites[i].dy;
                            blocked.push(sprites[i]);
                        }
                    } else {
                        if (sprites[i] instanceof Wall /*|| sprites[i] instanceof Scale*/) this.setTop(sprites[i].getBottom());
                        if (this.dy < 0) {
                            this.dy = 0;
                        }
                        blocked.push(sprites[i]);
                    }
                }
                if (sprites[i].deadly) {
                    this.killGerbil();
                    return;
                }
            }
        }
        return blocked;
    }

    this.handleInput = function () {
        this.moveDirection = 0;
        if (keyboardState.isLeftPressed()) this.moveDirection = -1;
        else if (keyboardState.isRightPressed()) this.moveDirection = 1;
        else if (keyboardState.isUpPressed()) {
            var center = sprites.filter(function (obj) { return obj instanceof Gerbil && obj.container == null; }).map(function (obj) { return obj.x; }).average();
            this.moveDirection = (center - this.x) / 10;
            if (Math.abs(this.moveDirection) > 1) this.moveDirection = this.moveDirection / Math.abs(this.moveDirection);
        }
        if (keyboardState.isJumpPressed()) {
            if (this.canJump()) {
                this.dy -= 4.0;
                this.y -= 1;
            }
        }
    }

    this.imageSource = document.getElementById("Gerbil");
    this.draw = function () {
        gameViewContext.imageSmoothingEnabled = false;
        this.frameCount++;
        if (this.isDead) {
            if (this.frameCount % 10 < 5)
                this.camera.drawImage(this.imageSource, 0, 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
            else
                this.camera.drawImage(this.imageSource, 0, 16, 16, 16, this.getLeft() + 2, this.getTop(), this.width, this.height);
        } else if (this.container != null && this.container instanceof Wheel) {
            if (this.frameCount % 10 < 5)
                this.camera.drawImage(this.imageSource, 16, 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
            else
                this.camera.drawImage(this.imageSource, 32, 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
        } else if (this.moveDirection < 0) {
            if (this.frameCount % 10 < 5)
                this.camera.drawImage(this.imageSource, 16, 0, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
            else
                this.camera.drawImage(this.imageSource, 32, 0, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
        } else if (this.moveDirection > 0) {
            if (this.frameCount % 10 < 5)
                this.camera.drawImage(this.imageSource, 16, 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
            else
                this.camera.drawImage(this.imageSource, 32, 16, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
        } else {
            this.camera.drawImage(this.imageSource, 0, 0, 16, 16, this.getLeft(), this.getTop(), this.width, this.height);
        }
    }

    this.climb = function () {
        if (this.isStanding) this.climbCounter -= 1;
        if (this.climbCounter < 0) this.climbCounter = 0;
        if (this.climbCooldownTimer > 0) {
            if (this.isStanding) this.climbCooldownTimer -= 1;
            return;
        }
        if (isMouseClicked && this.y < mouseY) return;

        var isClimbing = false;

        if (keyboardState.isUpPressed())
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] == this) continue;
                if (!sprites[i].solid) continue;
                if (keyboardState.isDownPressed() && sprites[i] instanceof Gerbil) continue;
                var horizClose = (this.moveDirection < 0 && Math.abs(this.getLeft() - sprites[i].getRight()) < 10) ||
                                 (this.moveDirection > 0 && Math.abs(this.getRight() - sprites[i].getLeft()) < 10)

                if (horizClose && this.y < sprites[i].getBottom() && this.getBottom() > sprites[i].getTop()) {
                    if (sprites[i].isStanding === false) continue;
                    this.dy = sprites[i].dy - (60 - this.climbCounter) / 20;
                    if (this.dy < -5) this.dy = -3;
                    isClimbing = true;
                }
            }

        if (isClimbing) this.climbCounter += 1;
        if (this.climbCounter > 60) {
            this.climbCounter = 0;
            this.climbCooldownTimer = 20;
        }
    }

    this.canJump = function () {
        var clearAbove = (this.getCumulativeRiders().length == 0);
        var solidBelow = (this.riding != null && !(this.riding instanceof Gerbil));
        var canMove = (!this.container || this.container instanceof Cell)
        return clearAbove && solidBelow && canMove;
    }


}
Gerbil.prototype = new SpriteBase();
Gerbil.prototype.constructor = Gerbil;