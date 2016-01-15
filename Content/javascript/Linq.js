﻿// Functions converted to linq so I don't have to remember the JS equivalients

Array.prototype.distinct = function () {
    var me = this;
    return me.filter(function (value, index) { return me.indexOf(value) == index });
};

Array.prototype.any = function (func) {
    return this.filter(func).length > 0;
};

Array.prototype.min = function (func) {
    if (func === undefined) func = function (x) { return x; };
    var ret = null;
    for (var i = 0; i < this.length; i++) {
        if (ret === null || func(this[i]) < func(ret)) ret = this[i];
    }
    return ret;
};

Array.prototype.max = function (func) {
    if (func === undefined) func = function (x) { return x; };
    var ret = null;
    for (var i = 0; i < this.length; i++) {
        if (ret === null || func(this[i]) > func(ret)) ret = this[i];
    }
    return ret;
};

// Also some other array extensions

Array.prototype.pushArray = function () {
    var toPush = this.concat.apply([], arguments);
    for (var i = 0, len = toPush.length; i < len; ++i) {
        this.push(toPush[i]);
    }
};
Array.prototype.sum = function () {
    var ret = 0;
    for (var i = 0; i < this.length; i++) ret += this[i];
    return ret;
};
Array.prototype.average = function () {
    if (!this.length) return 0;
    return this.sum() / this.length;
};