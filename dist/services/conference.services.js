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
const events_model_1 = require("../models/events.model");
const conference_model_1 = require("../models/conference.model");
const mongoose_1 = require("mongoose");
class ConferenceServices {
    static fetchConferences(type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type)
                type = "public";
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            let data = yield conference_model_1.Conference.aggregate([
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventsId',
                        foreignField: '_id',
                        as: 'events_data',
                        pipeline: [
                            { $sort: { startTime: 1 } }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'admin',
                        foreignField: '_id',
                        as: 'admin_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reviewer',
                        foreignField: '_id',
                        as: 'reviewer_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
            ]);
            // // console.log("data");
            // // console.log(data);
            return data;
        });
    }
    static fetchConferencesOne(type, confId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type)
                type = "public";
            // // console.log(confId);
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            let data = yield conference_model_1.Conference.aggregate([
                {
                    $match: {
                        _id: new mongoose_1.Types.ObjectId(confId),
                    }
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventsId',
                        foreignField: '_id',
                        as: 'events_data',
                        pipeline: [
                            { $sort: { startTime: 1 } }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'admin',
                        foreignField: '_id',
                        as: 'admin_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reviewer',
                        foreignField: '_id',
                        as: 'reviewer_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
            ]);
            return data[0];
        });
    }
    static fetchRegisteredConferences(type, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!type)
                type = "public";
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            let data = yield conference_model_1.Conference.aggregate([
                {
                    $match: {
                        registered: new mongoose_1.Types.ObjectId(userId),
                    }
                },
                {
                    $sort: { startTime: 1 }
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events_data',
                        pipeline: [
                            { $sort: { startTime: 1 } }
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'admin',
                        foreignField: '_id',
                        as: 'admin_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reviewer',
                        foreignField: '_id',
                        as: 'reviewer_data',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'work_experiences',
                                    localField: 'workExperience',
                                    foreignField: '_id',
                                    as: 'workExperience_data',
                                }
                            },
                            {
                                $lookup: {
                                    from: 'educations',
                                    localField: 'education',
                                    foreignField: '_id',
                                    as: 'education_data',
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
                        ]
                    }
                },
            ]);
            return data;
        });
    }
    static addConferences(subject, about, startTime, endTime, admin, id, location) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = new conference_model_1.Conference({ subject, about, startTime, endTime, admin, creator: id, location });
            yield data.save();
            // let userList = await User.find();
            return data;
        });
    }
    static editConferences(conferenceId, bodydata) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield conference_model_1.Conference.findByIdAndUpdate(conferenceId, {
                $set: bodydata,
            });
            return data;
        });
    }
    static registerConferences(conferenceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield conference_model_1.Conference.findByIdAndUpdate(conferenceId, { $push: { registered: userId } });
            return data;
        });
    }
    static editLogo(filepath, confId) {
        return __awaiter(this, void 0, void 0, function* () {
            let edit = yield conference_model_1.Conference.findByIdAndUpdate(confId, {
                $set: {
                    eventLogo: filepath
                },
            }, { new: true });
            return edit;
        });
    }
    static deleteConference(conferenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield conference_model_1.Conference.findById(conferenceId);
            yield events_model_1.Event.deleteMany({ _id: { $in: data.eventsId } });
            yield conference_model_1.Conference.findByIdAndDelete(conferenceId);
            return data;
        });
    }
    static conferenceReminderMail(name, dob, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const createUser = new User({ name, email, password, dob })
            }
            catch (error) {
                throw error;
            }
        });
    }
    static conferenceUpdationMail(name, dob, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const createUser = new User({ name, email, password, dob })
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ConferenceServices;
//# sourceMappingURL=conference.services.js.map