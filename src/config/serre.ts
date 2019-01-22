import { RelayInterruptor } from "../interruptors";
import Interruptor from "../Interruptor";
import { Config, Configurator } from ".";

let gpio: any;
let raspi: any;
const moment = require("moment");

try {
  raspi = require("raspi");
  gpio = require("raspi-gpio");
} catch (err) {
  console.log(err);
}

export default class Serre implements Configurator {
  display: any;
  temp: any;
  temp1: any;

  constructor() {
    this.displayMessageFor("App is starting", 2000);
  }

  displayMessageFor(message: String, time: Number) {
    if (this.display) {
      const line1Message = message;
      let line2Message: () => String;

      if (this.temp && this.temp1) {
        line2Message = () => {
          return `${moment()
            .tz("Europe/Paris")
            .format(
              "DD/MM hh:mm:ss"
            )}-T:${this.temp.value()}/${this.temp1.value()}`;
        };
      } else {
        line2Message = () => {
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
    const allRelays = [];
    const sensors: Array<any> = [];

    const relayFan = new RelayInterruptor({
      name: "Fan",
      port: 7,
      builder: "pi",
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
    console.log("RASPI", !!raspi);
    if (raspi) {
      raspi.init(() => {
        callback(this.getConfig());
      });
    } else {
      callback(this.getConfig());
    }
  }
}
