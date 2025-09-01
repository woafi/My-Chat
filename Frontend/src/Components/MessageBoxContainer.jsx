import { useEffect, useRef, useState } from 'react';
import moment from "moment";

import '../Styles/chatmessagebox.css';
import ChatFrom from './ChatFrom';

function MessageContainer({
  current_conversation_id,
  current_conversation_name,
  current_conversation_avatar,
  chatFromHandle,
  messageData,
  currentUser,
  handleSubmit,
  handleTyping,
  isTyping,
  typingUser,
  deleteConversation
}) {
  const chatListRef = useRef(null);

  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messageData, isTyping]);

  // Handle input change with typing indicator
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (handleTyping) {
      handleTyping(true);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      const newTimeout = setTimeout(() => {
        handleTyping(false);
      }, 1000);
      setTypingTimeout(newTimeout);
    }
  };

  // Handle Message Form Submission
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      handleSubmit(e);
      setMessage('');
      if (handleTyping) {
        handleTyping(false);
      }
    }
  };

  // Delete conversation
  const handleDeleteConversation = () => {
    if (confirm("Are you sure you want to remove the conversation?")) {
      deleteConversation(current_conversation_id);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  };

  const shownMessage = current_conversation_id || messageData.length !== 0;

  return (
    <div className='w-full rounded-r-2xl flex flex-col bg-background transition-all duration-1800 justify-between'>
      <div className="h-[80px] w-full border-gray-500/40 border-b flex justify-between items-center px-[20px]">
        {current_conversation_name && (
          <div className='flex justify-center items-center'>
            <div className="rounded-full w-10 h-10 mx-2 bg-secondary overflow-hidden flex justify-center items-center">
              <img
                src={
                  current_conversation_avatar
                    ? current_conversation_avatar
                    : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"
                }
                alt=""
              />
            </div>
            <span className='text-black'>{current_conversation_name}</span>
          </div>
        )}
        {current_conversation_name && (
          <div className="cursor-pointer hover:scale-110 px-2 py-1 rounded">
            <img
              className="w-7.5 hover:scale-105"
              onClick={handleDeleteConversation}
              src="/images/trash.png"
              alt=""
            />
          </div>
        )}
      </div>

      <div
        ref={chatListRef}
        className="chat-message-list w-full flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-2"
      >
        <div className="flex-1 w-full"></div>

        {shownMessage ? (
          messageData
            .sort(
              (a, b) =>
                new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
            )
            .map((message) => {
              const isCurrentUser = message.sender.id === currentUser.userid;
              return isCurrentUser ? (
                <div key={message._id} className="message-row you-message mb-4">
                  <div className="message-content flex px-4 gap-7 justify-end">
                    <div className="flex flex-col items-end">
                      <div className="message-text px-4 py-2 text-white rounded-lg max-w-54 sm:max-w-80 break-words">
                        {message.text}
                      </div>
                      {message.attachment && <div className='rounded-xl max-w-50 max-h-50 mt-1 overflow-hidden flex'>
                        <img src={message.attachment} alt="" />
                      </div>
                      }

                      <div className="message-time text-[12px] m-1 text-gray-500">
                        {moment(message.date_time).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={message._id} className="message-row other-message mb-4">
                  <div className="message-content flex px-2 sm:px-4 gap-2 sm:gap-5">
                    <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
                      <img
                        src={
                          message.sender.avatar
                            ? message.sender.avatar
                            : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="message-text px-4 py-2 rounded-lg max-w-54 sm:max-w-80 break-words">
                        {message.text}
                      </div>
                      {message.attachment &&
                        <div className='rounded-xl max-w-50 max-h-50 mt-1 overflow-hidden flex'>
                          <img src={message.attachment} alt="" />
                        </div>
                      }
                      <div className="message-time text-[12px] m-1 text-gray-500">
                        {moment(message.date_time).fromNow()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className='h-full flex flex-col justify-center items-center text-black'>
            <span>Select a conversation</span>
            <span>or</span>
            <span className='text-center'>Click '+' for adding a conversation</span>
          </div>
        )}

        {isTyping && typingUser && (
          <div className="message-row other-message mb-4 ">
            <div className="message-content flex px-2 sm:px-4 gap-2 sm:gap-5">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ">
                <span className="text-sm font-medium">
                  {typingUser.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="message-text px-4 py-2 bg-gray-200 rounded-lg">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="message-time text-[12px] m-1 text-gray-500">
                  {typingUser} is typing...
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatFrom
        message={message}
        chatFrom={chatFromHandle}
        handleInputChange={handleInputChange}
        handleOnSubmit={handleOnSubmit}
      />
    </div>
  );
}

export default MessageContainer;
