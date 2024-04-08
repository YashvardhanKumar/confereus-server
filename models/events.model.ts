import { Schema, model } from "mongoose";

export interface IEvent {
    subject: string,
    conferenceId: Schema.Types.ObjectId,
    reviewer: Schema.Types.ObjectId,
    presenter: [Schema.Types.ObjectId],
    abstractId: [Schema.Types.ObjectId],
    startTime: Date,
    endTime: Date,
    location: string
}

const EventSchema = new Schema<IEvent>({
    subject: { type: String, required: true },
    conferenceId: {type: Schema.Types.ObjectId, ref: "conference"},
    reviewer: { type: Schema.Types.ObjectId, ref: "users" },
    presenter: [{ type: Schema.Types.ObjectId, ref: "users" }],
    abstractId: [{type: Schema.Types.ObjectId, ref: "abstract"}],
    location: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
});
export const Event = model<IEvent>('events', EventSchema);