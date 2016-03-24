﻿
var currentLevel = null;

function LevelBase(levelObject) {
    var me = this;
    this.levelObject = levelObject;

    if (levels.indexOf(levelObject) > -1 && levels.indexOf(levelObject) < levels.length - 1) {
        this.nextLevelObject = levels[levels.indexOf(levelObject) + 1];
    }
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
            playButton,
            backToMainMenu
        ]);
        menu.display();
    }

    this.WinMenu = function () {
        var menuTitle = new MenuFancyText(["Yeah!", "Nice!", "Gerbiltastic!", "Excellent!", "Awesome!", "Sweet!"].rand());
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            GetMenuObjectFromElement(this).close();
        });
        var text = new MenuText("Maybe there will be stats here some day.");

        var menuOptions = [menuTitle, text];
        if (this.nextLevelObject) {
            var newLevel = new LevelBase(this.nextLevelObject);
            var nextLevelButton = new MenuActionButton("Next Level", function () {
                newLevel.LevelStartMenu();
            });
            menuOptions.push(nextLevelButton);
        }
        menuOptions.push(backToMainMenu);

        var menu = new MenuBase(400, null, menuOptions);
        menu.display();
    }
}

function CheckForDeadState() {
    if (currentLevel == null) return;
    var gerbils = sprites.filter(function (spr) { return spr instanceof Gerbil; });
    var exitDoors = sprites.filter(function (spr) { return spr instanceof ExitDoor; });
    var savedGerbilCount = exitDoors.map(function (x) { return x.currentGerbilCount; }).sum();
    if (gerbils.length == 0 || savedGerbilCount > 1) {

        if (savedGerbilCount == 0) currentLevel.DeadMenu();
        else currentLevel.WinMenu();
        currentLevel = null;
    }
}


