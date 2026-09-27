import { Router } from "express";
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllAsRead, 
    createTestNotification 
} from "../../../controller/notification.controller";
import { isAuthenticated } from "../../../middlewares/user.middleware";

const notificationRouter = Router({ mergeParams: true });

notificationRouter.get('/', isAuthenticated, getNotifications);
notificationRouter.put('/read-all', isAuthenticated, markAllAsRead);
notificationRouter.put('/:notificationId/read', isAuthenticated, markNotificationAsRead);
notificationRouter.post('/test', isAuthenticated, createTestNotification);

export default notificationRouter;
