"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var SimpleNameVisitor = (function (_super) {
    __extends(SimpleNameVisitor, _super);
    function SimpleNameVisitor() {
        _super.apply(this, arguments);
    }
    SimpleNameVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'SimpleName');
        return node.identifier;
    };
    return SimpleNameVisitor;
}(Visitor_1.default));
exports.SimpleNameVisitor = SimpleNameVisitor;
var QualifiedNameVisitor = (function (_super) {
    __extends(QualifiedNameVisitor, _super);
    function QualifiedNameVisitor() {
        _super.apply(this, arguments);
    }
    QualifiedNameVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'QualifiedName');
        return new NameVisitor(this).visit(node.qualifier) + '.' + new SimpleNameVisitor(this).visit(node.name);
    };
    return QualifiedNameVisitor;
}(Visitor_1.default));
exports.QualifiedNameVisitor = QualifiedNameVisitor;
var NameVisitor = (function (_super) {
    __extends(NameVisitor, _super);
    function NameVisitor() {
        _super.apply(this, arguments);
    }
    NameVisitor.prototype.visit = function (node) {
        if (node.node === 'SimpleName') {
            return new SimpleNameVisitor(this.parent).visit(node);
        }
        else if (node.node === 'QualifiedName') {
            return new QualifiedNameVisitor(this.parent).visit(node);
        }
        throw 'Unsupported node: ' + node.node;
    };
    return NameVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NameVisitor;
