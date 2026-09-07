import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { registerSchema } from "../../../utils";
import { registerUser } from "../../../store/slice/authSlice";
import "./register.css";

const Register = () => {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user_details = await registerSchema.validate(formData);
      await dispatch(registerUser(user_details)).unwrap();

      setFormData(initialState);
      message.success("Account created successfully! Welcome aboard.");
      navigate("/customer-dashboard", { replace: true });
    } catch (error) {
      const errMsg = typeof error === "string" ? error : error?.message || "Registration failed";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-visual">
        <div className="tag">First time here</div>
        <h2>Create an account to start planning your next trip.</h2>
        <div className="auth-stub">
          <span>New Passenger</span>
          <span>TE · Enroll</span>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="eyebrow">Create account</div>
          <h1>Register</h1>
          <p className="sub">Takes less than a minute.</p>

          <div className="field">
            <label>Full name</label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Phone</label>
            <input
              name="phone"
              type="text"
              placeholder="03001234567 (11 digits)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="•••••••• (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-solid" disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <div className="auth-switch">
            Already have an account? <Link to="/auth/login">Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
