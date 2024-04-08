"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.refreshToken = exports.logout = exports.verifiedEmail = exports.sendMail = exports.login = exports.changePassword = exports.getLinkedinUser = exports.signUp = void 0;
const user_services_1 = __importDefault(require("../services/user.services"));
const user_model_1 = require("../models/User Profile Models/user.model");
const blacklist_model_1 = require("../models/blacklist.model");
const profile_services_1 = require("../services/profile.services");
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, dob, } = req.body;
        //@ts-ignore
        const success = yield user_services_1.default.signUpWithEmailAndPassword(name, new Date(Date.parse(dob)), email, req.hashedPassword);
        const accessToken = user_services_1.default.generateToken({ email }, 5 * 60);
        const refreshToken = user_services_1.default.generateToken({ email }, 30 * 24 * 60 * 60);
        res.cookie("login_access_token", accessToken);
        res.cookie("login_refresh_token", refreshToken);
        res.status(200).json({ status: true, token: accessToken, userId: success._id });
    });
}
exports.signUp = signUp;
function getLinkedinUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, profilePicture, email } = req.body;
        // // console.log(req.body);
        const accessToken = user_services_1.default.generateToken({ email }, 15 * 60);
        const refreshToken = user_services_1.default.generateToken({ email }, 30 * 24 * 60 * 60);
        res.cookie("login_access_token", accessToken);
        res.cookie("login_refresh_token", refreshToken);
        let user = yield user_services_1.default.userBuilder({ firstName, lastName, profilePicture }, email);
        let resStatus = 200;
        res.status(resStatus).json({ token: accessToken, userId: user });
    });
}
exports.getLinkedinUser = getLinkedinUser;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        //@ts-ignore
        const success = yield user_services_1.default.updatePass(email, req.hashedPassword);
        res.status(200).json({ status: true, success });
    });
}
exports.changePassword = changePassword;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const accessToken = user_services_1.default.generateToken({ email }, 15 * 60);
        const refreshToken = user_services_1.default.generateToken({ email }, 30 * 24 * 60 * 60);
        const userId = (yield user_model_1.User.findOne({ email }))._id;
        res.cookie("login_access_token", accessToken);
        res.cookie("login_refresh_token", refreshToken);
        res.status(200).json({ status: true, token: accessToken, userId });
    });
}
exports.login = login;
function sendMail(req, res) {
    // @ts-ignore
    const token = user_services_1.default.generateToken({ otp: req.otp }, 2 * 60);
    res.cookie("encrypted_otp_token", token, { maxAge: 2 * 60 * 1000 });
    res.status(200).json({ status: true });
}
exports.sendMail = sendMail;
function verifiedEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let accessToken = req.headers['authorization'];
            accessToken = accessToken.slice(7, accessToken.length);
            const data = user_services_1.default.verifyToken(accessToken);
            if (!data) {
                return res.json({ status: false, success: "Session Expired" });
            }
            var user = yield user_model_1.User.findOneAndUpdate({ email: data.email }, {
                $set: {
                    emailVerified: true,
                }
            });
            res.status(200).json({ status: true, user });
        }
        catch (error) {
            // console.log(error.message);
            throw error;
        }
    });
}
exports.verifiedEmail = verifiedEmail;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.headers['authorization'];
        let blacklist = new blacklist_model_1.Blacklist({
            accessToken,
            refreshToken: req.body.login_refresh_token
        });
        blacklist.save();
        res.clearCookie("login_access_token");
        res.clearCookie("login_refresh_token");
        res.clearCookie("encrypted-otp-token");
        res.status(200).json({ status: true });
    });
}
exports.logout = logout;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const accessToken = user_services_1.default.generateToken({ email: req.data }, 15 * 60);
        res.cookie(`login_access_token`, accessToken);
        res.json({ status: true, token: accessToken });
    });
}
exports.refreshToken = refreshToken;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield profile_services_1.ProfileController.fetchProfile();
            res.json({ status: true, data });
        }
        catch (error) {
            // console.log(error);
            res.json({ status: false, message: error });
        }
    });
}
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=user.controller.js.map