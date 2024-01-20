import { Conference } from "../models/conference.model";
import { Event } from "../models/events.model";

export class EventServices {

    static async fetchEvents(confId: string) {
        return await Event.find({ conferenceId: confId });
    }
    
    static async fetchEventsOne(eventId: string) {
        return await Event.findById(eventId);
    }

    static async addEvents(subject: string, presenter: string, startTime: any, endTime: any, location: string, confId: string) {
        let event = new Event({ subject, presenter, startTime, endTime, location, conferenceId: confId });
        await event.save();
        await Conference.findByIdAndUpdate(confId, {
            $push: { eventsId: event._id },
        });
        return event;
    }

    static async editEvents(bodydata: any, eventId: string) {
        let data = await Event.findByIdAndUpdate(eventId,
            {
                $set: bodydata
            });
        return data;
    }

    static async deleteEvents(eventId: string, confId: string) {
        let data = Event.findById(eventId);
        await Event.findByIdAndDelete(eventId);
        await Conference.findByIdAndUpdate(confId, {
            $pull: { eventsId: eventId },
        });
        return data;
    }
}