import { Model, Schema, model } from "mongoose";

export interface INotification {
    userId: Schema.Types.ObjectId;
    title: string;
    body: string;
    type: 'event_reminder' | 'abstract_status' | 'conference_update' | 'general';
    channel: 'email' | 'in_app' | 'push';
    status: 'pending' | 'sent' | 'failed';
    data?: Record<string, any>;
    read: boolean;
    sentAt?: Date;
    error?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification, Model<INotification>>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['event_reminder', 'abstract_status', 'conference_update', 'general'],
        default: 'general' 
    },
    channel: { 
        type: String, 
        enum: ['email', 'in_app', 'push'], 
        default: 'in_app' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'sent', 'failed'], 
        default: 'pending' 
    },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
    sentAt: { type: Date },
    error: { type: String }
}, { timestamps: true });

NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ status: 1 });

export const Notification = model<INotification>('notification', NotificationSchema);
