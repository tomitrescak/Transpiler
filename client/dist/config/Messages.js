"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    Errors: {
        DuplicateAccessor: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return 'Duplicate accessors: ' + args.join();
        },
        UnexpectedModifier: function (modifier) {
            return 'Unexpected modifier: ' + modifier;
        },
        SimpleEnumsOnlySupported: function () {
            return 'Only simple enums are supported';
        },
        CannotFindSymbol: function (name) {
            return 'Cannot find symbol: ' + name;
        },
        TypeMismatch: function (from, to) {
            return "Type mismatch: Cannot convert from '" + from + "' to '" + to + "'";
        },
        MethodNotFound: function (name) {
            return "Method '" + name + "' not found";
        }
    },
    Warnings: {
        IgnoredAnnotation: function () { return 'Annotations are not supported.'; },
        IgnoredModifier: function (modifier) { return "Modifier '" + modifier + "' is not supported."; }
    },
    Infos: {},
};
