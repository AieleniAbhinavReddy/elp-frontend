import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { apiForgotPassword } from "../services/api";
import videoBg from '../assets/background_video.mp4'; // Import video
import './Welcome.css'; // Import shared styles for the background

export default function ForgotPassword() {
    const [username, setUsername] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Verifying details...');
        try {
            const response = await apiForgotPassword(username, securityAnswer);
            const { token } = response.data;
            toast.success("Verification successful! Redirecting...", { id: toastId });
            navigate(`/reset-password/${token}`);
        } catch (error) {
            const msg = error.response?.data?.message || "Verification failed";
            toast.error(msg, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="welcome-container">
            <video autoPlay loop muted className="background-video">
                <source src={videoBg} type="video/mp4" />
            </video>
            <div className="content-overlay">
                <div className="card glass-card p-4 p-md-5 border-0" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="card-body">
                        <h2 className="text-center fw-bold mb-4">Forgot Password</h2>
                        <p className="text-center small mb-4" style={{color: '#e0e0e0'}}>Enter your username and security answer to reset your password.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                               <input type="text" placeholder="Username" className="form-control form-control-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                               <label className="form-label small mb-1">Security question: What is your favourite food?</label>
                               <input type="password" placeholder="Your security answer" className="form-control form-control-lg" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg shadow" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}