"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conference_controller_1 = require("../../../controller/conference.controller");
const user_middleware_1 = require("../../../middlewares/user.middleware");
const catchAsync_1 = __importDefault(require("../../../services/catchAsync"));
const conflogo_upload_1 = require("../../../config/utils/conflogo.upload");
const fileUploader_controller_1 = require("../../../controller/fileUploader.controller");
const conferenceRoute = (0, express_1.Router)({ mergeParams: true });
conferenceRoute.get('/', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.fetchConferences))
    .patch('/:confId/uploadLogo', user_middleware_1.checkAccessToken, conflogo_upload_1.uploads.single("picture"), (0, catchAsync_1.default)(fileUploader_controller_1.editLogoConf))
    .post('/add', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.addConference))
    .patch('/edit/:confId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.editConference))
    .delete('/delete/:confId', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.deleteConference));
conferenceRoute.get('/registered', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.fetchRegisteredConferences))
    .post('/:confId/register', user_middleware_1.isAuthenticated, user_middleware_1.isTokenNotExpired, (0, catchAsync_1.default)(conference_controller_1.registerConference));
exports.default = conferenceRoute;
//# sourceMappingURL=conference.router.js.map