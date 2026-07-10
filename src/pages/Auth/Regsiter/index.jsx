import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input, message } from "antd";
import { registerSchema } from "../../../utils";
import "./register.css";
import { registerUser } from "../../../store/slice/authSlice";

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
      const res = await dispatch(registerUser(user_details)).unwrap();

      setFormData(initialState);

      navigate("/user-side");

      message.success("user register");
    } catch (error) {
      message.error(error.message);
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
            <Input
              name="name"
              type="text"
              placeholder="your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Phone</label>
            <Input
              name="phone"
              type="text"
              placeholder="+92 3XX XXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-solid" disabled={loading}>
            Create account →
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
