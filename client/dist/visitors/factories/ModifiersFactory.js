"use strict";
var ModifiersVisitor_1 = require('../ModifiersVisitor');
var MarkerVisitor_1 = require('../MarkerVisitor');
var Messages_1 = require('../../config/Messages');
var ModifiersFactory = (function () {
    function ModifiersFactory() {
    }
    ModifiersFactory.create = function (parent, nodes, allowedModifiers, ignoredModifiers, allowAnnotations) {
        if (allowAnnotations === void 0) { allowAnnotations = false; }
        if (!nodes) {
            return;
        }
        ;
        // we create a list of all modifiers
        var modifiers = nodes.map(function (node) {
            switch (node.node) {
                case 'Modifier':
                    return new ModifiersVisitor_1.ModifierVisitor(parent, node, allowedModifiers, ignoredModifiers);
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
        return modifiers;
    };
    return ModifiersFactory;
}());
exports.ModifiersFactory = ModifiersFactory;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModifiersFactory;
