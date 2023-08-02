import mongoose from 'mongoose';

const MessageModel = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  messageType: { type: String, default: 'text' },
  message: String,
  messageStatus: { type: String, default: 'sent' },
  createdAt: { type: Date, default: Date.now },
});

const Messages = mongoose.model('Messages', MessageModel);

export default Messages;
