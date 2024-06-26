"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controller/user.controller");
const user_middleware_1 = require("../../middlewares/user.middleware");
// import { getLinkedinUser } from "../../config/linkedin.config";
const catchAsync_1 = __importDefault(require("../../services/catchAsync"));
const userRouter = (0, express_1.Router)({ mergeParams: true });
userRouter.post('/signup', user_middleware_1.canCreateUser, user_middleware_1.hashPassword, user_controller_1.signUp);
userRouter.post('/resetpassword', user_middleware_1.hashPassword, user_controller_1.changePassword);
userRouter.post('/login', user_middleware_1.doesUserExist, user_middleware_1.checkPassword, user_controller_1.login);
userRouter.post('/sendotpmail/:id', user_middleware_1.isAuthenticated, user_middleware_1.sendOTPToMail, user_controller_1.sendMail);
userRouter.post('/verifymail/:id', user_middleware_1.isAuthenticated, user_middleware_1.verifyOTP, user_controller_1.verifiedEmail);
userRouter.post('/logout', user_middleware_1.isAuthenticated, (0, catchAsync_1.default)(user_controller_1.logout));
userRouter.put('/refreshtoken', user_middleware_1.isAuthenticated, user_middleware_1.checkTokenForLogin, (0, catchAsync_1.default)(user_controller_1.refreshToken));
userRouter.get('/getAllUsers', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(user_controller_1.getAllUsers));
// userRouter.post('/signin-linkedin',getLinkedinUser)
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map