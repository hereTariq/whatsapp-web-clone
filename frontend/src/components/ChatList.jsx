export const ChatList = ({ conversations, onSelect, activeChat }) => {
  return (
    <div className="w-full h-full border-r border-gray-200 bg-gray-50 overflow-y-auto">
      <div className="p-3 bg-whatsapp-dark border-b border-gray-200">
        <h2 className="text-xl font-semibold text-white">Chats</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className={`p-3 hover:bg-gray-100 cursor-pointer ${activeChat === conversation._id ? 'bg-gray-200' : ''}`}
            onClick={() => onSelect(conversation._id, conversation.profile_name)}
          >
            <div className="flex items-center">
              <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-whatsapp-green flex-shrink-0 flex items-center justify-center text-white">
                {conversation.profile_name?.charAt(0)}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{conversation.profile_name}</h3>
                <p className="text-sm text-gray-500 truncate">{conversation.last_message}</p>
              </div>
              <div className="ml-auto text-xs text-gray-500">
                {new Date(parseInt(conversation.last_message_time) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};