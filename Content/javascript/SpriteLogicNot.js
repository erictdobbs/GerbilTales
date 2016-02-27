function LogicNot(x, y, width, height, input) {
    SpriteBase.call(this, x + width/2, y + height/2);
    this.width = width;
    this.height = height;

    this.visible = true;

    this.input = input;
    
    this.color = new Color(100, 128, 100, 1.0);
    this.borderColor = new Color(80, 80, 80, 1.0);
    this.power = 0;

    this.executeRules = function () {
        if (this.input) this.power = 1 - this.input.power;
        else this.power = 1;
    };

    this.draw = function () {
        if (mode == gameMode.edit || this.visible) {
            gameViewContext.fillStyle = this.color.toString();
            this.camera.fillRect(this.getLeft(), this.getTop(), this.width, this.height);
            gameViewContext.strokeStyle = this.borderColor.toString();
            gameViewContext.lineWidth = 3;
            this.camera.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);

            gameViewContext.lineWidth = 6;
            var x1 = this.getLeft() + this.width / 4;
            var x2 = this.getRight() - this.width / 4;
            var y1 = this.getTop() + this.height / 4;
            var y2 = this.getBottom() - this.height / 4;

            gameViewContext.beginPath();
            this.camera.moveTo(x1, y1);
            this.camera.lineTo(x2, y2);
            gameViewContext.stroke();
            gameViewContext.beginPath();
            this.camera.moveTo(x2, y1);
            this.camera.lineTo(x1, y2);
            gameViewContext.stroke();
        }
    }
}
LogicNot.prototype = new SpriteBase();
LogicNot.prototype.constructor = LogicNot;