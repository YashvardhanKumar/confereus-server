"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conference = exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    presenter: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});
exports.Event = (0, mongoose_1.model)('events', EventSchema);
const ConferenceSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    eventLogo: String,
    about: { type: String, required: true },
    admin: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "users" },
    location: String,
    registered: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
    visibility: String,
    abstractLink: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    events: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "events" }]
}, { timestamps: true });
exports.Conference = (0, mongoose_1.model)('conference', ConferenceSchema);
//# sourceMappingURL=conference.model.js.map