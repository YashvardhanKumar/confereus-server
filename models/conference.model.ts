import { Date, Model, Schema, model } from "mongoose";

export interface IConference {
    subject: string,
    about: string,
    creator: Schema.Types.ObjectId,
    admin: [Schema.Types.ObjectId],
    reviewer: [Schema.Types.ObjectId],
    location: string,
    registered: [Schema.Types.ObjectId],
    visibility: string,
    startTime: Date,
    endTime: Date,
    eventLogo: String,
    events: [Schema.Types.ObjectId],
}
export interface IEvent {
    subject: string,
    reviewer: Schema.Types.ObjectId,
    presenter: [Schema.Types.ObjectId],
    startTime: Date,
    endTime: Date,
    location: string
}

const EventSchema = new Schema<IEvent>({
    subject: { type: String, required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "users" },
    presenter: [{ type: Schema.Types.ObjectId, ref: "users" }],
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});
export const Event = model<IEvent>('events', EventSchema);

const ConferenceSchema = new Schema<IConference, Model<IConference>>({
    subject: { type: String, required: true },
    eventLogo: String,
    creator: { type: Schema.Types.ObjectId, required: true , ref: "users"},
    about: { type: String, required: true },
    admin: [{ type: Schema.Types.ObjectId, required: true , ref: "users"}],
    reviewer: [{ type: Schema.Types.ObjectId, ref: "users"}],
    location: String,
    registered: [{ type: Schema.Types.ObjectId, ref: "users" }],
    visibility: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    events: [{type: Schema.Types.ObjectId, ref: "events"}]

}, { timestamps: true });


export const Conference = model<IConference, Model<IConference>>('conference', ConferenceSchema);