"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/User Profile Models/user.model");
const profile_services_1 = require("../services/profile.services");
class UserSocket {
    constructor(socket) {
        this.socket = socket;
        user_model_1.User.watch().on("change", (message) => {
            // console.log(message);
            const { _id } = message.documentKey._id;
            profile_services_1.ProfileController.fetchProfileOne(_id).then((result) => {
                socket.emit("users-one", result[0]);
            }).catch((err) => {
                // console.log(err);
            });
            profile_services_1.ProfileController.fetchProfile().then((result) => {
                socket.emit("users", result);
            }).catch((err) => {
                // console.log(err);
            });
        });
        this.fetchUsers();
    }
    fetchUsers() {
        let socket = this.socket;
        socket.on('users', (...args) => {
            let { userId } = args[2];
            if (!userId) {
                profile_services_1.ProfileController.fetchProfile().then((result) => {
                    socket.emit("users", result);
                }).catch((err) => {
                    // console.log(err);
                });
            }
            else {
                profile_services_1.ProfileController.fetchProfileOne(userId).then((result) => {
                    // console.log(result);
                    socket.emit("users-one", result[0]);
                }).catch((err) => {
                    // console.log(err);
                });
            }
        });
    }
}
exports.default = UserSocket;
//# sourceMappingURL=user.socket.js.map