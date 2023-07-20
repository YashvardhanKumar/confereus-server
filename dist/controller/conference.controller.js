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
exports.fetchRegisteredConferences = exports.registerConference = exports.deleteConference = exports.editConference = exports.addConference = exports.fetchConferences = void 0;
const conference_model_1 = require("../models/conference.model");
const mongoose_1 = require("mongoose");
function fetchConferences(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = req.query.type;
        if (!type)
            type = "public";
        try {
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            let data = yield conference_model_1.Conference.aggregate([
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
            ]);
            console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchConferences = fetchConferences;
function addConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subject, about, startTime, endTime } = req.body.data;
        const id = req.params.id;
        // let user = await User.findById(id);
        // const _id = new Types.ObjectId(id);
        console.log(req.params);
        try {
            let data = new conference_model_1.Conference({ subject, about, startTime, endTime, admin: id });
            yield data.save();
            // let userList = await User.find();
            console.log(data);
            data = yield data.populate('events');
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addConference = addConference;
function editConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conferenceId = req.params.confId;
        console.log(req.body.data);
        try {
            let data = yield conference_model_1.Conference.findByIdAndUpdate(conferenceId, {
                $set: req.body.data,
            });
            data = yield data.populate('events');
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.editConference = editConference;
function deleteConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conferenceId = req.params.confId;
        let type = req.query.type;
        try {
            let data = yield conference_model_1.Conference.findById(conferenceId);
            yield conference_model_1.Event.deleteMany({ _id: { $in: data.events } });
            yield conference_model_1.Conference.findByIdAndDelete(conferenceId);
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.deleteConference = deleteConference;
function registerConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conferenceId = req.params.confId;
        const userId = req.params.id;
        try {
            let data = yield conference_model_1.Conference.findByIdAndUpdate(conferenceId, { $push: { registered: userId } });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.registerConference = registerConference;
function fetchRegisteredConferences(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        console.log(userId + 'yash');
        try {
            let data = yield conference_model_1.Conference.find({ registered: new mongoose_1.Types.ObjectId(userId) }).sort({ startTime: 1 }).populate('events');
            console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchRegisteredConferences = fetchRegisteredConferences;
//# sourceMappingURL=conference.controller.js.map