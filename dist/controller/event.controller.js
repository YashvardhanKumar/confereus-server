"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.editEvent = exports.addEvent = exports.getEvent = void 0;
const event_services_1 = require("../services/event.services");
const app_1 = require("../app");
function getEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const confId = req.params.confId;
        try {
            let data = yield event_services_1.EventServices.fetchEvents(confId);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.getEvent = getEvent;
function addEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subject, presenter, startTime, endTime, location } = req.body.data;
        const confId = req.params.confId;
        try {
            let data = yield event_services_1.EventServices.addEvents(subject, presenter, startTime, endTime, location, confId);
            app_1.io.emit("events", yield event_services_1.EventServices.fetchEvents(confId));
            app_1.io.emit("added-events", data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addEvent = addEvent;
function editEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventId = req.params.eventId;
        try {
            let data = yield event_services_1.EventServices.editEvents(req.body, eventId);
            app_1.io.emit("events", yield event_services_1.EventServices.fetchEvents(req.params.confId));
            app_1.io.emit("edited-events", data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editEvent = editEvent;
function deleteEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventId = req.params.eventId;
        const confId = req.params.confId;
        try {
            let data = yield event_services_1.EventServices.deleteEvents(eventId, confId);
            app_1.io.emit("events", yield event_services_1.EventServices.fetchEvents(req.params.confId));
            app_1.io.emit("deleted-events", data);
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=event.controller.js.map