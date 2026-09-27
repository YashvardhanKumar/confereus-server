'use strict'
import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './routes/user/user.router';
import UserService from './services/user.services';
import cors from 'cors';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import deeplinkRouter from './routes/user/deeplink/r/deeplink.router';
import conferenceRoute from './routes/user/conference/conference.router';
import profileRouter from './routes/user/profile/profile.router';
import eventRoute from './routes/user/conference/event.router';
import { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import abstractRoute from './routes/user/conference/abstract.router';
import notificationRouter from './routes/user/notification/notification.router';
import { Server } from 'socket.io';
import { Conference } from './models/conference.model';
import ConferenceServices from './services/conference.services';
import ConferenceSocket from './sockets/conferences.socket';
import EventSocket from './sockets/event.socket';
import { jwtauth } from './sockets/socket.middleware';
import UserSocket from './sockets/user.socket';
declare module 'express-session' {
  interface SessionData {
    user: { [key: string]: any };
  }
}

const app = express();
let server = createServer(app);

const io = new Server(server, {
  cors: {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: (origin, callback) => {
      // Allow any origin or requests without origin (like mobile Flutter apps)
      callback(null, true);
    },
    credentials: true,
  }
})

io.on('connection', (socket) => {
  // // console.log(`Connected to ${socket.id}`);
  // io.emit('message', "data");
  socket.on('message', (message) => {
    // // console.log(`message from ${socket.id} : ${message}`);
  })
  socket.use((event, next) => {
    jwtauth(socket, event, next);
  });
  new ConferenceSocket(socket);
  new EventSocket(socket);
  new UserSocket(socket);
  // socket.on('conferences', (message) => {
  //   if (!message) {
  //     ConferenceServices.fetchConferences('all').then((result) => {
  //       socket.emit("conferences", result);
  //     }).catch((err) => {
  //       // console.log(err);
  //     });
  //   } else {
  //   let {confId} = message;
  //     ConferenceServices.fetchConferencesOne('all',confId).then((result) => {
  //       // console.log(result);
  //       socket.emit("conferences-one", result);
  //     }).catch((err) => {
  //       // console.log(err);
  //     });
  //   }
  // })


  socket.on('connect', (message) => {
    // // console.log(`message from ${socket.id} : ${message}`);
  })

  socket.on('disconnect', () => {
    // // console.log(`socket ${socket.id} disconnected`);
  })
  socket.on('error', function (err) {
    // // console.log('received error from client:', socket.id)
    // // console.log(err)
  })
});


app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uploadsPath = fs.existsSync(path.join(__dirname, 'uploads')) 
    ? path.join(__dirname, 'uploads') 
    : path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/', userRouter);
app.use('/applink/r', deeplinkRouter);
app.use('/:id/conferences', conferenceRoute);
app.use('/:id/conferences/:confId/events', eventRoute);
app.use('/:id/conferences/:confId/abstract', abstractRoute);
app.use('/:id/profile', profileRouter);
app.use('/:id/notifications', notificationRouter);


// app.use('/:id/profile');
// app.use('/:id/home');


export { app, server, io };

