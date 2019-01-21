import Interruptor, { InterruptorState } from "../Interruptor";

// [
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i1, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 0
//     }
//   },
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i2, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 11
//     }
//   },
//   {
//     type: "interruptor",
//     options: {
//       interruptor: i3, // Interruptor object
//       duration: 10, // Time in seconds
//       offset: 11
//     }
//   },
// ]

export default class Scenario extends Interruptor {
  description: String;
  sequence: Array<any>;
  timeouts: Array<NodeJS.Timer>;

  constructor(options: {
    name: String;
    description: String;
    sequence: Array<any>;
  }) {
    super(options);
    this.description = options.description;
    this.state = InterruptorState.OFF;

    this.sequence = options.sequence;
    this.checkSequenceValidity();
  }

  checkSequenceValidity() {
    if (!this.sequence) throw "Sequence missing";
    if (!Array.isArray(this.sequence)) throw "Sequence should be an array";

    for (let i = 0, len = this.sequence.length; i < len; i++) {
      const item = this.sequence[i];

      if (!item.options)
        throw "[OPTIONS ERROR] [item ${i}] item must have options]";

      // Interruptor types
      if (item.type == "interruptor") {
        if (!item.options.interruptor)
          throw "[interruptor ERROR] [item ${i}] item should have an interruptor";
        const isInterruptor = item.options.interruptor instanceof Interruptor;
        if (!isInterruptor)
          throw "[interruptor ERROR] options.interruptor should be an instance of Interruptor";

        if (!Number.isInteger(item.options.duration))
          throw "[interruptor ERROR] [item ${i}] option.duration must be present and be an integer (duration in seconds)";
      }
    }
  }

  turnOn() {
    super.turnOn();
    console.log(`Turning on scenario ${this.name} at ${this.turnedOnAt}`);

    this.timeouts = [];
    for (let i = 0, len = this.sequence.length; i < len; i++) {
      const item = this.sequence[i];

      if (item.type == "interruptor") {
        let callback: () => void;
        if (i == this.sequence.length - 1)
          callback = () => {
            this.turnOff();
          };

        const offset = item.options.offset || 0;
        console.log(
          `Will turn on ${item.options.interruptor.name} for ${
            item.options.duration
          } seconds in ${item.options.offset} seconds`
        );
        this.timeouts[i] = setTimeout(() => {
          item.options.interruptor.turnOnFor(item.options.duration, callback);
        }, offset * 1000);
      }
    }
  }

  turnOff() {
    super.turnOff();
    console.log(
      `Scenario "${
        this.name
      }" turned off. Disabling all timeouts, turning off all interruptors in scenario`
    );

    if (this.timeouts) {
      this.timeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
      this.timeouts = undefined;
    }

    this.sequence.forEach(item => {
      if (item.type == "interruptor") item.options.interruptor.turnOff();
    });
  }

  turnOnFor() {
    throw "Should not be using this method";
  }
}
