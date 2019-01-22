const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const scheduler = require("node-schedule");
const moment = require("moment-timezone");

import { Config, Configurator } from "./config";
import getConfigurator from "./config";
import Interruptor from "./Interruptor";

class App {
  config: Config;
  app: any;

  constructor(config: Config) {
    this.config = config;
    this.app = express();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(bodyParser.json());

    // Add headers
    this.app.use(function(req: any, res: any, next: any) {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
      );
      res.setHeader("Access-Control-Allow-Credentials", true);
      next();
    });

    this.app.get("/ping", (req: any, res: any) => {
      res.write("ok");
      res.end();
    });

    this.app.get(`/relays`, (req: any, res: any) => {
      res.json(
        this.config.relays.map(i => {
          return i.getState();
        })
      );
    });

    this.app.get(`/relays/:id`, (req: any, res: any) => {
      this.actOnInterruptor(req.params.id, res, undefined);
    });

    this.app.get(`/relays/:id/on`, (req: any, res: any) => {
      this.actOnInterruptor(req.params.id, res, i => {
        i.turn("on", req.query.time);
      });
    });

    this.app.get(`/relays/:id/off`, (req: any, res: any) => {
      this.actOnInterruptor(req.params.id, res, i => {
        i.turn("off");
      });
    });

    this.app.post(`/relays/:id/on`, (req: any, res: any) => {
      this.actOnInterruptor(req.params.id, res, i => {
        i.turn("on", req.body.time);
      });
    });

    this.app.post(`/relays/:id/off`, (req: any, res: any) => {
      this.actOnInterruptor(req.params.id, res, i => {
        i.turn("off");
      });
    });

    this.app.listen(3001);
  }

  getInterruptor(id: String) {
    let result;
    for (const i in this.config.relays) {
      if (this.config.relays[i].id == id) {
        result = this.config.relays[i];
      }
    }
    return result;
  }

  actOnInterruptor(id: String, res: any, callback: (i: Interruptor) => void) {
    const i = this.getInterruptor(id);
    if (i) {
      if (callback) callback(i);
      res.json(i.getState());
    } else {
      res.json({ error: "Interruptor does not exist" });
    }
  }
}

const configName = process.env.CONFIG_NAME || (process.argv[2] || "serre");
const configurator = getConfigurator(configName);
configurator.onReady(config => {
  new App(config);
});
