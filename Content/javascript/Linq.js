// Functions converted to linq so I don't have to remember the JS equivalients

Array.prototype.distinct = function () {
    var me = this;
    return me.filter(function (value, index) { return me.indexOf(value) == index });
};

// Also some other array extensions

Array.prototype.pushArray = function () {
    var toPush = this.concat.apply([], arguments);
    for (var i = 0, len = toPush.length; i < len; ++i) {
        this.push(toPush[i]);
    }
};