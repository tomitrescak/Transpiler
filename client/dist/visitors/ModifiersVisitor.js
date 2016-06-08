"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Messages_1 = require('../config/Messages');
var MarkerVisitor_1 = require('./MarkerVisitor');
var ModifierVisitor = (function (_super) {
    __extends(ModifierVisitor, _super);
    function ModifierVisitor(parent, node, allowedModifiers, ignoredModifiers) {
        if (allowedModifiers === void 0) { allowedModifiers = []; }
        if (ignoredModifiers === void 0) { ignoredModifiers = []; }
        _super.call(this, parent, node, 'Modifier');
        var keyword = node.keyword;
        this.modifier = keyword;
        this.render = true;
        // we only return modifier if it is allowed, otherwise we throw warning
        if (allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) > -1) {
            this.addWarning(Messages_1.default.Warnings.IgnoredModifier, keyword);
            this.render = false;
        }
        if (allowedModifiers.length && allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) === -1) {
            this.addError(Messages_1.default.Errors.UnexpectedModifier, keyword);
            this.render = false;
        }
    }
    ModifierVisitor.prototype.visit = function (builder) {
        var _a = this.node, location = _a.location, keyword = _a.keyword;
        if (this.render) {
            builder.add(keyword + ' ', location);
        }
    };
    return ModifierVisitor;
}(Visitor_1.default));
exports.ModifierVisitor = ModifierVisitor;
var ModifiersVisitor = (function () {
    function ModifiersVisitor(parent, nodes, allowedModifiers, ignoredModifiers, allowAnnotations) {
        if (allowAnnotations === void 0) { allowAnnotations = false; }
        if (!nodes) {
            return;
        }
        ;
        // we create a list of all modifiers
        var modifiers = nodes.map(function (node) {
            switch (node.node) {
                case 'Modifier':
                    return new ModifierVisitor(parent, node, allowedModifiers, ignoredModifiers);
                case 'MarkerAnnotation':
                    return new MarkerVisitor_1.MarkerVisitor(parent, node, allowAnnotations);
                default:
                    throw new Error(node.node + ' not implemented');
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
            parent.addErrorAtLocation.apply(parent, [nodes[0].location, Messages_1.default.Errors.DuplicateAccessor].concat(accessors));
        }
        this.modifiers = modifiers;
    }
    ModifiersVisitor.prototype.visit = function (builder) {
        builder.join(this.modifiers, '');
    };
    return ModifiersVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModifiersVisitor;
