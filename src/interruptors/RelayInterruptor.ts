import Interruptor, { InterruptorState } from "../Interruptor";
let mraa: any;
let groveSensor: any;
let gpio: any;

try {
  mraa = require("mraa");
  groveSensor = require("jsupm_grove");
} catch (err) {}

try {
  gpio = require("raspi-gpio");
} catch (err) {}

export default class RelayInterruptor extends Interruptor {
  builder: String;
  relay: any;
  type: String;
  inverted: Boolean;

  constructor(options: {
    name: String;
    port?: Number;
    builder?: String;
    type: String;
    inverted?: Boolean;
  }) {
    super(options);
    this.builder = options.builder;
    if (options.builder === "pi") {
      if (gpio) {
        this.relay = new gpio.DigitalOutput(options.port);
      }
    } else if (options.builder == "grove") {
      this.relay = new groveSensor.GroveRelay(options.port);
      if (this.relay.isOn()) this.state = InterruptorState.ON;
      if (this.relay.isOff()) this.state = InterruptorState.OFF;
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
    } else {
      return super.isOn();
    }
  }

  turnOn() {
    if (this.builder === "pi" && !!gpio) {
      this.relay.write(this.inverted ? gpio.LOW : gpio.HIGH);
    } else if (this.builder === "grove") {
      this.relay.on();
    }
    super.turnOn();
  }

  turnOff() {
    if (this.builder === "pi" && !!gpio) {
      this.relay.write(this.inverted ? gpio.HIGH : gpio.LOW);
    } else if (this.builder === "grove") {
      this.relay.on();
    }
    super.turnOff();
  }
}
