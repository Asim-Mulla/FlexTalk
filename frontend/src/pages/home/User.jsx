import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../store/slices/user/userSlice";
import "./UserSidebar.css";

const User = ({ user, setIsOpen }) => {
  const { selectedUser } = useSelector((state) => state.userReducer);
  const { onlineUsers } = useSelector((state) => state.socketReducer);
  const dispatch = useDispatch();

  const handleUserSelect = () => {
    dispatch(setSelectedUser(user));
  };

  const toggleUsersSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li
      onClick={() => {
        handleUserSelect();
        toggleUsersSidebar();
      }}
      className={`list-row hover:bg-gray-700 cursor-pointer ms-3 mb-1 user ${
        user._id === selectedUser?._id ? "bg-gray-700" : ""
      }`}
    >
      <div
        className={`avatar ${
          onlineUsers?.includes(user?._id) ? "avatar-online" : ""
        } `}
      >
        <div className="w-10 rounded-full">
          <img src={user?.avatar} />
        </div>
      </div>
      <div>
        <h2 className="line-clamp-1">{user?.name}</h2>
        <h3 className="text-xs font-semibold opacity-60">{user?.username}</h3>
      </div>
      {/* <button className="btn btn-square btn-ghost">
        <svg
          className="size-[1.2em]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
          >
            <path d="M6 3L20 12 6 21 6 3z"></path>
          </g>
        </svg>
      </button> */}
    </li>
  );
};

export default User;
