"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_model_1 = require("../models/abstract.model");
const abstract_services_1 = require("../services/abstract.services");
class AbstractSocket {
    constructor(socket) {
        this.socket = socket;
        abstract_model_1.Abstract.watch().on("change", (message) => {
            // // console.log(message);
            const { _id, eventId, conferenceId } = message.documentKey;
            abstract_services_1.AbstractServices.fetchAbstractOne(_id).then((result) => {
                socket.emit("abstracts-one", result);
            }).catch((err) => {
                // console.log(err);
            });
            if (eventId && conferenceId)
                abstract_services_1.AbstractServices.fetchAbstract(conferenceId, eventId).then((result) => {
                    socket.emit("abstracts", result);
                }).catch((err) => {
                    // console.log(err);
                });
            else {
                abstract_model_1.Abstract.findById(message.documentKey._id).then((value) => {
                    abstract_services_1.AbstractServices.fetchAbstract(value.conferenceId.toString(), value.eventId.toString()).then((result) => {
                        socket.emit("abstracts", result);
                    }).catch((err) => {
                        // console.log(err);
                    });
                });
            }
        });
    }
    fetchAbstract() {
        let socket = this.socket;
        socket.on('abstracts', (...args) => {
            // console.log(args);
            const { eventId, confId, absId } = args[2];
            if (!absId) {
                abstract_services_1.AbstractServices.fetchAbstract(confId, eventId).then((result) => {
                    socket.emit("abstracts", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
            else {
                // console.log(args);
                abstract_services_1.AbstractServices.fetchAbstractOne(absId).then((result) => {
                    // console.log(result);
                    socket.emit("abstracts-one", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        });
    }
    addAbstracts() {
        let socket = this.socket;
        socket.on('abstracts-add', (...args) => {
            let { confId, userId, eventId, paperName, abstract, paperLink } = args[2];
            abstract_services_1.AbstractServices.addAbstract(confId, userId, eventId, paperName, abstract, paperLink)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    editAbstracts() {
        let socket = this.socket;
        socket.on('abstracts-edit', (...args) => {
            let { absId } = args[2];
            abstract_services_1.AbstractServices.editAbstract(args[2], absId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
    deleteConferences() {
        let socket = this.socket;
        socket.on('abstracts-delete', (...args) => {
            let { absId } = args[2];
            abstract_services_1.AbstractServices.deleteAbstract(absId)
                .then((data) => {
                // console.log(data);
            }).catch((err) => {
                // console.log(err);
            });
        });
    }
}
//# sourceMappingURL=abstract.socket.js.map