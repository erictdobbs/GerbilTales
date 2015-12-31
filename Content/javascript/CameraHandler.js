function Camera(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    //this.accel = 1;
    //this.maxSpeed = 3;

    this.fillRect = function (x, y, width, height) {
        gameViewContext.fillRect((x - this.x)*this.scale + 400, (y - this.y)*this.scale + 300, width*this.scale, height*this.scale);
    }
    this.strokeRect = function (x, y, width, height) {
        gameViewContext.strokeRect((x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300, width * this.scale, height * this.scale);
    }
    this.fillText = function (text, x, y) {
        gameViewContext.fillText(text, (x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300);
    }
    this.arc = function (x, y, radius) {
        gameViewContext.arc((x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300, radius*this.scale, 0, 2 * Math.PI);
    }

    this.updateCamera = function () {
        var cameraFoci = sprites.filter(function (obj) { return obj.cameraFocus; });
        var gerbilXs = cameraFoci.map(function (obj) { return obj.x; });
        var gerbilYs = cameraFoci.map(function (obj) { return obj.y; });
        var targetX = gerbilXs.average();
        var targetY = gerbilYs.average();

        var xRange = gerbilXs.max() - gerbilXs.min();
        var yRange = gerbilYs.max() - gerbilYs.min();
        var targetScale = 1 / [(xRange+256) / 800, (yRange+256) / 600].max();
        this.scale += (targetScale - this.scale) / 20;

        targetX = gerbilXs.min() + xRange / 2;
        targetY = gerbilYs.min() + yRange / 2;

        this.dx = (targetX - this.x) / 20;
        this.dy = (targetY - this.y) / 20;

        this.x += this.dx;
        this.y += this.dy;
    }
}