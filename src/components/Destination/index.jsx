import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../store/axiosInstance";
import "./destinations.css";

const API_BASE = "http://localhost:5000/api/packages";

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

      const res = await fetch(`${API_BASE}?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setPackages(data.packages || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
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
      setBookingMessage("Please log in first to create a booking.");
      return;
    }
    if (!bookingDate || !numOfPeople) {
      setBookingMessage("Please add a travel date and number of people.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage("");

      const res = await axiosInstance.post("/bookings", {
        packageId: selectedPackage._id || selectedPackage.id,
        travelDate: bookingDate,
        numOfPeople: Number(numOfPeople),
      });

      if (res.status === 201) {
        setBookingMessage("Booking request created successfully.");
        setBookingDate("");
        setNumOfPeople(1);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Booking failed. Please try again.";
      setBookingMessage(message);
    } finally {
      setBookingLoading(false);
    }
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
                  src={
                    selectedPackage.images && selectedPackage.images.length > 0
                      ? selectedPackage.images[0]
                      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                  }
                  alt={selectedPackage.title}
                  className="pkg-detail-image"
                />
                <span className="rating-badge">
                  {(selectedPackage.rating || 0).toFixed(1)}
                  <small>RATED</small>
                </span>
                {!selectedPackage.availability && (
                  <span className="sold-out-badge">Not Available</span>
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
                    disabled={!selectedPackage.availability}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPackage && onSelectPackage(selectedPackage);
                    }}
                  >
                    {selectedPackage.availability ? "Book this package" : "Sold Out"}
                  </button>
                </div>

                <form className="booking-form" onSubmit={handleBookingSubmit}>
                  <h3 className="booking-form-title">Book this package</h3>
                  <label className="booking-field">
                    <span>Travel date</span>
                    <input
                      type="date"
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
                      value={numOfPeople}
                      onChange={(e) => setNumOfPeople(e.target.value)}
                      required
                    />
                  </label>
                  <button type="submit" className="btn btn-primary" disabled={bookingLoading || !selectedPackage.availability}>
                    {bookingLoading ? "Creating booking..." : "Confirm booking"}
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
                    <span className="fact-label">Availability</span>
                    <span className="fact-value">{selectedPackage.availability ? "Open" : "Closed"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="dest-grid">
          {packages.map((pkg) => (
            <div
              className="dest-card"
              key={pkg._id}
              onClick={() => openPackageDetails(pkg)}
            >
              <div className="dest-image-wrap">
                <img
                  src={
                    pkg.images && pkg.images.length > 0
                      ? pkg.images[0]
                      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80"
                  }
                  alt={pkg.title}
                  className="dest-image"
                />
                <span className="rating-badge">
                  {(pkg.rating || 0).toFixed(1)}
                  <small>RATED</small>
                </span>
                {!pkg.availability && (
                  <span className="sold-out-badge">Not Available</span>
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
                    disabled={!pkg.availability}
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onSelectPackage && onSelectPackage(pkg);
                    }}
                  >
                    {pkg.availability ? "Select" : "Sold Out"}
                  </button>
                </div>
              </div>
            </div>
          ))}
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