import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./contact.css";

const Contact = () => {
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
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="eyebrow">Send an enquiry</div>
          <h1>Contact Us</h1>
          <p className="sub">
            No account needed — we'll reply by email within a day.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="field">
            <label>FULL NAME</label>
            <input
              name="fullName"
              type="text"
              placeholder="Name"
              value={formData.fullName}
              onChange={handleChange}
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
            />
          </div>

          <div className="field">
            <label>Subject</label>
            <input
              name="subject"
              type="text"
              placeholder="Question about Destination"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label>Message</label>
            <input
              name="message"
              type="text"
              placeholder="Tell us what you need..."
              value={formData.message} 
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-solid">
            Submit enquiry →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;