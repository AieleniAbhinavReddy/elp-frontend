import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await signup({ username, firstName, lastName, password, securityAnswer });
        if (success) {
            navigate("/login");
        }
    };

    return (
        <div className="auth-bg">
            <div className="card shadow-lg p-4 p-md-5 border-0" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="text-center fw-bold text-primary mb-4">Create Your Account</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Your input fields remain the same */}
                        <div className="mb-3">
                            <input type="text" placeholder="Username" className="form-control form-control-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="row g-2 mb-3">
                            <div className="col">
                                <input type="text" placeholder="First name" className="form-control form-control-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            </div>
                            <div className="col">
                                <input type="text" placeholder="Last name" className="form-control form-control-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <input type="password" placeholder="Password (at least 6 characters)" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small text-muted mb-1">Security Question: What is your favorite food?</label>
                            <input type="password" placeholder="Your security answer" className="form-control form-control-lg" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} required />
                        </div>
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <hr className="my-3" />
                        <span className="small text-muted me-1">Already have an account?</span>
                        <Link to="/login" className="fw-bold text-decoration-none">Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}