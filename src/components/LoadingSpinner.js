import React from 'react';
import { useLoading } from '../context/LoadingContext';

const LoadingSpinner = () => {
    const { isLoading } = useLoading();

    // The component will only render when isLoading is true
    if (!isLoading) {
        return null;
    }

    return (
        <div className="spinner-overlay">
            <div className="spinner-container"></div>
        </div>
    );
};

export default LoadingSpinner;