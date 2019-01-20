// import RelayInterruptor from '../../src/interruptors/RelayInterruptor';
// import Button from '../../src/Button';
// import Interruptor from '../../src/Interruptor';
// import RelayInterruptor from '../../src/interruptors/RelayInterruptor';
// import Scenario from '../../src/interruptors/Scenario';
// import Display from '../../src/Display';
// try {
//   var groveSensor = require('jsupm_grove');
// } catch(err) {}
// export default class Config {
//   constructor(options){
//     this.display = new Display();
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
//   function getRelays(){
//     const button2 = new Button({ name: "pin 4", port: 4 });
//     var relayInterruptor6 = new RelayInterruptor({
//       id: "poule-up",
//       name: "Going UP -- pin 6",
//       port: 6,
//       didTurnOn: function(){
//         relayInterruptor7.turnOff();
//         self.displayMessageFor("DOOR GOING UP", 70000);
//         button2.watchOn(10, () => {
//           self.displayMessageFor("DOOR UP", 20000);
//           this.turnOff();
//         });
//         // Gestion du blocage :
//         // si la fin de course est encore enclenchée 12sec après le début, on redescend
//         setTimeout(() => {
//           if(button3.isOn()){
//             self.displayMessageFor("DOOR BLOCKED", 20000);
//             this.turnOff();
//             setTimeout(() => {
//               relayInterruptor7.turnOn();
//             }, 100);
//           }
//         }, 20000);
//       }
//     });
//     const button3 = new Button({ name: "pin 3", port: 3 });
//     const button8 = new Button({ name: "pin 8", port: 8 });
//     const relayInterruptor7 = new RelayInterruptor({
//       id: "poule-down",
//       name: "Going DOWN -- pin 7",
//       port: 7,
//       didTurnOn: function(){
//         relayInterruptor6.turnOff();
//         self.displayMessageFor("DOOR GOING DOWN", 70000);
//         // fin de course
//         button3.watchOn(10, () => {
//           self.displayMessageFor("LOCKING DOOR", 20000);
//           setTimeout(() => {
//             self.displayMessageFor("DOOR LOCKED", 20000);
//             this.turnOff();
//           }, 10000);
//         });
//         // Gestion anti écrasement
//         button8.watchOn(10, () => {
//           self.displayMessageFor("SAFETY ON", 20000);
//           this.turnOff();
//           setTimeout(() => {
//             relayInterruptor6.turnOn();
//           }, 100);
//         });
//       }
//     });
//     return [relayInterruptor6, relayInterruptor7];
//   }
//   function getSensors(){
//     if(groveSensor){
//       return [new groveSensor.GroveTemp(0), new groveSensor.GroveTemp(1)];
//     } else {
//       return [];
//     }
//   }
//   function getScheduledJobs(){
//     return [];
//   }
// }
//# sourceMappingURL=poules.js.map