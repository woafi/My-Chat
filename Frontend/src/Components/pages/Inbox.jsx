import Conversation from "../Conversion"
import MessageBoxContainer from "../MessageBoxContainer"
import useConversion from "../../hooks/useConversion";
import { useAuth } from "../../contexts/AuthContext"
import { useSocket } from "../../contexts/SocketContext"
import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import showToast from "../../utils/toastify";


function Inbox() {
  const [messageData, setMessageData] = useState([])
  const [participant, setParticipant] = useState(null)
  const [current_conversation_id, setCurrent_conversation_id] = useState(null)
  const [current_conversation_name, setCurrent_conversation_name] = useState(null)
  const [current_conversation_avatar, setCurrent_conversation_avatar] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState(null)

  const chatFromHandle = useRef(null);
  const { conversion, loading, error, deleteConversation } = useConversion();
  const { currentUser } = useAuth();
  const { socket, isConnected } = useSocket();


  // Memoized message handler to prevent unnecessary re-renders
  const handleNewMessage = useCallback((data) => {
    const { message } = data;
    // Add message if it belongs to current conversation OR if no conversation is selected
    if (!current_conversation_id || message.conversation_id === current_conversation_id) {
      setMessageData(prevMessages => {
        // Check if message already exists to avoid duplicates
        const messageExists = prevMessages.some(msg =>
          msg._id === message._id ||
          (msg.text === message.text &&
            msg.sender.id === message.sender.id &&
            Math.abs(new Date(msg.createdAt) - new Date(message.createdAt)) < 1000)
        );

        if (messageExists) {
          return prevMessages;
        }

        return [...prevMessages, message];
      });
    }
  }, [current_conversation_id]);




  // Memoized typing handler
  const handleUserTyping = useCallback((data) => {
    if (data.userId !== currentUser.userid && data.conversationId === current_conversation_id) {
      setIsTyping(data.isTyping);
      setTypingUser(data.isTyping ? data.userName : null);

      // Clear typing indicator after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          setIsTyping(false);
          setTypingUser(null);
        }, 3000);
      }
    }
  }, [currentUser.userid, current_conversation_id]);



  // Set up socket listeners
  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, isConnected, handleNewMessage, handleUserTyping]);



  // Join/leave conversation rooms when conversation changes
  useEffect(() => {
    if (socket && isConnected && current_conversation_id && currentUser.userid) {

      socket.emit('join_conversation', {
        conversationId: current_conversation_id,
        userId: currentUser.userid
      });

      return () => {
        socket.emit('leave_conversation', {
          conversationId: current_conversation_id,
          userId: currentUser.userid
        });
      };
    }
  }, [socket, isConnected, current_conversation_id, currentUser.userid]);


  
  // Get messages of a conversation
  async function getMessage(conversation_id, current_conversation_name, current_conversation_avatar) {
    try {
      const response = await fetch(`/api/inbox/messages/${conversation_id}`, {
        credentials: 'include',
      });
      const result = await response.json();

      if (!result.errors && result.data) {
        const { data } = result;

        setParticipant(data.participant);
        setCurrent_conversation_id(conversation_id);
        setCurrent_conversation_name(current_conversation_name);
        setCurrent_conversation_avatar(current_conversation_avatar);

        // Set messages
        if (data.messages) {
          setMessageData(data.messages);
        } else {
          setMessageData([]);
        }
      } else {
        showToast({
          text: "Error loading messages!",
          duration: 1500,
          position: "center",
        });
      }
      chatFromHandle.current.style.visibility = "visible";
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // Handle sending message
  async function handleSubmit(e) {
    const formData = new FormData(e.target);

    // Prepare the form data
    formData.append('receiverId', participant.id);
    formData.append('receiverName', participant.name);
    formData.append('avatar', participant.avatar || '');
    formData.append('conversationId', current_conversation_id);

    const data = Object.fromEntries(formData.entries());
    if (data.attachment.name) {
      const selectedFile = data.attachment;
      const formCloud = new FormData();
      formCloud.append("file", selectedFile);
      formCloud.append("upload_preset", "testing");

      let fileUrl = null;

      //Save Cloudinary
      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_KEY}/image/upload`, {
          method: "POST",
          body: formCloud
        });

        const data = await response.json();
        fileUrl = data.secure_url;
      } catch (error) {
        console.error("cloudinary error:", error);
      }
      data.attachment = fileUrl;
    } else {
      data.attachment = null;
    }

    //Fetch Post
    try {
      const response = await fetch(`/api/inbox/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.errors) {
        e.target.reset();
      } else {
        showToast({
          text: "Error sending message!",
          duration: 1500,
          position: "center",
        });
        console.error("Failed to send message:", result.errors);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  // Handle typing indicator
  function handleTyping(isTyping) {
    if (socket && isConnected && current_conversation_id) {
      socket.emit('typing', {
        conversationId: current_conversation_id,
        userId: currentUser.userid,
        userName: currentUser.username,
        isTyping
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Inbox - MyChat</title>
      </Helmet>
      <div className='flex w-full justify-between md:h-full h-[82vh]'>
        <Conversation
          conversion={conversion}
          handleGetMessage={getMessage}
          currentUser={currentUser}
          current_conversation_id={current_conversation_id}
        />
        <MessageBoxContainer
          messageData={messageData}
          currentUser={currentUser}
          handleSubmit={handleSubmit}
          handleTyping={handleTyping}
          isTyping={isTyping}
          typingUser={typingUser}
          chatFromHandle={chatFromHandle}
          current_conversation_id={current_conversation_id}
          current_conversation_name={current_conversation_name}
          current_conversation_avatar={current_conversation_avatar}
          deleteConversation={deleteConversation}
        />
      </div>
    </>
  )
}

export default Inbox;