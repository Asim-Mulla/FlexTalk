import { FiSend } from "react-icons/fi";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getMessagesThunk,
  sendMessageThunk,
} from "../../store/slices/message/messageThunk";
import "./UserSidebar.css";
import { IoMenu } from "react-icons/io5";

const ChatsContainer = ({ setIsOpen }) => {
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { messages } = useSelector((state) => state.messageReducer);
  const { socket, onlineUsers } = useSelector((state) => state.socketReducer);

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();

  const getMessages = async () => {
    const res = await dispatch(
      getMessagesThunk({ otherUserId: selectedUser._id })
    );
  };

  const handleSetMessage = (e) => {
    if (e.target.value) {
      socket.emit("isTyping", {
        isTyping: true,
        to: selectedUser._id,
      });
    } else {
      socket.emit("isTyping", {
        isTyping: false,
        to: selectedUser._id,
      });
    }

    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.length === 0) {
      return;
    }

    const res = await dispatch(
      sendMessageThunk({ receiverId: selectedUser._id, message })
    );

    if (res.payload.success) {
      setMessage("");
    }
  };

  const toggleUsersSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("otherPersonTyping", (otherPerson) => {
      if (otherPerson.isTyping) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    if (!isTyping) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isTyping]);

  return (
    <div className="chatsSection h-screen w-full flex flex-col border-l border-gray-700">
      {selectedUser ? (
        <div className="h-screen w-full flex flex-col">
          <div className="border-b border-gray-700 p-3">
            <div className="flex items-center">
              <div className="toggleSidebarButton">
                <button className="text-2xl me-3" onClick={toggleUsersSidebar}>
                  <IoMenu />
                </button>
              </div>
              <div className="flex items-center">
                <div
                  className={`avatar ${
                    onlineUsers?.includes(selectedUser?._id)
                      ? "avatar-online"
                      : ""
                  } me-3`}
                >
                  <div className="w-12 rounded-full">
                    <img src={selectedUser?.avatar} />
                  </div>
                </div>
                <div>
                  <h2 className={`line-clamp-1 ${!isTyping ? "" : ""}`}>
                    {selectedUser?.name}
                  </h2>
                  <h3 className="text-xs font-semibold opacity-60">
                    {isTyping ? (
                      <div className="text-sm italic text-gray-400">
                        typing...
                      </div>
                    ) : (
                      <div className="text-sm italic text-gray-400">
                        {onlineUsers?.includes(selectedUser?._id)
                          ? "online"
                          : null}
                      </div>
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {messages ? (
            <div className="h-full overflow-y-auto p-3">
              {messages?.map((message) => {
                return <Message messageDetails={message} key={message._id} />;
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center italic text-gray-400 p-3">
              <p>"Looks like you haven’t started chatting yet. Say hello!"</p>
            </div>
          )}

          <div className="flex items-center justify-between p-3">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={handleSetMessage}
              className="input input-primary w-full"
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-primary ms-3"
              disabled={message.length === 0}
            >
              <FiSend />
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <h2 className="text-2xl font-bold">Welcome to FlexTalk</h2>
          <p className="text-sm font-semibold">
            Please select a user to start chatting
          </p>
          <button
            className="toggleSidebarButton btn btn-primary btn-sm"
            onClick={toggleUsersSidebar}
          >
            Select User
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatsContainer;
