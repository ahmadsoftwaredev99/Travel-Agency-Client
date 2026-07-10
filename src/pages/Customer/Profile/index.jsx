import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import { LockOutlined } from "@ant-design/icons";
import { Card } from "antd";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // TODO: replace with your actual login API call
      // const res = await axios.post("/api/auth/login", formData);
      // save token to Redux + localStorage here

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-wrap">
      {/* <div className="auth-visual">
        <div className="tag">Welcome back</div>
        <h2>
          Your bookings, itineraries, and next departure — all in one place.
        </h2>
        <div className="auth-stub">
          <span>Passenger</span>
          <span>TE · Access</span>
        </div>
      </div> */}

      <div className="auth-form-side">
        <Card className="w-100">
          <form className="auth-card" onSubmit={handleSubmit}>
            <h1 className="text-center">Profile</h1>

            {error && <div className="auth-error">{error}</div>}

            <div className="field">
              <label>FULL NAME</label>
              <input
                name="fullName"
                type="text"
                placeholder=""
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder=""
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Phone</label>
              <input
                name="phone"
                type="number"
                placeholder=""
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>New Passoword</label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-solid">
              Edit Profile
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
