"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interruptor_1 = __importDefault(require("../Interruptor"));
try {
    var mraa = require("mraa");
    var groveSensor = require("jsupm_grove");
}
catch (err) { }
class LedInterruptor extends Interruptor_1.default {
    constructor(options) {
        super(options);
        if (mraa) {
            this.led = new groveSensor.GroveLed(options.port);
        }
    }
    turnOn() {
        if (this.led)
            this.led.on();
        super.turnOn();
    }
    turnOff() {
        if (this.led)
            this.led.off();
        super.turnOff();
    }
}
exports.default = LedInterruptor;
//# sourceMappingURL=LedInterruptor.js.map