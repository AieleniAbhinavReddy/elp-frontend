import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import './App.css';

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider, useLoading } from "./context/LoadingContext";
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
import LoadingSpinner from "./components/LoadingSpinner"; // <-- 1. IMPORT THE SPINNER

const AppContent = () => {
  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    setupInterceptors(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  return (
    <>
      <LoadingSpinner /> {/* <-- 2. ADD THE SPINNER HERE */}
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