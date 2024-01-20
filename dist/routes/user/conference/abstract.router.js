"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = require("../../../middlewares/user.middleware");
const catchAsync_1 = __importDefault(require("../../../services/catchAsync"));
const abstract_controller_1 = require("../../../controller/abstract.controller");
const abstractRoute = (0, express_1.Router)({ mergeParams: true });
abstractRoute.get('/', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.fetchAbstract))
    .get('/:eventId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.fetchAbstract))
    .post('/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.addAbstract))
    .patch('/edit/:absId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.editAbstract))
    .patch('/approve/:absId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.approveAbstract))
    .delete('/delete/:absId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(abstract_controller_1.deleteAbstract));
exports.default = abstractRoute;
//# sourceMappingURL=abstract.router.js.map