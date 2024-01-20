import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Abstract } from "../models/abstract.model";
import { AbstractServices } from "../services/abstract.services";
import { Event } from "../models/events.model";

class AbstractSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.socket = socket;
        Abstract.watch().on("change", (message) => {
            // console.log(message);
            const { _id, eventId, conferenceId } = message.documentKey;
            AbstractServices.fetchAbstractOne(_id).then((result) => {
                socket.emit("abstracts-one", result);
            }).catch((err) => {
                console.log(err);
            });
            if (eventId && conferenceId)
                AbstractServices.fetchAbstract(conferenceId, eventId).then((result) => {
                    socket.emit("abstracts", result);
                }).catch((err) => {
                    console.log(err);
                });
            else {
                Abstract.findById(message.documentKey._id).then((value) => {
                    AbstractServices.fetchAbstract(value.conferenceId.toString(), value.eventId.toString()).then((result) => {
                        socket.emit("abstracts", result);
                    }).catch((err) => {
                        console.log(err);
                    });
                });
            }

        });
    }

    fetchAbstract(): void {
        let socket = this.socket;
        socket.on('abstracts', (...args) => {
            console.log(args);
            const { eventId, confId, absId } = args[2];
            if (!absId) {
                AbstractServices.fetchAbstract(confId, eventId).then((result) => {
                    socket.emit("abstracts", result);
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                console.log(args);
                AbstractServices.fetchAbstractOne(absId).then((result) => {
                    console.log(result);
                    socket.emit("abstracts-one", result);
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    }

    addAbstracts(): void {
        let socket = this.socket;
        socket.on('abstracts-add', (...args) => {
            let { confId, userId, eventId, paperName, abstract, paperLink } = args[2];
            AbstractServices.addAbstract(confId, userId, eventId, paperName, abstract, paperLink)
                .then((data) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });
        })
    }

    editAbstracts(): void {
        let socket = this.socket;
        socket.on('abstracts-edit', (...args) => {
            let { absId } = args[2];
            AbstractServices.editAbstract(args[2], absId)
                .then((data) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });
        })
    }

    deleteConferences(): void {
        let socket = this.socket;
        socket.on('abstracts-delete', (...args) => {
            let { absId } = args[2];
            AbstractServices.deleteAbstract(absId)
                .then((data) => {
                    console.log(data);
                }).catch((err) => {
                    console.log(err);
                });
        })
    }
}