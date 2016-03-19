
var currentLevel = null;

function LevelBase(levelObject) {
    var me = this;
    this.levelObject = levelObject;
    this.LevelStartMenu = function () {
        var menuContainer = document.getElementById("MenuContainer");

        CloseAllMenus();
        var getReadyElement = new MenuFancyText('Get Ready!');
        var goElement = new MenuFancyText(["GO!", "Gerbil it up!", "Squeak!", "Go get 'em!", "Let's roll!", "It's gerbil time!"].rand());

        var getReadyMenu = new MenuBase(0, 0, [getReadyElement]);
        getReadyMenu.hideBackPanel = true;
        var goMenu = new MenuBase(0, 0, [goElement]);
        goMenu.hideBackPanel = true;

        getReadyMenu.display();
        var levelObject = this.levelObject;
        setTimeout(function () {
            getReadyMenu.delete();
            goMenu.display();
            LoadLevel(levelObject);
            SwitchToPlayMode(false);
            currentLevel = me;
        }, 1500);

        setTimeout(function () {
            goMenu.close();
        }, 2200);
    }

    this.DeadMenu = function () {
        var menuTitle = new MenuFancyText('Oops!');
        var levelTitle = new MenuTitle('Level Title');
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            GetMenuObjectFromElement(this).close();
        });
        var level = this;
        var playButton = new MenuActionButton("Try Again!", function () {
            level.LevelStartMenu();
        })

        var menu = new MenuBase(400, null, [
            menuTitle,
            levelTitle,
            playButton,
            backToMainMenu
        ]);
        menu.display();
    }

    this.WinMenu = function () {
        var menuTitle = new MenuFancyText('Yeah!');
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            GetMenuObjectFromElement(this).close();
        });
        var text = new MenuText("Maybe there will be stats here some day.");

        var menu = new MenuBase(400, null, [
            menuTitle,
            text,
            backToMainMenu
        ]);
        menu.display();
    }
}

function CheckForDeadState() {
    if (currentLevel == null) return;
    var gerbils = sprites.filter(function (spr) { return spr instanceof Gerbil; });
    var exitDoors = sprites.filter(function (spr) { return spr instanceof ExitDoor; });
    if (gerbils.length == 0) {
        var savedGerbilCount = exitDoors.map(function (x) { return x.currentGerbilCount; }).sum();

        if (savedGerbilCount == 0) currentLevel.DeadMenu();
        else currentLevel.WinMenu();
        currentLevel = null;
    }
}


var levels = [
    { "v": "0.01", "s": [{ "a": "EditorGerbil", "e": [6, 0] }, { "a": "EditorWall", "e": [-3, 1, 39, 14] }, { "a": "EditorWall", "e": [-19, -21, 16, 36] }, { "a": "EditorWall", "e": [8, 2, 4, 2] }, { "a": "EditorWall", "e": [18, -1, 4, 4] }, { "a": "EditorTextBox", "e": [17, -2, "Press space to jump"] }, { "a": "EditorTextBox", "e": [5, -1, "Use A and D to move"] }, { "a": "EditorWall", "e": [25, -2, 11, 3] }, { "a": "EditorWall", "e": [39, -2, 5, 2] }, { "a": "EditorWall", "e": [42, -1, 9, 3] }, { "a": "EditorWall", "e": [51, -6, 4, 10] }, { "a": "EditorWall", "e": [55, -7, 9, 14] }, { "a": "EditorWall", "e": [64, -25, 13, 36] }, { "a": "EditorExitDoor", "e": [59, -9, 2, 2, 1] }, { "a": "EditorTextBox", "e": [46, -3, "Hold W and D to climb"] }, { "a": "EditorCoin", "e": [20, -4] }, { "a": "EditorCoin", "e": [29, -5] }, { "a": "EditorCoin", "e": [38, -5] }, { "a": "EditorCoin", "e": [37, -5] }, { "a": "EditorCoin", "e": [36, -4] }, { "a": "EditorCoin", "e": [39, -4] }, { "a": "EditorCoin", "e": [50, -3] }, { "a": "EditorCoin", "e": [50, -4] }, { "a": "EditorCoin", "e": [50, -5] }, { "a": "EditorCoin", "e": [50, -6] }, { "a": "EditorCoin", "e": [53, -10] }] },
    { "v": "0.01", "s": [{ "a": "EditorWall", "e": [0, 2, 8, 3] }, { "a": "EditorGerbil", "e": [1, 1] }, { "a": "EditorExitDoor", "e": [4, 0, 2, 2, 1] }] }
];