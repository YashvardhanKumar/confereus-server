"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_services_1 = require("../services/event.services");
const events_model_1 = require("../models/events.model");
class EventSocket {
    constructor(socket) {
        this.socket = socket;
        events_model_1.Event.watch().on("change", (message) => {
            // console.log(message);
            const { _id, conferenceId } = message.documentKey;
            event_services_1.EventServices.fetchEventsOne(_id).then((result) => {
                socket.emit("events-one", result);
            }).catch((err) => {
                // console.log(err);
            });
            if (conferenceId) {
                event_services_1.EventServices.fetchEvents(conferenceId).then((result) => {
                    socket.emit("events", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
            else {
                events_model_1.Event.findById(message.documentKey._id).then((value) => {
                    event_services_1.EventServices.fetchEvents(value.conferenceId.toString()).then((result) => {
                        socket.emit("events", result);
                    }).catch((err) => {
                        // console.log(err);
                    });
                });
            }
        });
        this.fetchEvents();
        this.addEvents();
        this.deleteEvents();
        this.editEvents();
    }
    fetchEvents() {
        let socket = this.socket;
        socket.on('events', (...args) => {
            let { confId, eventId } = args[2];
            if (!eventId) {
                event_services_1.EventServices.fetchEvents(confId).then((result) => {
                    socket.emit("events", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
            else {
                event_services_1.EventServices.fetchEventsOne(eventId).then((result) => {
                    socket.emit("events-one", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        });
    }
    addEvents() {
        let socket = this.socket;
        socket.on('events-add', (...args) => {
            let { subject, presenter, startTime, endTime, location, confId } = args[2];
            event_services_1.EventServices.addEvents(subject, presenter, startTime, endTime, location, confId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    editEvents() {
        let socket = this.socket;
        socket.on('events-edit', (...args) => {
            let { eventId } = args[2];
            event_services_1.EventServices.editEvents(args[2], eventId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    deleteEvents() {
        let socket = this.socket;
        socket.on('events-delete', (...args) => {
            let { eventId, confId } = args[2];
            event_services_1.EventServices.deleteEvents(eventId, confId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
}
exports.default = EventSocket;
//# sourceMappingURL=event.socket.js.map