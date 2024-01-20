"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    subject: { type: String, required: true },
    conferenceId: { type: mongoose_1.Schema.Types.ObjectId, ref: "conference" },
    reviewer: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" },
    presenter: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "users" }],
    abstractId: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "abstract" }],
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});
exports.Event = (0, mongoose_1.model)('events', EventSchema);
//# sourceMappingURL=events.model.js.map