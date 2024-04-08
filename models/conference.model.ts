import { Date, Model, Schema, model } from "mongoose";

export interface IConference {
    subject: string,
    about: string,
    creator: Schema.Types.ObjectId,
    admin: [Schema.Types.ObjectId],
    reviewer: [Schema.Types.ObjectId],
    location: string,
    registered: [Schema.Types.ObjectId],
    abstractId: [Schema.Types.ObjectId],
    visibility: string,
    startTime: Date,
    endTime: Date,
    eventLogo: String,
    eventsId: [Schema.Types.ObjectId],
}




const ConferenceSchema = new Schema<IConference, Model<IConference>>({
    subject: { type: String, required: true },
    eventLogo: String,
    creator: { type: Schema.Types.ObjectId, required: true , ref: "users"},
    about: { type: String, required: true },
    admin: [{ type: Schema.Types.ObjectId, required: true , ref: "users"}],
    reviewer: [{ type: Schema.Types.ObjectId, ref: "users"}],
    abstractId: [{type: Schema.Types.ObjectId, ref: "abstract"}],
    location: {type: String, required: true},
    registered: [{ type: Schema.Types.ObjectId, ref: "users" }],
    visibility: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    eventsId: [{type: Schema.Types.ObjectId, ref: "events"}]

}, { timestamps: true });


export const Conference = model<IConference, Model<IConference>>('conference', ConferenceSchema);