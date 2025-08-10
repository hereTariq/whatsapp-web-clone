import Message from "../models/message.js";

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $group: {
          _id: "$wa_id",
          profile_name: { $first: "$profile_name" },
          recipient_number: {
            $first: {
              $cond: [
                { $eq: ["$from", "918329446654"] }, // If message is from us
                "$to", // Then recipient is 'to'
                "$from" // Else recipient is 'from'
              ]
            }
          },
          last_message: { $last: "$body" },
          last_message_time: { $last: "$timestamp" }
        }
      },
      { $sort: { last_message_time: -1 } }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessagesByUser = async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id })
      .sort({ timestamp: 1 })
      .lean();

    const businessNumber = "918329446654";
    const messagesWithDirection = messages.map(msg => ({
      ...msg,
      direction: msg.direction || (msg.from === businessNumber ? 'outgoing' : 'incoming')
    }));

    res.json(messagesWithDirection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { 
      wa_id,
      from,
      to,
      profile_name,
      body,
      type = "text",
      status = "sent"
    } = req.body;

    const newMessage = {
      _id: `msg-${Date.now()}`,
      meta_msg_id: `wamid.msg-${Date.now()}`,
      wa_id,
      from,
      to,
      profile_name,
      body,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      type,
      status,
      direction: from === "918329446654" ? "outgoing" : "incoming",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const savedMessage = await Message.create(newMessage);
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};