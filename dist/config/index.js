"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serre_1 = __importDefault(require("./serre"));
const water_1 = __importDefault(require("./water"));
exports.default = (name) => {
    if (name === "serre") {
        return new serre_1.default();
    }
    else if (name === "water") {
        return new water_1.default();
    }
    else {
        throw new Error("Should be a valid config name");
    }
};
//# sourceMappingURL=index.js.map