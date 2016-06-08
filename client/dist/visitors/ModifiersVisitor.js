"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Visitor_1 = require('./Visitor');
var Messages_1 = require('../config/Messages');
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
        if (allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) === -1) {
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
