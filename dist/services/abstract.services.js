"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AbstractServices = void 0;
const mongoose_1 = require("mongoose");
const abstract_model_1 = require("../models/abstract.model");
const conference_model_1 = require("../models/conference.model");
const nodemailer_1 = require("nodemailer");
const user_model_1 = require("../models/User Profile Models/user.model");
const ical_generator_1 = __importStar(require("ical-generator"));
const events_model_1 = require("../models/events.model");
class AbstractServices {
    static fetchAbstract(confId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = {};
            if (eventId) {
                match = {
                    conferenceId: new mongoose_1.Types.ObjectId(confId),
                    eventId: new mongoose_1.Types.ObjectId(eventId)
                };
            }
            else {
                match = {
                    conferenceId: new mongoose_1.Types.ObjectId(confId),
                };
            }
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            return yield abstract_model_1.Abstract.aggregate([
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: 'conferences',
                        localField: 'conferenceId',
                        foreignField: '_id',
                        as: 'conference',
                        pipeline: [
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
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'event',
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'users',
                        pipeline: [
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
                        ]
                    }
                }
            ]);
        });
    }
    static fetchAbstractOne(abstractId) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = {};
            match = {
                abstractId: new mongoose_1.Types.ObjectId(abstractId),
            };
            // let data = await Conference.find((type == 'all') ? {} : { visibility: type }).sort({startTime: 1}).populate('events');
            return yield abstract_model_1.Abstract.aggregate([
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: 'conferences',
                        localField: 'conferenceId',
                        foreignField: '_id',
                        as: 'conference',
                        pipeline: [
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
                        ]
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'eventId',
                        foreignField: '_id',
                        as: 'event',
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'users',
                        pipeline: [
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
                        ]
                    }
                }
            ]);
        });
    }
    static addAbstract(confId, id, eventId, paperName, abstract, paperLink, isApproved) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = new abstract_model_1.Abstract({ conferenceId: confId, eventId, userId: id, paperLink, abstract, paperName, isApproved });
            yield data.save();
            return data;
        });
    }
    static editAbstract(bodydata, absId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield abstract_model_1.Abstract.findByIdAndUpdate(absId, {
                $set: bodydata,
            });
        });
    }
    static deleteAbstract(absId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield abstract_model_1.Abstract.findById(absId);
            yield abstract_model_1.Abstract.findByIdAndDelete(absId);
            return data;
        });
    }
    static approveAbstract(bodydata, absId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield abstract_model_1.Abstract.findByIdAndUpdate(absId, {
                $set: bodydata,
            });
            let approve = bodydata.isApproved;
            let conferences = yield conference_model_1.Conference.findById(data.conferenceId);
            let event = yield events_model_1.Event.findById(data.eventId);
            const cal = (0, ical_generator_1.default)({ name: conferences.subject });
            cal.method(ical_generator_1.ICalCalendarMethod.REQUEST);
            let startTime = event.get('startTime', Date).toLocaleString();
            // 'en-IN', { timeZone: 'UTC' }
            let endTime = event.get('endTime', Date).toLocaleString();
            // cal.url("mytestwebsite.com");
            if (approve) {
                cal.createEvent({
                    start: new Date(startTime),
                    end: new Date(endTime),
                    summary: conferences.subject,
                    description: conferences.about,
                    location: conferences.location, // 'Delhi'
                });
            }
            for (let index = 0; index < data.userId.length; index++) {
                const element = data.userId[index];
                let user = yield user_model_1.User.findById(element);
                const transporter = (0, nodemailer_1.createTransport)({
                    secure: true,
                    service: 'gmail',
                    auth: {
                        user: process.env.FROM_EMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    tls: { rejectUnauthorized: false }
                });
                if (approve) {
                    let alternatives = {
                        "Content-Type": "text/calendar",
                        "method": "REQUEST",
                        "content": Buffer.from(cal.toString()),
                        "component": "VEVENT",
                        "Content-Class": "urn:content-classes:calendarmessage"
                    };
                    transporter['alternatives'] = alternatives;
                    // transporter['alternatives']['contentType'] = 'text/calendar'
                    // transporter['alternatives']['content'] = Buffer.from(cal.toString())
                }
                const message = {
                    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                    to: user.email,
                    subject: `Regarding your paper on ${conferences.subject} `,
                    html: `<div>
                    <h3>Hello ${user.name},</h3>
                    ${conferences.eventLogo ? `<img src="${conferences.eventLogo}" alt="eventlogo"/>` : ""}
                    <p>${approve ? "Congratulations!" : ""} Your abstract was ${approve ? "<b>Approved</b>" : "<b>Rejected</b>"} by the reviewers!</p>
                    <p>${approve ? "Your presentation on <b>" + event.subject + "</b> is scheduled on <b>" + startTime + "</b> till <b>" + endTime +
                        "</b> located at <b>" + conferences.location + "</b>. A person from the conference administration may connect to you soon via. mail!" : ""}</p>
                    <p>If you didn't recognize this mail, you can ignore this email or reply back to this mail if issue persists!</p>
                    <p>Regards,</p>
                    <p>Confereus team</p>
                    </div>`
                };
                const info = yield transporter.sendMail(message);
            }
            yield events_model_1.Event.findByIdAndUpdate(data.eventId, {
                $push: {
                    presenter: data.userId
                }
            });
            return data;
        });
    }
}
exports.AbstractServices = AbstractServices;
//# sourceMappingURL=abstract.services.js.map