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
const conference_model_1 = require("../models/conference.model");
const mongoose_1 = require("mongoose");
function getEvent(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const confId = req.params.confId;
        console.log(req.params);
        const { ObjectId } = mongoose_1.Types;
        try {
            let data = yield conference_model_1.Conference.aggregate([
                { $match: { _id: new ObjectId(confId) } },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                        pipeline: [
                            { $sort: { startTime: 1 } }
                        ]
                    }
                },
                { $limit: 1 },
            ]);
            console.log(data);
            res.json({ status: true, data: data[0].events });
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
            let event = new conference_model_1.Event({ subject, presenter, startTime, endTime, location });
            yield event.save();
            let data = yield conference_model_1.Conference.findByIdAndUpdate(confId, {
                $push: { events: event._id },
            });
            res.json({ status: true, data: event });
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
        console.log(req.body.data);
        try {
            let data = yield conference_model_1.Event.findByIdAndUpdate(eventId, {
                $set: req.body.data
            });
            res.json({ status: true, data: data });
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
            let data = yield conference_model_1.Event.findByIdAndDelete(eventId);
            yield conference_model_1.Conference.findByIdAndUpdate(confId, {
                $pull: { events: data._id },
            });
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