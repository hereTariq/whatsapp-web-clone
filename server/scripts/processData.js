import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Message from '../models/message.js';
dotenv.config();

export async function processAllData() {
  try {
    const dataDir = path.join(process.cwd(), 'sample_payloads');
    const files = fs.readdirSync(dataDir);

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (file.includes('message')) {
        await processMessageData(data);
      } else if (file.includes('status')) {
        await processStatusData(data);
      }
    }

    console.log('All data processed successfully');
  } catch (error) {
    console.error('Error processing data:', error);
  }
}

async function processMessageData(data) {
  try {
    const entry = data.metaData.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;
    const metadata = value.metadata;
    const contact = value.contacts?.[0];
    
    // Business identifiers from metadata
    const businessDisplayNumber = metadata.display_phone_number; // "918329446654"
    const businessPhoneNumberId = metadata.phone_number_id;     // "629305560276479" (ID, not number)

    for (const message of value.messages) {
      const isIncoming = message.from !== businessDisplayNumber;
      
      // Correct from/to handling
      const from = message.from;
      const to = isIncoming 
        ? businessDisplayNumber  // For incoming messages, recipient is your business number
        : contact?.wa_id;       // For outgoing messages, recipient is contact's number

      const messageData = {
        _id: data._id,
        meta_msg_id: message.id,
        wa_id: contact?.wa_id || from, // Conversation thread ID
        from,
        to,
        profile_name: isIncoming 
          ? contact?.profile?.name || 'Unknown' 
          : 'Business Account',
        body: message.text?.body || '',
        timestamp: message.timestamp,
        type: message.type,
        status: 'sent',
        direction: isIncoming ? 'incoming' : 'outgoing',
        createdAt: parseDate(data.createdAt) || new Date(),
        updatedAt: parseDate(data.completedAt) || new Date()
      };

      await Message.findOneAndUpdate(
        { meta_msg_id: message.id },
        messageData,
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error processing message data:', error);
  }
}

async function processStatusData(data) {
  try {
    const entry = data.metaData.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;
    
    if (value.statuses && value.statuses.length > 0) {
      for (const status of value.statuses) {
        // Safely parse date - fallback to current date if invalid
        const updatedAt = parseDate(data.completedAt) || new Date();
        
        await Message.updateOne(
          { meta_msg_id: status.id || status.meta_msg_id },
          { 
            $set: { 
              status: status.status,
              updatedAt
            } 
          }
        );
      }
    }
  } catch (error) {
    console.error('Error processing status data:', error);
  }
}

function parseDate(dateString) {
  if (!dateString) return null;
  
  // Try parsing as ISO string first
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) return date;
  
  // Try parsing as timestamp
  const timestamp = parseInt(dateString);
  if (!isNaN(timestamp)) return new Date(timestamp * 1000);
  
  return null;
}

