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
const user_model_1 = require("../models/User Profile Models/user.model");
const jwt = __importStar(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UserService {
    static signUpWithEmailAndPassword(name, dob, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createUser = new user_model_1.User({ name, email, password, dob, provider: 'email_login' });
                yield createUser.save();
                return createUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static userBuilder(userProfile, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield user_model_1.User.findOne({
                email: userEmail,
            });
            let data = {
                name: `${userProfile.firstName} ${userProfile.lastName}`,
                profileImageURL: userProfile.profilePicture,
                email: userEmail,
                password: null,
                emailVerified: true,
                provider: 'linkedin_login'
            };
            if (!user) {
                user = new user_model_1.User(data);
                yield user.save();
                return user._id;
            }
            if (user.provider == 'linkedin_login') {
                return user._id;
            }
            else {
                yield user.updateOne({
                    $set: data,
                });
            }
            return user._id;
        });
    }
    static updatePass(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield user_model_1.User.findOneAndUpdate({ email }, { $set: { password } });
                return userId;
            }
            catch (error) {
                return "Something Went Wrong!";
            }
        });
    }
    static signUpWithFacebook(name, dob, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createUser = new user_model_1.User({ name, email, password, dob });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static signUpWithTwitter(name, dob, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createUser = new user_model_1.User({ name, email, password, dob });
            }
            catch (error) {
                throw error;
            }
        });
    }
    static generateToken(payload, jwt_expire) {
        const privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'keys', 'rsa.key'), 'utf8');
        try {
            return jwt.sign(payload, privateKey, { expiresIn: jwt_expire, algorithm: 'RS256' });
        }
        catch (err) {
            // console.log(err);
            return null;
        }
    }
    static verifyToken(token, onError = () => {
    }) {
        const publicKey = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'keys', 'rsa.key.pub'), 'utf8');
        try {
            return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        }
        catch (err) {
            // console.log(err);
            onError();
            return err;
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.services.js.map