"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Abstract = void 0;
const mongoose_1 = require("mongoose");
const AbstractSchema = new mongoose_1.Schema({
    conferenceId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'conference' },
    eventId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'events' },
    userId: [{ type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'users' }],
    paperName: { type: String, required: true },
    abstract: { type: String, required: true },
    paperLink: { type: String, required: true },
    approved: { type: Date },
    isApproved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now() },
});
exports.Abstract = (0, mongoose_1.model)('abstract', AbstractSchema);
//# sourceMappingURL=abstract.model.js.map