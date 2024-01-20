"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conference = void 0;
const mongoose_1 = require("mongoose");
const ConferenceSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    eventLogo: String,
    creator: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "users" },
    about: { type: String, required: true },
    admin: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "users" }],
    reviewer: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
    abstractId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "abstract" }],
    location: { type: String, required: true },
    registered: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
    visibility: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    eventsId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "events" }]
}, { timestamps: true });
exports.Conference = (0, mongoose_1.model)('conference', ConferenceSchema);
//# sourceMappingURL=conference.model.js.map