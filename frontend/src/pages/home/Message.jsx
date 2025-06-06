import { useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ messageDetails }) => {
  const { userProfile, selectedUser } = useSelector(
    (state) => state.userReducer
  );
  const messageRef = useRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      ref={messageRef}
      className={`chat ${
        messageDetails?.senderId === userProfile?._id
          ? "chat-end"
          : "chat-start"
      }`}
    >
      {/* <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="user profile image"
            src={
              messageDetails?.senderId === userProfile?._id
                ? userProfile?.avatar
                : selectedUser?.avatar
            }
          />
        </div>
      </div> */}
      <div className="chat-header">
        <time className="text-xs opacity-50">
          {new Date(messageDetails?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
      <div className="chat-bubble">{messageDetails?.message}</div>
    </div>
  );
};

export default Message;
