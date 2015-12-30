function Gerbil(x, y) {
    SpriteBase.call(this, x, y);

    this.speed = Math.random() + 4;
    this.speedResetCounter = 0;

    this.moveDirection = 0;
    this.climbCooldownTimer = 0;
    this.climbCounter = 0;

    this.color = new Color(192, 192, 128, 1.0);
    this.borderColor = new Color(100, 100, 80, 1.0);
    this.riding = null;
    this.wheel = null;

    this.isStanding = false;

    this.executeRules = function () {
        this.handleInput();

        if (this.wheel) {
        } else {
            this.dy += 0.4;

            this.speedResetCounter -= 1;
            if (this.speedResetCounter <= 0) {
                this.speed = Math.random() + 4;
                this.speedResetCounter = 100 + Math.random() * 100;
            }

            if (this.moveDirection) this.dx = this.speed * this.moveDirection;
            this.dx *= .9;

            this.blockMovement();
            this.climb();

            this.x += this.dx;
            this.y += this.dy;
        }
    };

    this.handleInput = function () {
        this.moveDirection = 0;
        if (keyboardState.isKeyPressed(keyboardState.key.A)) this.moveDirection = -1;
        else if (keyboardState.isKeyPressed(keyboardState.key.D)) this.moveDirection = 1;
        else if (keyboardState.isKeyPressed(keyboardState.key.W)) {
            var numGerbils = 0;
            var xSum = 0;
            for (var i = 0; i < sprites.length; i++) if (sprites[i] instanceof Gerbil && sprites[i].wheel == null) {
                numGerbils++;
                xSum += sprites[i].x;
            }
            var center = xSum / numGerbils;
            this.moveDirection = (center - this.x) / 10;
            if (Math.abs(this.moveDirection) > 1) this.moveDirection = this.moveDirection / Math.abs(this.moveDirection);
        }
    }

    this.draw = function () {
        this.color.b = 128 + this.climbCounter * 2;
        if (this.climbCooldownTimer > 0) this.color.b = 255;
        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
        gameViewContext.strokeStyle = this.borderColor.toString();
        gameViewContext.lineWidth = 3;
        gameViewContext.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

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
                if (keyboardState.isKeyPressed(keyboardState.key.S) && sprites[i] instanceof Gerbil) continue;
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
                if (keyboardState.isKeyPressed(keyboardState.key.S) && sprites[i] instanceof Gerbil) continue;
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

    
}
Gerbil.prototype = new SpriteBase();
Gerbil.prototype.constructor = Gerbil;