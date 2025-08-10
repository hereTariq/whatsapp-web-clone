import { useState } from 'react';

export const ChatWindow = ({ messages, profile_name, onSendMessage, onBack, isMobile }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header with back button on mobile */}
      <div className="p-3 bg-whatsapp-dark border-b border-gray-200 flex items-center">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-2 text-white"
          >
            ←
          </button>
        )}
        <h2 className="text-xl font-semibold text-white">{profile_name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.direction === 'outgoing' ? 'bg-whatsapp-light' : 'bg-white'}`}
            >
              <p className="text-gray-800">{message.body}</p>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs text-gray-500">
                  {new Date(parseInt(message.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {message.direction === 'outgoing' && (
                  <span className="text-xs">
                    {message.status === 'read' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex space-x-1">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-1 focus:outline-none focus:ring-1 focus:ring-whatsapp-green"
            placeholder="Type a message"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-3 rounded-r-lg focus:outline-none ${newMessage.trim()
                ? 'bg-whatsapp-green text-white hover:bg-whatsapp-darker cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};