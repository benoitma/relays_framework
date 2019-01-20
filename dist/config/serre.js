"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RelayInterruptor_1 = __importDefault(require("../interruptors/RelayInterruptor"));
let gpio;
let raspi;
const moment = require("moment");
try {
    raspi = require("raspi");
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
class Serre {
    constructor(options = {}) {
        this.displayMessageFor("App is starting", 2000);
    }
    displayMessageFor(message, time) {
        if (this.display) {
            var line1Message = message;
            if (this.temp && this.temp1) {
                var line2Message = () => {
                    return `${moment()
                        .tz("Europe/Paris")
                        .format("DD/MM hh:mm:ss")}-T:${this.temp.value()}/${this.temp1.value()}`;
                };
            }
            else {
                var line2Message = () => {
                    return `${moment()
                        .tz("Europe/Paris")
                        .format("DD/MM hh:mm:ss")}`;
                };
            }
            this.display.displayMessageFor(line1Message, line2Message, time);
        }
        else {
            console.log(message);
        }
    }
    getConfig() {
        let allRelays = [];
        let sensors = [];
        const relayFan = new RelayInterruptor_1.default({
            name: "Irrigation Zone 1 (pin 12)",
            relay: new PiRelay({ pin: 12 }),
            type: "NC"
        });
        allRelays.push(relayFan);
        return {
            relays: allRelays,
            scheduledJobs: [{ hour: 7, minute: 30, interruptor: relayFan }],
            sensors: sensors
        };
    }
    onReady(callback) {
        if (raspi) {
            raspi(() => {
                callback(this.getConfig());
            });
        }
        else {
            callback(this.getConfig());
        }
    }
}
exports.default = Serre;
//# sourceMappingURL=serre.js.map