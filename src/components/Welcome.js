import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="auth-bg text-white">
      <div className="container text-center" style={{ maxWidth: '800px' }}>
        <h1 className="display-2 fw-bold mb-4">Learn Today, Lead Tomorrow.</h1>
        <p className="lead fs-4 mx-auto mb-5" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
          Unlock your potential with expert-led courses and personalized learning paths. Join a global community of learners and master new skills.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/signup" className="btn btn-light btn-lg text-primary">Get Started</Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">Existing User?</Link>
        </div>
      </div>
    </div>
  );
}