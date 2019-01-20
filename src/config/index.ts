import Interruptor from "../Interruptor";
import Serre from "./serre";

interface Config {
  relays: Array<Interruptor>;
  scheduledJobs: Array<{
    hour: number;
    minute: number;
    interruptor: Interruptor;
  }>;
  sensors: Array<any>;
}

interface Configurator {
  getConfig: () => Config;
  onReady: (callback: (config: Config) => void) => void;
}

export { Config, Configurator };
export default (name: String): Configurator => {
  if (name === "serre") {
    return new Serre();
  } else {
    return new Serre();
  }
};
