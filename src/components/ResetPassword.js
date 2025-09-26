import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";
import { apiResetPassword } from "../services/api";

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
        // --- CHANGE HERE: Use the 'auth-bg' class for the background ---
        <div className="auth-bg">
            <div className="card shadow-lg p-4 p-md-5 auth-card border-0">
                <div className="card-body">
                    <h2 className="text-center fw-bold text-success mb-4">Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                           <input type="password" placeholder="New password" className="form-control form-control-lg rounded-pill" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                           <input type="password" placeholder="Confirm password" className="form-control form-control-lg rounded-pill" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-success btn-lg rounded-pill shadow" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}