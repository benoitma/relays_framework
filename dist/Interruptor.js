"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("js-md5");
const moment = require("moment");
var InterruptorState;
(function (InterruptorState) {
    InterruptorState[InterruptorState["OFF"] = 0] = "OFF";
    InterruptorState[InterruptorState["ON"] = 1] = "ON";
    InterruptorState[InterruptorState["UNKNOWN"] = 2] = "UNKNOWN";
})(InterruptorState = exports.InterruptorState || (exports.InterruptorState = {}));
class Interruptor {
    constructor(options) {
        this.name = options.name;
        this.id = options.id || md5(this.name);
        this.state = InterruptorState.UNKNOWN;
        this.didTurnOn =
            typeof options.didTurnOn == "function"
                ? options.didTurnOn.bind(this)
                : () => { };
    }
    isOn() {
        return this.state === InterruptorState.ON;
    }
    turn(way = "on", time = null) {
        if (way == "on") {
            if (isNaN(parseInt(time))) {
                this.turnOn();
            }
            else {
                this.turnOnFor(parseInt(time), null);
            }
        }
        else if (way == "off") {
            this.turnOff();
        }
    }
    turnOn() {
        console.log(`Turning on ${this.name}`);
        this.state = InterruptorState.ON;
        this.turnedOnAt = moment();
        this.didTurnOn();
    }
    turnOff() {
        console.log(`Turning off ${this.name}`);
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.turnedOnAt = null;
        this.willTurnOffAt = null;
        this.state = InterruptorState.OFF;
    }
    turnOnFor(seconds, callback) {
        console.log(`Turning on ${this.name} for ${seconds} seconds`);
        this.turnOn();
        this.willTurnOffAt = this.turnedOnAt.clone().add(seconds, "seconds");
        this.timeout = setTimeout(() => {
            this.turnOff();
            this.timeout = null;
            if (callback)
                callback();
        }, seconds * 1000);
    }
    getState() {
        return {
            id: this.id,
            name: this.name,
            state: this.isOn() ? "on" : "off",
            infos: {
                turnedOnAt: this.turnedOnAt ? this.turnedOnAt.format() : null,
                willTurnOffAt: this.willTurnOffAt
                    ? this.willTurnOffAt.format("YYYY-MM-DDTHH:mm:ssZ")
                    : null,
                willTurnOffAsString: this.willTurnOffAt
                    ? this.willTurnOffAt.fromNow()
                    : null
            }
        };
    }
}
exports.default = Interruptor;
//# sourceMappingURL=Interruptor.js.map