"use strict";
var SourceMap_1 = require('../config/SourceMap');
var Messages_1 = require('../config/Messages');
var Handler_1 = require('./Handler');
var LeftPad_1 = require('../config/LeftPad');
var Builder = (function () {
    // constructor
    function Builder(handler) {
        this.Warnigns = Messages_1.default.Warnings;
        this.Errors = Messages_1.default.Errors;
        this.Infos = Messages_1.default.Infos;
        this.handler = handler ? handler : new Handler_1.default();
        this.text = '';
        this.currentLine = 0;
        this.currentColumn = 0;
        this.lineText = '';
        // init source map, reset previous run
        this.sourceMap = new SourceMap_1.default();
        this.sourceMap.init();
    }
    // methods
    Builder.prototype.addLine = function () {
        this.add('\n');
    };
    Builder.prototype.add = function (text, location) {
        // add to current text
        this.text += text;
        // count how many new line characters are there
        var nls = 0;
        for (var i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                nls++;
            }
            ;
        }
        if (location) {
            // console.log(node)
            this.sourceMap.setLine(this.currentLine, this.currentColumn, location.line, location.column);
        }
        // we start a new column if it was detected
        // if it was a last column we add what is remaming after the '\n' symbol
        this.currentColumn = nls === 0 ?
            this.currentColumn + text.length :
            text.substring(text.lastIndexOf('\n')).length; // new line
        this.currentLine += nls;
    };
    Builder.prototype.join = function (array, joinWith, append) {
        if (joinWith === void 0) { joinWith = ', '; }
        if (append === void 0) { append = ''; }
        if (array && array.length) {
            for (var i = 0; i < array.length; i++) {
                array[i].visit(this, array[i].node);
                // add separator
                if (i < array.length - 1) {
                    this.add(joinWith);
                }
            }
            if (append) {
                this.add(append);
            }
        }
    };
    Builder.prototype.pad = function (indent) {
        this.add(LeftPad_1.default('', indent));
    };
    // static addInfo(message: string, location: AstLocation) {
    //   this.handler.addInfo(message, location);
    // }
    Builder.prototype.addError = function (location, error) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.handler.addError(error.apply(null, args), location);
    };
    Builder.prototype.addWarning = function (location, warning) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.handler.addWarning(warning.apply(null, args), location);
    };
    return Builder;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Builder;
