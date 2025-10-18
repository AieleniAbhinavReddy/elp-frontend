import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll

  // Effect to add and remove the scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if page is scrolled more than 10px, else false
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Conditionally add the 'scrolled' class to the navbar
  const navbarClass = `navbar navbar-expand-lg fixed-top main-navbar ${isScrolled ? 'scrolled' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to={isAuthenticated ? "/dashboard" : "/"}>
          SkillBase
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
              null
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}