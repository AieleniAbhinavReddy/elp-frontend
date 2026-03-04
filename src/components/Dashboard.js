import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyCourses } from "../services/coursesApi";

export default function Dashboard() {
    const { user, token } = useAuth();
    const [myCoursesCount, setMyCoursesCount] = useState(0);

    useEffect(() => {
        const loadMyCourses = async () => {
            try {
                const courses = await getMyCourses(token);
                setMyCoursesCount(courses.length);
            } catch {
                setMyCoursesCount(0);
            }
        };

        loadMyCourses();
    }, [token]);

    if (!user) return <div>Loading...</div>;

    return (
        // WRAPPED: The new container div to handle centering
        <div className="dashboard-container">
            <div className="dashboard-hero">
                <h1 className="display-4 fw-bold mb-3">Welcome back, {user.firstName}!</h1>
                <p className="lead fs-5 dashboard-subtitle">
                    Your learning journey continues here. What would you like to do next?
                </p>
                <p className="mb-0 text-muted">You are enrolled in {myCoursesCount} course{myCoursesCount === 1 ? '' : 's'}.</p>
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
                            <i className="bi bi-chat-dots-fill fs-1 text-success"></i>
                            <h3 className="card-title fw-bold">AI Assistant</h3>
                            <p className="text-muted">Have a question? Get instant help from our AI tutor.</p>
                            <Link to="/chat" className="btn btn-success mt-3">
                                Start Chat
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card h-100 text-center">
                        <div className="card-body p-5">
                            <i className="bi bi-journal-check fs-1 text-primary mb-3"></i>
                            <h3 className="card-title fw-bold">My Learning</h3>
                            <p className="text-muted">Track progress, continue lessons, and complete your enrolled courses.</p>
                            <Link to="/my-learning" className="btn btn-outline-primary mt-3">Open My Learning</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card h-100 text-center">
                        <div className="card-body p-5">
                            <i className="bi bi-braces fs-1 mb-3" style={{ color: '#7c3aed' }}></i>
                            <h3 className="card-title fw-bold">DSA Practice</h3>
                            <p className="text-muted">Sharpen your DSA skills with curated problem sheets and video solutions.</p>
                            <Link to="/dsa" className="btn btn-outline-primary mt-3">Start Practicing</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}