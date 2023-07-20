"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkExperience = exports.WorkExperienceSchema = void 0;
const mongoose_1 = require("mongoose");
exports.WorkExperienceSchema = new mongoose_1.Schema({
    position: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    jobType: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: Date,
    location: String,
});
exports.WorkExperience = (0, mongoose_1.model)('work_experiences', exports.WorkExperienceSchema);
//# sourceMappingURL=work_experience.model.js.map