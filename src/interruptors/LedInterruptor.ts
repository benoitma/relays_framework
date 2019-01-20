import Interruptor from "../Interruptor";
let mraa: any;
let groveSensor: any;

try {
  mraa = require("mraa");
  groveSensor = require("jsupm_grove");
} catch (err) {}

export default class LedInterruptor extends Interruptor {
  led: any;

  constructor(options: { name: String; port: Number }) {
    super(options);
    if (mraa) {
      this.led = new groveSensor.GroveLed(options.port);
    }
  }

  turnOn() {
    if (this.led) this.led.on();
    super.turnOn();
  }

  turnOff() {
    if (this.led) this.led.off();
    super.turnOff();
  }
}
