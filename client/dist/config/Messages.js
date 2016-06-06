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
        UnexpectedModifier: function (modifier) { return 'Unexpected modifier: ' + modifier; },
        SimpleEnumsOnlySupported: function () { return 'Only simple enums are supported'; }
    },
    Warnings: {
        IgnoredAnnotation: function () { return 'Annotations are not supported and will be ignored'; },
        IgnoredModifier: function (modifier) { return "Modifier '" + modifier + "' is not supported on this level and will be ignored;"; }
    },
    Infos: {},
};
