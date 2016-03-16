
var menus = [];

function GetCurrentMenu() {
    return menuStack.last();
}


function MenuBase(width, height, elements) {
    this.width = width;
    this.height = height;
    this.elements = elements;
    this.menuContainer = document.getElementById("MenuContainer");
    this.menuElement = document.createElement('div');
    if (this.width) this.menuElement.style.width = this.width + 'px';
    if (this.height) this.menuElement.style.height = this.height + 'px';
    this.centerPosition = function () {
        this.menuElement.style.left = ((viewWidth - this.width) / 2) + 'px';
        this.menuElement.style.top = ((viewHeight - this.height) / 2) + 'px';
    }
    this.bottomLeftPosition = function () {
        this.menuElement.style.left = '0px';
        this.menuElement.style.bottom = '0px';
    }
    this.bottomRightPosition = function () {
        this.menuElement.style.right = '0px';
        this.menuElement.style.bottom = '0px';
    }
    this.display = function () {
        if (menus.indexOf(this) == -1) {
            menus.push(this);
            var menuElement = document.createElement('div');
            this.menuElement.classList.add('menu');
            for (var i = 0; i < this.elements.length; i++) {
                var node = this.elements[i].toNode(this);
                this.menuElement.appendChild(node);
            }
            this.menuContainer.appendChild(this.menuElement);
        }
        this.menuElement.style.opacity = '1.0';
        if (this.id) {
            this.menuElement.id = this.id;
        }
    }
    this.hide = function () {
        this.menuElement.style.opacity = '0';
    }
    this.disable = function (permanent) {
        // Use when another menu goes active to prevent interaction with previous menu
        //this.menuElement.style.opacity = '0.3';
        var nodes = this.menuElement.getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = true;
            nodes[i].onclickcache = nodes[i].onclick;
            nodes[i].onclick = null;
        }
    }
    this.enable = function () {
        this.menuElement.style.opacity = '1.0';
        var nodes = this.menuElement.getElementsByTagName('*');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].disabled = false;
            if (nodes[i].onclickcache) nodes[i].onclick = nodes[i].onclickcache;
        }
    }
    this.close = function () {
        this.disable();
        if (this.parent) this.parent.enable();
        this.fadeOut();
    }
    this.fadeOut = function () {
        if (this.menuElement.style.opacity == '0' && this.opacity === undefined) {
            this.delete();
        } else {
            if (this.opacity === undefined) this.opacity = 1.0;
            this.opacity -= 0.05;
            var me = this;
            if (this.opacity > 0) {
                this.menuElement.style.opacity = this.opacity;
                setTimeout(function () { me.fadeOut() }, 25);
            } else {
                this.delete();
            }
        }
    }
    this.delete = function () {
        this.menuContainer.removeChild(this.menuElement);
        menus.splice(menus.indexOf(this), 1);
    }
}


function MenuTitle(text) {
    this.text = text;
    this.toNode = function (menu) {
        var h = document.createElement("H2");
        var t = document.createTextNode(this.text);
        h.appendChild(t);
        return h;
    }
}


function MenuText(text) {
    this.text = text;
    this.toNode = function (menu) {
        var h = document.createElement("div");
        var t = document.createTextNode(this.text);
        h.appendChild(t);
        return h;
    }
}


function MenuTextArea(text, readOnly) {
    this.text = text;
    this.readOnly = readOnly;
    this.toNode = function (menu) {
        var input = document.createElement("textarea");
        input.readOnly = this.readOnly;
        input.textContent = this.text;
        input.style.width = (menu.width - 44) + 'px';
        return input;
    }
}


function MenuActionButton(text, func) {
    this.text = text;
    this.action = func;
    this.toNode = function (menu) {
        var div = document.createElement("DIV");
        var t = document.createTextNode(this.text);
        div.appendChild(t);
        div.classList.add('menuButton');
        div.onclick = this.action;
        return div;
    }
}


function MenuActionButtonSmall(text, func) {
    this.text = text;
    this.action = func;
    this.toNode = function (menu) {
        var div = document.createElement("DIV");
        var t = document.createTextNode(this.text);
        div.appendChild(t);
        div.classList.add('menuButtonSmall');
        div.onclick = this.action;
        return div;
    }
}


