var m_isMouseClicked = false;
var m_mouseX = 0;
var m_mouseY = 0;

function onMouseDown(e) {
    if (e.button === undefined || e.button === 0) {
        m_isMouseClicked = true;

        var canvas = document.getElementById("gameView");

        var pageX = e.pageX;
        var pageY = e.pageY;
        if (e.touches) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        }

        var x = pageX;
        var y = pageY;
        for (var node = canvas; node != null; node = node.parentNode) {
            if (node.offsetLeft) x -= node.offsetLeft;
            if (node.offsetTop) y -= node.offsetTop;
        }
        m_mouseX = x;
        m_mouseY = y;
    }
}

function onMouseUp(e) {
    if (e.button === undefined || e.button === 0) {
        m_isMouseClicked = false;
    }
}


function onMouseMove(e) {
    var canvas = document.getElementById("gameView");
    var pageX = e.pageX;
    var pageY = e.pageY;
    if (e.touches) {
        pageX = e.touches[0].pageX;
        pageY = e.touches[0].pageY;
    }

    var x = pageX;
    var y = pageY;
    for (var node = canvas; node != null; node = node.parentNode) {
        if (node.offsetLeft) x -= node.offsetLeft;
        if (node.offsetTop) y -= node.offsetTop;
    }

    mouseDeltaX = x - m_mouseX;
    mouseDeltaY = y - m_mouseY;

    m_mouseX = x;
    m_mouseY = y;
}

var mouseX = 0;
var mouseY = 0;
var mouseDeltaX = 0;
var mouseDeltaY = 0;
var oldMouseX = 0;
var oldMouseY = 0;
var isMouseClicked = false;
var oldIsMouseClicked = false;
var isMouseChanged = false;
function UpdateMouseDelta() {
    mouseX = m_mouseX;
    mouseY = m_mouseY;
    isMouseClicked = m_isMouseClicked;

    mouseDeltaX = mouseX - oldMouseX;
    mouseDeltaY = mouseY - oldMouseY;

    oldMouseX = mouseX;
    oldMouseY = mouseY;
    isMouseChanged = (oldIsMouseClicked != isMouseClicked);
    oldIsMouseClicked = isMouseClicked;
}



function SetCursor(cursorType) {
    document.getElementById('gameView').style.cursor = cursorType;
}