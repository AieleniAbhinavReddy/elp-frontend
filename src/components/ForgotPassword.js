import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { apiForgotPassword } from "../services/api";

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
        // --- CHANGE HERE: Use the 'auth-bg' class for the background ---
        <div className="auth-bg">
            <div className="card shadow-lg p-4 p-md-5 auth-card border-0">
                <div className="card-body">
                    <h2 className="text-center fw-bold text-primary mb-4">Forgot Password</h2>
                    <p className="text-muted text-center small mb-4">Enter your username and security answer to reset your password.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                           <input type="text" placeholder="Username" className="form-control form-control-lg rounded-pill" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                           <label className="form-label small text-muted mb-1">Security question: What is your favourite food?</label>
                           <input type="password" placeholder="Your security answer" className="form-control form-control-lg rounded-pill" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}