let gpio: any;

try {
  gpio = require("raspi-gpio");
} catch (err) {}

export default class PiRelay {
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
