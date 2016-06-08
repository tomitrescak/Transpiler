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
        this.keyword = node.keyword;
    }
    ModifierVisitor.prototype.visit = function (builder) {
        builder.add(this.keyword + ' ', this.location);
    };
    return ModifierVisitor;
}(Visitor_1.default));
exports.ModifierVisitor = ModifierVisitor;
(function (ModifierLevel) {
    ModifierLevel[ModifierLevel["Class"] = 0] = "Class";
    ModifierLevel[ModifierLevel["Property"] = 1] = "Property";
    ModifierLevel[ModifierLevel["Function"] = 2] = "Function";
    ModifierLevel[ModifierLevel["Variable"] = 3] = "Variable";
})(exports.ModifierLevel || (exports.ModifierLevel = {}));
var ModifierLevel = exports.ModifierLevel;
var ModifiersVisitor = (function () {
    function ModifiersVisitor(parent, nodes, allowedModifiers, ignoredModifiers, modifierLevel, allowAnnotations) {
        var _this = this;
        if (allowedModifiers === void 0) { allowedModifiers = []; }
        if (ignoredModifiers === void 0) { ignoredModifiers = []; }
        if (allowAnnotations === void 0) { allowAnnotations = false; }
        if (!nodes) {
            return;
        }
        ;
        // we create a list of all modifiers
        this.modifiers = [];
        this.markers = [];
        var accessors = [];
        nodes.forEach(function (node) {
            switch (node.node) {
                case 'Modifier':
                    var m = node;
                    var visitor = new ModifierVisitor(parent, m);
                    var keyword = m.keyword;
                    // check whetegr it is static or final
                    if (keyword === 'static') {
                        _this.isStatic = true;
                    }
                    else if (keyword === 'final') {
                        _this.isFinal = true;
                    }
                    else if (keyword === 'public' || keyword === 'protected' || keyword === 'private') {
                        accessors.push(keyword);
                    }
                    // we only return modifier if it is allowed, otherwise we throw warning
                    if (allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) > -1) {
                        visitor.addWarning(Messages_1.default.Warnings.IgnoredModifier, keyword);
                    }
                    else if (allowedModifiers.length && allowedModifiers.indexOf(keyword) === -1 && ignoredModifiers.indexOf(keyword) === -1) {
                        visitor.addError(Messages_1.default.Errors.UnexpectedModifier, keyword);
                    }
                    else {
                        // deal with final keyword based on modifier level
                        // - on variable level, final becomes const
                        // - on method level, final becomes static but only if it is not static as well to avoid duplicates
                        if (keyword === 'final') {
                            if (modifierLevel === ModifierLevel.Variable) {
                                visitor.keyword = 'const';
                            }
                            else {
                                if (_this.isStatic) {
                                    return;
                                }
                                else {
                                    visitor.keyword = 'static';
                                }
                            }
                        }
                        _this.modifiers.push(visitor);
                    }
                    break;
                case 'MarkerAnnotation':
                    _this.markers.push(new MarkerVisitor_1.MarkerVisitor(parent, node, false));
                    break;
                default:
                    throw new Error(node.node + ' not implemented');
            }
        });
        // check for duplicate identifiers
        if (accessors.length > 1) {
            parent.addErrorAtLocation.apply(parent, [nodes[0].location, Messages_1.default.Errors.DuplicateAccessor].concat(accessors));
        }
    }
    ModifiersVisitor.prototype.visit = function (builder) {
        builder.join(this.modifiers, '');
    };
    return ModifiersVisitor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModifiersVisitor;
