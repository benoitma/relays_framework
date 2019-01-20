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
try {
    mraa = require("mraa");
    groveSensor = require("jsupm_grove");
}
catch (err) { }
class RelayInterruptor extends Interruptor_1.default {
    constructor(options) {
        super(options);
        this.builder = options.builder;
        if (options.builder == "grove") {
            this.relay = new groveSensor.GroveRelay(options.port);
            if (this.relay.isOn())
                this.state = Interruptor_1.InterruptorState.ON;
            if (this.relay.isOff())
                this.state = Interruptor_1.InterruptorState.OFF;
        }
        else if (options.relay) {
            this.relay = options.relay;
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
        if (this.relay)
            this.relay.on();
        super.turnOn();
    }
    turnOff() {
        if (this.relay)
            this.relay.off();
        super.turnOff();
    }
}
exports.default = RelayInterruptor;
//# sourceMappingURL=RelayInterruptor.js.map