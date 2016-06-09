"use strict";
if (!Array.prototype['find']) {
    Array.prototype['find'] = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
var cache = [
    '',
    ' ',
    '  ',
    '   ',
    '    ',
    '     ',
    '      ',
    '       ',
    '        ',
    '         '
];
function leftPad(str, len, ch) {
    // convert `str` to `string`
    str = str + '';
    // doesn't need to pad
    len = len - str.length;
    if (len <= 0) {
        return str;
    }
    ;
    // convert `ch` to `string`
    if (!ch && ch !== 0) {
        ch = ' ';
    }
    ;
    ch = ch + '';
    if (ch === ' ' && len < 10) {
        return cache[len] + str;
    }
    var pad = '';
    while (true) {
        if (len & 1) {
            pad += ch;
        }
        len >>= 1;
        if (len) {
            ch += ch;
        }
        else {
            break;
        }
    }
    return pad + str;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = leftPad;
