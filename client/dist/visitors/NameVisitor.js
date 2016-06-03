"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var BaseNameVisitor = (function (_super) {
    __extends(BaseNameVisitor, _super);
    function BaseNameVisitor() {
        _super.apply(this, arguments);
    }
    return BaseNameVisitor;
}(Visitor_1.default));
var SimpleNameVisitor = (function (_super) {
    __extends(SimpleNameVisitor, _super);
    function SimpleNameVisitor() {
        _super.apply(this, arguments);
    }
    SimpleNameVisitor.prototype.visit = function (node, substitutions) {
        if (substitutions === void 0) { substitutions = null; }
        _super.prototype.check.call(this, node, 'SimpleName');
        if (substitutions != null) {
            for (var i = 0; i < substitutions.length / 2; i++) {
                if (node.identifier === substitutions[i * 2]) {
                    Builder_1.default.add(substitutions[i * 2 + 1], node);
                    return this;
                }
            }
        }
        this.name = node.identifier;
        // build this name
        Builder_1.default.add(this.name, node);
        return this;
    };
    return SimpleNameVisitor;
}(BaseNameVisitor));
exports.SimpleNameVisitor = SimpleNameVisitor;
var QualifiedNameVisitor = (function (_super) {
    __extends(QualifiedNameVisitor, _super);
    function QualifiedNameVisitor() {
        _super.apply(this, arguments);
    }
    QualifiedNameVisitor.prototype.visit = function (node) {
        _super.prototype.check.call(this, node, 'QualifiedName');
        new NameVisitor(this).visit(node.qualifier);
        Builder_1.default.add('.');
        // remember name
        this.name = new SimpleNameVisitor(this).visit(node.name).name;
        return this;
    };
    return QualifiedNameVisitor;
}(BaseNameVisitor));
exports.QualifiedNameVisitor = QualifiedNameVisitor;
var NameVisitor = (function (_super) {
    __extends(NameVisitor, _super);
    function NameVisitor() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(NameVisitor.prototype, "name", {
        get: function () {
            return this.visitor.name;
        },
        enumerable: true,
        configurable: true
    });
    NameVisitor.prototype.visit = function (node, substitutions) {
        if (substitutions === void 0) { substitutions = null; }
        if (node.node === 'SimpleName') {
            this.visitor = new SimpleNameVisitor(this.parent).visit(node, substitutions);
        }
        else if (node.node === 'QualifiedName') {
            this.visitor = new QualifiedNameVisitor(this.parent).visit(node);
        }
        else {
            throw new Error('Unsupported node: ' + node.node);
        }
        //console.log(this.visitor);
        return this;
    };
    return NameVisitor;
}(Visitor_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NameVisitor;
