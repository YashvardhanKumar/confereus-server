import "../server/db";
import { Notification } from "../models/notification.model";
import { User } from "../models/user_profile/user.model";
import { Event } from "../models/events.model";
import { Conference } from "../models/conference.model";
import NotificationServices from "../services/notification.services";

console.log("=========================================");
console.log("   Confereus Notification Worker Started ");
console.log("=========================================");

const POLL_INTERVAL = parseInt(process.env.WORKER_POLL_INTERVAL_MS || "30000", 10);
let isRunning = true;

async function processPendingNotifications() {
    try {
        const pendingNotifications = await Notification.find({ status: 'pending' }).limit(50);
        if (pendingNotifications.length > 0) {
            console.log(`[Worker] Found ${pendingNotifications.length} pending notification(s) to process.`);
        }

        for (const notif of pendingNotifications) {
            try {
                if (notif.channel === 'email') {
                    const user = await User.findById(notif.userId);
                    if (user && user.email) {
                        const emailHtml = `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                                <h2 style="color: #2b5876;">Confereus Notification</h2>
                                <h3>${notif.title}</h3>
                                <p style="font-size: 16px; color: #333;">${notif.body}</p>
                                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                                <p style="font-size: 12px; color: #888;">This is an automated notification from Confereus. Please do not reply directly to this email.</p>
                            </div>
                        `;
                        await NotificationServices.sendMail(user.email, notif.title, emailHtml);
                        console.log(`[Worker] Sent email notification to ${user.email} (${notif.title})`);
                    } else {
                        console.warn(`[Worker] User not found or no email for notification ${notif._id}`);
                    }
                }
                notif.status = 'sent';
                notif.sentAt = new Date();
                await notif.save();
            } catch (err: any) {
                console.error(`[Worker] Failed to process notification ${notif._id}:`, err?.message || err);
                notif.status = 'failed';
                notif.error = err?.message || String(err);
                await notif.save();
            }
        }
    } catch (error) {
        console.error("[Worker] Error in processPendingNotifications:", error);
    }
}

async function checkUpcomingEventReminders() {
    try {
        const now = new Date();
        const reminderWindow = new Date(now.getTime() + 30 * 60 * 1000); // next 30 minutes

        const upcomingEvents = await Event.find({
            startTime: { $gte: now, $lte: reminderWindow }
        });

        for (const event of upcomingEvents) {
            const conference = await Conference.findById(event.conferenceId);
            if (!conference) continue;

            // Recipient IDs: presenters + registered users
            const recipients = new Set<string>();
            if (Array.isArray(event.presenter)) {
                event.presenter.forEach(id => recipients.add(id.toString()));
            }
            if (Array.isArray(conference.registered)) {
                conference.registered.forEach(id => recipients.add(id.toString()));
            }

            for (const userId of recipients) {
                // Check if reminder already sent for this event and user
                const alreadySent = await Notification.findOne({
                    userId,
                    type: 'event_reminder',
                    'data.eventId': event._id
                });

                if (!alreadySent) {
                    const title = `Reminder: "${event.subject}" starts soon`;
                    const body = `Your session "${event.subject}" at ${conference.subject} is scheduled to begin at ${new Date(event.startTime).toLocaleTimeString()} at ${event.location}.`;
                    
                    await NotificationServices.createNotification({
                        userId: userId as any,
                        title,
                        body,
                        type: 'event_reminder',
                        channel: 'email',
                        data: {
                            eventId: event._id,
                            conferenceId: conference._id
                        }
                    });
                    console.log(`[Worker] Queued reminder for user ${userId} regarding event "${event.subject}"`);
                }
            }
        }
    } catch (error) {
        console.error("[Worker] Error in checkUpcomingEventReminders:", error);
    }
}

function setupChangeStreams() {
    try {
        const changeStream = Notification.watch([{ $match: { operationType: 'insert' } }]);
        changeStream.on('change', async (change) => {
            if (isRunning) {
                await processPendingNotifications();
            }
        });
        changeStream.on('error', (err) => {
            console.warn('[Worker] Change stream encountered error (falling back to polling):', err.message);
        });
    } catch (err: any) {
        console.warn('[Worker] Change streams not supported or replica set not ready (polling will be used):', err.message);
    }
}

async function loop() {
    while (isRunning) {
        await processPendingNotifications();
        await checkUpcomingEventReminders();
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }
}

// Start watching and main loop
setupChangeStreams();
loop().catch((err) => {
    console.error("[Worker] Fatal loop error:", err);
});

// Graceful shutdown
const shutdown = () => {
    console.log("[Worker] Shutting down gracefully...");
    isRunning = false;
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
