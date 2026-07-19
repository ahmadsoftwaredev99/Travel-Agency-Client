import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { contactSchema } from "../../../utils";
import { sendEnquiry } from "../../../store/slice/contactSlice";
import "./contact.css";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const valid_Enquiry = await contactSchema.validate(form);

      await dispatch(sendEnquiry(valid_Enquiry)).unwrap();

      setForm(initialState);

      notification.success({
        title: "Success",
        description: "Enquiry Send",
        duration: 2,
      });
    } catch (error) {
      notification.error({
        title: "Failed",
        description: error.message || "Something went wrong!",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bp-page">
      <div className="bp-card">
        <div className="bp-eyebrow">
          <span className="bp-eyebrow-dash" />
          Send an enquiry
        </div>
        <h1 className="bp-title">Contact us</h1>
        <p className="bp-sub">
          No account needed — we'll reply by email within a day.
        </p>

        <form className="bp-form" onSubmit={handleSubmit}>
          <div className="bp-field">
            <label className="bp-label" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              className="bp-input"
              name="name"
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="bp-field">
            <label className="bp-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="bp-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="bp-field">
            <label className="bp-label" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              className="bp-input"
              name="subject"
              type="text"
              placeholder="Question about Bali Escape"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="bp-field">
            <label className="bp-label" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="bp-input bp-textarea"
              name="message"
              placeholder="Tell us what you need..."
              rows={5}
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="bp-submit" disabled={loading}>
            Send enquiry <span className="bp-arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
