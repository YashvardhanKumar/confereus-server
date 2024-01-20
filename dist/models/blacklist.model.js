"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacklist = void 0;
const mongoose_1 = require("mongoose");
const BlacklistSchema = new mongoose_1.Schema({
    refreshToken: String,
    accessToken: String,
}, { timestamps: true });
exports.Blacklist = (0, mongoose_1.model)('blacklist', BlacklistSchema);
//# sourceMappingURL=blacklist.model.js.map