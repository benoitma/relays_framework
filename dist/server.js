"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const scheduler = require("node-schedule");
const moment = require("moment-timezone");
const config_1 = __importDefault(require("./config"));
class App {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.setupRoutes();
    }
    setupRoutes() {
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        // Add headers
        this.app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
            res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
            res.setHeader("Access-Control-Allow-Credentials", true);
            next();
        });
        this.app.get("/ping", (req, res) => {
            res.write("ok");
            res.end();
        });
        this.app.get(`/relays`, (req, res) => {
            res.json(this.config.relays.map(i => {
                return i.getState();
            }));
        });
        this.app.get(`/relays/:id`, (req, res) => {
            this.actOnInterruptor(req.params.id, res, undefined);
        });
        this.app.get(`/relays/:id/on`, (req, res) => {
            this.actOnInterruptor(req.params.id, res, i => {
                i.turn("on", req.query.time);
            });
        });
        this.app.get(`/relays/:id/off`, (req, res) => {
            this.actOnInterruptor(req.params.id, res, i => {
                i.turn("off");
            });
        });
        this.app.post(`/relays/:id/on`, (req, res) => {
            this.actOnInterruptor(req.params.id, res, i => {
                i.turn("on", req.body.time);
            });
        });
        this.app.post(`/relays/:id/off`, (req, res) => {
            this.actOnInterruptor(req.params.id, res, i => {
                i.turn("off");
            });
        });
        this.app.listen(3001);
    }
    getInterruptor(id) {
        let result;
        for (const i in this.config.relays) {
            if (this.config.relays[i].id == id) {
                result = this.config.relays[i];
            }
        }
        return result;
    }
    actOnInterruptor(id, res, callback) {
        const i = this.getInterruptor(id);
        if (i) {
            if (callback)
                callback(i);
            res.json(i.getState());
        }
        else {
            res.json({ error: "Interruptor does not exist" });
        }
    }
}
const configurator = config_1.default("serre");
configurator.onReady(config => {
    new App(config);
});
//# sourceMappingURL=server.js.map