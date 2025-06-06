import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ProtectedRoutes from "./components/utilities/ProtectedRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getOtherUsersThunk,
  getUserProfileThunk,
} from "./store/slices/user/userThunk";

const App = () => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userReducer);

  const getUserProfile = async () => {
    const res = await dispatch(getUserProfileThunk());
  };

  const getOtherUsers = async () => {
    const res = await dispatch(getOtherUsersThunk());
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    getOtherUsers();
  }, [userProfile]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Home />
        </ProtectedRoutes>
      ),
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
