import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

export const fetchConversations = async () => {
  const response = await axios.get(`${API_BASE_URL}/conversations`);
  return response.data;
};

export const fetchMessages = async (wa_id) => {
  const response = await axios.get(`${API_BASE_URL}/messages/${wa_id}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_BASE_URL}/messages`, messageData);
  return response.data;
};