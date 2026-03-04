import React from 'react';
// The LoadingSpinner import has been removed.

// This component wraps our main application pages
const Layout = ({ children }) => {
  return (
    <div className="main-app-layout">
      {/* The LoadingSpinner component has been removed from here. */}
      <div className="container py-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;