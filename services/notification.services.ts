import { Notification, INotification } from "../models/notification.model";
import { createTransport } from "nodemailer";

export class NotificationServices {
    static getMailTransporter() {
        return createTransport({
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: { rejectUnauthorized: false }
        });
    }

    static async sendMail(to: string, subject: string, html: string) {
        if (!process.env.FROM_EMAIL || !process.env.EMAIL_PASSWORD) {
            console.warn("Email credentials not configured in environment variables.");
            return false;
        }

        const transporter = this.getMailTransporter();
        const mailOptions = {
            from: `${process.env.FROM_NAME || 'Confereus'} <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    }

    static async createNotification(payload: Partial<INotification>) {
        const notification = new Notification({
            ...payload,
            status: payload.status || (payload.channel === 'email' ? 'pending' : 'sent'),
            sentAt: payload.channel === 'in_app' ? new Date() : undefined
        });
        return await notification.save();
    }

    static async fetchUserNotifications(userId: string) {
        return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    }

    static async markAsRead(notificationId: string, userId: string) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { $set: { read: true } },
            { new: true }
        );
    }

    static async markAllAsRead(userId: string) {
        return await Notification.updateMany(
            { userId, read: false },
            { $set: { read: true } }
        );
    }
}

export default NotificationServices;
