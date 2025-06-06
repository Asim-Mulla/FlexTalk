import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaKey, FaUser } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUserThunk } from "../../store/slices/user/userThunk";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      // Allow only lowercase letters, numbers, dashes, and underscores
      const filteredValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");

      setLoginData((prevData) => ({
        ...prevData,
        [name]: filteredValue,
      }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      toast.error("Invalid username or password");
      return;
    }

    const res = await dispatch(loginUserThunk(loginData));
    if (res?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[25rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-center text-2xl font-bold">
          Login to your account
        </h2>
        {/* <label className="input input-bordered w-full flex items-center gap-2">
          <MdMail />
          <input type="text" className="grow" placeholder="Email" />
        </label> */}
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            className="grow"
            onChange={handleLoginDataChange}
            placeholder="Username"
            name="username"
            value={loginData.username}
          />
        </label>
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaKey />
          <input
            type={showPassword ? "text" : "password"}
            className="grow"
            onChange={handleLoginDataChange}
            placeholder="Password"
            name="password"
            value={loginData.password}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </label>
        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#5f5dfe]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
