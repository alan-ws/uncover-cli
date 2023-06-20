"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("k6/http"));
const k6_1 = require("k6");
function default_1() {
    http_1.default.get("https://test.k6.io");
    (0, k6_1.sleep)(1);
}
exports.default = default_1;
//# sourceMappingURL=script.js.map