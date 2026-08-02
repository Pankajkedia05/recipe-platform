import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <div className="section-card" style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div className="page-heading">
          <div>
            <h1>Your profile</h1>
            <p className="text-muted">Manage your account and keep your recipe activity at a glance.</p>
          </div>
          <span className="status-pill">Member</span>
        </div>

        {user ? (
          <div className="card-content" style={{ padding: 0 }}>
            <div className="list-box">
              <div className="list-item">
                <span>Username</span>
                <strong>{user.username}</strong>
              </div>
              <div className="list-item">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div className="list-item">
                <span>Role</span>
                <strong>Recipe creator</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="error-message">Please log in to view your profile.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
