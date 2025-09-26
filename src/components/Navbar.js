import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top main-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to={isAuthenticated ? "/dashboard" : "/"}>
          ModernLearn
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-courses">My Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/chat">AI Assistant</Link>
                </li>
                {/* --- ADDED THIS LINK FOR THE COMPILER --- */}
                <li className="nav-item">
                  <Link className="nav-link" to="/compiler">Online Compiler</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {isAuthenticated && (
              <div className="me-3">
                <ThemeToggle />
              </div>
            )}
            
            {isAuthenticated ? (
              <>
                <span className="navbar-text me-3">Hello, {user?.firstName}</span>
                <button className="btn btn-outline-primary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-light btn-sm me-2" to="/login">Log In</Link>
                <Link className="btn btn-primary btn-sm" to="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}