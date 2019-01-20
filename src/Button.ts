const md5 = require("js-md5");
const moment = require("moment");
let upm: any;

try {
  upm = require("jsupm_button");
} catch (err) {}

export default class Button {
  name: String;
  id: String;
  button: any;

  constructor(options: { name: String; port: Number }) {
    this.name = options.name;
    this.id = md5(this.name);

    if (upm) {
      this.button = new upm.Button(options.port);
    }
  }

  isOn() {
    if (this.button) {
      return this.button.value() == 1;
    } else {
      return false;
    }
  }

  // Execute function when button is pressed
  watchOn(
    interval: number,
    callback: () => void,
    stopAfterFirstExecution = true
  ) {
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
