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
exports.jwtauth = void 0;
const user_services_1 = __importDefault(require("../services/user.services"));
function jwtauth(socket, event, next) {
    const eventName = event[0];
    let accessToken = event[1];
    const refreshToken = event[2];
    // console.log("event " + event);
    let data = user_services_1.default.verifyToken(refreshToken);
    if (data) {
        if (!accessToken)
            socket.emit("error", { success: false, error: "Authentication Error" });
        // accessToken = accessToken.slice(7, accessToken.length)
        // console.log("accessToken" + accessToken);
        let aData = user_services_1.default.verifyToken(accessToken, () => __awaiter(this, void 0, void 0, function* () {
            accessToken = user_services_1.default.generateToken({ email: data.email }, 15 * 60);
            socket.emit("access-token", accessToken);
        }));
        next();
    }
    else {
        socket.emit("error", { success: false, error: "Authentication Needed" });
        // next(new Error('Authentication error'))
    }
}
exports.jwtauth = jwtauth;
//# sourceMappingURL=socket.middleware.js.map