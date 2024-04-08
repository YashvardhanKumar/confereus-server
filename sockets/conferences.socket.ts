import { Socket, Event } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import ConferenceServices from "../services/conference.services";
import { Conference } from "../models/conference.model";
import { jwtauth } from "./socket.middleware";
import { ObjectId } from "mongoose";

export default class ConferenceSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.socket = socket
        Conference.watch().on("change", (message) => {
            // console.log(message);
            ConferenceServices.fetchConferences('all').then((result) => {
                socket.emit("conferences", result);
            }).catch((err) => {
                // console.log(err);
            });
            ConferenceServices.fetchConferencesOne('all', message.documentKey._id).then((result) => {
                socket.emit("conferences-one", result);
            }).catch((err) => {
                // console.log(err);
            });
        })
        this.fetchConferences();
        this.addConferences();
        this.editConferences();
        this.deleteConferences();
    }
    fetchConferences(): void {
        let socket = this.socket;
        socket.on('conferences', (...args) => {
            // console.log(args);

            let { confId } = args[2];
            if (!confId) {
                ConferenceServices.fetchConferences('all').then((result) => {
                    socket.emit("conferences", result);
                }).catch((err) => {
                    // console.log(err);
                });
            } else {
                // console.log(args);
                ConferenceServices.fetchConferencesOne('all', confId).then((result) => {
                    // console.log(result);
                    socket.emit("conferences-one", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        })
    }

    addConferences(): void {
        let socket = this.socket;
        socket.on('conferences-add', (...args) => {
            let { subject, about, startTime, endTime, admin, creator, location } = args[2];
            ConferenceServices.addConferences(subject, about, startTime, endTime, admin, creator, location)
                .then((data) => {
                    // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                });
        })
    }

    editConferences(): void {
        let socket = this.socket;
        socket.on('conferences-edit', (...args) => {
            let { confId } = args[2][1];
            ConferenceServices.editConferences(confId, args[2][0])
                .then((data) => {
                    // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                });
        })
    }

    deleteConferences(): void {
        let socket = this.socket;
        socket.on('conferences-delete', (...args) => {
            let { confId } = args[2];
            ConferenceServices.deleteConference(confId)
                .then((data) => {
                    // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                });
        })
    }

    registerConference(): void {
        let socket = this.socket;
        socket.on('conferences-register', (...args) => {
            let { confId, userId } = args[2];
            ConferenceServices.registerConferences(confId, userId)
                .then((data) => {
                    // console.log(data);
                }).catch((err) => {
                    // console.log(err);
                });
        })
    }
}