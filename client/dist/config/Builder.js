"use strict";
var Messages_1 = require('../config/Messages');
var LeftPad_1 = require('../config/LeftPad');
var Builder = (function () {
    function Builder() {
    }
    Builder.addLine = function () {
        Builder.add('\n');
    };
    Builder.add = function (text, node) {
        if (node === void 0) { node = null; }
        // add to current text
        Builder.text += text;
        // count how many new line characters are there
        var nls = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                nls++;
            }
            ;
        }
        if (node) {
            // console.log(node)
            Builder.sourceMap.setLine(Builder.currentLine, Builder.currentColumn, node.location.line, node.location.column);
        }
        // we start a new column if it was detected
        // if it was a last column we add what is remaming after the '\n' symbol
        Builder.currentColumn = nls === 0 ?
            Builder.currentColumn + text.length :
            text.substring(text.lastIndexOf('\n')).length; // new line
        Builder.currentLine += nls;
    };
    Builder.join = function (array, joinFunc, joinWith, append) {
        if (joinWith === void 0) { joinWith = ', '; }
        if (append === void 0) { append = ''; }
        if (array && array.length) {
            for (var i = 0; i < array.length; i++) {
                joinFunc(array[i]);
                // add separator
                if (i < array.length - 1) {
                    Builder.add(joinWith);
                }
            }
            if (append) {
                Builder.add(append);
            }
        }
    };
    Builder.pad = function (indent) {
        Builder.add(LeftPad_1.default('', indent));
    };
    Builder.addInfo = function (message, location) {
        Builder.handler.addInfo(message, location);
    };
    Builder.addError = function (message, location) {
        Builder.handler.addError(message, location);
    };
    Builder.addWarning = function (message, location) {
        Builder.handler.addWarning(message, location);
    };
    Builder.Warnigns = Messages_1.default.Warnings;
    Builder.Errors = Messages_1.default.Errors;
    Builder.Infos = Messages_1.default.Infos;
    return Builder;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Builder;
