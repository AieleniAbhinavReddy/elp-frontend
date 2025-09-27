import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import './App.css';

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
// 1. Import the Loading provider and hook
import { LoadingProvider, useLoading } from "./context/LoadingContext";
// 2. Import the interceptor setup function
import { setupInterceptors } from "./services/api";

// Import all your components
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChatComponent from "./components/ChatComponent";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import MyCourses from "./components/MyCourses";
import CompilerPage from "./components/CompilerPage";

// 3. Create a new component to handle interceptor setup
// This component must be a child of LoadingProvider to access the context
const AppContent = () => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Setup the interceptors once the component mounts
    setupInterceptors(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/chat" element={<Layout><ChatComponent /></Layout>} />
          <Route path="/courses" element={<Layout><CourseList /></Layout>} />
          <Route path="/course/:courseId" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/my-courses" element={<Layout><MyCourses /></Layout>} />
          <Route path="/compiler" element={<Layout><CompilerPage /></Layout>} />
        </Route>
      </Routes>
    </>
  );
};


export default function App() {
  return (
    <BrowserRouter>
      {/* 4. Wrap all other providers with the LoadingProvider */}
      <LoadingProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
}