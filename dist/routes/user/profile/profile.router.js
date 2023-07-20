"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middleware_1 = require("../../../middlewares/user.middleware");
const profile_controller_1 = require("../../../controller/profile.controller");
const catchAsync_1 = __importDefault(require("../../../services/catchAsync"));
const profileRouter = (0, express_1.Router)({ mergeParams: true });
profileRouter.get('/', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, profile_controller_1.fetchProfile)
    .patch('/edit', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, profile_controller_1.editProfile);
profileRouter.post('/workspace/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.addWorkSpace))
    .patch('/workspace/:wid/edit', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.editWorkSpace))
    .delete('/workspace/:wid/delete', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.deleteWorkSpace));
profileRouter.post('/education/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.addEducation))
    .patch('/education/:eid/edit', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.editEducation))
    .delete('/education/:eid/delete', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.deleteEducation));
profileRouter.post('/skills/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.addSkill))
    .patch('/skills/:sid/edit', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.editSkill))
    .delete('/skills/:sid/delete', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(profile_controller_1.deleteSkills));
exports.default = profileRouter;
//# sourceMappingURL=profile.router.js.map