import { useState } from "react";
import { useSelector } from "react-redux";
import "./package.css";

const DESTINATIONS = ["Asia", "Europe", "Middle East"];
const DURATIONS = ["3–5 days", "6–8 days", "9+ days"];
const SORTS = ["Popular", "Price ↑", "Rating"];

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`tp-pill ${active ? "tp-pill--active" : ""}`}
    >
      {label}
    </button>
  );
}

function PackageCard({ pkg }) {
  return (
    <article className="tp-card">
      <div
        className="tp-card-media"
        style={{
          backgroundImage: `linear-gradient(
      180deg,
      rgba(10,10,15,0) 40%,
      rgba(10,10,15,0.5) 100%
    ), url(${pkg.image})`,
        }}
      />

      <div className="tp-card-body">
        <span className="tp-card-route">{pkg.route}</span>
        <h3 className="tp-card-title">{pkg.title}</h3>
        <p className="tp-card-desc">{pkg.desc}</p>

        <div className="tp-card-divider" />

        <div className="tp-card-footer">
          <span className="tp-card-price">
            {pkg.price} <small>/ person</small>
          </span>
          <button className="tp-btn-view">View</button>
        </div>
      </div>
    </article>
  );
}
export default function TravelPackages() {
  const [destination, setDestination] = useState("Asia");
  const [duration, setDuration] = useState("6–8 days");
  const [rating, setRating] = useState("4+");
  const [sort, setSort] = useState("Popular");
  const [price, setPrice] = useState(600);
  const { tourPackage } = useSelector((store) => store.packageSlice);

  console.log("tourPackage", tourPackage);

  return (
    <div className="tp-page">
      <div className="tp-container">
        {/* Sidebar */}
        <aside className="tp-sidebar">
          <div className="tp-sidebar-head">
            <span className="tp-sidebar-dash" />
            <h2>Filter</h2>
          </div>

          <div className="tp-filter-group">
            <h3>Destination</h3>
            <div className="tp-pill-row">
              {DESTINATIONS.map((d) => (
                <Pill
                  key={d}
                  label={d}
                  active={destination === d}
                  onClick={() => setDestination(d)}
                />
              ))}
            </div>
          </div>

          <div className="tp-filter-group">
            <h3>Price range — up to ${price}</h3>
            <input
              type="range"
              min="0"
              max="2000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="tp-slider"
            />
          </div>

          <div className="tp-filter-group">
            <h3>Duration</h3>
            <div className="tp-pill-row">
              {DURATIONS.map((d) => (
                <Pill
                  key={d}
                  label={d}
                  active={duration === d}
                  onClick={() => setDuration(d)}
                />
              ))}
            </div>
          </div>
          <button className="tp-btn-apply">Apply filters</button>
        </aside>
        {/* Results */}
        <main className="tp-results">
          <div className="tp-results-head">
            <span className="tp-results-count">
              Showing {tourPackage.length} of packages
            </span>
          </div>
          <div className="tp-card-grid">
            {tourPackage.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
