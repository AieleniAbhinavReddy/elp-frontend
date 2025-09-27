import React from 'react';
// 1. Import the LoadingSpinner component
import LoadingSpinner from './LoadingSpinner';

// This component wraps our main application pages
const Layout = ({ children }) => {
  return (
    <div className="main-app-layout">
      {/* 2. Add the spinner here. It will only be visible when loading. */}
      <LoadingSpinner />
      <div className="container py-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;