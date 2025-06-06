import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaKey, FaUser } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUserThunk,
  registerUserThunk,
} from "../../store/slices/user/userThunk";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
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

  const handleSignupDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "username") {
      // Allow only lowercase letters, numbers, dashes, and underscores
      const filteredValue = value.toLowerCase().replace(/[^a-z0-9_-]/g, "");

      setSignupData((prevData) => ({
        ...prevData,
        [name]: filteredValue,
      }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const dispatch = useDispatch();

  const handleSignup = async () => {
    const { name, username, password, confirmPassword } = signupData;

    if (!name || !username || !password || !confirmPassword) {
      toast.error("All fields are resuired");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Please check the 'confirmPassword'");
      return;
    }

    const res = await dispatch(registerUserThunk(signupData));
    if (res?.payload?.success) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[25rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-center text-2xl font-bold">Please sign up</h2>
        {/* <label className="input input-bordered w-full flex items-center gap-2">
          <MdMail />
          <input type="text" className="grow" placeholder="Email" />
        </label> */}
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            className="grow"
            onChange={handleSignupDataChange}
            placeholder="Enter your full name"
            name="name"
            title="Enter your full name"
            value={signupData.name}
          />
        </label>
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaUser />
          <input
            type="text"
            className="grow"
            onChange={handleSignupDataChange}
            placeholder="Username"
            pattern="^[a-z0-9_-]+$"
            title="Only lowercase letters, numbers, hyphens (-), and underscores (_) are allowed."
            name="username"
            value={signupData.username}
          />
        </label>
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaKey />
          <input
            type={showPassword ? "text" : "password"}
            className="grow"
            onChange={handleSignupDataChange}
            placeholder="Password"
            name="password"
            title="Create a strong password atleast 8 characters"
            value={signupData.password}
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
        <label className="input input-bordered w-full flex items-center gap-2">
          <FaKey />
          <input
            type={showPassword ? "text" : "password"}
            className="grow"
            onChange={handleSignupDataChange}
            placeholder="Confirm password"
            name="confirmPassword"
            title="Re-enter password"
            value={signupData.confirmPassword}
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
        <div className="flex gap-3">
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            defaultChecked
            onClick={handleSignupDataChange}
            className="radio bg-blue-100 border-blue-300 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600"
          />
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            onClick={handleSignupDataChange}
            className="radio bg-pink-100 border-pink-300 checked:bg-pink-200 checked:text-pink-600 checked:border-pink-600"
          />
          <label htmlFor="female">Female</label>
        </div>
        <button onClick={handleSignup} className="btn btn-primary">
          Signup
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#5f5dfe]">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
