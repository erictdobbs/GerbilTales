function Camera(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.scale = 1;
    this.width = 800;
    this.height = 600;
    //this.accel = 1;
    //this.maxSpeed = 3;

    this.convertX = function (x) { return (x - this.x) * this.scale + this.width/2; }
    this.convertY = function (y) { return (y - this.y) * this.scale + this.height / 2; }
    this.invertX = function (x) { return (x - this.width / 2) / this.scale + this.x; }
    this.invertY = function (y) { return (y - this.height / 2) / this.scale + this.y; }

    //this.shadeRect = function (x, y, width, height) {
    //    var gap = 8;
    //    var screenX1 = this.convertX(x);
    //    var screenX2 = this.convertX(x + width);
    //    var screenY1 = this.convertY(y);
    //    var screenY2 = this.convertY(y + height);
    //    for (var i = gap * parseInt((screenX1 + gap) / gap) ; i < screenX2; i += gap) {
    //        gameViewContext.beginPath();
    //        gameViewContext.moveTo(i, screenY1);
    //        var diagY = (i - screenX1) + screenY1;
    //        diagY = diagY > screenY2 ? screenY2 : diagY;
    //        gameViewContext.lineTo(screenX1 + ((i - screenX1) + screenY1 - diagY), diagY);
    //        gameViewContext.stroke();
    //    }
    //    for (var i = gap * parseInt((screenY1 + gap) / gap) ; i < screenY2; i += gap) {
    //        gameViewContext.beginPath();
    //        gameViewContext.moveTo(screenX2, i);
    //        var diagX = (i - screenY1) + screenX2;
    //        diagX = diagX > screenX2 ? screenX2 : diagX;
    //        gameViewContext.lineTo(diagX, screenY1 + ((i - screenY1) + screenX2 - diagX));
    //        gameViewContext.stroke();
    //    }
    //}
    this.getMouseX = function () { return this.invertX(mouseX); }
    this.getMouseY = function () { return this.invertY(mouseY); }

    this.moveTo = function (x, y) {
        gameViewContext.moveTo(this.convertX(x), this.convertY(y));
    }

    this.lineTo = function (x, y) {
        gameViewContext.lineTo(this.convertX(x), this.convertY(y));
    }

    this.drawVerticalLine = function (x) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(x), 0);
        gameViewContext.lineTo(this.convertX(x), this.height);
        gameViewContext.stroke();
    }
    this.drawHorizontalLine = function (y) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(0, this.convertY(y));
        gameViewContext.lineTo(this.width, this.convertY(y));
        gameViewContext.stroke();
    }
    this.drawLine = function (x1, y1, x2, y2) {
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(x1), this.convertY(y1));
        gameViewContext.lineTo(this.convertX(x2), this.convertY(y2));
        gameViewContext.stroke();
    }
    this.drawPolygon = function (points) {
        if (points.length == 0) return;
        gameViewContext.beginPath();
        gameViewContext.moveTo(this.convertX(points[0].x), this.convertY(points[0].y));
        for (var i = 1; i < points.length; i++) {
            gameViewContext.lineTo(this.convertX(points[i].x), this.convertY(points[i].y));
            gameViewContext.stroke();
        }
        gameViewContext.lineTo(this.convertX(points[0].x), this.convertY(points[0].y));
        gameViewContext.stroke();
        gameViewContext.fill();
    }
    this.fillRect = function (x, y, width, height) {
        gameViewContext.fillRect(this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.strokeRect = function (x, y, width, height) {
        gameViewContext.strokeRect(this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.drawImage = function (image, sx, sy, swidth, sheight, x, y, width, height) {
        gameViewContext.drawImage(image, sx, sy, swidth, sheight,
            this.convertX(x), this.convertY(y), width * this.scale, height * this.scale);
    }
    this.fillText = function (text, x, y) {
        gameViewContext.fillText(text, this.convertX(x), this.convertY(y));
    }
    this.centerText = function (text, x, y) {
        var width = gameViewContext.measureText(text).width;
        gameViewContext.fillText(text, this.convertX(x) - width/2, this.convertY(y));
    }
    this.arc = function (x, y, radius, thetaStart, thetaEnd, counterclockwise) {
        //if (thetaEnd < thetaStart) return;
        gameViewContext.arc(this.convertX(x), this.convertY(y), radius * this.scale, thetaStart, thetaEnd, counterclockwise);
    }
    this.arcTo = function (x1, y1, x2, y2, r) {
        gameViewContext.arcTo(this.convertX(x1), this.convertY(y1), this.convertX(x2), this.convertY(y2), r);
    }

    this.updateCamera = function () {
        if (mode == gameMode.play || mode == gameMode.playPaused) {
            var cameraFoci = sprites.filter(function (obj) { return obj.cameraFocus; });
        } else if (mode == gameMode.edit) {
            var cameraFoci = editorSprites.map(function(obj) {return obj.createSprite(); });
        }
        var fociXs = cameraFoci.map(function (obj) { return obj.x; });
        var fociYs = cameraFoci.map(function (obj) { return obj.y; });

        var targetX = fociXs.average();
        var targetY = fociYs.average();
        var xRange = cameraFoci.map(function (obj) { return obj.getRight(); }).max() - cameraFoci.map(function (obj) { return obj.getLeft(); }).min();
        var yRange = cameraFoci.map(function (obj) { return obj.getBottom(); }).max() - cameraFoci.map(function (obj) { return obj.getTop(); }).min();

        var targetScale = 1 / [(xRange + 256) / this.width, (yRange + 256) / this.height].max();
        this.scale += (targetScale - this.scale) / 20;

        this.dx = (targetX - this.x) / 20;
        this.dy = (targetY - this.y) / 20;

        this.x += this.dx;
        this.y += this.dy;
    }

    this.drawPowerConnection = function (target) {

        // THIS COULD BE IMPROVED

        var powerParams = ["powerSource","input1","input2","input"];
        for (var i = 0; i < powerParams.length; i++) {
            var powerParam = powerParams[i];
            var source = target[powerParam];
            if (source == null) continue;
            if (!target.powerFrame) target.powerFrame = 0;
            if (!source.power) source.power = 0;
            target.powerFrame += source.power;

            if (target.createSprite) target = target.createSprite();
            if (source.createSprite) source = source.createSprite();

            var xDir = target.x > source.x ? 1 : -1;
            var yDir = target.y > source.y ? 1 : -1;
            var indicatorDistance = 20;

            var unpoweredColor = new Color(80, 80, 80, (source.power / 4) + 0.2);
            var poweredColor = new Color(64, 255, 64, (source.power / 4) + 0.2);
            gameViewContext.strokeStyle = unpoweredColor.toString();
            gameViewContext.fillStyle = poweredColor.toString();

            var bubbleGap = 3;
            var bubbleDelay = 7;
            var bubbleCount = parseInt(target.powerFrame / bubbleDelay + 1) % bubbleGap;

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
}