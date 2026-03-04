import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
    getCourseDetail,
    getLessonDetail,
    getCourseProgress,
    markLessonComplete,
    unmarkLessonComplete,
} from '../services/coursesApi';

export default function LessonContent() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [lesson, setLesson] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const loadLesson = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const [lessonData, courseData] = await Promise.all([
                getLessonDetail(courseId, lessonId),
                getCourseDetail(courseId),
            ]);

            setLesson({
                ...lessonData,
                totalLessons: lessonData.totalLessons || courseData.totalLessons || courseData.lessons?.length || 0,
            });

            if (isAuthenticated) {
                try {
                    const progressData = await getCourseProgress(courseId, token);
                    const completedIds = Array.isArray(progressData?.completedLessonIds)
                        ? progressData.completedLessonIds
                        : [];
                    setIsRegistered(true);
                    setIsCompleted(completedIds.includes(Number(lessonId)) || completedIds.includes(String(lessonId)));
                } catch {
                    setIsRegistered(false);
                    setIsCompleted(false);
                }
            } else {
                setIsRegistered(false);
                setIsCompleted(false);
            }
        } catch (apiError) {
            setError(apiError.normalizedError?.message || 'Unable to load lesson content.');
        } finally {
            setLoading(false);
        }
    }, [courseId, isAuthenticated, lessonId, token]);

    useEffect(() => {
        loadLesson();
    }, [loadLesson]);

    const handleToggleComplete = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = isCompleted
                ? await unmarkLessonComplete(courseId, lessonId, token)
                : await markLessonComplete(courseId, lessonId, token);

            const completedIds = Array.isArray(response?.completedLessonIds) ? response.completedLessonIds : [];
            const nowCompleted = completedIds.includes(Number(lessonId)) || completedIds.includes(String(lessonId));
            setIsCompleted(nowCompleted);
            toast.success(response?.message || (nowCompleted ? 'Lesson marked as complete.' : 'Lesson completion removed.'));
        } catch (apiError) {
            toast.error(apiError.normalizedError?.message || 'Unable to update lesson status.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 mb-0">Loading lesson...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={loadLesson}>Retry</button>
            </div>
        );
    }

    if (!lesson) {
        return <div className="alert alert-info">Resource not found.</div>;
    }

    return (
        <div className="lesson-page">
            <nav className="mb-3">
                <Link to="/courses" className="text-decoration-none">Courses</Link>
                <span className="mx-2">/</span>
                <Link to={`/course/${courseId}`} className="text-decoration-none">{lesson.courseTitle}</Link>
                <span className="mx-2">/</span>
                <span>{lesson.title}</span>
            </nav>

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                    <h2 className="fw-bold mb-1">{lesson.title}</h2>
                    <p className="text-muted mb-0">Lesson {lesson.orderIndex} of {lesson.totalLessons}</p>
                </div>
                {isAuthenticated && isRegistered && (
                    <button
                        type="button"
                        className={`btn ${isCompleted ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={handleToggleComplete}
                        disabled={actionLoading}
                    >
                        {actionLoading ? 'Updating...' : isCompleted ? 'Completed ✓ (Unmark)' : 'Mark as Complete'}
                    </button>
                )}
            </div>

            {isAuthenticated && !isRegistered && (
                <div className="alert alert-info">Register for this course to track lesson completion.</div>
            )}

            <div className="card mb-4">
                <div className="card-body lesson-content" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>

            <div className="d-flex justify-content-between flex-wrap gap-2">
                {lesson.previousLessonId ? (
                    <Link className="btn btn-outline-primary" to={`/course/${courseId}/lesson/${lesson.previousLessonId}`}>
                        ← Previous Lesson
                    </Link>
                ) : <span />}

                {lesson.nextLessonId ? (
                    <Link className="btn btn-primary" to={`/course/${courseId}/lesson/${lesson.nextLessonId}`}>
                        Next Lesson →
                    </Link>
                ) : (
                    <span className="text-muted">You reached the last lesson.</span>
                )}
            </div>

            <div className="mt-4">
                <Link className="btn btn-link p-0" to={`/course/${courseId}`}>← Back to course</Link>
            </div>
        </div>
    );
}
