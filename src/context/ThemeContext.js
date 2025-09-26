import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // --- THIS IS THE FIX ---
    // The state now always defaults to 'light' and no longer reads from localStorage.
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // This effect still applies the current theme to the HTML tag,
        // but it no longer saves the preference to localStorage.
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};