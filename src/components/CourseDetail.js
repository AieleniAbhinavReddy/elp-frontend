import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from "react-hot-toast"; // <-- Use react-hot-toast
import { apiGetCourseDetails, apiRegisterForCourse, apiUnregisterFromCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import YouTube from 'react-youtube';

export default function CourseDetail() {
    const { courseId } = useParams();
    const { isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false); // For register/unregister buttons

    const fetchCourse = useCallback(async () => {
        try {
            const response = await apiGetCourseDetails(courseId);
            const courseData = response.data;
            const videoData = JSON.parse(courseData.videos);
            setCourse(courseData.courseDetails);
            setVideos(videoData.items || []);
            setIsRegistered(courseData.isRegistered);
            if (videoData.items && videoData.items.length > 0) {
                setCurrentVideoId(videoData.items[0].snippet.resourceId.videoId);
            }
        } catch (error) { 
            console.error("Error fetching course details:", error);
            toast.error("Could not load course details.");
        }
    }, [courseId]);

    useEffect(() => { fetchCourse(); }, [fetchCourse]);

    const handleRegister = async () => {
        setLoadingAction(true);
        const toastId = toast.loading('Registering...');
        try {
            await apiRegisterForCourse(courseId);
            toast.success('Successfully registered!', { id: toastId });
            fetchCourse(); // Refresh course details
        } catch (error) {
            toast.error(error.response?.data || 'Registration failed!', { id: toastId });
        } finally {
            setLoadingAction(false);
        }
    };
    
    const handleUnregister = async () => {
        setLoadingAction(true);
        const toastId = toast.loading('Unregistering...');
        try {
            await apiUnregisterFromCourse(courseId);
            toast.success('Successfully unregistered.', { id: toastId });
            fetchCourse(); // Refresh course details
        } catch (error) {
            toast.error(error.response?.data || 'Unregistering failed!', { id: toastId });
        } finally {
            setLoadingAction(false);
        }
    };

    const playerOptions = {
        height: '100%',
        width: '100%',
        playerVars: { autoplay: 1 },
    };
    
    if (!course) return <div className="text-center">Loading course...</div>;

    return (
        <div className="row g-5">
            <div className="col-lg-8">
                <div className="ratio ratio-16x9 mb-4 shadow-lg rounded">
                    {currentVideoId ? 
                        <YouTube 
                            videoId={currentVideoId} 
                            opts={playerOptions}
                            className="rounded"
                        /> : 
                        <div className="bg-dark rounded"></div>
                    }
                </div>
                <h2 className="fw-bold">{course.title}</h2>
                <p className="text-muted fs-5">{course.description}</p>
            </div>
            <div className="col-lg-4">
                <div className="card">
                    <div className="card-header fw-bold bg-light">Course Content</div>
                    <ul className="list-group list-group-flush" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                        {videos.map((video, index) => (
                            <li 
                                key={video.id} 
                                className={`list-group-item list-group-item-action d-flex align-items-center ${currentVideoId === video.snippet.resourceId.videoId ? 'active' : ''}`}
                                style={{cursor: 'pointer'}}
                                onClick={() => setCurrentVideoId(video.snippet.resourceId.videoId)}>
                                <span className="fw-bold me-3 text-primary">{index + 1}</span> 
                                <span className="flex-grow-1">{video.snippet.title}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="card-footer p-3">
                        <div className="d-grid">
                            {isAuthenticated && (
                                isRegistered ? 
                                <button className="btn btn-danger" onClick={handleUnregister} disabled={loadingAction}>
                                    {loadingAction ? 'Processing...' : 'Unregister'}
                                </button> :
                                <button className="btn btn-primary" onClick={handleRegister} disabled={loadingAction}>
                                    {loadingAction ? 'Processing...' : 'Register for Course'}
                                </button>
                            )}
                            {!isAuthenticated && <p className="text-center mb-0">Please <a href="/login">login</a> to register.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}