function MenuImage(image) {
    this.toNode = function (menu) {
        var img = document.createElement("img");
        img.src = image.src;
        img.classList.add('image-' + image.id);
        return img;
    }
}


function MenuTable(elements) {
    // elements is a list of lists corresponding to a 2d array of nodes
    this.elements = elements;
    this.toNode = function (menu) {
        var table = document.createElement("table");
        for (var i = 0; i < elements.length; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < elements[i].length; j++) {
                var cell = document.createElement("td");
                cell.appendChild(elements[i][j]);
                row.appendChild(cell);
            }
            table.appendChild(row);            
        }
        return table;
    }
}


function GetMenuObjectFromElement(element) {
    for (var i = 0; i < menus.length; i++) {
        var el = element;
        while (el && !el.classList.contains('menu')) el = el.parentNode;
            if (menus[i].menuElement == el)
                return menus[i];
    }
}




function MainMenu() {
    var gameLogo = new MenuImage(document.getElementById('GameLogo'))

    var levelSelect = new MenuActionButton("Play", function () {
        GetMenuObjectFromElement(this).close();
    });
    var startLevelEditor = new MenuActionButton("Level Editor", function () {
        var editMenu = new EditMenu();
        editMenu.bottomLeftPosition();
        editMenu.display();
        var toolMenu = new ToolMenu();
        toolMenu.display();
        GetMenuObjectFromElement(this).close();
        SwitchToEditMode();
    });
    var logo = new MenuImage(document.getElementById('StudioLogo')).toNode();
    logo.style.float = 'left';
    logo.style.margin = '20px';

    MenuBase.call(this, 600, 300, [
        gameLogo,
        levelSelect,
        startLevelEditor,
        new MenuTable([[logo, new MenuText("version " + version).toNode()]])
    ]);
}
MainMenu.prototype = new MenuBase();
MainMenu.prototype.constructor = MainMenu;



function ToolMenu() {
    var tools = [];
    for (var i = 0; i < editorObjectTypes.length; i++) {
        var button = new MenuActionButtonSmall(
            editorObjectTypes[i].name,
            function () { InsertEditorObject(this.getAttribute("editorObjectIndex")); }
        );
        var buttonNode = button.toNode();
        buttonNode.setAttribute("editorObjectIndex", i);
        tools.push(buttonNode);
    }

    MenuBase.call(this, null, null, [
        new MenuTable([tools])
    ]);
}
ToolMenu.prototype = new MenuBase();
ToolMenu.prototype.constructor = ToolMenu;



var editMenu = null;
var editButton = null;
var playButton = null;
var exportButton = null;
var importButton = null;
var cameraButton = null;
function EditMenu() {
    var options = [];

    var button1 = new MenuActionButtonSmall("Switch to EDIT Mode", SwitchToEditMode);
    editButton = button1.toNode();
    editButton.classList.add('hidden');
    options.push(editButton);

    var button2 = new MenuActionButtonSmall("Switch to PLAY Mode", SwitchToPlayMode);
    playButton = button2.toNode();
    options.push(playButton);

    var button3 = new MenuActionButtonSmall("Export Level", ExportLevel);
    exportButton = button3.toNode();
    options.push(exportButton);

    var button4 = new MenuActionButtonSmall("Import Level", function () { ImportLevel(prompt('Paste your level export string:')); });
    importButton = button4.toNode();
    options.push(importButton);

    var button5 = new MenuActionButtonSmall("Back to Main Menu", function () {
        GetMenuObjectFromElement(this).close();
        for (var i = 0; i < menus.length; i++) if (menus[i] instanceof ToolMenu) menus[i].close();
        var mainMenu = new MainMenu();
        SwitchToPlayMode();
        sprites = [];
        mainMenu.centerPosition();
        mainMenu.display();
    });
    options.push(button5.toNode());

    var button6 = new MenuActionButtonSmall("Center Camera", function () { camera.x = 0; camera.y; });
    cameraButton = button6.toNode();
    options.push(cameraButton);

    MenuBase.call(this, null, null, [
        new MenuTable([options])
    ]);
}
EditMenu.prototype = new MenuBase();
EditMenu.prototype.constructor = EditMenu;




function EditableMenu() {
    this.id = 'editables';
    MenuBase.call(this, null, null, []);
}
EditableMenu.prototype = new MenuBase();
EditableMenu.prototype.constructor = EditableMenu;
