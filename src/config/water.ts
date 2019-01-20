// import RelayInterruptor from '../interruptors/RelayInterruptor';
// import Scenario from '../interruptors/Scenario';

// import { init } from 'raspi';
// import { DigitalOutput, LOW, HIGH } from 'raspi-gpio';

// class PiRelay {
//   constructor(options){
//     this.output = new DigitalOutput(options.pin);
//   }

//   on(){
//     this.output.write(LOW);
//   }

//   off(){
//     this.output.write(HIGH);
//   }
// }

// export default class Config {
//   constructor(options){
//     this.displayMessageFor("App is starting", 2000);
//   }

//   displayMessageFor(message, time){
//     if(this.display) {
//       var line1Message = message;

//       if(this.temp && this.temp1){
//         var line2Message = () => {
//           return `${moment().tz("Europe/Paris").format('DD/MM hh:mm:ss')}-T:${this.temp.value()}/${this.temp1.value()}`;
//         }
//       } else {
//         var line2Message = () => {
//           return `${moment().tz("Europe/Paris").format('DD/MM hh:mm:ss')}`;
//         }
//       }

//       this.display.displayMessageFor(line1Message, line2Message, time);
//     } else {
//       console.log(message);
//     }
//   }

//   getConfig(){
//     let allRelays = [];

//     const relayInterruptor12 = new RelayInterruptor({name: "Irrigation Zone 1 (pin 12)", relay: new PiRelay({pin: 12}), type: 'NC'});
//     allRelays.push(relayInterruptor12);

//     const relayInterruptor0 = new RelayInterruptor({name: "Irrigation Zone 2 (pin 0)", relay: new PiRelay({pin: 0}), type: 'NC'});
//     allRelays.push(relayInterruptor0);

//     const relayInterruptor7 = new RelayInterruptor({name: "Irrigation zone 3 (pin 7)", relay: new PiRelay({pin: 10}), type: 'NC'});
//     allRelays.push(relayInterruptor7);

//     const relayInterruptor13 = new RelayInterruptor({name: "Irrigation Zone 4 (pin 13)", relay: new PiRelay({pin: 13}), type: 'NC'});
//     allRelays.push(relayInterruptor13);

//     const relayInterruptor3 = new RelayInterruptor({name: "Irrigation Zone X (pin 3)", relay: new PiRelay({pin: 3}), type: 'NC'});
//     allRelays.push(relayInterruptor3);

//     let watering = [];
//     const seconds = 600; // Time per zone
//     const wait = 30; // wait between 2 zones
//     for (var i = 0, len = allRelays.length; i < len; i++) {
//       watering.push({
//         type: 'interruptor',
//         options: {
//           interruptor: allRelays[i],
//           duration: seconds,
//           offset: i * (seconds + wait)
//         }
//       });
//     }

//     let wateringScenario = new Scenario({
//       name: "Scenario d'irrigation",
//       sequence: watering
//     });
//     allRelays.unshift(wateringScenario);

//     const relayInterruptor2 = new RelayInterruptor({name: "Irrigation Zone Piscine (pin 2)", relay: new PiRelay({pin: 2}), type: 'NC'});
//     allRelays.push(relayInterruptor2);

//     const relayInterruptor14 = new RelayInterruptor({name: "Lampe piscine (pin 14)", relay: new PiRelay({pin: 14}), type: 'NC'});
//     allRelays.push(relayInterruptor14);

//     const relayInterruptor11 = new RelayInterruptor({name: "DO NOT OPEN (pin 11)", relay: new PiRelay({pin: 11}), type: 'NC'});
//     allRelays.push(relayInterruptor11);

//     return {
//       relays: allRelays,
//       scheduledJobs: [
//         { hour: 7, minute: 30, interruptor: wateringScenario }
//       ],
//       sensors: []
//     };
//   }

//   onReady(callback){
//     if(init){
//       init(() => {
//         callback(this.getConfig());
//       });
//     } else {
//       callback(this.getConfig());
//     }
//   }
// }

// module.exports = Config
