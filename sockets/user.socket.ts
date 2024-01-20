import { Socket } from "socket.io";
import { User } from "../models/User Profile Models/user.model";
import { ProfileController } from "../services/profile.services";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { EventServices } from "../services/event.services";

export default class UserSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    constructor(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.socket = socket;
        User.watch().on("change", (message) => {
            console.log(message);
            const { _id } = message.documentKey._id;
            ProfileController.fetchProfileOne(_id).then((result) => {
                socket.emit("users-one", result[0]);
            }).catch((err) => {
                console.log(err);
            });
            ProfileController.fetchProfile().then((result) => {
                socket.emit("users", result);
            }).catch((err) => {
                console.log(err);
            });
        });
        this.fetchUsers();
    }
    fetchUsers(): void {
        let socket = this.socket;
        socket.on('users', (...args) => {
            let { userId } = args[2];
            if (!userId) {
                ProfileController.fetchProfile().then((result) => {
                    socket.emit("users", result);
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                ProfileController.fetchProfileOne(userId).then((result) => {
                    console.log(result);
                    socket.emit("users-one", result[0]);
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    }
}
