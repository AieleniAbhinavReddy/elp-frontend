import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGetCourses } from '../services/api';

export default function CourseList() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        apiGetCourses()
            .then(response => setCourses(response.data))
            .catch(error => console.error("Error fetching courses:", error));
    }, []);

    return (
        <>
            <div className="mb-5">
                {/* This h1 now has the gradient text effect */}
                <h1 className="display-5 page-title">Our Courses</h1>
                <p className="text-muted">Expand your skills with our curated list of courses.</p>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {courses.map(course => (
                    <div className="col" key={course.id}>
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column p-4">
                                <h5 className="card-title fw-bold">{course.title}</h5>
                                <p className="card-text text-muted flex-grow-1 mt-2">{course.description}</p>
                                <Link to={`/course/${course.id}`} className="btn btn-primary mt-4">
                                    <i className="bi bi-play-circle-fill me-2"></i>
                                    Start Learning
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}