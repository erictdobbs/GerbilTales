function Gerbil(x, y) {
    SpriteBase.call(this, x, y);

    this.speed = Math.random() + 4;
    this.speedResetCounter = 0;

    this.moveDirection = 0;
    this.climbCooldownTimer = 0;
    this.climbCounter = 0;

    this.color = new Color(220, 220, 128, 1.0);
    this.borderColor = new Color(180, 180, 80, 1.0);
    this.riding = null;

    this.isStanding = false;

    this.executeRules = function () {
        this.handleInput();
        this.dy += 0.4;

        this.speedResetCounter -= 1;
        if (this.speedResetCounter <= 0) {
            this.speed = Math.random() + 4;
            this.speedResetCounter = 100 + Math.random() * 100;
        }

        if (this.moveDirection) this.dx = this.speed * this.moveDirection;
        //var supportingSprites = this.getSupportingSprites();
        //for (var i = 0; i < supportingSprites.length; i++) this.dx += supportingSprites[i].dx / supportingSprites.length;
        //if (Math.abs(this.dx) > 10) this.dx = this.dx < 0 ? -10 : 10;
        this.dx *= .9;

        this.blockMovement();
        this.climb();

        this.x += this.dx;
        this.y += this.dy;
    };

    this.handleInput = function () {
        if (this.climbCooldownTimer > 0) return;
        this.moveDirection = 0;
        if (keyboardState.isKeyPressed(keyboardState.key.A)) this.moveDirection = -1;
        else if (keyboardState.isKeyPressed(keyboardState.key.D)) this.moveDirection = 1;
        else if (isMouseClicked) {
            this.moveDirection = (mouseX - this.x) / 10;
            if (Math.abs(this.moveDirection) > 1) this.moveDirection = this.moveDirection / Math.abs(this.moveDirection);
        }
    }

    this.draw = function () {
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        gameViewContext.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);
        //gameViewContext.beginPath();
        //gameViewContext.moveTo(this.x, this.y);
        //gameViewContext.lineTo(this.x + this.dx * 4, this.y + this.dy * 4);
        //gameViewContext.stroke();

        gameViewContext.font = "12px monospace";
        gameViewContext.fillStyle = this.borderColor.toString();
        gameViewContext.fillText(sprites.indexOf(this), this.x - 7, this.y + 5);
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
        if (this.moveDirection < 0) {
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] == this) continue;
                if (Math.abs(this.getLeft() - sprites[i].getRight()) < 10 && this.y < sprites[i].getBottom() && this.getBottom() > sprites[i].getTop()) {
                    if (sprites[i].isStanding === false) continue;
                    this.dy = sprites[i].dy - (60 - this.climbCounter) / 20;
                    if (this.dy < -5) this.dy = -5;
                    isClimbing = true;
                }
            }
        }
        if (this.moveDirection > 0) {
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] == this) continue;
                if (Math.abs(this.getRight() - sprites[i].getLeft()) < 10 && this.y < sprites[i].getBottom() && this.getBottom() > sprites[i].getTop()) {
                    if (sprites[i].isStanding === false) continue;
                    this.dy = sprites[i].dy - (60 - this.climbCounter) / 20;
                    if (this.dy < -5) this.dy = -5;
                    isClimbing = true;
                }
            }
        }

        if (isClimbing) this.climbCounter += 1;
        if (this.climbCounter > 60) {
            this.climbCounter = 0;
            this.climbCooldownTimer = 20;
        }
    }

    this.blockMovement = function () {
        this.riding = null;
        this.isStanding = false;
        for (var i = 0; i < sprites.length; i++) {
            if (sprites[i] == this) continue;
            if (this.doesOverlapSprite(sprites[i])) {
                var xOff = this.x - sprites[i].x;
                var yOff = this.y - sprites[i].y;
                var blockedHoriz = Math.abs(xOff) + (sprites[i].height - sprites[i].width)/2 >= Math.abs(yOff);
                if (blockedHoriz) {
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
                    if (this.y < sprites[i].y) {
                        this.isStanding = true;
                        this.riding = sprites[i];
                        this.setBottom(sprites[i].getTop());
                        this.dy = sprites[i].dy;
                    } else {
                        if (sprites[i] instanceof Wall) this.setTop(sprites[i].getBottom());
                        if (this.dy < 0) this.dy = 0;
                    }
                }
            }
        }
    }
}
Gerbil.prototype = new SpriteBase();
Gerbil.prototype.constructor = Gerbil;