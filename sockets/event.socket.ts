import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import ConferenceServices from "../services/conference.services";
import { Conference } from "../models/conference.model";
import { EventServices } from "../services/event.services";
import { Event } from "../models/events.model";

export default class EventSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.socket = socket;
        Event.watch().on("change", (message) => {
            console.log(message);
            const { _id, conferenceId } = message.documentKey;
            EventServices.fetchEventsOne(_id).then((result) => {
                socket.emit("events-one", result);
            }).catch((err) => {
                // console.log(err);
            });
            if (conferenceId) {

                EventServices.fetchEvents(conferenceId).then((result) => {
                    socket.emit("events", result);
                }).catch((err) => {
                    // console.log(err);
                });
            } else {
                if (message.operationType !== 'delete')
                    Event.findById(message.documentKey._id).then((value) => {
                        EventServices.fetchEvents(value.conferenceId.toString()).then((result) => {
                            socket.emit("events", result);
                        }).catch((err) => {
                            // console.log(err);
                        });
                    })
            }
        })
        this.fetchEvents();
        this.addEvents();
        this.deleteEvents();
        this.editEvents();
    }
    fetchEvents(): void {
        let socket = this.socket;
        socket.on('events', (...args) => {
            let { confId, eventId } = args[2];
            if (!eventId) {
                EventServices.fetchEvents(confId).then((result) => {
                    socket.emit("events", result);
                }).catch((err) => {
                    // console.log(err);
                });
            } else {
                EventServices.fetchEventsOne(eventId).then((result) => {
                    socket.emit("events-one", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        })
    }

    addEvents(): void {
        let socket = this.socket;
        socket.on('events-add', (...args) => {
            console.log(args);

            let { subject, presenter, startTime, endTime, location } = args[2][0];
            let { confId } = args[2][1];
            console.log(args[2][0]);

            EventServices.addEvents(subject, presenter, startTime, endTime, location, confId)
                .then((data) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });
        })
    }

    editEvents(): void {
        let socket = this.socket;
        socket.on('events-edit', (...args) => {
            console.log(args);
            let { eventId } = args[2][1];
            console.log(args[2][0]);
            
            EventServices.editEvents(args[2][0], eventId)
                .then((data) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });
        })
    }

    deleteEvents(): void {
        let socket = this.socket;
        socket.on('events-delete', (...args) => {
            let { eventId, confId } = args[2];
            EventServices.deleteEvents(eventId, confId)
                .then(async (data) => {
                    let result = await EventServices.fetchEvents(confId)
                    console.log(result);
                    socket.emit("events", result);
                    // console.log(err);
                    // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                });
        })
    }
}