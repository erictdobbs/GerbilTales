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
    this.drawImage = function (image, sx, sy, swidth, sheight, x, y, width, height) {
        gameViewContext.drawImage(image, sx, sy, swidth, sheight,
            (x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300, width * this.scale, height * this.scale);
    }
    this.fillText = function (text, x, y) {
        gameViewContext.fillText(text, (x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300);
    }
    this.arc = function (x, y, radius, thetaStart, thetaEnd) {
        if (thetaEnd < thetaStart) return;
        gameViewContext.arc((x - this.x) * this.scale + 400, (y - this.y) * this.scale + 300, radius * this.scale, thetaStart, thetaEnd);
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

    this.powerFrame = 0;
    this.drawPowerConnection = function (target) {
        var source = target.powerSource;
        if (source == null) return;
        this.powerFrame += source.power;
        
        var xDir = target.x > source.x ? 1 : -1;
        var yDir = target.y > source.y ? 1 : -1;
        var indicatorDistance = 20;

        var unpoweredColor = new Color(80, 80, 80, (source.power / 4) + 0.2);
        var poweredColor = new Color(64, 255, 64, (source.power / 4) + 0.2);
        gameViewContext.strokeStyle = unpoweredColor.toString();
        gameViewContext.fillStyle = poweredColor.toString();

        var bubbleGap = 3;
        var bubbleDelay = 7;
        var bubbleCount = parseInt(this.powerFrame / bubbleDelay + 1) % bubbleGap;

        for (var x = source.x - (source.x - target.x) % indicatorDistance ; x * xDir < target.x * xDir; x += xDir * indicatorDistance) {
            gameViewContext.beginPath();
            this.arc(x, source.y, 5, 0, Math.PI * 2);
            if (bubbleCount == 0) gameViewContext.fill();
            gameViewContext.stroke();
            bubbleCount = (bubbleCount - 1 + bubbleGap) % bubbleGap;
        }
        for (var y = source.y; y * yDir < target.y * yDir; y += yDir * indicatorDistance) {
            gameViewContext.beginPath();
            this.arc(target.x, y, 5, 0, Math.PI * 2);
            if (bubbleCount == 0) gameViewContext.fill();
            gameViewContext.stroke();
            bubbleCount = (bubbleCount - 1 + bubbleGap) % bubbleGap;
        }
    }
}