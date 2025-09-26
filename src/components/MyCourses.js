import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
// Import the correct function from your api.js file
import { apiGetMyCourses } from '../services/api'; // (Adjust the path to your api.js file if needed)


const MyCourses = () => {
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                // Use the centralized apiGetMyCourses function
                const response = await apiGetMyCourses();
                setMyCourses(response.data);
            } catch (error) {
                toast.error("Failed to fetch your courses.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    if (loading) {
        return <div className="container text-center mt-5"><h4>Loading your courses...</h4></div>;
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Registered Courses</h2>
            </div>
            <hr />
            {myCourses.length > 0 ? (
                <div className="row">
                    {myCourses.map(course => (
                        <div className="col-md-4 mb-4" key={course.id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text flex-grow-1">{course.description}</p>
                                    <Link to={`/course/${course.id}`} className="btn btn-primary mt-auto">Go to Course</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">
                    You have not registered for any courses yet. Visit the course list to get started!
                </div>
            )}
        </>
    );
};

export default MyCourses;