import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Input, message } from "antd";
import { createBooking } from "../../../store/slice/bookingSlice";
import "./package.css";

const DESTINATIONS = ["All", "Asia", "Europe", "Middle East", "America", "Africa"];
const DURATIONS = ["All", "1–3 days", "4–7 days", "8+ days"];
const SORTS = ["Recommended", "Price: Low to High", "Price: High to Low", "Duration"];

function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tp-pill ${active ? "tp-pill--active" : ""}`}
    >
      {label}
    </button>
  );
}

function PackageCard({ pkg, onOpenDetails, onQuickBook }) {
  const imageUrl = Array.isArray(pkg.image)
    ? pkg.image[0] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
    : pkg.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";

  const isAvailable = (pkg.availablePackages ?? 0) > 0;

  return (
    <article className="tp-card">
      <div
        className="tp-card-media"
        style={{
          backgroundImage: `linear-gradient(
            180deg,
            rgba(10,10,15,0) 40%,
            rgba(10,10,15,0.65) 100%
          ), url(${imageUrl})`,
        }}
      >
        <span className="tp-rating-badge">
          {(pkg.rating || 5.0).toFixed(1)}
          <small>★</small>
        </span>
        <span className={`tp-availability-badge ${isAvailable ? "is-available" : "is-sold-out"}`}>
          {isAvailable ? `${pkg.availablePackages} spots left` : "Sold Out"}
        </span>
      </div>

      <div className="tp-card-body">
        <div className="tp-card-top">
          <span className="tp-card-route">{pkg.route || pkg.location}</span>
          <span className="tp-card-duration">{pkg.duration} Days</span>
        </div>
        <h3 className="tp-card-title">{pkg.title}</h3>
        <p className="tp-card-desc">{pkg.description}</p>

        <div className="tp-card-divider" />

        <div className="tp-card-footer">
          <span className="tp-card-price">
            ${pkg.price} <small>/ person</small>
          </span>
          <div className="tp-card-actions">
            <button
              type="button"
              className="tp-btn-details"
              onClick={() => onOpenDetails(pkg)}
            >
              Details
            </button>
            <button
              type="button"
              className="tp-btn-view"
              disabled={!isAvailable}
              onClick={() => onQuickBook(pkg)}
            >
              {isAvailable ? "Book Now" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TravelPackages() {
  const [destination, setDestination] = useState("All");
  const [duration, setDuration] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(2500);

  // Modal states
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [numOfPeople, setNumOfPeople] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { tourPackage, isLoading } = useSelector((store) => store.packageSlice);
  const dispatch = useDispatch();

  // Filter and sort logic
  const filteredPackages = useMemo(() => {
    if (!tourPackage || !Array.isArray(tourPackage)) return [];

    return tourPackage
      .filter((pkg) => {
        // Destination filter
        if (destination !== "All") {
          const matchLoc = pkg.location?.toLowerCase().includes(destination.toLowerCase());
          const matchCat = pkg.category?.toLowerCase().includes(destination.toLowerCase());
          const matchRoute = pkg.route?.toLowerCase().includes(destination.toLowerCase());
          if (!matchLoc && !matchCat && !matchRoute) return false;
        }

        // Price filter
        if (pkg.price > price) return false;

        // Duration filter
        if (duration !== "All") {
          const d = Number(pkg.duration) || 0;
          if (duration === "1–3 days" && (d < 1 || d > 3)) return false;
          if (duration === "4–7 days" && (d < 4 || d > 7)) return false;
          if (duration === "8+ days" && d < 8) return false;
        }

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = pkg.title?.toLowerCase().includes(q);
          const matchDesc = pkg.description?.toLowerCase().includes(q);
          const matchLoc = pkg.location?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "Price: Low to High") return a.price - b.price;
        if (sort === "Price: High to Low") return b.price - a.price;
        if (sort === "Duration") return (b.duration || 0) - (a.duration || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [tourPackage, destination, duration, price, search, sort]);

  const handleOpenDetails = (pkg) => {
    setSelectedPkg(pkg);
    setIsDetailModalOpen(true);
  };

  const handleQuickBook = (pkg) => {
    setSelectedPkg(pkg);
    setTravelDate("");
    setNumOfPeople(1);
    setIsBookModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPkg) return;

    if (!travelDate) {
      message.error("Please select a travel date.");
      return;
    }

    if (numOfPeople < 1 || numOfPeople > (selectedPkg.availablePackages || 1)) {
      message.error(`Please select between 1 and ${selectedPkg.availablePackages} guests.`);
      return;
    }

    setBookingLoading(true);
    try {
      await dispatch(
        createBooking({
          packageId: selectedPkg._id,
          travelDate,
          numOfPeople: Number(numOfPeople),
        })
      ).unwrap();

      message.success("Booking submitted successfully! Check 'My Bookings'.");
      setIsBookModalOpen(false);
      setIsDetailModalOpen(false);
    } catch (err) {
      message.error(typeof err === "string" ? err : err?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const resetFilters = () => {
    setDestination("All");
    setDuration("All");
    setPrice(2500);
    setSearch("");
    setSort("Recommended");
  };

  return (
    <div className="tp-page">
      <div className="tp-container">
        {/* Sidebar Filters */}
        <aside className="tp-sidebar">
          <div className="tp-sidebar-head">
            <span className="tp-sidebar-dash" />
            <h2>Filters</h2>
          </div>

          <div className="tp-filter-group">
            <h3>Search</h3>
            <Input
              placeholder="Search destination, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="tp-search-input"
            />
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
            <h3>Max Price — ${price}</h3>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="tp-slider"
            />
            <div className="tp-price-labels">
              <span>$200</span>
              <span>$3000</span>
            </div>
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

          <button type="button" className="tp-btn-reset" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        {/* Results */}
        <main className="tp-results">
          <div className="tp-results-head">
            <span className="tp-results-count">
              Showing {filteredPackages.length} of {tourPackage?.length || 0} packages
            </span>

            <div className="tp-sort-row">
              <span className="tp-sort-label">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="tp-sort-select"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="tp-loading-state">Loading packages...</div>
          ) : filteredPackages.length > 0 ? (
            <div className="tp-card-grid">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  onOpenDetails={handleOpenDetails}
                  onQuickBook={handleQuickBook}
                />
              ))}
            </div>
          ) : (
            <div className="tp-empty-state">
              <h3>No matching packages found</h3>
              <p>Try broadening your filters or search criteria.</p>
              <button type="button" className="tp-btn-reset" onClick={resetFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Package Details Modal */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={720}
        centered
        className="tp-modal"
      >
        {selectedPkg && (
          <div className="tp-modal-detail">
            <div
              className="tp-modal-image"
              style={{
                backgroundImage: `url(${
                  Array.isArray(selectedPkg.image)
                    ? selectedPkg.image[0]
                    : selectedPkg.image
                })`,
              }}
            >
              <span className="tp-modal-route">{selectedPkg.route || selectedPkg.location}</span>
            </div>

            <div className="tp-modal-content">
              <div className="tp-modal-header">
                <div>
                  <span className="tp-eyebrow-text">{selectedPkg.category || "Tour Package"}</span>
                  <h2>{selectedPkg.title}</h2>
                </div>
                <div className="tp-modal-price">
                  ${selectedPkg.price} <span>/ person</span>
                </div>
              </div>

              <div className="tp-modal-meta-grid">
                <div className="tp-meta-item">
                  <span className="label">Location</span>
                  <span className="value">{selectedPkg.location}</span>
                </div>
                <div className="tp-meta-item">
                  <span className="label">Duration</span>
                  <span className="value">{selectedPkg.duration} Days</span>
                </div>
                <div className="tp-meta-item">
                  <span className="label">Available Spots</span>
                  <span className="value">{selectedPkg.availablePackages}</span>
                </div>
                <div className="tp-meta-item">
                  <span className="label">Rating</span>
                  <span className="value">★ {(selectedPkg.rating || 5.0).toFixed(1)}</span>
                </div>
              </div>

              <div className="tp-modal-description">
                <h3>About this itinerary</h3>
                <p>{selectedPkg.description}</p>
              </div>

              <div className="tp-modal-actions">
                <button
                  type="button"
                  className="tp-btn-cancel"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tp-btn-book"
                  disabled={(selectedPkg.availablePackages ?? 0) <= 0}
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleQuickBook(selectedPkg);
                  }}
                >
                  {(selectedPkg.availablePackages ?? 0) > 0 ? "Book This Package →" : "Sold Out"}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Booking Form Modal */}
      <Modal
        open={isBookModalOpen}
        onCancel={() => setIsBookModalOpen(false)}
        footer={null}
        width={520}
        centered
        className="tp-modal"
      >
        {selectedPkg && (
          <div className="tp-modal-booking">
            <div className="tp-book-header">
              <span className="tp-eyebrow-text">Reserve Your Departure</span>
              <h2>Book {selectedPkg.title}</h2>
              <p>No upfront charge. We will confirm your reservation shortly.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="tp-book-form">
              <div className="tp-book-field">
                <label>Travel Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                />
              </div>

              <div className="tp-book-field">
                <label>Number of People (Max {selectedPkg.availablePackages})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedPkg.availablePackages || 10}
                  value={numOfPeople}
                  onChange={(e) => setNumOfPeople(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              <div className="tp-book-summary">
                <div className="summary-row">
                  <span>Price per person</span>
                  <span>${selectedPkg.price}</span>
                </div>
                <div className="summary-row">
                  <span>Guests</span>
                  <span>× {numOfPeople}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Estimated Total</span>
                  <span>${selectedPkg.price * numOfPeople}</span>
                </div>
              </div>

              <div className="tp-modal-actions">
                <button
                  type="button"
                  className="tp-btn-cancel"
                  onClick={() => setIsBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tp-btn-book"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Confirming..." : "Confirm Booking →"}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
