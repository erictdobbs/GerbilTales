var editorScale = 16;

function DrawEditorGridLines() {
    if (mode == gameMode.edit && editorSprites.length > 0) {
        gameViewContext.strokeStyle = new Color(128, 128, 128, 0.2).toString();
        gameViewContext.lineWidth = 3;
        var asSprites = editorSprites.map(function (obj) { return obj.createSprite(); });
        var border = 20;
        var minX = asSprites.min(function (obj) { return obj.getLeft(); }).getLeft();
        var maxX = asSprites.max(function (obj) { return obj.getRight(); }).getRight();
        var minY = asSprites.min(function (obj) { return obj.getTop(); }).getTop();
        var maxY = asSprites.max(function (obj) { return obj.getBottom(); }).getBottom();
        for (var x = minX - editorScale * border; x <= maxX + editorScale * border; x += editorScale)
            camera.drawVerticalLine(x);
        for (var y = minY - editorScale * border; y <= maxY + editorScale * border; y += editorScale)
            camera.drawHorizontalLine(y);
    }
}

function EditorBase(tileX, tileY, width, height) {

    this.editables = [];
    this.anchors = [];
    this.tileX = tileX;
    this.tileY = tileY;
    this.width = width;
    this.height = height;

    this.offset = 16;

    this.createSprite = function () { }

    this.highlightColor = new Color(255, 255, 200, 0.5);
    this.draw = function () {
        var sprite = this.createSprite();
        sprite.draw();
    }

    this.drawAnchors = function () {
        var sprite = this.createSprite();
        gameViewContext.setLineDash([5, 5]);
        gameViewContext.strokeStyle = new Color(255, 0, 0, 1.0).toString();
        gameViewContext.strokeRect(camera.convertX(sprite.getLeft()) - this.offset, camera.convertY(sprite.getTop()) - this.offset, sprite.width * camera.scale + this.offset * 2, sprite.height * camera.scale + this.offset * 2);
        gameViewContext.setLineDash([]);
        for (var i = 0; i < this.anchors.length; i++)
            this.anchors[i].draw(this);
    }

    this.edit = function () {
        var editableContainer = document.getElementById('editables');
        editableContainer.innerHTML = '';
        var newTable = document.createElement("table");
        for (var i = 0; i < this.editables.length; i++) {
            var editable = this.editables[i];
            var newRow = newTable.insertRow(0);
            editable.populateRow(newRow, this[editable.paramName]);
        }
        editableContainer.appendChild(newTable);
    }
}

function Editable(paramName, paramType) {
    this.paramName = paramName;
    this.paramType = paramType;
    this.getInputBox = function (value) {
        if (this.paramType == paramTypes.integer) {
            var inputBox = document.createElement("input");
            inputBox.setAttribute("id", this.paramName);
            inputBox.classList.add("editorBox");
            inputBox.setAttribute("type", this.paramType.inputType);
            inputBox.setAttribute("value", value);
            inputBox.setAttribute("onchange", this.paramType.onChange + '(this)');
            return inputBox;
        }
        if (this.paramType == paramTypes.powerSource) {
            var selectBox = document.createElement("select");
            selectBox.setAttribute("id", this.paramName);
            selectBox.classList.add("editorBox");
            selectBox.setAttribute("onchange", this.paramType.onChange + '(this)');

            var options = editorSprites.filter(function (obj) { return obj.isPowerSource; });
            for (var i = 0; i < options.length; i++) {
                var option = document.createElement("option");
                var val = editorSprites.indexOf(options[i]);
                var name = options[i].constructor.name.replace('Editor', '') + val;

                // THIS ISN'T WORKING
                if (value == options[i]) option.selected = true;

                option.setAttribute("value", val);
                option.innerHTML = name;
                selectBox.appendChild(option);
            }
            selectBox.selectedIndex = 0;
            return selectBox;
        }
    }
    this.populateRow = function (row, value) {
        var cell1 = row.insertCell(0);
        cell1.innerHTML = this.paramName;
        var cell2 = row.insertCell(1);
        cell2.appendChild(this.getInputBox(value));
    }
}

function EditorInputChanged(el) { selectedSprite[el.id] = el.value };
function EditorInputChangedInteger(el) { selectedSprite[el.id] = parseInt(el.value) };
function EditorInputChangedSprite(el) { selectedSprite[el.id] = editorSprites[el.value] };


var paramTypes = {
    integer: { inputType: "number", defaultValue: 0, onChange: 'EditorInputChangedInteger' },
    powerSource: { onChange: 'EditorInputChangedSprite' }
};