import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getDsaSheetDetail, markProblemSolved, unmarkProblemSolved } from '../services/dsaApi';

const PLATFORM_COLORS = {
    'LeetCode': { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
    'GeeksForGeeks': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
    'HackerRank': { bg: '#d1fae5', text: '#064e3b', border: '#34d399' },
    'Coding Ninjas': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    'InterviewBit': { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' },
    'CodeChef': { bg: '#fce7f3', text: '#9d174d', border: '#f9a8d4' },
    'Codeforces': { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
};

const getPlatformStyle = (platform) => {
    return PLATFORM_COLORS[platform] || { bg: 'var(--surface-2)', text: 'var(--text)', border: 'var(--border)' };
};

export default function DsaSheetDetail() {
    const { sheetId } = useParams();
    const { isAuthenticated } = useAuth();

    const [sheet, setSheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [togglingId, setTogglingId] = useState(null);
    const [activeVideoId, setActiveVideoId] = useState(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');

    const fetchSheet = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDsaSheetDetail(sheetId);
            setSheet(data);
        } catch (err) {
            setError(err.normalizedError?.message || 'Failed to load sheet details.');
        } finally {
            setLoading(false);
        }
    }, [sheetId]);

    useEffect(() => {
        fetchSheet();
    }, [fetchSheet]);

    // Extract unique platforms
    const platforms = useMemo(() => {
        if (!sheet?.problems) return [];
        const set = new Set(sheet.problems.map(p => p.platform).filter(Boolean));
        return Array.from(set).sort();
    }, [sheet]);

    // Filtered problems
    const filteredProblems = useMemo(() => {
        if (!sheet?.problems) return [];
        return sheet.problems.filter(p => {
            const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchStatus = statusFilter === 'all' ||
                (statusFilter === 'solved' && p.solved) ||
                (statusFilter === 'unsolved' && !p.solved);
            const matchPlatform = platformFilter === 'all' || p.platform === platformFilter;
            return matchSearch && matchStatus && matchPlatform;
        });
    }, [sheet, searchQuery, statusFilter, platformFilter]);

    const handleToggleSolved = async (problem) => {
        if (togglingId) return;
        setTogglingId(problem.id);
        try {
            let result;
            if (problem.solved) {
                result = await unmarkProblemSolved(problem.id);
                toast.success(`Unmarked "${problem.title}"`);
            } else {
                result = await markProblemSolved(problem.id);
                toast.success(`Marked "${problem.title}" as solved!`);
            }
            // Update local state with response
            setSheet(prev => ({
                ...prev,
                solvedCount: result.solvedCount,
                progressPercentage: result.progressPercentage,
                problems: prev.problems.map(p =>
                    p.id === problem.id ? { ...p, solved: !p.solved } : p
                )
            }));
        } catch (err) {
            if (err.message === 'Authentication required') {
                toast.error('Please login to track progress.');
            } else {
                toast.error(err.normalizedError?.message || 'Action failed.');
            }
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3 mb-0">Loading sheet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
                <span>{error}</span>
                <button className="btn btn-sm btn-outline-danger" onClick={fetchSheet}>Retry</button>
            </div>
        );
    }

    if (!sheet) return null;

    const pct = Math.max(0, Math.min(100, sheet.progressPercentage || 0));
    const solvedCountDisplay = sheet.solvedCount || 0;
    const totalDisplay = sheet.totalProblems || 0;

    return (
        <div className="dsa-sheet-detail">
            {/* Back nav */}
            <Link to="/dsa" className="btn btn-sm btn-outline-primary mb-3">
                <i className="bi bi-arrow-left me-1"></i> All Sheets
            </Link>

            {/* Sheet Header */}
            <div className="dsa-sheet-header">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <h2 className="fw-bold mb-1">{sheet.title}</h2>
                        <p className="text-muted mb-0">{sheet.description}</p>
                    </div>
                    {sheet.youtubePlaylistUrl && (
                        <a
                            href={sheet.youtubePlaylistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-danger btn-sm"
                        >
                            <i className="bi bi-youtube me-1"></i>Playlist
                        </a>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">
                        <i className="bi bi-list-check me-1"></i>{totalDisplay} Problems
                    </span>
                    {isAuthenticated && (
                        <span className="fw-bold small" style={{ color: 'var(--primary)' }}>
                            {solvedCountDisplay}/{totalDisplay} solved ({pct}%)
                        </span>
                    )}
                </div>
                {isAuthenticated && (
                    <div className="progress mb-0" style={{ height: '8px' }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${pct}%`, transition: 'width 0.5s ease' }}
                        />
                    </div>
                )}
            </div>

            {/* Video Player */}
            {activeVideoId && (
                <div className="dsa-video-player">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">
                            <i className="bi bi-play-circle-fill text-danger me-2"></i>Solution Video
                        </h6>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setActiveVideoId(null)}
                        >
                            <i className="bi bi-x-lg"></i> Close
                        </button>
                    </div>
                    <div className="dsa-video-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                            title="Solution Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="dsa-filters">
                <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-5">
                        <div className="input-group">
                            <span className="input-group-text" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                    </div>
                    {isAuthenticated && (
                        <div className="col-6 col-md-3">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            >
                                <option value="all">All Status</option>
                                <option value="solved">Solved</option>
                                <option value="unsolved">Unsolved</option>
                            </select>
                        </div>
                    )}
                    <div className="col-6 col-md-3">
                        <select
                            className="form-select"
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        >
                            <option value="all">All Platforms</option>
                            {platforms.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-1 text-end">
                        <span className="text-muted small">{filteredProblems.length} results</span>
                    </div>
                </div>
            </div>

            {/* Not logged in notice */}
            {!isAuthenticated && (
                <div className="alert alert-info d-flex align-items-center mb-3">
                    <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                    <span>
                        <Link to="/login" className="fw-bold">Login</Link> to track your progress and mark problems as solved.
                    </span>
                </div>
            )}

            {/* Problem List */}
            <div className="dsa-problem-list">
                {filteredProblems.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                        No problems match your filters.
                    </div>
                ) : (
                    filteredProblems.map((problem) => {
                        const platformStyle = getPlatformStyle(problem.platform);
                        const isSolved = problem.solved;
                        const isToggling = togglingId === problem.id;

                        return (
                            <div
                                key={problem.id}
                                className={`dsa-problem-row ${isSolved ? 'dsa-problem-solved' : ''}`}
                            >
                                {/* Order Number */}
                                <div className="dsa-problem-order">
                                    {isSolved ? (
                                        <i className="bi bi-check-circle-fill text-success"></i>
                                    ) : (
                                        <span>{problem.orderIndex + 1}</span>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div
                                    className="dsa-problem-thumb"
                                    onClick={() => setActiveVideoId(problem.youtubeVideoId)}
                                    title="Watch solution video"
                                >
                                    <img
                                        src={problem.thumbnailUrl || `https://i.ytimg.com/vi/${problem.youtubeVideoId}/mqdefault.jpg`}
                                        alt={problem.title}
                                    />
                                    <div className="dsa-thumb-play">
                                        <i className="bi bi-play-fill"></i>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="dsa-problem-info">
                                    <h6 className="fw-semibold mb-1">{problem.title}</h6>
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        {problem.platform && (
                                            <span
                                                className="dsa-platform-badge"
                                                style={{
                                                    background: platformStyle.bg,
                                                    color: platformStyle.text,
                                                    border: `1px solid ${platformStyle.border}`
                                                }}
                                            >
                                                {problem.platform}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="dsa-problem-actions">
                                    {problem.practiceUrl ? (
                                        <a
                                            href={problem.practiceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                            title="Practice on platform"
                                        >
                                            <i className="bi bi-box-arrow-up-right me-1"></i>
                                            <span className="d-none d-md-inline">Practice</span>
                                        </a>
                                    ) : (
                                        <button className="btn btn-sm btn-outline-secondary" disabled title="No practice link">
                                            <i className="bi bi-link-45deg me-1"></i>
                                            <span className="d-none d-md-inline">No Link</span>
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setActiveVideoId(problem.youtubeVideoId)}
                                        title="Watch solution"
                                    >
                                        <i className="bi bi-youtube text-danger me-1"></i>
                                        <span className="d-none d-md-inline">Video</span>
                                    </button>

                                    {isAuthenticated && (
                                        <button
                                            className={`btn btn-sm ${isSolved ? 'btn-success' : 'btn-outline-success'}`}
                                            onClick={() => handleToggleSolved(problem)}
                                            disabled={isToggling}
                                            title={isSolved ? 'Unmark as solved' : 'Mark as solved'}
                                        >
                                            {isToggling ? (
                                                <span className="spinner-border spinner-border-sm" />
                                            ) : isSolved ? (
                                                <><i className="bi bi-check-lg me-1"></i><span className="d-none d-md-inline">Solved</span></>
                                            ) : (
                                                <><i className="bi bi-circle me-1"></i><span className="d-none d-md-inline">Mark Solved</span></>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
