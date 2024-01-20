"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    emailVerified: Boolean,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: String,
    dob: Date,
    profileImageURL: String,
    provider: String,
    workExperience: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "work_experiences" }],
    education: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "educations" }],
    skills: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "skills" }],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('users', UserSchema);
//# sourceMappingURL=user.model.js.map