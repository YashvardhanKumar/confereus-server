"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../../../services/catchAsync"));
const user_controller_1 = require("../../../../controller/user.controller");
const deeplinkRouter = (0, express_1.Router)({ mergeParams: true });
deeplinkRouter.post('/linkedinlogin', (0, catchAsync_1.default)(user_controller_1.getLinkedinUser));
deeplinkRouter.get('/facebooklogin', (0, catchAsync_1.default)(user_controller_1.getLinkedinUser));
exports.default = deeplinkRouter;
//# sourceMappingURL=deeplink.router.js.map