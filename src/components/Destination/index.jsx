import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axiosInstance from "../../store/axiosInstance";
import { createBooking } from "../../store/slice/bookingSlice";
import "./destinations.css";

export default function Destinations({ onSelectPackage, onViewPackage }) {
  const { isAuth } = useSelector((store) => store.authSlice);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [numOfPeople, setNumOfPeople] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchPackages = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("page", page);
      params.append("limit", 9);

      const res = await axiosInstance.get(`/packages?${params.toString()}`);
      const data = res.data;

      setPackages(data.packages || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    setTimeout(fetchPackages, 0);
  };

  const openPackageDetails = (pkg) => {
    setSelectedPackage(pkg);
    setBookingMessage("");
    if (onViewPackage) {
      onViewPackage(pkg);
    }
  };

  const closePackageDetails = () => {
    setSelectedPackage(null);
    setBookingMessage("");
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPackage) return;
    if (!isAuth) {
      message.warning("Please log in first to create a booking reservation.");
      return;
    }
    if (!bookingDate || !numOfPeople) {
      message.error("Please provide a travel date and number of people.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage("");

      await dispatch(
        createBooking({
          packageId: selectedPackage._id || selectedPackage.id,
          travelDate: bookingDate,
          numOfPeople: Number(numOfPeople),
        })
      ).unwrap();

      message.success("Booking request created successfully! View in your dashboard.");
      setBookingMessage("✓ Booking request created successfully.");
      setBookingDate("");
      setNumOfPeople(1);
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message || "Booking failed. Please try again.";
      message.error(msg);
      setBookingMessage(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const getImage = (pkg) => {
    if (!pkg) return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
    if (Array.isArray(pkg.image) && pkg.image.length > 0) return pkg.image[0];
    if (typeof pkg.image === "string" && pkg.image) return pkg.image;
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
  };

  return (
    <div className="destinations-page">
      <section className="dest-hero">
        <div className="eyebrow">
          <span className="eyebrow-dash" />
          ALL DESTINATIONS
        </div>
        <h1 className="dest-headline">Find your next trip</h1>
        <p className="dest-subtext">
          Browse curated packages across 40+ destinations. Search by
          location, filter by budget, and pick the one that fits.
        </p>
      </section>

      <section className="dest-filters">
        <form className="filters-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Beach">Beach</option>
            <option value="City">City</option>
            <option value="Adventure">Adventure</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Family">Family</option>
          </select>
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear
          </button>
        </form>
      </section>

      <section className="dest-results">
        {loading && <p className="dest-state">Loading packages...</p>}
        {error && <p className="dest-state dest-error">{error}</p>}
        {!loading && !error && packages.length === 0 && (
          <p className="dest-state">No packages found. Try a different search.</p>
        )}

        {selectedPackage && (
          <div className="pkg-detail-panel">
            <button type="button" className="back-link" onClick={closePackageDetails}>
              ← Back to packages
            </button>

            <div className="pkg-detail-grid">
              <div className="pkg-detail-image-wrap">
                <img
                  src={getImage(selectedPackage)}
                  alt={selectedPackage.title}
                  className="pkg-detail-image"
                />
                <span className="rating-badge">
                  {(selectedPackage.rating || 5.0).toFixed(1)}
                  <small>RATED</small>
                </span>
                {(selectedPackage.availablePackages ?? 0) <= 0 && (
                  <span className="sold-out-badge">Sold Out</span>
                )}
              </div>

              <div className="pkg-detail-info">
                <div className="pkg-detail-meta">
                  {selectedPackage.route || selectedPackage.location} · {selectedPackage.duration} days
                </div>
                <h2 className="pkg-detail-title">{selectedPackage.title}</h2>
                <p className="pkg-detail-description">{selectedPackage.description}</p>

                <div className="pkg-detail-price-row">
                  <div className="pkg-detail-price">
                    ${selectedPackage.price} <span>/ person</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={(selectedPackage.availablePackages ?? 0) <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPackage && onSelectPackage(selectedPackage);
                    }}
                  >
                    {(selectedPackage.availablePackages ?? 0) > 0 ? "Book this package" : "Sold Out"}
                  </button>
                </div>

                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  <h3 className="booking-form-title">Reserve this package</h3>
                  <label className="booking-field">
                    <span>Travel date</span>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </label>
                  <label className="booking-field">
                    <span>Number of people</span>
                    <input
                      type="number"
                      min="1"
                      max={selectedPackage.availablePackages || 10}
                      value={numOfPeople}
                      onChange={(e) => setNumOfPeople(Math.max(1, Number(e.target.value)))}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bookingLoading || (selectedPackage.availablePackages ?? 0) <= 0}
                  >
                    {bookingLoading ? "Creating booking..." : "Confirm Booking Reservation"}
                  </button>
                  {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
                </form>

                <div className="pkg-detail-facts">
                  <div className="fact">
                    <span className="fact-label">Location</span>
                    <span className="fact-value">{selectedPackage.location}</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Category</span>
                    <span className="fact-value">{selectedPackage.category || "General"}</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Duration</span>
                    <span className="fact-value">{selectedPackage.duration} days</span>
                  </div>
                  <div className="fact">
                    <span className="fact-label">Available Spots</span>
                    <span className="fact-value">
                      {(selectedPackage.availablePackages ?? 0) > 0
                        ? `${selectedPackage.availablePackages} Spots`
                        : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dest-grid">
          {packages.map((pkg) => {
            const isAvailable = (pkg.availablePackages ?? 0) > 0;
            return (
              <div
                className="dest-card"
                key={pkg._id}
                onClick={() => openPackageDetails(pkg)}
              >
                <div className="dest-image-wrap">
                  <img
                    src={getImage(pkg)}
                    alt={pkg.title}
                    className="dest-image"
                  />
                  <span className="rating-badge">
                    {(pkg.rating || 5.0).toFixed(1)}
                    <small>RATED</small>
                  </span>
                  {!isAvailable && (
                    <span className="sold-out-badge">Sold Out</span>
                  )}
                </div>

                <div className="dest-body">
                  <div className="dest-meta">
                    {pkg.route || pkg.location} · {pkg.duration} days
                  </div>
                  <h3 className="dest-title">{pkg.title}</h3>
                  <p className="dest-tagline">{pkg.description}</p>

                  <div className="dest-footer">
                    <div className="dest-price">
                      ${pkg.price} <span>/ person</span>
                    </div>
                    <button
                      className="btn-view"
                      disabled={!isAvailable}
                      onClick={(e) => {
                        e.stopPropagation();
                        openPackageDetails(pkg);
                      }}
                    >
                      {isAvailable ? "View Details" : "Sold Out"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && totalPages > 1 && (
          <div className="dest-pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}