var selectedSprite = null;
var selectedAnchor = null;
function HandleAnchors() {
    if (!isMouseClicked) {
        selectedAnchor = null;
        SetCursor('');
    }
    if (selectedAnchor == null) {
        if (selectedSprite != null) {
            for (var i = 0; i < selectedSprite.anchors.length; i++) {
                if (selectedSprite.anchors[i].isCoordinateWithin(mouseX, mouseY)) {
                    if (isMouseChanged && isMouseClicked) selectedAnchor = selectedSprite.anchors[i];
                    SetCursor(selectedSprite.anchors[i].anchorType.cursor);
                    //UpdateEditorPanel();
                    break;
                }
            }
        }
        if (isMouseChanged && isMouseClicked && selectedAnchor == null) {
            for (var i = 0; i < editorSprites.length; i++) {
                if (editorSprites[i].createSprite().isMouseOver()) {
                    SelectEditorObject(i);
                    HandleAnchors();
                    return;
                }
            }
            SelectEditorObject(-1);
            document.getElementById('editables').innerHTML = '';
        }
    }
    if (selectedAnchor != null) {
        selectedAnchor.onChange(mouseDeltaX, mouseDeltaY);
        var editorBoxes = document.getElementsByClassName('editorBox');
        for (var i = 0; i < editorBoxes.length; i++) {
            editorBoxes[i].value = selectedSprite[editorBoxes[i].id];
        }
    }
}

function SwitchToEditMode() {
    var editButton = document.getElementById('toggleEdit');
    var playButton = document.getElementById('togglePlay');
    editButton.className = 'hidden';
    playButton.className = '';

    mode = gameMode.edit;
    //for (var i = 0; i < sprites.length; i++) sprites[i].kill();
    sprites = [];
    var buttonContainer = document.getElementById('editorButtons');

    for (var i = 0; i < editorObjectTypes.length; i++) {
        var button = document.createElement("button");
        button.setAttribute("id", 'create' + editorObjectTypes[i].name);
        button.classList.add("editorAddButton");
        button.setAttribute("editorObjectIndex", i);
        button.innerHTML = 'Insert ' + editorObjectTypes[i].name;
        button.onclick = function () { InsertEditorObject(this.getAttribute("editorObjectIndex")); };
        buttonContainer.appendChild(button);
    }
}

function SwitchToPlayMode() {
    var editButton = document.getElementById('toggleEdit');
    var playButton = document.getElementById('togglePlay');
    editButton.className = '';
    playButton.className = 'hidden';

    mode = gameMode.play;
    for (var i = 0; i < sprites.length; i++) sprites[i].kill();
    var buttonContainer = document.getElementById('editorButtons');
    buttonContainer.innerHTML = '';
    var editorObjContainer = document.getElementById("editSprites");
    editorObjContainer.innerHTML = '';

    for (var i = 0; i < editorSprites.length; i++) {
        var newSprite = editorSprites[i].createSprite();
        sprites.push(newSprite);
    }
    for (var i = 0; i < editorSprites.length; i++) {
        var editorSprite = editorSprites[i];
        for (var j = 0; j < editorSprite.editables.length; j++) {
            var editable = editorSprite.editables[j];
            if (editable.paramType == paramTypes.powerSource) {
                var paramName = editable.paramName;
                var spriteIndex = editorSprites.indexOf(editorSprite[paramName]);
                sprites[i][paramName] = sprites[spriteIndex];
            }
        }
    }
}

function InsertEditorObject(index) {
    editorSprites.push(editorObjectTypes[index].add(0, 0));
    UpdateEditorPanel();
}

function UpdateEditorPanel() {
    var container = document.getElementById("editSprites");
    container.innerHTML = "";

    for (var i = 0; i < editorSprites.length; i++) {
        var editorObjDiv = document.createElement("div");
        editorObjDiv.classList.add("editorObject");
        if (editorSprites[i] == selectedSprite) editorObjDiv.classList.add("selected");
        editorObjDiv.innerHTML = editorSprites[i].constructor.name.replace("Editor", "");
        editorObjDiv.setAttribute("editorSpriteIndex", i);
        editorObjDiv.onclick = function () { SelectEditorObject(this.getAttribute("editorSpriteIndex")); };
        container.appendChild(editorObjDiv);
    }
}

function SelectEditorObject(index) {
    if (index >= 0) {
        selectedSprite = editorSprites[index];
        selectedSprite.edit();
    }
    else selectedSprite = null;
    UpdateEditorPanel();
}

var editorObjectTypes = [
    { name: 'Wall', type: EditorWall, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } },
    { name: 'Gerbil Start', type: EditorGerbilSpawn, add: function (tileX, tileY) { return new this.type(tileX, tileY, 2, 2); } },
    { name: 'Spike Block', type: EditorSpikeBlock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } },
    { name: 'Wheel', type: EditorWheel, add: function (tileX, tileY) { return new this.type(tileX, tileY, 3); } },
    { name: 'Button', type: EditorButton, add: function (tileX, tileY) { return new this.type(tileX, tileY, 3); } },
    { name: 'Fan', type: EditorFan, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4); } },
    { name: 'Cell', type: EditorCell, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } },
    { name: 'Clock', type: EditorClock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1); } },
    { name: 'Peekablock', type: EditorPeekablock, add: function (tileX, tileY) { return new this.type(tileX, tileY, 4, 2); } },
    { name: 'LogicAnd', type: EditorLogicAnd, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } },
    { name: 'LogicOr', type: EditorLogicOr, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } },
    { name: 'LogicNot', type: EditorLogicNot, add: function (tileX, tileY) { return new this.type(tileX, tileY, 1, 1); } },
    { name: 'Coin', type: EditorCoin, add: function (tileX, tileY) { return new this.type(tileX, tileY); } }
];