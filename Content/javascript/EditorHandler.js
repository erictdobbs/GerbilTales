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
        if (editorSprites[i].powerSource) {
            var powerSourceIndex = editorSprites.indexOf(editorSprites[i].powerSource);
            sprites[i].powerSource = sprites[powerSourceIndex];
        }
    }
}

function InsertEditorObject(index) {
    editorSprites.push(editorObjectTypes[index].add(0, 0));
    UpdateEditorPanel();
}

function UpdateEditorPanel() {
    var editorObjDiv = document.createElement("div");
    var container = document.getElementById("editSprites");
    container.innerHTML = "";

    for (var i = 0; i < editorSprites.length; i++) {
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
    { name: 'Wall', add: function (tileX, tileY) { return new EditorWall(tileX, tileY, 4, 2); } },
    { name: 'Gerbil Start', add: function (tileX, tileY) { return new EditorGerbilSpawn(tileX, tileY, 2, 2); } },
    { name: 'Wheel', add: function (tileX, tileY) { return new EditorWheel(tileX, tileY, 3); } },
    { name: 'Button', add: function (tileX, tileY) { return new EditorButton(tileX, tileY, 3); } },
    { name: 'Fan', add: function (tileX, tileY) { return new EditorFan(tileX, tileY, 4); } },
    { name: 'Cell', add: function (tileX, tileY) { return new EditorCell(tileX, tileY, 4, 2); } }
];