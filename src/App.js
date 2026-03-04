import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import './App.css';

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
import { setupInterceptors, initializeApiBase } from "./services/api";

// Import all your components
import Navbar from "./components/Navbar";
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
import LessonContent from "./components/LessonContent";
import LoadingSpinner from "./components/LoadingSpinner"; // <-- 1. IMPORT THE SPINNER

const AppContent = () => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    // Initialize API base URL first (checks localhost availability)
    initializeApiBase().then(() => {
      // Then setup interceptors
      setupInterceptors(showLoader, hideLoader);
    });
  }, [showLoader, hideLoader]);

  return (
    <>
      <LoadingSpinner /> {/* <-- 2. ADD THE SPINNER HERE */}
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/courses" element={<Layout><CourseList /></Layout>} />
          <Route path="/course/:courseId" element={<Layout><CourseDetail /></Layout>} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<Layout><LessonContent /></Layout>} />
          <Route path="/chat" element={<Layout><ChatComponent /></Layout>} />
          <Route path="/my-learning" element={<Layout><MyCourses /></Layout>} />
          <Route path="/compiler" element={<Layout><CompilerPage /></Layout>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};


export default function App() {
  return (
    <BrowserRouter>
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