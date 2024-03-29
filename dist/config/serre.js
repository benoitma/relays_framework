"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interruptors_1 = require("../interruptors");
let gpio;
let raspi;
const moment = require("moment");
try {
    raspi = require("raspi");
    gpio = require("raspi-gpio");
}
catch (err) {
    console.log(err);
}
class Serre {
    constructor() {
        this.displayMessageFor("App is starting", 2000);
    }
    displayMessageFor(message, time) {
        if (this.display) {
            const line1Message = message;
            let line2Message;
            if (this.temp && this.temp1) {
                line2Message = () => {
                    return `${moment()
                        .tz("Europe/Paris")
                        .format("DD/MM hh:mm:ss")}-T:${this.temp.value()}/${this.temp1.value()}`;
                };
            }
            else {
                line2Message = () => {
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
        const allRelays = [];
        const sensors = [];
        const relayFan = new interruptors_1.RelayInterruptor({
            name: "Fan",
            port: 7,
            builder: "pi",
            type: "NO"
        });
        allRelays.push(relayFan);
        return {
            relays: allRelays,
            scheduledJobs: [{ hour: 7, minute: 30, interruptor: relayFan }],
            sensors: sensors
        };
    }
    onReady(callback) {
        console.log("RASPI", !!raspi);
        if (raspi) {
            raspi.init(() => {
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