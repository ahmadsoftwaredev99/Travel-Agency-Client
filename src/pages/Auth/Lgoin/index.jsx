import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSchema } from "../../../utils";
import { loginUser } from "../../../store/slice/authSlice";
import { message } from "antd";
import { getPackages } from "../../../store/slice/packageSlice";
import { getAllUser, getUser } from "../../../store/slice/userSlice";
import { getAllEnquiries, getMyEnquiry } from "../../../store/slice/contactSlice";
import { getAllBookings, getMyBookings } from "../../../store/slice/bookingSlice";
import "./login.css";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user_details = await loginSchema.validate(formData);
      const res = await dispatch(loginUser(user_details)).unwrap();

      // Trigger relevant data loading
      const requests = [
        dispatch(getPackages()),
        dispatch(getUser()),
        dispatch(getMyEnquiry()),
        dispatch(getMyBookings()),
      ];

      if (res?.role === "admin") {
        requests.push(
          dispatch(getAllUser()),
          dispatch(getAllEnquiries()),
          dispatch(getAllBookings())
        );
      }

      await Promise.allSettled(requests);

      message.success(`Welcome back, ${res?.name || "Traveler"}!`);

      if (res?.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/customer-dashboard", { replace: true });
      }
    } catch (error) {
      const errMsg = typeof error === "string" ? error : error?.message || "Invalid credentials";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <div className="tag">Welcome back</div>
        <h2>
          Your bookings, itineraries, and next departure — all in one place.
        </h2>
        <div className="auth-stub">
          <span>Passenger</span>
          <span>TE · Access</span>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="eyebrow">Sign in</div>
          <h1>Log in</h1>
          <p className="sub">Enter your details to access your dashboard.</p>

          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-solid" disabled={loading}>
            {loading ? "Logging in..." : "Log in →"}
          </button>

          <div className="auth-switch">
            Don't have an account? <Link to="/auth/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
