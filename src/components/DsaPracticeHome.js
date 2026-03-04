import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDsaSheets, getMyDsaProgress } from '../services/dsaApi';

const SHEET_ICONS = ['bi-code-slash', 'bi-grid-3x3-gap-fill', 'bi-braces-asterisk'];
const SHEET_GRADIENTS = [
    'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
    'linear-gradient(135deg, #d97706 0%, #dc2626 100%)'
];

export default function DsaPracticeHome() {
    const { isAuthenticated } = useAuth();
    const [sheets, setSheets] = useState([]);
    const [overallProgress, setOverallProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const sheetsData = await getDsaSheets();
                setSheets(sheetsData);

                if (isAuthenticated) {
                    try {
                        const progress = await getMyDsaProgress();
                        setOverallProgress(progress);
                    } catch {
                        // Progress fetch may fail if user has no progress yet
                    }
                }
            } catch (err) {
                setError(err.normalizedError?.message || 'Failed to load DSA sheets.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 mb-0">Loading DSA sheets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="dsa-home">
            {/* Hero Section */}
            <div className="dsa-hero">
                <div className="dsa-hero-content">
                    <h1 className="display-5 fw-bold mb-2">
                        <i className="bi bi-braces me-3"></i>DSA Coding Practice
                    </h1>
                    <p className="lead mb-0 dsa-hero-subtitle">
                        Master Data Structures & Algorithms with curated problem sheets and video solutions.
                    </p>
                </div>
            </div>

            {/* Overall Progress (logged in only) */}
            {isAuthenticated && overallProgress && (
                <div className="dsa-overall-progress">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">
                            <i className="bi bi-trophy-fill text-warning me-2"></i>
                            Overall Progress
                        </h6>
                        <span className="fw-bold" style={{ color: 'var(--primary)' }}>
                            {overallProgress.totalSolved}/{overallProgress.totalProblems} solved ({overallProgress.overallPercentage}%)
                        </span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${Math.max(0, Math.min(100, overallProgress.overallPercentage))}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Sheet Cards */}
            <div className="row g-4 mt-1">
                {sheets.map((sheet, idx) => {
                    const pct = Math.max(0, Math.min(100, sheet.progressPercentage || 0));
                    return (
                        <div className="col-12 col-md-6 col-lg-4" key={sheet.id}>
                            <div className="card dsa-sheet-card h-100">
                                <div
                                    className="dsa-sheet-card-accent"
                                    style={{ background: SHEET_GRADIENTS[idx % SHEET_GRADIENTS.length] }}
                                >
                                    <i className={`bi ${SHEET_ICONS[idx % SHEET_ICONS.length]} dsa-sheet-icon`}></i>
                                </div>
                                <div className="card-body d-flex flex-column p-4">
                                    <h5 className="card-title fw-bold mb-2">{sheet.title}</h5>
                                    <p className="text-muted small flex-grow-1 mb-3">{sheet.description}</p>

                                    <div className="d-flex justify-content-between small text-muted mb-2">
                                        <span><i className="bi bi-list-check me-1"></i>{sheet.totalProblems} Problems</span>
                                        {isAuthenticated && sheet.solvedCount > 0 && (
                                            <span className="text-success fw-semibold">
                                                <i className="bi bi-check-circle-fill me-1"></i>{sheet.solvedCount} Solved
                                            </span>
                                        )}
                                    </div>

                                    {isAuthenticated && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-1">
                                                <small className="text-muted">Progress</small>
                                                <small className="fw-semibold" style={{ color: 'var(--primary)' }}>{pct}%</small>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {sheet.youtubePlaylistUrl && (
                                        <a
                                            href={sheet.youtubePlaylistUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-danger mb-2"
                                        >
                                            <i className="bi bi-youtube me-1"></i>YouTube Playlist
                                        </a>
                                    )}

                                    <Link
                                        to={`/dsa/sheets/${sheet.id}`}
                                        className="btn btn-primary mt-auto"
                                    >
                                        Start Practicing <i className="bi bi-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isAuthenticated && (
                <div className="alert alert-info mt-4 d-flex align-items-center">
                    <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                    <span>
                        <Link to="/login" className="fw-bold">Login</Link> to track your solving progress across all sheets.
                    </span>
                </div>
            )}
        </div>
    );
}
