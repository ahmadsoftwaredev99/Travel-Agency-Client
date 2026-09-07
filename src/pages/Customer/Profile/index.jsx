import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, KeyOutlined } from "@ant-design/icons";
import { Card, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMyProfile, changePassword, getUser } from "../../../store/slice/userSlice";
import "./profile.css";

const initialState = {
  name: "",
  email: "",
  phone: "",
  oldPassword: "",
  newPassword: "",
};

const Profile = () => {
  const [state, setState] = useState(initialState);
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user } = useSelector((store) => store.userSlice);
  const authUser = useSelector((store) => store.authSlice.user);
  const activeUser = user || authUser;
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeUser) {
      setState((prev) => ({
        ...prev,
        name: activeUser.name || "",
        email: activeUser.email || "",
        phone: activeUser.phone || "",
        oldPassword: "",
        newPassword: "",
      }));
    }
  }, [activeUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update basic profile info
      await dispatch(
        updateMyProfile({
          name: state.name.trim(),
          phone: state.phone.trim(),
        })
      ).unwrap();

      // 2. Change password if requested
      if (isChangePass && state.newPassword) {
        if (!state.oldPassword) {
          message.error("Please provide your current password to set a new password.");
          setSaving(false);
          return;
        }
        await dispatch(
          changePassword({
            oldPassword: state.oldPassword,
            newPassword: state.newPassword,
          })
        ).unwrap();
        message.success("Password updated successfully!");
      }

      await dispatch(getUser()).unwrap();
      message.success("Profile updated successfully!");
      setIsEdit(false);
      setIsChangePass(false);
      setState((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    } catch (err) {
      const errMsg = typeof err === "string" ? err : err?.message || "Failed to update profile";
      message.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setIsChangePass(false);
    if (activeUser) {
      setState({
        name: activeUser.name || "",
        email: activeUser.email || "",
        phone: activeUser.phone || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  return (
    <div className="profile-wrap">
      <Card className="profile-card-shell">
        <form className="profile-card" onSubmit={handleSubmit}>
          <div className="profile-identity">
            <div className="profile-avatar">
              <span className="profile-avatar-initial">
                {activeUser?.name?.charAt(0)?.toUpperCase() || "T"}
              </span>
            </div>

            <div>
              <span className="profile-eyebrow">TRAVELER PROFILE</span>
              <h1 className="profile-title">{activeUser?.name || "Passenger"}</h1>
              <div className="profile-subtitle">
                Role: <strong>{activeUser?.role?.toUpperCase() || "USER"}</strong> · Account Active
              </div>
            </div>
          </div>

          <div className="profile-field">
            <label>
              <UserOutlined /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={state.name}
              disabled={!isEdit}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="profile-field">
            <label>
              <MailOutlined /> Email Address (Read-only)
            </label>
            <input
              type="email"
              name="email"
              value={state.email}
              disabled={true}
              title="Email address cannot be changed"
            />
          </div>

          <div className="profile-field">
            <label>
              <PhoneOutlined /> Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={state.phone}
              disabled={!isEdit}
              onChange={handleChange}
              placeholder="03001234567"
            />
          </div>

          {isEdit && (
            <div className="profile-password-toggle">
              <button
                type="button"
                className="profile-toggle-btn"
                onClick={() => setIsChangePass(!isChangePass)}
              >
                <KeyOutlined /> {isChangePass ? "Cancel Password Change" : "Change Password?"}
              </button>
            </div>
          )}

          {isEdit && isChangePass && (
            <div className="profile-password-block">
              <div className="profile-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={state.oldPassword}
                  placeholder="Enter current password"
                  onChange={handleChange}
                  required={isChangePass}
                />
              </div>

              <div className="profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={state.newPassword}
                  placeholder="Enter new password (min 6 chars)"
                  onChange={handleChange}
                  required={isChangePass}
                />
              </div>
            </div>
          )}

          {!isEdit ? (
            <button
              type="button"
              className="profile-submit"
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button type="submit" className="profile-submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Profile;
