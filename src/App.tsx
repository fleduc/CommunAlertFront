// src/App.tsx
/**
 * App Component
 *
 * This file defines the main routing structure for the application.
 * It uses an authentication provider to manage the logged-in state and
 * protects routes that require authentication.
 *
 * @module App
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Layout from './pages/Layout';
import Login from './pages/Login';
import AlertsList from './pages/AlertsList';
import AlertDetail from './pages/AlertDetail';
import AlertEdit from './pages/AlertEdit';

/**
 * ProtectedRoutes component that ensures only authenticated users can access certain routes.
 *
 * If the user is not authenticated (and loading is finished), they are redirected to the login page.
 *
 * @component
 * @returns {JSX.Element} The protected routes wrapped in a Layout component.
 */
const ProtectedRoutes: React.FC = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Layout>
            <Routes>
                <Route path="/alerts" element={<AlertsList />} />
                <Route path="/alerts/:id" element={<AlertDetail />} />
                <Route path="/alerts/edit/:id" element={<AlertEdit />} />
                <Route path="/alerts/create" element={<AlertEdit />} />
                <Route path="*" element={<Navigate to="/alerts" replace />} />
            </Routes>
        </Layout>
    );
};

/**
 * App component that defines the main application routing.
 *
 * It uses the AuthProvider to manage authentication state and
 * sets up the Router with both public and protected routes.
 *
 * @component
 * @returns {JSX.Element} The main App component.
 */
const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={<ProtectedRoutes />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
