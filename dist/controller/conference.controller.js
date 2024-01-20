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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRegisteredConferences = exports.customizeRoles = exports.registerConference = exports.deleteConference = exports.editConference = exports.addConference = exports.fetchConferencesOne = exports.fetchConferences = void 0;
const conference_model_1 = require("../models/conference.model");
const conference_services_1 = __importDefault(require("../services/conference.services"));
const app_1 = require("../app");
function fetchConferences(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = req.query.type;
        try {
            let data = yield conference_services_1.default.fetchConferences(type);
            // // console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchConferences = fetchConferences;
function fetchConferencesOne(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let type = req.query.type;
        try {
            let data = yield conference_services_1.default.fetchConferencesOne(type, req.params.confId);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchConferencesOne = fetchConferencesOne;
function addConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subject, about, admin, startTime, endTime, location } = req.body.data;
        const id = req.params.id;
        try {
            let data = yield conference_services_1.default.addConferences(subject, about, startTime, endTime, admin, id, location);
            app_1.io.emit("conferences", yield conference_services_1.default.fetchConferences(null));
            app_1.io.emit("conferences-add", data);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.addConference = addConference;
function editConference(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conferenceId = req.params.confId;
        try {
            let data = yield conference_services_1.default.editConferences(conferenceId, req.body.data);
            app_1.io.emit("conferences", yield conference_services_1.default.fetchConferences(null));
            app_1.io.emit("conferences-edit", yield conference_services_1.default.fetchConferencesOne(null, conferenceId));
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
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
            let data = yield conference_services_1.default.deleteConference(conferenceId);
            app_1.io.emit("conferences", yield conference_services_1.default.fetchConferences(null));
            app_1.io.emit("conferences-delete", data);
        }
        catch (error) {
            // // console.log(error);
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
            app_1.io.emit("conferences", yield conference_services_1.default.fetchConferences(null));
            app_1.io.emit("conferences-edit", data);
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.registerConference = registerConference;
function customizeRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const conferenceId = req.params.confId;
        const userId = req.params.id;
        const { reviewer, admin } = req.body.data;
        try {
            let data = yield conference_model_1.Conference.findByIdAndUpdate(conferenceId, { $set: { reviewer, admin } });
            app_1.io.emit("conferences", yield conference_services_1.default.fetchConferences(null));
            app_1.io.emit("conferences-edit", data);
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
        res.json({ status: true });
    });
}
exports.customizeRoles = customizeRoles;
function fetchRegisteredConferences(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        try {
            let data = yield conference_services_1.default.fetchRegisteredConferences(null, userId);
            // // console.log(data);
            res.json({ status: true, data });
        }
        catch (error) {
            // // console.log(error);
            res.json({ status: false, message: "Something went wrong" });
        }
    });
}
exports.fetchRegisteredConferences = fetchRegisteredConferences;
//# sourceMappingURL=conference.controller.js.map