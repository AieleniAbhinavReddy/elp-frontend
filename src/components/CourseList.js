import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses } from '../services/coursesApi';

export default function CourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getCourses();
            setCourses(data);
        } catch (apiError) {
            const message = apiError.normalizedError?.message || 'Unable to load courses right now.';
            setError(message);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 mb-0">Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchCourses}>Retry</button>
            </div>
        );
    }

    return (
        <>
            <div className="mb-5">
                {/* This h1 now has the gradient text effect */}
                <h1 className="display-5 page-title">Courses</h1>
                <p className="text-muted">Browse and start learning from the full catalog.</p>
            </div>
            {courses.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                        <div className="col" key={course.id || course.courseId}>
                            <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(`/course/${course.id || course.courseId}`)}>
                                <div className="card-body d-flex flex-column p-4">
                                    <h5 className="card-title fw-bold">{course.title}</h5>
                                    <p className="card-text text-muted flex-grow-1 mt-2">{course.description}</p>
                                    <div className="small text-muted mb-3">
                                        <div><strong>Category:</strong> {course.category || 'N/A'}</div>
                                        <div><strong>Difficulty:</strong> {course.difficultyLevel || 'N/A'}</div>
                                        <div><strong>Estimated Hours:</strong> {course.estimatedHours ?? 'N/A'}</div>
                                        <div><strong>Total Lessons:</strong> {course.totalLessons ?? 'N/A'}</div>
                                    </div>
                                    <div className="d-flex mt-auto">
                                        <Link
                                            to={`/course/${course.id || course.courseId}`}
                                            className="btn btn-primary flex-fill"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            Learn
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">
                    No courses available.
                </div>
            )}
        </>
    );
}