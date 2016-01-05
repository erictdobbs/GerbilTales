var viewWidth = 800;
var viewHeight = 600;
window.onload = InitializeGameEngine;

var debugMode = false;

var gameViewContext;
var sprites = [];
var mouseInfo = { x: 0, y: 0, pressed: false, oldX: 0, oldY: 0, clicked: false };
var mainLoop = { interval: null, milliseconds: 20 };

function InitializeGameEngine() {

    var scale1 = new Scale(680, 240, 60, 60);
    var scale2 = new Scale(60, 420, 60, 60);
    scale1.pair(scale2);

    sprites.push(scale1, scale2);

    var button = new Button(240, 535, 60, 5);
    sprites.push(button);

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 4; j++) {
            sprites.push(new Gerbil(100 + j * 32, 300 + i * 32));
        }
    }
    sprites.push(new Wall(0, 540, 800, 60));
    sprites.push(new Wall(0, 0, 800, 60));
    sprites.push(new Wall(0, 0, 60, 600));
    sprites.push(new Wall(740, 0, 60, 600));
    sprites.push(new Wall(460, 240, 60, 60));
    sprites.push(new Wall(460, 300, 220, 60));
    sprites.push(new Wall(120, 420, 60, 120));


    sprites.push(new Wall(120, 180, 120, 60));
    var cell = new Cell(120, 120, 120, 60, button)
    cell.addCaptive(sprites[4]);
    cell.addCaptive(sprites[5]);
    sprites.push(cell);

    var wheel = new Wheel(680, 480, 100);
    sprites.push(wheel);

    sprites.push(new Fan(400, 520, 60, 20, wheel));

    var gameView = document.getElementById('gameView');

    gameView.addEventListener("mousedown", onMouseDown, false);
    gameView.addEventListener("mouseup", onMouseUp, false);
    gameView.addEventListener("mousemove", onMouseMove, false);
    gameView.addEventListener("touchstart", onMouseDown, false);
    gameView.addEventListener("touchmove", onMouseMove, false);
    gameView.addEventListener("touchend", onMouseUp, false);
    gameView.oncontextmenu = function (e) { e.preventDefault(); };

    gameView.onmousedown = function (e) {
        e = e || window.event;
        mouseInfo.x = e.clientX;
        mouseInfo.y = e.clientY;
        mouseInfo.pressed = true;
        mouseInfo.clicked = true;
    };

    gameView.onmousemove = function (e) {
        e = e || window.event;
        mouseInfo.x = e.clientX;
        mouseInfo.y = e.clientY;
    };

    gameView.onmouseup = function (e) { mouseInfo.pressed = false; };
    gameView.onmouseout = function (e) { mouseInfo.pressed = false; };

    gameView.ontouchstart = function (e) {
        e = e || window.event;
        e.preventDefault();
        var touch = e.touches.item(0);
        mouseInfo.x = touch.clientX;
        mouseInfo.y = touch.clientY;
        mouseInfo.pressed = true;
        mouseInfo.clicked = true;
    };

    gameView.ontouchmove = function (e) {
        e = e || window.event;
        e.preventDefault();
        var touch = e.touches.item(0);
        mouseInfo.x = touch.clientX;
        mouseInfo.y = touch.clientY;
        mouseInfo.pressed = true;
    };

    gameView.ontouchend = function (e) {
        e = e || window.event;
        e.preventDefault();
        mouseInfo.pressed = false;
    }

    gameViewContext = gameView.getContext('2d');
    gameViewContext.imageSmoothingEnabled = false;
    mainLoop.interval = setInterval(pulse, mainLoop.milliseconds);
}

var debugKeyStep = false;
function pulse() {
    MainDrawLoop();
    //cycleMouseInfo();
}


var paused = false;

function MainDrawLoop() {

    gameViewContext.clearRect(0, 0, viewWidth, viewHeight);

    if (keyboardState.isKeyPressed(keyboardState.key.P)) paused = false;
    if (keyboardState.isKeyPressed(keyboardState.key.O)) paused = true;
    
    var debugPressed = keyboardState.isKeyPressed(keyboardState.key.M);
    if (!debugPressed) debugKeyStep = false;

    for (var i = 0; i < sprites.length; i++)
        if (sprites[i] && sprites[i].active)
            if (!paused || (debugPressed && !debugKeyStep)) {
                sprites[i].executeRules();
            }
    for (var i = sprites.length - 1; i > 0; i--)
        if (sprites[i] && !sprites[i].active)
            sprites[i].delete();

    camera.updateCamera();

    for (var i = 0; i < sprites.length; i++) {
        camera.drawPowerConnection(sprites[i]);
    }
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].prepareDraw();
        sprites[i].draw();
    }

    if (debugPressed) debugKeyStep = true;
}

