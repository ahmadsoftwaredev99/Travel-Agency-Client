import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            travel<span>ease</span>
          </div>
          <p className="footer-tagline">
            Inquiry-based travel packages, planned end to end. No hidden
            fees, no payment gateway required to reserve.
          </p>
        </div>

        <div className="footer-col">
          <a href="#">Packages</a>
          <a href="#">Destinations</a>
          <a href="#">Deals</a>
        </div>

        <div className="footer-col">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Careers</a>
        </div>

        <div className="footer-col">
          <a href="#">Login</a>
          <a href="#">Register</a>
          <a href="#">Help center</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 TravelEase</span>
        <span>Karachi, PK</span>
      </div>
    </footer>
  );
}