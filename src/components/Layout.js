import React from 'react';

// This component wraps our main application pages
const Layout = ({ children }) => {
  return (
    <div className="main-app-layout">
      <div className="container py-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;