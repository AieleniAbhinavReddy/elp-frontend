import React from 'react';
import { useTheme } from '../context/ThemeContext';
// REMOVED: No longer need to import the CSS here

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary btn-sm"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%'
            }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? (
                <i className="bi bi-moon-stars-fill"></i>
            ) : (
                <i className="bi bi-sun-fill"></i>
            )}
        </button>
    );
};

export default ThemeToggle;