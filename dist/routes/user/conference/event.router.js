"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../../../controller/event.controller");
const user_middleware_1 = require("../../../middlewares/user.middleware");
const catchAsync_1 = __importDefault(require("../../../services/catchAsync"));
const eventRoute = (0, express_1.Router)({ mergeParams: true });
eventRoute
    .get('/', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, event_controller_1.getEvent)
    .post('/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(event_controller_1.addEvent))
    .patch('/edit/:eventId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(event_controller_1.editEvent))
    .delete('/delete/:eventId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(event_controller_1.deleteEvent));
exports.default = eventRoute;
//# sourceMappingURL=event.router.js.map