var levels = [
    { "v": "0.01", "n": "The Basics", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 3, "n": "EditorExitDoor", "e": ["tileX", "tileY", "width", "height", "requiredGerbils"] }, { "i": 4, "n": "EditorCoin", "e": ["tileX", "tileY"] }], "s": [{ "a": 0, "e": [6, 0] }, { "a": 1, "e": [-3, 1, 39, 14] }, { "a": 1, "e": [-19, -21, 16, 36] }, { "a": 1, "e": [8, 2, 4, 2] }, { "a": 1, "e": [18, -1, 4, 4] }, { "a": 2, "e": [17, -2, "Press space to jump"] }, { "a": 2, "e": [5, -1, "Use A and D to move"] }, { "a": 1, "e": [25, -2, 11, 3] }, { "a": 1, "e": [39, -2, 5, 2] }, { "a": 1, "e": [42, -1, 9, 3] }, { "a": 1, "e": [51, -6, 4, 10] }, { "a": 1, "e": [55, -7, 9, 14] }, { "a": 1, "e": [64, -25, 13, 36] }, { "a": 3, "e": [59, -9, 2, 2, 1] }, { "a": 2, "e": [46, -3, "Hold W and D to climb"] }, { "a": 4, "e": [20, -4] }, { "a": 4, "e": [29, -5] }, { "a": 4, "e": [38, -5] }, { "a": 4, "e": [37, -5] }, { "a": 4, "e": [36, -4] }, { "a": 4, "e": [39, -4] }, { "a": 4, "e": [50, -3] }, { "a": 4, "e": [50, -4] }, { "a": 4, "e": [50, -5] }, { "a": 4, "e": [50, -6] }, { "a": 4, "e": [53, -10] }] },
    { "v": "0.01", "n": "A Big Fan", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorSpikeBlock", "e": ["tileX", "tileY"] }, { "i": 3, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 4, "n": "EditorExitDoor", "e": ["tileX", "tileY", "width", "height"] }, { "i": 5, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 6, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 7, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }], "s": [{ "a": 0, "e": [1, 1] }, { "a": 1, "e": [4, 3, 7, 21] }, { "a": 2, "e": [11, 5] }, { "a": 2, "e": [12, 4] }, { "a": 2, "e": [13, 5] }, { "a": 2, "e": [12, 5] }, { "a": 2, "e": [11, 6] }, { "a": 2, "e": [12, 6] }, { "a": 2, "e": [13, 6] }, { "a": 2, "e": [11, 4] }, { "a": 2, "e": [13, 4] }, { "a": 1, "e": [14, 3, 4, 13] }, { "a": 1, "e": [11, 7, 3, 12] }, { "a": 3, "e": [12, 0] }, { "a": 3, "e": [13, 0] }, { "a": 3, "e": [14, 1] }, { "a": 3, "e": [11, 1] }, { "a": 1, "e": [14, -4, 3, 2] }, { "a": 1, "e": [8, -4, 3, 2] }, { "a": 1, "e": [19, -3, 3, 2] }, { "a": 1, "e": [4, -3, 4, 2] }, { "a": 1, "e": [0, 2, 4, 15] }, { "a": 1, "e": [0, -4, 4, 2] }, { "a": 1, "e": [-4, -3, 4, 19] }, { "a": 4, "e": [5, -5, 2, 2] }, { "a": 1, "e": [-13, -6, 6, 5] }, { "a": 3, "e": [-10, -8] }, { "a": 3, "e": [-11, -8] }, { "a": 3, "e": [-11, -9] }, { "a": 3, "e": [-10, -9] }, { "a": 3, "e": [-11, -7] }, { "a": 3, "e": [-10, -7] }, { "a": 1, "e": [18, 4, 4, 2] }, { "a": 1, "e": [25, -22, 4, 21] }, { "a": 5, "e": [22, 5, 3, 52, 8] }, { "a": 1, "e": [18, 6, 26, 8] }, { "a": 1, "e": [25, 4, 4, 2] }, { "a": 2, "e": [29, 5] }, { "a": 2, "e": [30, 5] }, { "a": 2, "e": [31, 5] }, { "a": 2, "e": [32, 5] }, { "a": 1, "e": [33, 4, 2, 2] }, { "a": 1, "e": [39, -5, 2, 11] }, { "a": 1, "e": [35, 3, 4, 3] }, { "a": 1, "e": [29, -6, 10, 4] }, { "a": 3, "e": [23, -1] }, { "a": 3, "e": [24, 0] }, { "a": 3, "e": [24, -2] }, { "a": 3, "e": [23, -3] }, { "a": 3, "e": [24, -4] }, { "a": 3, "e": [37, 1] }, { "a": 3, "e": [38, 1] }, { "a": 6, "e": [37, 2, false] }, { "a": 7, "e": [35, 2, "Press the up button (default \"W\") to toggle a lever"] }] },
    { "v": "0.01", "n": "The More The Merrier", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 2, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 3, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 4, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 5, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 6, "n": "EditorExitDoor", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [13, 2, 11, 5] }, { "a": 0, "e": [0, -22, 12, 44] }, { "a": 0, "e": [23, 12, 6, 14] }, { "a": 0, "e": [12, 13, 11, 13] }, { "a": 0, "e": [12, 11, 2, 2] }, { "a": 1, "e": [15, 12] }, { "a": 1, "e": [17, 12] }, { "a": 1, "e": [13, 10] }, { "a": 1, "e": [21, 12] }, { "a": 1, "e": [19, 12] }, { "a": 2, "e": [22, 11, "Hold up/W to stack gerbils. Hold down/s to scatter."] }, { "a": 0, "e": [27, 14, 10, 12] }, { "a": 3, "e": [29, 13, 4, 17, 10] }, { "a": 0, "e": [33, 12, 4, 2] }, { "a": 0, "e": [37, 10, 11, 16] }, { "a": 0, "e": [43, 3, 3, 3] }, { "a": 0, "e": [25, 1, 3, 7] }, { "a": 4, "e": [44, 2, false] }, { "a": 0, "e": [48, -16, 9, 43] }, { "a": 5, "e": [45, -1] }, { "a": 5, "e": [45, -2] }, { "a": 5, "e": [45, 0] }, { "a": 5, "e": [26, 10] }, { "a": 5, "e": [27, 9] }, { "a": 5, "e": [27, 11] }, { "a": 5, "e": [28, 10] }, { "a": 5, "e": [34, 10] }, { "a": 5, "e": [36, 10] }, { "a": 5, "e": [35, 9] }, { "a": 5, "e": [35, 11] }, { "a": 6, "e": [16, 0, 2, 2] }, { "a": 5, "e": [28, -1] }, { "a": 5, "e": [29, -2] }, { "a": 5, "e": [31, -2] }, { "a": 5, "e": [30, -1] }, { "a": 5, "e": [32, -1] }] },
    { "v": "0.01", "n": "Tick Tock", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 2, "n": "EditorPeekablock", "e": ["tileX", "tileY", "width", "height", "powerSource"] }, { "i": 3, "n": "EditorClock", "e": ["tileX", "tileY", "timeOn", "timeOff", "startingTick"] }, { "i": 4, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 6, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 7, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }], "s": [{ "a": 0, "e": [27, 26, 8, 8] }, { "a": 1, "e": [19, 24] }, { "a": 0, "e": [18, 25, 9, 11] }, { "a": 0, "e": [35, 25, 5, 2] }, { "a": 0, "e": [40, 26, 11, 10] }, { "a": 2, "e": [35, 27, 5, 7, 6] }, { "a": 3, "e": [37, 22, 75, 25, 0] }, { "a": 0, "e": [14, 24, 4, 12] }, { "a": 2, "e": [46, 24, 3, 1, 11] }, { "a": 0, "e": [49, 22, 6, 1] }, { "a": 0, "e": [51, 23, 10, 15] }, { "a": 3, "e": [47, 24, 75, 25, 0] }, { "a": 4, "e": [48, 22] }, { "a": 4, "e": [49, 20] }, { "a": 0, "e": [63, 23, 14, 6] }, { "a": 5, "e": [61, 31, 2, 16, 9] }, { "a": 6, "e": [67, 10, true] }, { "a": 2, "e": [69, 21, 2, 2, 34] }, { "a": 0, "e": [67, 19, 2, 2] }, { "a": 2, "e": [69, 17, 2, 2, 35] }, { "a": 0, "e": [71, 15, 2, 2] }, { "a": 2, "e": [73, 13, 2, 2, 34] }, { "a": 0, "e": [65, 11, 6, 2] }, { "a": 0, "e": [61, 32, 16, 8] }, { "a": 0, "e": [77, 6, 17, 36] }, { "a": 7, "e": [72, 30] }, { "a": 4, "e": [69, 31] }, { "a": 4, "e": [67, 31] }, { "a": 4, "e": [65, 31] }, { "a": 4, "e": [62, 27] }, { "a": 4, "e": [62, 25] }, { "a": 4, "e": [62, 29] }, { "a": 4, "e": [30, 25] }, { "a": 4, "e": [32, 25] }, { "a": 3, "e": [72, 21, 75, 25, 0] }, { "a": 3, "e": [72, 18, 75, 25, 50] }] },
    { "v": "0.01", "n": "Round Trip", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorPeekablock", "e": ["tileX", "tileY", "width", "height", "powerSource"] }, { "i": 3, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 4, "n": "EditorSpikeBlock", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 6, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 7, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }], "s": [{ "a": 0, "e": [4, 10] }, { "a": 1, "e": [14, 11, 10, 4] }, { "a": 2, "e": [24, 4, 2, 7, 4] }, { "a": 1, "e": [24, 11, 7, 2] }, { "a": 3, "e": [29, 14, true] }, { "a": 1, "e": [28, 15, 3, 28] }, { "a": 1, "e": [31, -10, 8, 51] }, { "a": 4, "e": [12, 12] }, { "a": 4, "e": [13, 12] }, { "a": 1, "e": [12, 13, 2, 2] }, { "a": 5, "e": [13, 6] }, { "a": 5, "e": [14, 7] }, { "a": 1, "e": [3, 11, 5, 3] }, { "a": 6, "e": [28, 9] }, { "a": 2, "e": [-7, 9, 8, 2, 21] }, { "a": 1, "e": [1, 10, 2, 5] }, { "a": 4, "e": [11, 13] }, { "a": 4, "e": [4, 14] }, { "a": 4, "e": [8, 13] }, { "a": 4, "e": [10, 13] }, { "a": 4, "e": [3, 14] }, { "a": 3, "e": [21, 10, false] }, { "a": 4, "e": [-7, 11] }, { "a": 4, "e": [-5, 11] }, { "a": 4, "e": [-4, 12] }, { "a": 4, "e": [-3, 11] }, { "a": 4, "e": [-2, 12] }, { "a": 4, "e": [0, 13] }, { "a": 1, "e": [-9, 10, 2, 2] }, { "a": 4, "e": [-1, 11] }, { "a": 1, "e": [-17, 12, 6, 31] }, { "a": 1, "e": [-11, 15, 4, 31] }, { "a": 5, "e": [-15, 10] }, { "a": 5, "e": [-16, 9] }, { "a": 5, "e": [-17, 10] }, { "a": 5, "e": [-16, 11] }, { "a": 1, "e": [-5, 17, 4, 32] }, { "a": 4, "e": [-6, 18] }, { "a": 4, "e": [-7, 18] }, { "a": 1, "e": [-1, 20, 9, 2] }, { "a": 4, "e": [12, 15] }, { "a": 1, "e": [8, 19, 2, 27] }, { "a": 1, "e": [12, 19, 4, 27] }, { "a": 1, "e": [16, 20, 4, 25] }, { "a": 1, "e": [23, 18, 5, 25] }, { "a": 5, "e": [20, 18] }, { "a": 5, "e": [22, 17] }, { "a": 5, "e": [11, 17] }, { "a": 5, "e": [0, 7] }, { "a": 5, "e": [-4, 6] }, { "a": 5, "e": [-6, 7] }, { "a": 5, "e": [-2, 6] }, { "a": 7, "e": [2, 8, "These stone blocks are only solid when powered. Find a lever to power it!"] }, { "a": 3, "e": [2, 9, false] }, { "a": 2, "e": [8, 9, 4, 4, 53] }] }
];