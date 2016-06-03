"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var MarkerVisitor_1 = require('./MarkerVisitor');
var ModifiersVisitor = (function (_super) {
    __extends(ModifiersVisitor, _super);
    function ModifiersVisitor() {
        _super.apply(this, arguments);
    }
    ModifiersVisitor.prototype.visit = function (nodes, allowedModifiers, errorModifiers, allowAnnotations) {
        var _this = this;
        if (allowAnnotations === void 0) { allowAnnotations = false; }
        // we create a list of all modifiers
        var modifiers = [];
        nodes.forEach(function (node) {
            switch (node.node) {
                case 'Modifier':
                    modifiers.push(new ModifierVisitor(_this).visit(node, allowedModifiers, errorModifiers));
                    break;
                case 'MarkerAnnotation':
                    new MarkerVisitor_1.default(_this).visit(node, allowAnnotations);
                    break;
                default:
                    Visitor_1.default.checkNode(node, ['Modifier', 'MarkerAnnotation']);
            }
        });
        // check for duplicate identifiers
        var accessors = [];
        if (modifiers.indexOf('public') > -1) {
            accessors.push('public');
        }
        if (modifiers.indexOf('private') > -1) {
            accessors.push('private');
        }
        if (modifiers.indexOf('protected') > -1) {
            accessors.push('protected');
        }
        // filter modifiers by allowed ones
        modifiers = modifiers.filter(function (m) { return allowedModifiers.indexOf(m) > -1; });
        if (accessors.length > 1) {
            Visitor_1.default.addError((_a = Visitor_1.default.messages.Errors).DuplicateAccessor.apply(_a, accessors), nodes[0].line);
        }
        return Visitor_1.default.join(modifiers, ' ', ' ');
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
            Visitor_1.default.addWarning(Visitor_1.default.Warnigns.IgnoredModifier(node.keyword), node.line);
        }
        if (errorModifiers.indexOf(node.keyword) > -1) {
            Visitor_1.default.addError(Visitor_1.default.Errors.UnexpectedModifier(node.keyword), node.line);
            return '';
        }
        return node.keyword;
    };
    return ModifierVisitor;
}(Visitor_1.default));
exports.ModifierVisitor = ModifierVisitor;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModifiersVisitor;
