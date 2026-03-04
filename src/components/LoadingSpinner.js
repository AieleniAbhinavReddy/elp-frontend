import React from 'react';
import { useLoading } from '../context/LoadingContext';
// 1. Import the Lottie Player component
import { Player } from '@lottiefiles/react-lottie-player';
// 2. Import your new animation JSON file
import animationData from '../assets/loading-animation.json';

const LoadingSpinner = () => {
    const { isLoading } = useLoading();

    if (!isLoading) {
        return null;
    }

    return (
        // The overlay div is still used to dim the background
        <div className="spinner-overlay">
            {/* 3. Use the Lottie Player instead of the old CSS spinner */}
            <Player
                autoplay
                loop
                src={animationData} // Use the imported animation data
                style={{ height: '300px', width: '300px' }}
            >
            </Player>
        </div>
    );
};

export default LoadingSpinner;