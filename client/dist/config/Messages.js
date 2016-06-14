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
        SymbolNotFound: function (name) {
            return 'Cannot find symbol: ' + name;
        },
        TypeMismatch: function (from, to) {
            return "Type mismatch: Cannot convert from '" + from + "' to '" + to + "'";
        },
        ConditionTypeMismatch: function (from, to) {
            return "Condition type mismatch: Cannot convert from '" + from + "' to boolean";
        },
        AssignTypeMismatch: function (from, to) {
            return "Incorrect assignment: Cannot assign '" + from + "' to '" + to + "'";
        },
        MethodNotFound: function (name) {
            return "Method '" + name + "' not found";
        },
        VariableNotFound: function (name) {
            return "Variable '" + name + "' not found";
        },
        TypeNotFound: function (name) {
            return "Type '" + name + "' not found";
        },
        FieldNotFound: function (name, typeName) {
            return "Field '" + name + "' not found on type '" + typeName + "'";
        },
        MissingReturnType: function () {
            return "Missing return type";
        },
        NoSuperClass: function () {
            return 'Class has no parent';
        },
        ConstantAssignment: function () {
            return 'Cannot assign value to a constant';
        },
        LabelsNotSupported: function () {
            return 'Labels are not supported';
        },
        TryResourcesNotSupported: function () {
            return 'Try statement resources are not supported';
        },
        MoreCatchClausesNotSupported: function () {
            return 'Only one catch clause is supported';
        },
        ContructorExpressionNotSupported: function () {
            return 'Contructor expressions not supported';
        },
        ConstructorTypeArgumentsNotSupported: function () {
            return 'Contructor type arguments not supported';
        }
    },
    Warnings: {
        IgnoredAnnotation: function () { return 'Annotations are not supported.'; },
        IgnoredModifier: function (modifier) { return "Modifier '" + modifier + "' is not supported."; }
    },
    Infos: {},
};
