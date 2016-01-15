function GerbilSpawn(x, y, width, height, maxGerbils) {
    SpriteBase.call(this, x + width/2, y + height/2);
    this.width = width;
    this.height = height;
    this.maxGerbils = maxGerbils;
    
    this.color = new Color(65, 80, 80, 1.0);

    this.timer = 0;
    this.delayBetweenGerbils = 100;
    this.gerbilsSpawned = 0;
    this.cameraFocus = true;
    this.solid = false;

    this.executeRules = function () {
        if (this.gerbilsSpawned < this.maxGerbils) {
            this.timer += 1;
            if (this.timer >= this.delayBetweenGerbils) {
                this.gerbilsSpawned += 1;
                this.timer = 0;
                sprites.push(new Gerbil(this.x, this.y));
                if (this.gerbilsSpawned == this.maxGerbils) {
                    this.color = new Color(45, 55, 55, 1.0);
                    this.cameraFocus = false;
                }
            }
        }
    };

    this.draw = function () {
        var circleY = this.getTop() + this.width / 2;

        gameViewContext.fillStyle = this.color.toString();
        gameViewContext.beginPath();
        this.camera.arc(this.x, circleY, this.width / 2, 0, 2 * Math.PI);
        gameViewContext.fill();
        this.camera.fillRect(this.getLeft(), circleY, this.width, this.height - (this.width/2));
    }
}
GerbilSpawn.prototype = new SpriteBase();
GerbilSpawn.prototype.constructor = GerbilSpawn;