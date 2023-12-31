import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import messageRoute from './Routes/MessagesRoute.js';
import audioRoute from './Routes/AudioRouter.js';
import tokenRoute from './Routes/GenerateToken.js';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '30mb', extented: true }));
dotenv.config();
app.use('/upload/images', express.static('upload/images'));
app.use('/upload/audios', express.static('upload/audios'));

const server = app.listen(5000, () => {
  console.log(`app working on port ${5000}`);
});

const CONNECTION_URL = process.env.MONGODB_URI;

app.use('/image', messageRoute);
app.use('/audio', audioRoute);
app.use('/generate', tokenRoute);

const io = new Server(server, {
  cors: {
    origin: process.env.IO_ORIGIN || 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  console.log('server connection');
  socket.on('join_room', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log({ online: onlineUsers });
    socket.broadcast.emit('online_users', {
      onlineUser: Array.from(onlineUsers.keys()),
    });
  });

  socket.on('send_msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.receiverId);
    console.log({ data });
    console.log({ sendUserSocket });
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('recieve-msg', {
        senderId: data.senderId,
        message: data.message,
        messageStatus: data.messageStatus,
        messageType: data.messageType,
      });
    }
  });

  socket.on('Sign_out', (id) => {
    console.log({ deleteId: id });
    onlineUsers.delete(id);
    socket.broadcast.emit('online_users', {
      onlineUser: Array.from(onlineUsers.keys()),
    });
  });
  socket.on('outgoing-voice-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('incoming_voice_call', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on('outgoing-video-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('incoming_video_call', {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    }
  });

  socket.on('reject-voice-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('voice_call_rejected');
    }
  });

  socket.on('end_call', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('end_voice_call');
    }
  });
  socket.on('end_v_call', (data) => {
    console.log('we got here');
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('end_video_call');
    }
  });
  socket.on('reject-video-call', (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('video_call_rejected');
    }
  });

  socket.on('accept-incoming-call', ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('accept-call');
    }
  });

  socket.on('accept-incoming-Vcall', ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('accept-Vcall');
    }
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
