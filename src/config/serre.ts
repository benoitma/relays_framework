import RelayInterruptor from "../interruptors/RelayInterruptor";
import Interruptor from "../Interruptor";
import { Config, Configurator } from ".";

let gpio: any;
let raspi: any;
const moment = require("moment");

try {
  raspi = require("raspi");
  gpio = require("raspi-gpio");
} catch (err) {}

class PiRelay {
  output: any;

  constructor(options: { pin: number }) {
    if (gpio) {
      this.output = new gpio.DigitalOutput(options.pin);
    }
  }

  on() {
    if (gpio) this.output.write(gpio.LOW);
  }

  off() {
    if (gpio) this.output.write(gpio.HIGH);
  }
}

export default class Serre implements Configurator {
  display: any;
  temp: any;
  temp1: any;

  constructor(options: {} = {}) {
    this.displayMessageFor("App is starting", 2000);
  }

  displayMessageFor(message: String, time: Number) {
    if (this.display) {
      var line1Message = message;

      if (this.temp && this.temp1) {
        var line2Message = () => {
          return `${moment()
            .tz("Europe/Paris")
            .format(
              "DD/MM hh:mm:ss"
            )}-T:${this.temp.value()}/${this.temp1.value()}`;
        };
      } else {
        var line2Message = () => {
          return `${moment()
            .tz("Europe/Paris")
            .format("DD/MM hh:mm:ss")}`;
        };
      }

      this.display.displayMessageFor(line1Message, line2Message, time);
    } else {
      console.log(message);
    }
  }

  getConfig(): Config {
    let allRelays = [];
    let sensors: Array<any> = [];

    const relayFan = new RelayInterruptor({
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

  onReady(callback: (config: Config) => void) {
    if (raspi) {
      raspi(() => {
        callback(this.getConfig());
      });
    } else {
      callback(this.getConfig());
    }
  }
}
