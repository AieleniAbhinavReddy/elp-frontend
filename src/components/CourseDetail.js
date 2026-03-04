import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
    getCourseDetail,
    getCourseProgress,
    registerCourse,
    unregisterCourse,
} from '../services/coursesApi';

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');

    const [progress, setProgress] = useState({
        totalLessons: 0,
        completedLessons: 0,
        completionPercentage: 0,
        completed: false,
        completedLessonIds: [],
    });

    const [isRegistered, setIsRegistered] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const detail = await getCourseDetail(courseId);
            setCourse(detail);
            setLessons(Array.isArray(detail.lessons) ? detail.lessons : []);

            const hasAnyCompleted = Array.isArray(detail.lessons)
                ? detail.lessons.some((lesson) => !!lesson.completed)
                : false;
            setIsRegistered(hasAnyCompleted);

            if (isAuthenticated) {
                try {
                    const progressData = await getCourseProgress(courseId, token);
                    setProgress({
                        totalLessons: progressData?.totalLessons || detail.totalLessons || 0,
                        completedLessons: progressData?.completedLessons || 0,
                        completionPercentage: progressData?.completionPercentage || 0,
                        completed: !!progressData?.completed,
                        completedLessonIds: Array.isArray(progressData?.completedLessonIds) ? progressData.completedLessonIds : [],
                    });
                    setIsRegistered(true);
                } catch {
                    setProgress({
                        totalLessons: detail.totalLessons || 0,
                        completedLessons: hasAnyCompleted ? detail.lessons.filter((lesson) => lesson.completed).length : 0,
                        completionPercentage: 0,
                        completed: false,
                        completedLessonIds: [],
                    });
                }
            }
        } catch (apiError) {
            setError(apiError.normalizedError?.message || 'Unable to load course details.');
        } finally {
            setLoading(false);
        }
    }, [courseId, isAuthenticated, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRegister = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = await registerCourse(courseId, token);
            toast.success(typeof response === 'string' ? response : 'Successfully registered for the course.');
            setIsRegistered(true);
            await fetchData();
        } catch (apiError) {
            toast.error(apiError.normalizedError?.message || 'Unable to register for this course.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnregister = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const confirm = window.confirm('This will delete all your progress. Are you sure?');
        if (!confirm) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await unregisterCourse(courseId, token);
            toast.success(typeof response === 'string' ? response : 'Successfully unregistered from the course.');
            setIsRegistered(false);
            await fetchData();
        } catch (apiError) {
            toast.error(apiError.normalizedError?.message || 'Unable to unregister from this course.');
        } finally {
            setActionLoading(false);
        }
    };

    const isLessonCompleted = (lesson) => {
        if (Array.isArray(progress.completedLessonIds) && progress.completedLessonIds.length > 0) {
            return progress.completedLessonIds.includes(lesson.id) || progress.completedLessonIds.includes(String(lesson.id));
        }
        return !!lesson.completed;
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 mb-0">Loading course details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchData}>Retry</button>
            </div>
        );
    }

    if (!course) {
        return <div className="alert alert-info">Resource not found.</div>;
    }

    return (
        <div className="row g-4">
            <div className="col-lg-8">
                <h2 className="fw-bold mb-2">{course.title}</h2>
                <p className="text-muted mb-3">{course.description}</p>

                <div className="small text-muted mb-4">
                    <div><strong>Category:</strong> {course.category || 'N/A'}</div>
                    <div><strong>Difficulty:</strong> {course.difficultyLevel || 'N/A'}</div>
                    <div><strong>Estimated Hours:</strong> {course.estimatedHours ?? 'N/A'}</div>
                    <div><strong>Total Lessons:</strong> {course.totalLessons ?? lessons.length}</div>
                </div>

                {isRegistered ? (
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">Your Progress</h5>
                                <span className="small text-muted">{progress.completionPercentage || 0}%</span>
                            </div>
                            <div className="progress mb-2" style={{ height: '10px' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: `${Math.max(0, Math.min(100, progress.completionPercentage || 0))}%` }}
                                    aria-valuenow={progress.completionPercentage || 0}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                />
                            </div>
                            <div className="small text-muted">
                                {progress.completedLessons || 0} of {progress.totalLessons || course.totalLessons || lessons.length} lessons completed
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="col-lg-4">
                <div className="card mb-3">
                    <div className="card-body d-grid gap-2">
                        {!isRegistered ? (
                            <button className="btn btn-success" onClick={handleRegister} disabled={actionLoading}>
                                {actionLoading ? 'Processing...' : 'Register for this Course'}
                            </button>
                        ) : (
                            <button className="btn btn-outline-danger" onClick={handleUnregister} disabled={actionLoading}>
                                {actionLoading ? 'Processing...' : 'Unregister'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header fw-bold">Lessons</div>
                    <ul className="list-group list-group-flush" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                        {lessons.length > 0 ? (
                            lessons.map((lesson) => (
                                <li key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <Link to={`/course/${courseId}/lesson/${lesson.id}`} className="text-decoration-none">
                                        <span className="me-2 fw-semibold">{lesson.orderIndex}.</span>
                                        {lesson.title}
                                    </Link>
                                    {isRegistered && isLessonCompleted(lesson) && (
                                        <span className="badge bg-success">✓</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">No lessons available.</li>
                        )}
                    </ul>
                </div>

                <div className="mt-3">
                    <Link to="/courses" className="btn btn-link p-0">← Back to catalog</Link>
                </div>
            </div>
        </div>
    );
}
