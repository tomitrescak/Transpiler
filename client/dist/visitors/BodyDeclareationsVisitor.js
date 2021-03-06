"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var FieldDeclarationVisitor_1 = require('./FieldDeclarationVisitor');
var BodyDeclarationsVisitor = (function (_super) {
    __extends(BodyDeclarationsVisitor, _super);
    function BodyDeclarationsVisitor() {
        _super.apply(this, arguments);
    }
    BodyDeclarationsVisitor.prototype.visit = function (types) {
        var _this = this;
        return types.map(function (type) {
            switch (type.node) {
                case 'FieldDeclaration':
                    return new FieldDeclarationVisitor_1.default(_this.parent).visit(type);
            }
        }).join('');
    };
    return BodyDeclarationsVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BodyDeclarationsVisitor;
