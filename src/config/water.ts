import { RelayInterruptor, Scenario } from "../interruptors";
import { Configurator, Config } from ".";

let gpio: any;
let raspi: any;
const moment = require("moment");

try {
  raspi = require("raspi");
  gpio = require("raspi-gpio");
} catch (err) {
  console.log(err);
}

export default class Water implements Configurator {
  display: any;
  temp: any;
  temp1: any;

  constructor() {
    this.displayMessageFor("App is starting", 2000);
  }

  displayMessageFor(message: String, time: Number) {
    if (this.display) {
      const line1Message = message;
      let line2Message;

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
          return `${moment().tz("Europe/Paris").format("DD/MM hh:mm:ss")}`;
        };
      }

      this.display.displayMessageFor(line1Message, line2Message, time);
    } else {
      console.log(message);
    }
  }

  getConfig(): Config {
    const allRelays = [];
    const sensors: any[] = [];

    const relayInterruptor7 = new RelayInterruptor({
      name: "Irrigation zone 3 (pin 7)",
      port: 10,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor7);

    const relayInterruptor12 = new RelayInterruptor({
      name: "Irrigation Zone 1 (pin 12)",
      port: 12,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor12);

    const relayInterruptor13 = new RelayInterruptor({
      name: "Irrigation Zone 4 (pin 13)",
      port: 13,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor13);

    const relayInterruptor0 = new RelayInterruptor({
      name: "Irrigation Zone 2 (pin 0)",
      port: 0,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor0);

    const relayInterruptor3 = new RelayInterruptor({
      name: "Irrigation Zone X (pin 3)",
      port: 3,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor3);

    const watering = [];
    const seconds = 1200; // Time per zone
    const wait = 7; // wait between 2 zones
    for (let i = 0, len = allRelays.length; i < len; i++) {
      watering.push({
        type: "interruptor",
        options: {
          interruptor: allRelays[i],
          duration: seconds,
          offset: i * (seconds + wait),
        },
      });
    }

    const wateringScenario = new Scenario({
      name: "Scenario d'irrigation",
      description: "Irrigation de tout le jardin",
      sequence: watering,
    });
    allRelays.unshift(wateringScenario);

    const relayInterruptor2 = new RelayInterruptor({
      name: "Irrigation Zone Piscine (pin 2)",
      port: 2,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor2);

    const relayInterruptor14 = new RelayInterruptor({
      name: "Lampe piscine (pin 14)",
      port: 14,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor14);

    const relayInterruptor11 = new RelayInterruptor({
      name: "DO NOT OPEN (pin 11)",
      port: 11,
      builder: "pi",
      type: "NC",
      inverted: true,
    });
    allRelays.push(relayInterruptor11);

    return {
      relays: allRelays,
      scheduledJobs: [{ hour: 7, minute: 30, interruptor: wateringScenario }],
      sensors: sensors,
    };
  }

  onReady(callback: (config: Config) => void) {
    if (raspi) {
      console.log("Starting with raspi");
      raspi.init(() => {
        callback(this.getConfig());
      });
    } else {
      console.log("Starting WITHOUT raspi");
      callback(this.getConfig());
    }
  }
}
