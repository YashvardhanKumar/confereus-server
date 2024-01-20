import { Model, Schema, model } from "mongoose";

export interface IAbstract {
    conferenceId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    userId: [Schema.Types.ObjectId],
    paperName: string,
    abstract: string,
    paperLink: string,
    approved: Date,
    isApproved: boolean,
    createdAt: Date,
}

const AbstractSchema = new Schema<IAbstract, Model<IAbstract>>({
    conferenceId: {type: Schema.Types.ObjectId,required: true, ref: 'conference'},
    eventId: {type: Schema.Types.ObjectId,required: true, ref: 'events'},
    userId: [{type: Schema.Types.ObjectId, required: true, ref: 'users'}],
    paperName: {type: String, required: true},
    abstract: {type: String, required: true},
    paperLink: {type: String, required: true},
    approved: {type: Date   },
    isApproved: {type: Boolean, required: true,default: false},
    createdAt: {type: Date, default: Date.now()},
})

export const Abstract = model<IAbstract>('abstract', AbstractSchema);
