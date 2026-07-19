import React from "react";
import "./about.css";

const stats = [
  { value: "40+", label: "Destinations covered" },
  { value: "1,200+", label: "Trips planned" },
  { value: "4.8", label: "Average traveler rating" },
  { value: "0%", label: "Hidden fees, ever" },
];

const values = [
  {
    title: "Planned end to end",
    text: "Flights, stays, and day-by-day itineraries — sorted before you even pack a bag.",
  },
  {
    title: "No pressure booking",
    text: "Every trip starts as an inquiry. You reserve your spot, we confirm the details, no card charged upfront.",
  },
  {
    title: "Real people, real support",
    text: "A dedicated team reviews every request personally — not a bot reading a script.",
  },
];

export default function About() {
  return (
    <div className="about-page">
      
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="eyebrow">
            <span className="eyebrow-dash" />
            ABOUT TRAVELEASE
          </div>
          <h1 className="about-headline">
            We plan the trip, <em>you enjoy the journey.</em>
          </h1>
          <p className="about-subtext">
            TravelEase started with one idea — booking a holiday shouldn't
            feel like a second job. We curate flights, stays, and
            itineraries across 40+ destinations, so you get a trip that's
            actually planned properly, not just a stack of open browser tabs.
          </p>
        </div>
      </section>

      
      <section className="about-stats">
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="about-story">
        <div className="story-grid">
          <div className="story-copy">
            <div className="eyebrow">
              <span className="eyebrow-dash" />
              OUR STORY
            </div>
            <h2 className="story-title">Built by people tired of messy travel planning</h2>
            <p>
              Every trip we sell is one we'd take ourselves — vetted stays,
              honest pricing, and routes that actually make sense. No
              payment gateway pressure, no fine print. You send an inquiry,
              we build the plan, you decide.
            </p>
            <p>
              What began as a way to help friends book smarter holidays has
              grown into a full curated marketplace of destinations, each
              itinerary planned by someone who has actually been there.
            </p>
          </div>
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
              alt="Travel planning"
            />
          </div>
        </div>
      </section>

      
      <section className="about-values">
        <div className="values-head">
          <div className="eyebrow">
            <span className="eyebrow-dash" />
            WHY TRAVELEASE
          </div>
          <h2 className="values-title">What makes a trip easy</h2>
        </div>

        <div className="values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="about-cta">
        <h2>Ready to plan your next journey?</h2>
        <p>Browse curated packages or send us your travel dates — we'll take it from there.</p>
        <div className="about-cta-row">
          <button className="btn btn-primary">Browse packages</button>
          <button className="btn btn-outline">Contact us</button>
        </div>
      </section>
    </div>
  );
}