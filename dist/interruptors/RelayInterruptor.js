"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interruptor_1 = __importStar(require("../Interruptor"));
let mraa;
let groveSensor;
let gpio;
try {
    mraa = require("mraa");
    groveSensor = require("jsupm_grove");
}
catch (err) { }
try {
    gpio = require("raspi-gpio");
}
catch (err) { }
class RelayInterruptor extends Interruptor_1.default {
    constructor(options) {
        super(options);
        this.builder = options.builder;
        this.inverted = options.inverted;
        if (options.builder === "pi") {
            if (gpio) {
                this.relay = new gpio.DigitalOutput(options.port);
            }
        }
        else if (options.builder == "grove") {
            this.relay = new groveSensor.GroveRelay(options.port);
            if (this.relay.isOn())
                this.state = Interruptor_1.InterruptorState.ON;
            if (this.relay.isOff())
                this.state = Interruptor_1.InterruptorState.OFF;
        }
        if (options.type === "NC") {
            setTimeout(() => {
                this.turnOff();
            }, 1000);
        }
    }
    isOn() {
        if (this.builder == "grove") {
            return this.relay.isOn();
        }
        else {
            return super.isOn();
        }
    }
    turnOn() {
        if (this.builder === "pi" && !!gpio) {
            this.relay.write(this.inverted ? gpio.LOW : gpio.HIGH);
        }
        else if (this.builder === "grove") {
            this.relay.on();
        }
        super.turnOn();
    }
    turnOff() {
        if (this.builder === "pi" && !!gpio) {
            this.relay.write(this.inverted ? gpio.HIGH : gpio.LOW);
        }
        else if (this.builder === "grove") {
            this.relay.on();
        }
        super.turnOff();
    }
}
exports.default = RelayInterruptor;
//# sourceMappingURL=RelayInterruptor.js.map