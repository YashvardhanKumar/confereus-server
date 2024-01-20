"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Education = exports.EducationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EducationSchema = new mongoose_1.Schema({
    institution: {
        type: String,
        required: true,
    },
    degree: {
        type: String,
        required: true,
    },
    field: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    location: String,
});
exports.Education = (0, mongoose_1.model)('educations', exports.EducationSchema);
//# sourceMappingURL=education.model.js.map