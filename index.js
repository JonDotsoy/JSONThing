"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonThink = exports.JSONThink = void 0;
var JSONThink = /** @class */ (function () {
    function JSONThink() {
    }
    JSONThink.prototype.stringify = function (value) {
        return JSON.stringify(value);
    };
    JSONThink.prototype.parse = function (text) {
        return JSON.parse(text);
    };
    return JSONThink;
}());
exports.JSONThink = JSONThink;
exports.jsonThink = new JSONThink();
