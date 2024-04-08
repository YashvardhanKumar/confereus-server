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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("../models/User Profile Models/user.model");
class ProfileController {
    static fetchProfileOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ObjectId } = mongoose_1.Types;
            return yield user_model_1.User.aggregate([
                { $match: { _id: new ObjectId(id) } },
                {
                    $lookup: {
                        from: 'work_experiences',
                        localField: 'workExperience',
                        foreignField: '_id',
                        as: 'workExperience_data',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'educations',
                        localField: 'education',
                        foreignField: '_id',
                        as: 'education_data',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'skills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills_data',
                    }
                },
                { $limit: 1 },
            ]);
        });
    }
    static fetchProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { ObjectId } = mongoose_1.Types;
            return yield user_model_1.User.aggregate([
                {
                    $lookup: {
                        from: 'work_experiences',
                        localField: 'workExperience',
                        foreignField: '_id',
                        as: 'workExperience_data',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'educations',
                        localField: 'education',
                        foreignField: '_id',
                        as: 'education_data',
                        pipeline: [
                            { $sort: { start: -1 } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'skills',
                        localField: 'skills',
                        foreignField: '_id',
                        as: 'skills_data',
                    }
                },
                { $limit: 1 },
            ]);
        });
    }
    static editProfile(id, bodydata) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield user_model_1.User.findByIdAndUpdate(id, { $set: bodydata });
            return data;
        });
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.services.js.map