import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses } from '../services/coursesApi';
import { useAuth } from '../context/AuthContext';

const clampProgress = (value) => Math.max(0, Math.min(100, Number(value) || 0));

const MyCourses = () => {
    const navigate = useNavigate();
    const { isAuthenticated, token, logout } = useAuth();

    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyLearning = useCallback(async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await getMyCourses(token);
            setMyCourses(data);
        } catch (apiError) {
            const status = apiError.normalizedError?.status;
            if (status === 401) {
                logout();
                navigate('/login');
                return;
            }

            setError(apiError.normalizedError?.message || 'Failed to fetch your enrolled courses.');
            setMyCourses([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, logout, navigate, token]);

    useEffect(() => {
        fetchMyLearning();
    }, [fetchMyLearning]);

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading your learning progress...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchMyLearning}>Retry</button>
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Courses</h2>
            </div>
            <hr />

            {myCourses.length > 0 ? (
                <div className="row g-4">
                    {myCourses.map((course) => {
                        const progress = clampProgress(course.completionPercentage);
                        const courseKey = course.courseId || course.id;

                        return (
                            <div className="col-md-6 col-lg-4" key={courseKey}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="card-title mb-0">{course.title}</h5>
                                            {course.completed && <span className="badge bg-success">Completed</span>}
                                        </div>

                                        <p className="card-text text-muted">{course.description}</p>

                                        <div className="small text-muted mb-3">
                                            <div><strong>Category:</strong> {course.category || 'N/A'}</div>
                                            <div><strong>Difficulty:</strong> {course.difficultyLevel || 'N/A'}</div>
                                            <div><strong>Estimated Hours:</strong> {course.estimatedHours ?? 'N/A'}</div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between small mb-1">
                                                <span>Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '8px' }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${progress}%` }}
                                                    aria-valuenow={progress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                />
                                            </div>
                                            <div className="small text-muted mt-2">
                                                Last Accessed: {course.lastAccessedLesson || 'Not started'}
                                            </div>
                                            <div className="small text-muted mt-1">
                                                {course.completedLessons || 0} of {course.totalLessons || 0} lessons completed
                                            </div>
                                        </div>

                                        <Link to={`/course/${courseKey}`} className="btn btn-primary mt-auto">
                                            Continue
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="alert alert-info">
                    No enrolled courses yet.
                </div>
            )}
        </>
    );
};

export default MyCourses;
