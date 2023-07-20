"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.isAuthenticated = exports.checkTokenForLogin = exports.checkAccessToken = exports.isTokenNotExpired = exports.verifyOTP = exports.sendOTPToMail = exports.checkPassword = exports.doesUserExist = exports.canCreateUser = exports.hashPassword = void 0;
const user_model_1 = require("../models/User Profile Models/user.model");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer_1 = require("nodemailer");
const blacklist_model_1 = require("../models/blacklist.model");
const user_services_1 = __importDefault(require("../services/user.services"));
function hashPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = yield (bcrypt.genSalt(10));
            const hashedPassword = yield bcrypt.hash(req.body.password, salt);
            //@ts-ignore
            req.hashedPassword = hashedPassword;
            next();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.hashPassword = hashPassword;
function canCreateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.User.findOne({ email: req.body.email });
            if (user == null) {
                return next();
            }
            else {
                res.json({ status: false, success: "Already have account!", });
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.canCreateUser = canCreateUser;
function doesUserExist(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.User.findOne({ email: req.body.email });
            if (user != null) {
                // @ts-ignore
                req.userPass = user.password;
                return next();
            }
            else {
                res.json({ status: false, success: "Account doesn't exists!", });
            }
        }
        catch (e) {
            throw e;
        }
    });
}
exports.doesUserExist = doesUserExist;
function checkPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield user_model_1.User.findOne({ email: req.body.email });
            /* @ts-ignore */
            console.log(req.body.password);
            /* @ts-ignore */
            const isMatch = yield bcrypt.compare(req.body.password, req.userPass);
            if (isMatch) {
                next();
            }
            else {
                res.json({ status: false, success: "Incorrect email or password", });
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkPassword = checkPassword;
function sendOTPToMail(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const OTP = Math.floor(Math.random() * 1000000);
        let stringOTP = OTP.toString();
        for (let index = 0; index < 5 - Math.log10(OTP); index++) {
            stringOTP = '0' + stringOTP;
        }
        const transporter = (0, nodemailer_1.createTransport)({
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: { rejectUnauthorized: false }
        });
        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: req.body.email,
            subject: 'Verify Email Confereus',
            html: `<div>
                <p>Hello,</p>
                <p>Copy and paste the OTP to verify your email address.</p>
                <p><h3><b>${stringOTP}</b></h3></p>
                <p>If you didn't ask to verify this address, you can ignore this email.</p>
                <p>Thanks,</p>
                <p>Your Confereus team</p>
                </div>`
        };
        const info = yield transporter.sendMail(message);
        console.log('Message sent : %s', info.messageId);
        console.log(stringOTP);
        const otpSalt = yield bcrypt.genSalt(10);
        const encryptedOTP = yield bcrypt.hash(stringOTP, otpSalt);
        // @ts-ignore
        req.otp = encryptedOTP;
        next();
    });
}
exports.sendOTPToMail = sendOTPToMail;
function verifyOTP(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const bcrypt_otp_token = req.body.encrypted_otp_token;
        console.log(bcrypt_otp_token);
        let bcryptOTP = user_services_1.default.verifyToken(bcrypt_otp_token);
        console.log(bcryptOTP);
        const success = yield bcrypt.compare(req.body.otp, bcryptOTP.otp);
        console.log(success);
        if (success) {
            return next();
        }
        else {
            res.json({ status: false, success: "Wrong OTP" });
        }
    });
}
exports.verifyOTP = verifyOTP;
function isTokenNotExpired(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.headers['authorization'];
        console.log(accessToken);
        accessToken = accessToken.slice(7, accessToken.length);
        try {
            let aData = user_services_1.default.verifyToken(accessToken, () => __awaiter(this, void 0, void 0, function* () {
                const refreshToken = req.body.login_refresh_token;
                let blacklist = yield blacklist_model_1.Blacklist.findOne({ refreshToken: refreshToken });
                let data = user_services_1.default.verifyToken(refreshToken);
                console.log(data);
                if (blacklist || !data) {
                    res.json({ status: false, success: "Session Expired!" });
                }
                else {
                    //@ts-ignore
                    req.data = data.email;
                    accessToken = user_services_1.default.generateToken({ email: data.email }, 15 * 60);
                    res.cookie(`login_access_token`, accessToken);
                    next();
                    // res.json({ status: true, token: accessToken });
                    // res.json({ status: false, success: "Session Expired!" })
                }
            }));
            if (aData) {
                //@ts-ignore
                req.data = aData.email;
                next();
            }
        }
        catch (e) {
            // if (aData) {
            //     //@ts-ignore
            //     req.data = aData.email;
            //     next();
            // } else {
            const refreshToken = req.body.login_refresh_token;
            let blacklist = yield blacklist_model_1.Blacklist.findOne({ refreshToken: refreshToken });
            let data = user_services_1.default.verifyToken(refreshToken);
            console.log(data);
            if (blacklist || !data) {
                res.json({ status: false, success: "Session Expired!" });
            }
            else {
                //@ts-ignore
                req.data = data.email;
                accessToken = user_services_1.default.generateToken({ email: data.email }, 15 * 60);
                res.cookie(`login_access_token`, accessToken);
                next();
                // res.json({ status: true, token: accessToken });
                // res.json({ status: false, success: "Session Expired!" })
            }
        }
    });
}
exports.isTokenNotExpired = isTokenNotExpired;
function checkAccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.headers['authorization'];
        console.log(accessToken);
        accessToken = accessToken.slice(7, accessToken.length);
        if (user_services_1.default.verifyToken(accessToken)) {
            //@ts-ignore
            // req.data = aData.email;
            next();
        }
        else {
            res.json({ status: false, success: "Expired" });
        }
    });
}
exports.checkAccessToken = checkAccessToken;
function checkTokenForLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessToken = req.headers['authorization'];
        console.log(accessToken);
        accessToken = accessToken.slice(7, accessToken.length);
        let aData = user_services_1.default.verifyToken(accessToken);
        if (user_services_1.default.verifyToken(accessToken)) {
            //@ts-ignore
            // req.data = aData.email;
            // next();
            res.json({ status: true, token: accessToken, success: "Not Expired Yet" });
        }
        else {
            const refreshToken = req.body.login_refresh_token;
            let blacklist = yield blacklist_model_1.Blacklist.findOne({ refreshToken: refreshToken });
            let data = user_services_1.default.verifyToken(refreshToken);
            console.log(data);
            if (blacklist || !data) {
                res.json({ status: false, success: "Session Expired!" });
            }
            else {
                //@ts-ignore
                req.data = data.email;
                // res.json({ status: false, success: "Session Expired!" })
                next();
            }
        }
    });
}
exports.checkTokenForLogin = checkTokenForLogin;
function isAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body.login_refresh_token);
        if (user_services_1.default.verifyToken(req.body.login_refresh_token)) {
            return next();
        }
        res.json({ status: false, success: "Login Needed" });
    });
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=user.middleware.js.map