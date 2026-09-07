import { useState } from "react";
import { useDispatch } from "react-redux";
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
        message: "Enquiry Sent Successfully",
        description: "Thank you for reaching out! Our travel concierge will reply within 24 hours.",
        duration: 3,
      });
    } catch (error) {
      const errMsg = typeof error === "string" ? error : error?.message || "Failed to submit enquiry";
      notification.error({
        message: "Submission Failed",
        description: errMsg,
        duration: 3,
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
          SEND AN ENQUIRY
        </div>
        <h1 className="bp-title">Contact Us</h1>
        <p className="bp-sub">
          Have a question about an itinerary or custom request? Send us a message and we'll reply by email.
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
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="bp-field">
            <label className="bp-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="bp-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
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
              placeholder="e.g. Custom itinerary for Bali or Swiss Alps"
              value={form.subject}
              onChange={handleChange}
              required
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
              placeholder="Tell us what you're planning, dates, or specific requirements..."
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="bp-submit" disabled={loading}>
            {loading ? "Sending enquiry..." : "Send Enquiry →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
