import { Moment } from "moment";

const md5 = require("js-md5");
const moment = require("moment");

export enum InterruptorState {
  OFF = 0,
  ON,
  UNKNOWN
}

export default class Interruptor {
  name: String;
  id: String;
  state: InterruptorState;
  turnedOnAt: Moment;
  willTurnOffAt: Moment;

  didTurnOn: Function;
  timeout: NodeJS.Timer;

  constructor(options: {
    id?: String;
    name: String;
    port?: Number;
    recommendedTime?: Number;
    didTurnOn?: Function;
  }) {
    this.name = options.name;
    this.id = options.id || md5(this.name);
    this.state = InterruptorState.UNKNOWN;
    this.didTurnOn =
      typeof options.didTurnOn == "function"
        ? options.didTurnOn.bind(this)
        : () => {};
  }

  isOn() {
    return this.state === InterruptorState.ON;
  }

  turn(way = "on", time: string = undefined) {
    if (way == "on") {
      if (isNaN(parseInt(time))) {
        this.turnOn();
      } else {
        this.turnOnFor(parseInt(time), undefined);
      }
    } else if (way == "off") {
      this.turnOff();
    }
  }

  turnOn() {
    console.log(`Turning on ${this.name}`);
    this.state = InterruptorState.ON;
    this.turnedOnAt = moment();

    this.didTurnOn();
  }

  turnOff() {
    console.log(`Turning off ${this.name}`);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.turnedOnAt = undefined;
    this.willTurnOffAt = undefined;
    this.state = InterruptorState.OFF;
  }

  turnOnFor(seconds: number, callback: () => void) {
    console.log(`Turning on ${this.name} for ${seconds} seconds`);
    this.turnOn();
    this.willTurnOffAt = this.turnedOnAt.clone().add(seconds, "seconds");
    this.timeout = setTimeout(() => {
      this.turnOff();
      this.timeout = undefined;
      if (callback) callback();
    }, seconds * 1000);
  }

  getState() {
    return {
      id: this.id,
      name: this.name,
      state: this.isOn() ? "on" : "off",
      infos: {
        turnedOnAt: this.turnedOnAt ? this.turnedOnAt.format() : undefined,
        willTurnOffAt: this.willTurnOffAt
          ? this.willTurnOffAt.format("YYYY-MM-DDTHH:mm:ssZ")
          : undefined,
        willTurnOffAsString: this.willTurnOffAt
          ? this.willTurnOffAt.fromNow()
          : undefined
      }
    };
  }
}
