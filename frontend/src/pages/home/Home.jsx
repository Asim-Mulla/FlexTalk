import { useDispatch, useSelector } from "react-redux";
import ChatsContainer from "./ChatsContainer";
import UserSidebar from "./UserSidebar";
import { useEffect } from "react";
import {
  initializeSocket,
  setOnlineUsers,
} from "../../store/slices/socket/socketSlice";
import { setNewMessages } from "../../store/slices/message/messageSlice";
import "./UserSidebar.css";
import { useState } from "react";

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector(
    (state) => state.userReducer
  );
  const { socket } = useSelector((state) => state.socketReducer);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    dispatch(initializeSocket(userProfile?._id));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("onlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socket.on("newMessage", (newMessage) => {
      dispatch(setNewMessages(newMessage));
    });

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <div className="flex">
      <UserSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChatsContainer setIsOpen={setIsOpen} />
    </div>
  );
};

export default Home;
