import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="auth-bg">
            <div className="card shadow-lg p-4 p-md-5 border-0" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="text-center fw-bold text-primary mb-4">Welcome Back!</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                placeholder="Username"
                                className="form-control form-control-lg"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="form-control form-control-lg"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg">Log In</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-muted text-decoration-none d-block mb-2 small">Forgot password?</Link>
                        <hr className="my-3" />
                        <span className="small text-muted me-1">Don't have an account?</span>
                        <Link to="/signup" className="fw-bold text-decoration-none">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}