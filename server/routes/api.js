import { Router } from "express";
import { getAllMessages, getConversations, getMessagesByUser, sendMessage } from '../controllers/message.js'

const router = Router();

router.get('/messages', getAllMessages);
router.get('/conversations', getConversations);
router.get('/messages/:wa_id', getMessagesByUser);
router.post('/messages', sendMessage);

export default router;