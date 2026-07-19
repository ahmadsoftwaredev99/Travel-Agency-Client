import React from "react";
import "./Home.css";

const packages = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.9,
    route: "KHI → DPS",
    duration: "6 days",
    title: "Bali Escape",
    tagline: "Flights + resort + island tour",
    price: 780,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
    rating: 4.8,
    route: "KHI → IST",
    duration: "5 days",
    title: "Istanbul Weekender",
    tagline: "Old city stays + Bosphorus cruise",
    price: 540,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    rating: 5.0,
    route: "KHI → ZRH",
    duration: "7 days",
    title: "Swiss Alps Trail",
    tagline: "Scenic rail + mountain lodges",
    price: 1240,
  },
];
 
export default function HomePage() {
  return (
    <div className="home-page">
      
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="eyebrow-dash" />
            DEPARTURES WORLDWIDE
          </div>
 
          <h1 className="headline">
            Book your <em>next journey</em>
            <br />
            before the gate closes.
          </h1>
 
          <p className="subtext">
            Curated travel packages across 40+ destinations — flights, stays,
            and itineraries planned so you don't have to.
          </p>
 
          <div className="cta-row">
            <button className="btn btn-primary">Browse packages</button>
            <button className="btn btn-outline">How it works</button>
          </div>
        </div>
      </section>
 
      
      <section className="popular">
        <div className="popular-head">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dash" />
              FEATURED THIS MONTH
            </div>
            <h2 className="popular-title">Popular packages</h2>
          </div>
          <a href="#" className="view-all">View all packages</a>
        </div>
 
        <div className="popular-grid">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.id}>
              <div className="package-image-wrap">
                <img src={pkg.image} alt={pkg.title} className="package-image" />
                <span className="rating-badge">
                  {pkg.rating.toFixed(1)}
                  <small>RATED</small>
                </span>
              </div>
 
              <div className="package-body">
                <div className="package-meta">
                  {pkg.route} · {pkg.duration}
                </div>
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-tagline">{pkg.tagline}</p>
 
                <div className="package-footer">
                  <div className="package-price">
                    ${pkg.price} <span>/ person</span>
                  </div>
                  <button className="btn-view">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}