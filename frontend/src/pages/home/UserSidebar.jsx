import { logoutUserThunk } from "../../store/slices/user/userThunk";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose, IoSearch } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import User from "./User";
import "./UserSidebar.css";

const UserSidebar = ({ isOpen, setIsOpen }) => {
  const { userProfile, otherUsers, contactedUsers } = useSelector(
    (state) => state.userReducer
  );
  const [searchUser, setSearchUser] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await dispatch(logoutUserThunk());
    if (res?.payload?.success) {
      navigate("/login");
    }
  };

  const toggleUsersSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        className={`usersSidebar ${
          isOpen ? "open" : ""
        } bg-base-100 sm:min-w-[20rem] min-w-[15rem] w-full h-screen flex flex-col `}
      >
        <div className="flex justify-between items-center p-3">
          <h1 className="text-2xl font-bold text-[#5f5dfe]">FlexTalk</h1>
          <button
            className="toggleSidebarButton text-2xl"
            onClick={toggleUsersSidebar}
          >
            <IoClose />
          </button>
        </div>
        <div className="px-3">
          <label className="input">
            <IoSearch />
            <input
              type="search"
              required
              placeholder="Search user"
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </label>
        </div>
        <div className="h-full overflow-y-scroll mt-3">
          {!searchUser && !contactedUsers?.length ? (
            <span className="ms-3 font-semibold opacity-60">
              Suggested for you
            </span>
          ) : null}
          <ul className="list bg-base-100 rounded-box shadow-md">
            {!searchUser && !contactedUsers?.length
              ? otherUsers
                  ?.slice(0, 3)
                  .map((user) => (
                    <User user={user} key={user._id} setIsOpen={setIsOpen} />
                  ))
              : !searchUser
              ? contactedUsers?.map((user) => (
                  <User user={user} key={user._id} setIsOpen={setIsOpen} />
                ))
              : otherUsers
                  ?.filter(
                    (user) =>
                      !searchUser ||
                      user.name
                        .toLowerCase()
                        .includes(searchUser.toLowerCase()) ||
                      user.username.includes(searchUser)
                  )
                  .map((user) => (
                    <User user={user} key={user._id} setIsOpen={setIsOpen} />
                  ))}
          </ul>
        </div>
        <div className="h-[3rem] m-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="avatar avatar-online me-3">
                <div className="w-12 rounded-full">
                  <img src={userProfile?.avatar} />
                </div>
              </div>
              <div>
                <h2 className="line-clamp-1">{userProfile?.name}</h2>
                <h3 className="text-xs font-semibold opacity-60">
                  {userProfile?.username}
                </h3>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-primary btn-sm">
              <FiLogOut />
              LogOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
