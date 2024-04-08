import { Socket } from "socket.io";
import { Event, SocketReservedEventsMap } from "socket.io/dist/socket";
import UserService from "../services/user.services";
import { Blacklist } from "../models/blacklist.model";
import { JwtPayload } from "jsonwebtoken";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExtendedError } from "socket.io/dist/namespace";

function jwtauth(socket: Socket, event: Event, next: (err?: Error) => void) {
    const eventName = event[0]
    let accessToken = event[1]
    const refreshToken = event[2]
    // console.log("event " + event);
    let data = UserService.verifyToken(refreshToken as string) as JwtPayload;
    if (data) {

        if (!accessToken) socket.emit("error", { success: false, error: "Authentication Error" });
        // accessToken = accessToken.slice(7, accessToken.length)
        // console.log("accessToken" + accessToken);
        let aData = UserService.verifyToken(accessToken, async () => {
            accessToken = UserService.generateToken({ email: data.email }, 15 * 60);
            socket.emit("access-token", accessToken);
        });
        next();
    }
    else {
        socket.emit("error", { success: false, error: "Authentication Needed" });
        // next(new Error('Authentication error'))
    }

}

export { jwtauth } 