﻿var keyboardState;
keyboardState = new Object();

keyboardState.keyState = new Array();
keyboardState.handleKeyDown = function (e) {
    e = e || window.event;
    keyboardState.keyState[e.keyCode] = true;
};

keyboardState.handleKeyUp = function (e) {
    e = e || window.event;
    keyboardState.keyState[e.keyCode] = false;
};

keyboardState.isKeyPressed = function (key) { return keyboardState.keyState[key]; };

keyboardState.isLeftPressed = function () { return this.isKeyPressed(this.key["A"]) || this.isKeyPressed(this.key["Left"]); };
keyboardState.isRightPressed = function () { return this.isKeyPressed(this.key["D"]) || this.isKeyPressed(this.key["Right"]); };
keyboardState.isUpPressed = function () { return this.isKeyPressed(this.key["W"]) || this.isKeyPressed(this.key["Up"]); };
keyboardState.isDownPressed = function () { return this.isKeyPressed(this.key["S"]) || this.isKeyPressed(this.key["Down"]); };
keyboardState.isJumpPressed = function () { return this.isKeyPressed(this.key["Space"]); };
keyboardState.isDeletePressed = function () { return this.isKeyPressed(this.key["Delete"]); };

keyboardState.key = {
    None: 0,
    Enter: 13,
    Shift: 16,
    Ctrl: 17,
    Alt: 18,
    Pause: 19,
    Escape: 27,
    Space: 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Insert: 45,
    Delete: 46,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    LWindow: 91,
    RWindow: 92,
    ContextMenu: 93,
    NumPad0: 96,
    NumPad1: 97,
    NumPad2: 98,
    NumPad3: 99,
    NumPad4: 100,
    NumPad5: 101,
    NumPad6: 102,
    NumPad7: 103,
    NumPad8: 104,
    NumPad9: 105,
    NumPadMultiply: 106,
    NumPadAdd: 107,
    NumPadEnter: 108,
    NumPadSubtract: 109,
    NumPadDecimal: 110,
    NumPadDivide: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NumLock: 144,
    ScrollLock: 145,
    SemiColon: 186,
    Equal: 187,
    Comma: 188,
    Minus: 189,
    Period: 190,
    Slash: 191,
    Backtick: 192,
    LeftBracket: 219,
    BackSlash: 220,
    RightBracket: 221,
    Quote: 222
};

document.onkeydown = keyboardState.handleKeyDown;
document.onkeyup = keyboardState.handleKeyUp;