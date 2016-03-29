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
    if (gerbils.length == 0 || savedGerbilCount >= 1) {

        if (savedGerbilCount == 0) currentLevel.DeadMenu();
        else currentLevel.WinMenu();
        currentLevel = null;
    }
}


var levels = [
    { "v": "0.2", "n": "The Basics", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 3, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 4, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorBackgroundWall", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [6, 0] }, { "a": 1, "e": [-3, 1, 39, 14] }, { "a": 1, "e": [-19, -21, 16, 36] }, { "a": 1, "e": [8, 2, 4, 2] }, { "a": 1, "e": [18, -1, 4, 4] }, { "a": 2, "e": [17, -2, "Press space to jump"] }, { "a": 2, "e": [5, -1, "Use A and D to move"] }, { "a": 1, "e": [25, -2, 11, 3] }, { "a": 1, "e": [39, -2, 5, 2] }, { "a": 1, "e": [42, -1, 9, 10] }, { "a": 1, "e": [51, -6, 4, 16] }, { "a": 1, "e": [55, -7, 9, 14] }, { "a": 1, "e": [64, -25, 13, 36] }, { "a": 3, "e": [59, -9] }, { "a": 2, "e": [46, -3, "Hold W and D to climb"] }, { "a": 4, "e": [20, -4] }, { "a": 4, "e": [29, -5] }, { "a": 4, "e": [38, -5] }, { "a": 4, "e": [37, -5] }, { "a": 4, "e": [36, -4] }, { "a": 4, "e": [39, -4] }, { "a": 4, "e": [50, -3] }, { "a": 4, "e": [50, -4] }, { "a": 4, "e": [50, -5] }, { "a": 4, "e": [50, -6] }, { "a": 4, "e": [53, -10] }, { "a": 5, "e": [19, -3, 9, 5] }, { "a": 5, "e": [34, -1, 10, 16] }] },
    { "v": "0.2", "n": "A Big Fan", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorSpikeBlock", "e": ["tileX", "tileY"] }, { "i": 3, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 4, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 6, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 7, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 8, "n": "EditorBackgroundWall", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [1, 1] }, { "a": 1, "e": [4, 3, 7, 21] }, { "a": 2, "e": [11, 5] }, { "a": 2, "e": [12, 4] }, { "a": 2, "e": [13, 5] }, { "a": 2, "e": [12, 5] }, { "a": 2, "e": [11, 6] }, { "a": 2, "e": [12, 6] }, { "a": 2, "e": [13, 6] }, { "a": 2, "e": [11, 4] }, { "a": 2, "e": [13, 4] }, { "a": 1, "e": [14, 3, 4, 13] }, { "a": 1, "e": [11, 7, 3, 12] }, { "a": 3, "e": [12, 0] }, { "a": 3, "e": [13, 0] }, { "a": 3, "e": [14, 1] }, { "a": 3, "e": [11, 1] }, { "a": 1, "e": [14, -4, 3, 2] }, { "a": 1, "e": [8, -4, 3, 2] }, { "a": 1, "e": [19, -3, 3, 2] }, { "a": 1, "e": [4, -3, 4, 2] }, { "a": 1, "e": [0, 2, 4, 15] }, { "a": 1, "e": [0, -4, 4, 2] }, { "a": 1, "e": [-4, -3, 4, 19] }, { "a": 4, "e": [5, -5] }, { "a": 1, "e": [-13, -6, 6, 5] }, { "a": 3, "e": [-10, -8] }, { "a": 3, "e": [-11, -8] }, { "a": 3, "e": [-11, -9] }, { "a": 3, "e": [-10, -9] }, { "a": 3, "e": [-11, -7] }, { "a": 3, "e": [-10, -7] }, { "a": 1, "e": [18, 4, 4, 2] }, { "a": 1, "e": [25, -22, 4, 21] }, { "a": 5, "e": [22, 5, 3, 52, 8] }, { "a": 1, "e": [18, 6, 29, 8] }, { "a": 1, "e": [25, 4, 4, 2] }, { "a": 2, "e": [29, 5] }, { "a": 2, "e": [30, 5] }, { "a": 2, "e": [31, 5] }, { "a": 2, "e": [32, 5] }, { "a": 1, "e": [33, 4, 2, 2] }, { "a": 1, "e": [39, -5, 8, 11] }, { "a": 1, "e": [35, 3, 4, 3] }, { "a": 1, "e": [29, -6, 10, 4] }, { "a": 3, "e": [23, -1] }, { "a": 3, "e": [24, 0] }, { "a": 3, "e": [24, -2] }, { "a": 3, "e": [23, -3] }, { "a": 3, "e": [24, -4] }, { "a": 3, "e": [37, 1] }, { "a": 3, "e": [38, 1] }, { "a": 6, "e": [37, 2, false] }, { "a": 7, "e": [35, 2, "Press the up button (default \"W\") to toggle a lever"] }, { "a": 8, "e": [-1, -3, 11, 15] }] },
    { "v": "0.01", "n": "The More The Merrier", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 2, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 3, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 4, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 5, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 6, "n": "EditorExitDoor", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [13, 2, 11, 5] }, { "a": 0, "e": [0, -22, 12, 44] }, { "a": 0, "e": [23, 12, 6, 14] }, { "a": 0, "e": [12, 13, 11, 13] }, { "a": 0, "e": [12, 11, 2, 2] }, { "a": 1, "e": [15, 12] }, { "a": 1, "e": [17, 12] }, { "a": 1, "e": [13, 10] }, { "a": 1, "e": [21, 12] }, { "a": 1, "e": [19, 12] }, { "a": 2, "e": [22, 11, "Hold up/W to stack gerbils. Hold down/s to scatter."] }, { "a": 0, "e": [27, 14, 10, 12] }, { "a": 3, "e": [29, 13, 4, 17, 10] }, { "a": 0, "e": [33, 12, 4, 2] }, { "a": 0, "e": [37, 10, 11, 16] }, { "a": 0, "e": [43, 3, 3, 3] }, { "a": 0, "e": [25, 1, 3, 7] }, { "a": 4, "e": [44, 2, false] }, { "a": 0, "e": [48, -16, 9, 43] }, { "a": 5, "e": [45, -1] }, { "a": 5, "e": [45, -2] }, { "a": 5, "e": [45, 0] }, { "a": 5, "e": [26, 10] }, { "a": 5, "e": [27, 9] }, { "a": 5, "e": [27, 11] }, { "a": 5, "e": [28, 10] }, { "a": 5, "e": [34, 10] }, { "a": 5, "e": [36, 10] }, { "a": 5, "e": [35, 9] }, { "a": 5, "e": [35, 11] }, { "a": 6, "e": [16, 0, 2, 2] }, { "a": 5, "e": [28, -1] }, { "a": 5, "e": [29, -2] }, { "a": 5, "e": [31, -2] }, { "a": 5, "e": [30, -1] }, { "a": 5, "e": [32, -1] }] },
    { "v": "0.2", "n": "Tick Tock", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 2, "n": "EditorPeekablock", "e": ["tileX", "tileY", "width", "height", "powerSource"] }, { "i": 3, "n": "EditorClock", "e": ["tileX", "tileY", "timeOn", "timeOff", "startingTick"] }, { "i": 4, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 6, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 7, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 8, "n": "EditorBackgroundWall", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [27, 26, 8, 8] }, { "a": 1, "e": [19, 24] }, { "a": 0, "e": [18, 25, 9, 11] }, { "a": 0, "e": [35, 25, 5, 2] }, { "a": 0, "e": [40, 26, 11, 10] }, { "a": 2, "e": [35, 27, 5, 7, 6] }, { "a": 3, "e": [37, 22, 75, 25, 0] }, { "a": 0, "e": [14, 24, 4, 12] }, { "a": 2, "e": [46, 24, 3, 1, 11] }, { "a": 0, "e": [49, 22, 6, 1] }, { "a": 0, "e": [51, 23, 10, 15] }, { "a": 3, "e": [47, 24, 75, 25, 0] }, { "a": 4, "e": [48, 22] }, { "a": 4, "e": [49, 20] }, { "a": 0, "e": [63, 23, 14, 6] }, { "a": 5, "e": [61, 31, 2, 16, 9] }, { "a": 6, "e": [67, 10, true] }, { "a": 2, "e": [69, 21, 2, 2, 34] }, { "a": 0, "e": [67, 19, 2, 2] }, { "a": 2, "e": [69, 17, 2, 2, 35] }, { "a": 0, "e": [71, 15, 2, 2] }, { "a": 2, "e": [73, 13, 2, 2, 34] }, { "a": 0, "e": [65, 11, 6, 2] }, { "a": 0, "e": [61, 32, 16, 8] }, { "a": 0, "e": [77, 6, 17, 36] }, { "a": 7, "e": [72, 30] }, { "a": 4, "e": [69, 31] }, { "a": 4, "e": [67, 31] }, { "a": 4, "e": [65, 31] }, { "a": 4, "e": [62, 27] }, { "a": 4, "e": [62, 25] }, { "a": 4, "e": [62, 29] }, { "a": 4, "e": [30, 25] }, { "a": 4, "e": [32, 25] }, { "a": 3, "e": [72, 21, 75, 25, 0] }, { "a": 3, "e": [72, 18, 75, 25, 50] }, { "a": 8, "e": [60, 24, 19, 13] }] },
    { "v": "0.01", "n": "Round Trip", "m": [{ "i": 0, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 1, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 2, "n": "EditorPeekablock", "e": ["tileX", "tileY", "width", "height", "powerSource"] }, { "i": 3, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 4, "n": "EditorSpikeBlock", "e": ["tileX", "tileY"] }, { "i": 5, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 6, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 7, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }], "s": [{ "a": 0, "e": [4, 10] }, { "a": 1, "e": [14, 11, 10, 4] }, { "a": 2, "e": [24, 4, 2, 7, 4] }, { "a": 1, "e": [24, 11, 7, 2] }, { "a": 3, "e": [29, 14, true] }, { "a": 1, "e": [28, 15, 3, 28] }, { "a": 1, "e": [31, -10, 8, 51] }, { "a": 4, "e": [12, 12] }, { "a": 4, "e": [13, 12] }, { "a": 1, "e": [12, 13, 2, 2] }, { "a": 5, "e": [13, 6] }, { "a": 5, "e": [14, 7] }, { "a": 1, "e": [3, 11, 5, 3] }, { "a": 6, "e": [28, 9] }, { "a": 2, "e": [-7, 9, 8, 2, 21] }, { "a": 1, "e": [1, 10, 2, 5] }, { "a": 4, "e": [11, 13] }, { "a": 4, "e": [4, 14] }, { "a": 4, "e": [8, 13] }, { "a": 4, "e": [10, 13] }, { "a": 4, "e": [3, 14] }, { "a": 3, "e": [21, 10, false] }, { "a": 4, "e": [-7, 11] }, { "a": 4, "e": [-5, 11] }, { "a": 4, "e": [-4, 12] }, { "a": 4, "e": [-3, 11] }, { "a": 4, "e": [-2, 12] }, { "a": 4, "e": [0, 13] }, { "a": 1, "e": [-9, 10, 2, 2] }, { "a": 4, "e": [-1, 11] }, { "a": 1, "e": [-17, 12, 6, 31] }, { "a": 1, "e": [-11, 15, 4, 31] }, { "a": 5, "e": [-15, 10] }, { "a": 5, "e": [-16, 9] }, { "a": 5, "e": [-17, 10] }, { "a": 5, "e": [-16, 11] }, { "a": 1, "e": [-5, 17, 4, 32] }, { "a": 4, "e": [-6, 18] }, { "a": 4, "e": [-7, 18] }, { "a": 1, "e": [-1, 20, 9, 2] }, { "a": 4, "e": [12, 15] }, { "a": 1, "e": [8, 19, 2, 27] }, { "a": 1, "e": [12, 19, 4, 27] }, { "a": 1, "e": [16, 20, 4, 25] }, { "a": 1, "e": [23, 18, 5, 25] }, { "a": 5, "e": [20, 18] }, { "a": 5, "e": [22, 17] }, { "a": 5, "e": [11, 17] }, { "a": 5, "e": [0, 7] }, { "a": 5, "e": [-4, 6] }, { "a": 5, "e": [-6, 7] }, { "a": 5, "e": [-2, 6] }, { "a": 7, "e": [2, 8, "These stone blocks are only solid when powered. Find a lever to power it!"] }, { "a": 3, "e": [2, 9, false] }, { "a": 2, "e": [8, 9, 4, 4, 53] }] },
    { "v": "0.2", "n": "Cannonball", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 2, "n": "EditorSpikeBlock", "e": ["tileX", "tileY"] }, { "i": 3, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 4, "n": "EditorCannon", "e": ["tileX", "tileY", "speed", "direction", "powerSource"] }, { "i": 5, "n": "EditorClock", "e": ["tileX", "tileY", "timeOn", "timeOff", "startingTick"] }, { "i": 6, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 7, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 8, "n": "EditorLogicNot", "e": ["tileX", "tileY", "input"] }, { "i": 9, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 10, "n": "EditorBackgroundWall", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [13, 12, 32, 7] }, { "a": 1, "e": [19, 11] }, { "a": 0, "e": [23, 10, 6, 2] }, { "a": 2, "e": [30, 11] }, { "a": 2, "e": [29, 11] }, { "a": 0, "e": [31, 10, 6, 2] }, { "a": 3, "e": [25, 7] }, { "a": 3, "e": [27, 7] }, { "a": 3, "e": [25, 9] }, { "a": 3, "e": [27, 9] }, { "a": 4, "e": [37, 11, 3, 0, 11] }, { "a": 5, "e": [35, 8, 75, 25, 0] }, { "a": 0, "e": [37, 10, 3, 1] }, { "a": 0, "e": [45, 11, 14, 9] }, { "a": 4, "e": [49, 7, 3, 270, 17] }, { "a": 4, "e": [55, 7, 3, 270, 17] }, { "a": 0, "e": [47, 2, 11, 5] }, { "a": 5, "e": [52, 7, 25, 25, 0] }, { "a": 3, "e": [48, 10] }, { "a": 3, "e": [51, 10] }, { "a": 3, "e": [54, 10] }, { "a": 3, "e": [57, 10] }, { "a": 6, "e": [59, 11, 3, 25, 12] }, { "a": 0, "e": [59, 12, 3, 9] }, { "a": 0, "e": [62, 11, 4, 13] }, { "a": 7, "e": [79, 6, false] }, { "a": 0, "e": [63, 2, 4, 7] }, { "a": 0, "e": [66, 11, 2, 1] }, { "a": 4, "e": [67, 12, 3, 0, 29] }, { "a": 5, "e": [66, 12, 25, 25, 0] }, { "a": 0, "e": [66, 13, 10, 11] }, { "a": 0, "e": [76, 11, 2, 18] }, { "a": 0, "e": [78, 7, 3, 18] }, { "a": 3, "e": [48, 0] }, { "a": 3, "e": [49, 1] }, { "a": 3, "e": [50, 0] }, { "a": 3, "e": [49, -1] }, { "a": 0, "e": [67, 2, 24, 2] }, { "a": 0, "e": [66, -2, 2, 4] }, { "a": 4, "e": [70, 1, 3, 0, 41] }, { "a": 4, "e": [70, 0, 3, 0, 42] }, { "a": 5, "e": [68, 1, 50, 50, 0] }, { "a": 8, "e": [68, -1, 41] }, { "a": 0, "e": [68, -2, 3, 1] }, { "a": 0, "e": [81, 4, 2, 19] }, { "a": 9, "e": [84, 5] }, { "a": 0, "e": [83, 7, 13, 14] }, { "a": 3, "e": [88, 6] }, { "a": 3, "e": [90, 6] }, { "a": 3, "e": [92, 6] }, { "a": 0, "e": [96, -12, 4, 32] }, { "a": 0, "e": [62, 1, 4, 1] }, { "a": 0, "e": [55, 1, 4, 1] }, { "a": 10, "e": [65, 3, 16, 13] }, { "a": 10, "e": [47, 6, 2, 8] }, { "a": 10, "e": [56, 6, 2, 6] }] },
    { "v": "0.2", "n": "Cannonball Barrage", "m": [{ "i": 0, "n": "EditorWall", "e": ["tileX", "tileY", "width", "height"] }, { "i": 1, "n": "EditorCannon", "e": ["tileX", "tileY", "speed", "direction", "powerSource"] }, { "i": 2, "n": "EditorClock", "e": ["tileX", "tileY", "timeOn", "timeOff", "startingTick"] }, { "i": 3, "n": "EditorFan", "e": ["tileX", "tileY", "width", "powerSource", "tileRange"] }, { "i": 4, "n": "EditorLever", "e": ["tileX", "tileY", "startOn"] }, { "i": 5, "n": "EditorGerbil", "e": ["tileX", "tileY"] }, { "i": 6, "n": "EditorTextBox", "e": ["tileX", "tileY", "text"] }, { "i": 7, "n": "EditorCoin", "e": ["tileX", "tileY"] }, { "i": 8, "n": "EditorExitDoor", "e": ["tileX", "tileY"] }, { "i": 9, "n": "EditorLogicAnd", "e": ["tileX", "tileY", "input1", "input2"] }, { "i": 10, "n": "EditorBackgroundWall", "e": ["tileX", "tileY", "width", "height"] }], "s": [{ "a": 0, "e": [5, 31, 38, 20] }, { "a": 1, "e": [35, 30, 3, 90, 2] }, { "a": 2, "e": [35, 31, 25, 25, 0] }, { "a": 0, "e": [31, 30, 4, 1] }, { "a": 0, "e": [43, 33, 5, 18] }, { "a": 3, "e": [43, 32, 3, 6, 10] }, { "a": 4, "e": [68, 32, false] }, { "a": 0, "e": [39, 23, 4, 2] }, { "a": 0, "e": [36, 22, 3, 2] }, { "a": 0, "e": [31, 18, 4, 1] }, { "a": 5, "e": [26, 30] }, { "a": 6, "e": [38, 20, "Jump off cannonballs for a little extra height!"] }, { "a": 0, "e": [31, 22, 4, 2] }, { "a": 7, "e": [34, 17] }, { "a": 7, "e": [32, 17] }, { "a": 7, "e": [33, 17] }, { "a": 7, "e": [34, 16] }, { "a": 7, "e": [33, 16] }, { "a": 7, "e": [32, 16] }, { "a": 0, "e": [23, 26, 8, 2] }, { "a": 0, "e": [29, 22, 2, 4] }, { "a": 8, "e": [25, 24] }, { "a": 0, "e": [5, 12, 18, 19] }, { "a": 0, "e": [48, 34, 1, 1] }, { "a": 1, "e": [48, 33, 3, 0, 34] }, { "a": 0, "e": [48, 36, 2, 1] }, { "a": 1, "e": [49, 35, 3, 0, 34] }, { "a": 0, "e": [48, 38, 3, 1] }, { "a": 1, "e": [50, 37, 3, 0, 34] }, { "a": 1, "e": [51, 39, 3, 0, 34] }, { "a": 0, "e": [48, 40, 4, 1] }, { "a": 0, "e": [48, 41, 36, 10] }, { "a": 0, "e": [62, 27, 1, 12] }, { "a": 2, "e": [71, 39, 25, 25, 0] }, { "a": 9, "e": [70, 40, 33, 6] }, { "a": 0, "e": [63, 38, 4, 1] }, { "a": 0, "e": [65, 34, 3, 2] }, { "a": 0, "e": [68, 33, 2, 8] }, { "a": 0, "e": [69, 22, 4, 11] }, { "a": 0, "e": [31, 19, 3, 3] }, { "a": 10, "e": [29, 23, 13, 11] }, { "a": 10, "e": [62, 28, 7, 14] }] }
];