function ExportLevel() {
    var condensedEditorSprites = [];

    for (var i = 0; i < editorSprites.length; i++) {
        var editorSprite = editorSprites[i];

        var editorType = editorSprite.constructor;
        var typeName = editorType.name;
        var editorObjectType = editorObjectTypes.filter(function (x) { return x.type == editorType })[0];
        if (editorObjectType == undefined) console.error("Failed to find object type " + typeName);
        var editorObjectTypeIndex = editorObjectTypes.indexOf(editorObjectType);

        var condensedEditorSprite = { a: typeName, e: [] };
        for (var j = 0; j < editorSprite.editables.length; j++) {
            var editable = editorSprite.editables[j];
            if (editable.paramType == paramTypes.powerSource) {
                condensedEditorSprite.e.push(editorSprites.indexOf(editorSprite[editable.paramName]));
            } else {
                condensedEditorSprite.e.push(editorSprite[editable.paramName]);
            }
        }
        condensedEditorSprites.push(condensedEditorSprite);
    }

    var ret = { v: "1.0", s: condensedEditorSprites };

    prompt('Here is your level export string:', JSON.stringify(ret));
}

function ImportLevel(levelString) {
    if (levelString == undefined) return;
    if (levelString == '') return;
    var obj = JSON.parse(levelString);

    if (obj.v === "1.0") {
        editorSprites = [];
        selectedSprite = null;
        for (var i = 0; i < obj.s.length; i++) {
            var importSprite = obj.s[i];
            var editorTypeName = importSprite.a;
            var editorObjectType = editorObjectTypes.filter(function (x) { return x.type.name == editorTypeName })[0];
            if (editorObjectType == undefined) console.error("Failed to find object type " + editorTypeName);
            
            var spr = editorObjectType.add(0, 0);
            for (var j = 0; j < importSprite.e.length; j++) {
                var editable = spr.editables[j];
                var paramType = editable.paramType;
                if (paramType == paramTypes.powerSource) continue;
                var paramName = editable.paramName;
                spr[paramName] = importSprite.e[j];
                console.log("set " + paramName + " to " + importSprite.e[j]);
            }
            editorSprites.push(spr);
        }
        for (var i = 0; i < obj.s.length; i++) {
            var spr = editorSprites[i];
            var importSprite = obj.s[i];
            for (var j = 0; j < importSprite.e.length; j++) {
                var editable = spr.editables[j];
                var paramType = editable.paramType;
                if (paramType != paramTypes.powerSource) continue;
                var paramName = editable.paramName;
                spr[paramName] = editorSprites[importSprite.e[j]];
                console.log("set " + paramName + " to " + importSprite.e[j]);
            }
        }
    } else {
        console.error("Unknown version (" + obj.v + ")");
    }    
}