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
exports.EventServices = void 0;
const conference_model_1 = require("../models/conference.model");
const events_model_1 = require("../models/events.model");
class EventServices {
    static fetchEvents(confId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield events_model_1.Event.find({ conferenceId: confId });
        });
    }
    static addEvents(subject, presenter, startTime, endTime, location, confId) {
        return __awaiter(this, void 0, void 0, function* () {
            let event = new events_model_1.Event({ subject, presenter, startTime, endTime, location, conferenceId: confId });
            yield event.save();
            yield conference_model_1.Conference.findByIdAndUpdate(confId, {
                $push: { eventsId: event._id },
            });
            return event;
        });
    }
    static editEvents(bodydata, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield events_model_1.Event.findByIdAndUpdate(eventId, {
                $set: bodydata
            });
            return data;
        });
    }
    static deleteEvents(eventId, confId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = events_model_1.Event.findById(eventId);
            yield events_model_1.Event.findByIdAndDelete(eventId);
            yield conference_model_1.Conference.findByIdAndUpdate(confId, {
                $pull: { eventsId: eventId },
            });
            return data;
        });
    }
}
exports.EventServices = EventServices;
//# sourceMappingURL=event.services.js.map