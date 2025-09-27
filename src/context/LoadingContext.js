import React, { createContext, useState, useContext, useMemo } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Using useMemo to prevent unnecessary re-renders
    const value = useMemo(() => ({
        showLoader: () => setIsLoading(true),
        hideLoader: () => setIsLoading(false),
        isLoading,
    }), [isLoading]);

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};