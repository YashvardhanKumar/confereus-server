"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skills = exports.SkillsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SkillsSchema = new mongoose_1.Schema({
    skill: {
        type: String,
        required: true,
    },
    expertise: {
        type: String,
        required: true,
    },
});
exports.Skills = (0, mongoose_1.model)('skills', exports.SkillsSchema);
//# sourceMappingURL=skills.model.js.map