import React from 'react';
import { Link } from 'react-router-dom';
import videoBg from '../assets/background_video.mp4'; // Import the video
import '../App.css';

export default function Welcome() {
  return (
    <div className="welcome-container">
      {/* The video will play muted in the background */}
      <video autoPlay loop muted className="background-video">
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* This overlay adds a dark tint so the white text is readable */}
      <div className="content-overlay">
        <div className="container text-center" style={{ maxWidth: '800px' }}>
          <h1 className="display-2 fw-bold mb-4" style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.5)' }}>
            Learn Today, Lead Tomorrow.
          </h1>
          <p className="lead fs-4 mx-auto mb-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Unlock your potential with expert-led courses and personalized learning paths. Join a global community of learners and master new skills.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-light btn-lg text-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">Existing User?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}