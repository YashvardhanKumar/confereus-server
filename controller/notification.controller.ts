import { Request, Response } from "express";
import NotificationServices from "../services/notification.services";
import { User } from "../models/user_profile/user.model";

export async function getNotifications(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const notifications = await NotificationServices.fetchUserNotifications(userId);
        return res.status(200).json({ status: true, data: notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ status: false, message: "Error fetching notifications" });
    }
}

export async function markNotificationAsRead(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const notificationId = req.params.notificationId;
        const updated = await NotificationServices.markAsRead(notificationId, userId);
        return res.status(200).json({ status: true, data: updated });
    } catch (error) {
        console.error("Error marking notification read:", error);
        return res.status(500).json({ status: false, message: "Error updating notification" });
    }
}

export async function markAllAsRead(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        await NotificationServices.markAllAsRead(userId);
        return res.status(200).json({ status: true, message: "All marked as read" });
    } catch (error) {
        console.error("Error marking all read:", error);
        return res.status(500).json({ status: false, message: "Error updating notifications" });
    }
}

export async function createTestNotification(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const { title, body, channel } = req.body;
        const notification = await NotificationServices.createNotification({
            userId: userId as any,
            title: title || "Test Notification",
            body: body || "This is a test notification from Confereus",
            type: "general",
            channel: channel || "in_app"
        });
        return res.status(201).json({ status: true, data: notification });
    } catch (error) {
        console.error("Error creating test notification:", error);
        return res.status(500).json({ status: false, message: "Error creating notification" });
    }
}
