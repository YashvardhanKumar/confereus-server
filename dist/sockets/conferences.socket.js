"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conference_services_1 = __importDefault(require("../services/conference.services"));
const conference_model_1 = require("../models/conference.model");
class ConferenceSocket {
    constructor(socket) {
        this.socket = socket;
        conference_model_1.Conference.watch().on("change", (message) => {
            // console.log(message);
            conference_services_1.default.fetchConferences('all').then((result) => {
                socket.emit("conferences", result);
            }).catch((err) => {
                // console.log(err);
            });
            conference_services_1.default.fetchConferencesOne('all', message.documentKey._id).then((result) => {
                socket.emit("conferences-one", result);
            }).catch((err) => {
                // console.log(err);
            });
        });
        this.fetchConferences();
        this.addConferences();
        this.editConferences();
        this.deleteConferences();
    }
    fetchConferences() {
        let socket = this.socket;
        socket.on('conferences', (...args) => {
            // console.log(args);
            let { confId } = args[2];
            if (!confId) {
                conference_services_1.default.fetchConferences('all').then((result) => {
                    socket.emit("conferences", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
            else {
                // console.log(args);
                conference_services_1.default.fetchConferencesOne('all', confId).then((result) => {
                    // console.log(result);
                    socket.emit("conferences-one", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        });
    }
    addConferences() {
        let socket = this.socket;
        socket.on('conferences-add', (...args) => {
            let { subject, about, startTime, endTime, admin, creator, location } = args[2];
            conference_services_1.default.addConferences(subject, about, startTime, endTime, admin, creator, location)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    editConferences() {
        let socket = this.socket;
        socket.on('conferences-edit', (...args) => {
            let { confId } = args[2];
            conference_services_1.default.editConferences(confId, args[2])
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    deleteConferences() {
        let socket = this.socket;
        socket.on('conferences-delete', (...args) => {
            let { confId } = args[2];
            conference_services_1.default.deleteConference(confId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    registerConference() {
        let socket = this.socket;
        socket.on('conferences-register', (...args) => {
            let { confId, userId } = args[2];
            conference_services_1.default.registerConferences(confId, userId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
}
exports.default = ConferenceSocket;
//# sourceMappingURL=conferences.socket.js.map