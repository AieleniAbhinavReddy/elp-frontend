import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    return (
        // WRAPPED: The new container div to handle centering
        <div className="dashboard-container">
            <div className="dashboard-hero">
                <h1 className="display-4 fw-bold mb-3">Welcome back, {user.firstName}!</h1>
                <p className="lead fs-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Your learning journey continues here. What would you like to do next?
                </p>
            </div>

            <div className="row justify-content-center g-4">
                <div className="col-md-5">
                    <div className="card h-100 text-center">
                        <div className="card-body p-5">
                            <i className="bi bi-collection-play-fill fs-1 text-primary mb-3"></i>
                            <h3 className="card-title fw-bold">Explore Courses</h3>
                            <p className="text-muted">Browse our full catalog of expert-led courses.</p>
                            <Link to="/courses" className="btn btn-primary mt-3">Browse Catalog</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card h-100 text-center">
                        <div className="card-body p-5">
                            <i className="bi bi-chat-dots-fill fs-1" style={{ color: 'var(--accent-green)' }}></i>
                            <h3 className="card-title fw-bold">AI Assistant</h3>
                            <p className="text-muted">Have a question? Get instant help from our AI tutor.</p>
                            <Link to="/chat" className="btn btn-success mt-3" style={{backgroundColor: 'var(--accent-green)', borderColor: 'var(--accent-green)'}}>
                                Start Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}