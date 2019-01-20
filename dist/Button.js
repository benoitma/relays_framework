"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("js-md5");
const moment = require("moment");
let upm;
try {
    upm = require("jsupm_button");
}
catch (err) { }
class Button {
    constructor(options) {
        this.name = options.name;
        this.id = md5(this.name);
        if (upm) {
            this.button = new upm.Button(options.port);
        }
    }
    isOn() {
        if (this.button) {
            return this.button.value() == 1;
        }
        else {
            return false;
        }
    }
    // Execute function when button is pressed
    watchOn(interval, callback, stopAfterFirstExecution = true) {
        console.log(`Button ${this.name} watching`);
        const timer = setInterval(() => {
            if (this.isOn()) {
                console.log(`Button ${this.name} pressed`);
                if (stopAfterFirstExecution) {
                    clearInterval(timer);
                }
                callback();
            }
        }, interval);
    }
    getState() {
        return {
            id: this.id,
            name: this.name,
            state: this.isOn() ? "on" : "off"
        };
    }
}
exports.default = Button;
//# sourceMappingURL=Button.js.map