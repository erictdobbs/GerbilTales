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
    this.dealTimer = 0;

    this.speed = Math.random() + 4;
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
        this.dx = 0;
        this.dy = -1;
    }

    this.executeRules = function () {
        if (this.isDead) {
            this.dealTimer++;
            this.x += this.dx;
            this.y += this.dy;

            if (this.dealTimer > 60) this.kill();
            return;
        }
        this.handleInput();
        this.cameraFocus = (this.container === null);

        if (!this.container || this.container instanceof Cell) {
            this.dy += 0.4;

            this.speedResetCounter -= 1;
            if (this.speedResetCounter <= 0) {
                this.speed = Math.random() + 4;
                this.speedResetCounter = 100 + Math.random() * 100;
            }

            if (this.moveDirection) this.dx = this.speed * this.moveDirection;
            this.dx *= .9;

            var solidTouchedSprites = this.blockMovement();
            if (solidTouchedSprites.any(function (x) { return x instanceof SpikeBlock })) {
                this.killGerbil();
            }

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
            var center = sprites.filter(function (obj) { return obj instanceof Gerbil && obj.container == null; }).map(function (obj) { return obj.x; }).average();
            this.moveDirection = (center - this.x) / 10;
            if (Math.abs(this.moveDirection) > 1) this.moveDirection = this.moveDirection / Math.abs(this.moveDirection);
        }
    }

    this.imageSource = document.getElementById("Gerbil");
    this.draw = function () {
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

        if (keyboardState.isKeyPressed(keyboardState.key.W))
            for (var i = 0; i < sprites.length; i++) {
                if (sprites[i] == this) continue;
                if (!sprites[i].solid) continue;
                if (keyboardState.isKeyPressed(keyboardState.key.S) && sprites[i] instanceof Gerbil) continue;
                var horizClose = (this.moveDirection < 0 && Math.abs(this.getLeft() - sprites[i].getRight()) < 10) ||
                                 (this.moveDirection > 0 && Math.abs(this.getRight() - sprites[i].getLeft()) < 10)

                if (horizClose && this.y < sprites[i].getBottom() && this.getBottom() > sprites[i].getTop()) {
                    if (sprites[i].isStanding === false) continue;
                    this.dy = sprites[i].dy - (60 - this.climbCounter) / 20;
                    if (this.dy < -5) this.dy = -5;
                    isClimbing = true;
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