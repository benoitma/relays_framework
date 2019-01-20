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
// [
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i1, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 0
//     }
//   },
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i2, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 11
//     }
//   },
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i3, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 11
//     }
//   },
// ]
class Scenario extends Interruptor_1.default {
    constructor(options) {
        super(options);
        this.description = options.description;
        this.state = Interruptor_1.InterruptorState.OFF;
        this.sequence = options.sequence;
        this.checkSequenceValidity();
    }
    checkSequenceValidity() {
        if (!this.sequence)
            throw "Sequence missing";
        if (!Array.isArray(this.sequence))
            throw "Sequence should be an array";
        for (var i = 0, len = this.sequence.length; i < len; i++) {
            let item = this.sequence[i];
            if (!item.options)
                throw "[OPTIONS ERROR] [item ${i}] item must have options]";
            // Interruptor types
            if (item.type == "interruptor") {
                if (!item.options.interruptor)
                    throw "[interruptor ERROR] [item ${i}] item should have an interruptor";
                let isInterruptor = item.options.interruptor instanceof Interruptor_1.default;
                if (!isInterruptor)
                    throw "[interruptor ERROR] options.interruptor should be an instance of Interruptor";
                if (!Number.isInteger(item.options.duration))
                    throw "[interruptor ERROR] [item ${i}] option.duration must be present and be an integer (duration in seconds)";
            }
        }
    }
    turnOn() {
        super.turnOn();
        console.log(`Turning on scenario ${this.name} at ${this.turnedOnAt}`);
        this.timeouts = [];
        for (var i = 0, len = this.sequence.length; i < len; i++) {
            let item = this.sequence[i];
            if (item.type == "interruptor") {
                let callback;
                if (i == this.sequence.length - 1)
                    callback = () => {
                        this.turnOff();
                    };
                let offset = item.options.offset || 0;
                console.log(`Will turn on ${item.options.interruptor.name} for ${item.options.duration} seconds in ${item.options.offset} seconds`);
                this.timeouts[i] = setTimeout(() => {
                    item.options.interruptor.turnOnFor(item.options.duration, callback);
                }, offset * 1000);
            }
        }
    }
    turnOff() {
        super.turnOff();
        console.log(`Scenario "${this.name}" turned off. Disabling all timeouts, turning off all interruptors in scenario`);
        if (this.timeouts) {
            this.timeouts.forEach(timeout => {
                clearTimeout(timeout);
            });
            this.timeouts = null;
        }
        this.sequence.forEach(item => {
            if (item.type == "interruptor")
                item.options.interruptor.turnOff();
        });
    }
    turnOnFor() {
        throw "Should not be using this method";
    }
}
exports.default = Scenario;
//# sourceMappingURL=Scenario.js.map