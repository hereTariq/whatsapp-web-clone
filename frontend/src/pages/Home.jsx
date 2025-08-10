import { useState, useEffect } from 'react';
import { ChatList } from '../components/ChatList.jsx';
import { ChatWindow } from '../components/ChatWindow.jsx';
import { fetchConversations, fetchMessages, sendMessage } from '../api/message.js';
import { useWindowSize } from '../hooks/useWindowSize.js';

export const HomePage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [profileName, setProfileName] = useState('');
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    const loadConversations = async () => {
      const data = await fetchConversations();
      setConversations(data);
    };
    loadConversations();
  }, []);

  const handleSelectChat = async (wa_id, name) => {
    setActiveChat(wa_id);
    setProfileName(name);
    const data = await fetchMessages(wa_id);
    setMessages(data);
  };

  const handleSendMessage = async (message) => {
    if (!activeChat) return;

    const newMessage = {
      _id: `temp-${Date.now()}`,
      meta_msg_id: `wamid.temp-${Date.now()}`,
      wa_id: activeChat,
      from: "918329446654", // Your business number (from JSON metadata)
      to: activeChat,       // Recipient's number (wa_id)
      profile_name: profileName,
      body: message,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      type: "text",
      status: "sent",
      direction: "outgoing",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setMessages([...messages, newMessage]);
    await sendMessage(newMessage);

    const updatedMessages = await fetchMessages(activeChat);
    console.log('updatedMessages: ', updatedMessages);
    setMessages(updatedMessages);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar (Mobile only) */}
      {isMobile && (
        <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4">
          <button
            onClick={() => setActiveChat(null)}
            className="p-3 rounded-full hover:bg-gray-200"
          >
            💬
          </button>
        </div>
      )}

      {/* Chat List - Always visible on desktop, conditionally on mobile */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-10 bg-white transition-transform duration-300' : 'block w-1/3'} 
        ${isMobile && activeChat ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <ChatList
          conversations={conversations}
          onSelect={handleSelectChat}
          activeChat={activeChat}
        />
      </div>

      {/* Chat Window - Conditional rendering */}
      {activeChat ? (
        <div className={`
          ${isMobile ? 'fixed inset-0 z-10 bg-white' : 'block w-2/3'}
        `}>
          <ChatWindow
            messages={messages}
            profile_name={profileName}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveChat(null)}
            isMobile={isMobile}
          />
        </div>
      ) : (
        <div className={`${isMobile ? 'hidden' : 'flex'} flex-1 items-center justify-center bg-gray-50`}>
          <div className="text-center p-4">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Select a chat</h3>
            <p className="mt-1 text-sm text-gray-500">Choose from your conversations</p>
          </div>
        </div>
      )}
    </div>
  );
};