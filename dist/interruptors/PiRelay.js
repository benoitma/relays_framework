"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let gpio;
try {
    gpio = require("raspi-gpio");
}
catch (err) { }
class PiRelay {
    constructor(options) {
        if (gpio) {
            this.output = new gpio.DigitalOutput(options.pin);
        }
    }
    on() {
        if (gpio)
            this.output.write(gpio.LOW);
    }
    off() {
        if (gpio)
            this.output.write(gpio.HIGH);
    }
}
exports.default = PiRelay;
//# sourceMappingURL=PiRelay.js.map