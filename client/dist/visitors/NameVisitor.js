"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var NameFactory_1 = require('./factories/NameFactory');
var SimpleNameVisitor = (function (_super) {
    __extends(SimpleNameVisitor, _super);
    function SimpleNameVisitor(parent, node, substitutions) {
        if (substitutions === void 0) { substitutions = null; }
        _super.call(this, parent, node, 'SimpleName');
        if (substitutions != null) {
            for (var i = 0; i < substitutions.length / 2; i++) {
                if (node.identifier === substitutions[i * 2]) {
                    this.name = substitutions[i * 2 + 1];
                    return;
                }
            }
        }
        this.name = node.identifier;
    }
    Object.defineProperty(SimpleNameVisitor.prototype, "fullName", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    SimpleNameVisitor.prototype.visit = function (builder) {
        // build this name
        builder.add(this.name, this.location);
    };
    return SimpleNameVisitor;
}(Visitor_1.default));
exports.SimpleNameVisitor = SimpleNameVisitor;
var QualifiedNameVisitor = (function (_super) {
    __extends(QualifiedNameVisitor, _super);
    function QualifiedNameVisitor(parent, node) {
        _super.call(this, parent, node, 'QualifiedName');
        this.qualification = NameFactory_1.default.create(this, node.qualifier);
        this.nameNode = new SimpleNameVisitor(this, node.name);
    }
    Object.defineProperty(QualifiedNameVisitor.prototype, "name", {
        get: function () {
            return this.qualification.name + '.' + this.nameNode.name;
        },
        enumerable: true,
        configurable: true
    });
    QualifiedNameVisitor.prototype.visit = function (builder) {
        this.qualification.visit(builder);
        builder.add('.');
        this.nameNode.visit(builder);
    };
    return QualifiedNameVisitor;
}(Visitor_1.default));
exports.QualifiedNameVisitor = QualifiedNameVisitor;
