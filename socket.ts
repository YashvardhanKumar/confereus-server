import { Server } from "socket.io";
import { http } from "./app";
var io = new Server(http,{});

io.use((socket,next) => {
    
})

io.on('connection', (server) => {
    console.log('Socket.io connected!');
    server.on('send_presenter_request',message => {
        
    })
});

export default io;