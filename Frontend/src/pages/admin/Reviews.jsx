import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { adminAPI } from "../../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await adminAPI.getAllReviews();
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setDeleting(id);
    try {
      const res = await adminAPI.deleteReview(id);
      if (res.data.success) {
        setReviews(reviews.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    } finally {
      setDeleting(null);
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Reviews</h1>
          <p>Manage patient reviews</p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="review-stars">{renderStars(review.stars)}</div>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(review._id)}
                    disabled={deleting === review._id}
                  >
                    {deleting === review._id ? "..." : "🗑️"}
                  </button>
                </div>
                <p className="review-comment">{review.comment || "No comment"}</p>
                <p className="review-date">{formatDate(review.createdAt)}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="no-data">No reviews found</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

