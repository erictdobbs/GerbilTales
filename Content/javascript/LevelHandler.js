
var currentLevel = null;

function LevelBase(levelObject) {
    var me = this;
    this.LevelStartMenu = function () {
        var menuTitle = new MenuFancyText('Get Ready!');
        var levelTitle = new MenuTitle('Level Title');
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            mainMenu.centerPosition();
            GetMenuObjectFromElement(this).close();
        });
        var playButton = new MenuActionButton("Play!", function () {
            GetMenuObjectFromElement(this).close();
            LoadLevel(levelObject);
            SwitchToPlayMode(false);
            currentLevel = me;
        })

        var menu = new MenuBase(400, null, [
            menuTitle,
            levelTitle,
            playButton,
            backToMainMenu
        ]);
        menu.display();
        menu.centerPosition();
    }

    this.DeadMenu = function () {
        var menuTitle = new MenuFancyText('Oops!');
        var levelTitle = new MenuTitle('Level Title');
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            mainMenu.centerPosition();
            GetMenuObjectFromElement(this).close();
        });
        var playButton = new MenuActionButton("Try Again!", function () {
            GetMenuObjectFromElement(this).close();
            SwitchToPlayMode(false);
            currentLevel = me;
        })

        var menu = new MenuBase(400, null, [
            menuTitle,
            levelTitle,
            playButton,
            backToMainMenu
        ]);
        menu.display();
        menu.centerPosition();
    }

    this.WinMenu = function () {
        var menuTitle = new MenuFancyText('Yeah!');
        var backToMainMenu = new MenuActionButton("Back to Main Menu", function () {
            var mainMenu = new MainMenu();
            mainMenu.display();
            mainMenu.centerPosition();
            GetMenuObjectFromElement(this).close();
        });
        var text = new MenuText("Maybe there will be stats here some day.");

        var menu = new MenuBase(400, null, [
            menuTitle,
            text,
            backToMainMenu
        ]);
        menu.display();
        menu.centerPosition();
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