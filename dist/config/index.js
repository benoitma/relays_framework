"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serre_1 = __importDefault(require("./serre"));
exports.default = (name) => {
    if (name === "serre") {
        return new serre_1.default();
    }
    else {
        return new serre_1.default();
    }
};
//# sourceMappingURL=index.js.map