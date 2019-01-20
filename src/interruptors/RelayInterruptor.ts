import Interruptor, { InterruptorState } from "../Interruptor";
let mraa: any;
let groveSensor: any;

try {
  mraa = require("mraa");
  groveSensor = require("jsupm_grove");
} catch (err) {}

export default class RelayInterruptor extends Interruptor {
  builder: any;
  relay: any;

  constructor(options: {
    name: String;
    port?: Number;
    builder?: String;
    type: String;
    relay: any;
  }) {
    super(options);
    this.builder = options.builder;

    if (options.builder == "grove") {
      this.relay = new groveSensor.GroveRelay(options.port);
      if (this.relay.isOn()) this.state = InterruptorState.ON;
      if (this.relay.isOff()) this.state = InterruptorState.OFF;
    } else if (options.relay) {
      this.relay = options.relay;
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
    if (this.relay) this.relay.on();
    super.turnOn();
  }

  turnOff() {
    if (this.relay) this.relay.off();
    super.turnOff();
  }
}
