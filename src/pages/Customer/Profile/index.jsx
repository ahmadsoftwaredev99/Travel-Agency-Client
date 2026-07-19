import { LockOutlined } from "@ant-design/icons";
import { Card, Space, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./profile.css";

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

const Profile = () => {
  const [state, setState] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);

  const { user } = useSelector((store) => store.userSlice);

  useEffect(() => {
    if (user) {
      setState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Dispatch update profile action here
    console.log("Updated Data:", state);

    setIsEdit(false);
  };

  return (
    <div className="profile-wrap">
      <Card className="profile-card-shell">
        <form className="profile-card" onSubmit={handleSubmit}>
          <div className="profile-identity">
            <div className="profile-avatar">
              <LockOutlined className="profile-avatar-icon" />
            </div>

            <div>
              <h1 className="profile-title">Profile</h1>
              <div className="profile-subtitle">Account details</div>
            </div>
          </div>

          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={state.name}
              disabled={!isEdit}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={state.email}
              disabled={!isEdit}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              disabled={!isEdit}
              onChange={handleChange}
            />
          </div>

          {isEdit && (
            <div className="profile-field">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                value={state.password}
                placeholder="Leave blank to keep current"
                onChange={handleChange}
              />
            </div>
          )}

          {!isEdit ? (
            <button className="profile-submit" onClick={() => setIsEdit(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>

              <button type="submit" className="profile-submit">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;
