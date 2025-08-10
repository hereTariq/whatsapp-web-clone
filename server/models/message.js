import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  _id: String,
  meta_msg_id: String,
  wa_id: String,
  from: String,
  to: String,
  profile_name: String,
  body: String,
  timestamp: String,
  type: String,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    required: true
  },
  createdAt: Date,
  updatedAt: Date
});

const Message = mongoose.model('Message', messageSchema, 'processed_messages');

export default Message;