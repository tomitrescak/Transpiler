"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Builder_1 = require('../config/Builder');
var MarkerVisitor_1 = require('./MarkerVisitor');
var ModifiersVisitor = (function (_super) {
    __extends(ModifiersVisitor, _super);
    function ModifiersVisitor() {
        _super.apply(this, arguments);
    }
    ModifiersVisitor.prototype.visit = function (nodes, allowedModifiers, errorModifiers, allowAnnotations) {
        var _this = this;
        if (allowAnnotations === void 0) { allowAnnotations = false; }
        if (!nodes) {
            return;
        }
        ;
        // we create a list of all modifiers
        nodes.forEach(function (node) {
            switch (node.node) {
                case 'Modifier':
                    new ModifierVisitor(_this).visit(node, allowedModifiers, errorModifiers);
                    break;
                case 'MarkerAnnotation':
                    new MarkerVisitor_1.default(_this).visit(node, allowAnnotations);
                    break;
                default:
                    _this.check(node, ['Modifier', 'MarkerAnnotation']);
            }
        });
        // check for duplicate identifiers
        var accessors = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node === 'Modifier') {
                var n = nodes[i];
                if (n.keyword === 'public' || n.keyword === 'protected' || n.keyword === 'private') {
                    accessors.push(n.keyword);
                }
            }
        }
        if (accessors.length > 1) {
            Builder_1.default.addError((_a = Builder_1.default.Errors).DuplicateAccessor.apply(_a, accessors), nodes[0].location);
        }
        var _a;
    };
    return ModifiersVisitor;
}(Visitor_1.default));
exports.ModifiersVisitor = ModifiersVisitor;
var ModifierVisitor = (function (_super) {
    __extends(ModifierVisitor, _super);
    function ModifierVisitor() {
        _super.apply(this, arguments);
    }
    ModifierVisitor.prototype.visit = function (node, allowedModifiers, errorModifiers) {
        if (allowedModifiers === void 0) { allowedModifiers = []; }
        if (errorModifiers === void 0) { errorModifiers = []; }
        _super.prototype.check.call(this, node, 'Modifier');
        // we only return modifier if it is allowed, otherwise we throw warning
        if (allowedModifiers.indexOf(node.keyword) === -1 && errorModifiers.indexOf(node.keyword) === -1) {
            Builder_1.default.addWarning(Builder_1.default.Warnigns.IgnoredModifier(node.keyword), node.location);
            return;
        }
        if (errorModifiers.indexOf(node.keyword) > -1) {
            Builder_1.default.addError(Builder_1.default.Errors.UnexpectedModifier(node.keyword), node.location);
            return '';
        }
        Builder_1.default.add(node.keyword + ' ', node);
    };
    return ModifierVisitor;
}(Visitor_1.default));
exports.ModifierVisitor = ModifierVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModifiersVisitor;
