import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";
import { apiResetPassword } from "../services/api";
import videoBg from '../assets/background_video.mp4'; // Import video
import './Welcome.css'; // Import shared styles for the background

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setLoading(true);
        const toastId = toast.loading('Resetting password...');
        try {
            await apiResetPassword(token, newPassword);
            toast.success("Password reset successful! Redirecting to login...", { id: toastId });
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data?.message || "Reset failed. Link may be invalid or expired.";
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
                        <h2 className="text-center fw-bold mb-4">Reset Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                               <input type="password" placeholder="New password" className="form-control form-control-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                               <input type="password" placeholder="Confirm password" className="form-control form-control-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg shadow" disabled={loading}>
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}