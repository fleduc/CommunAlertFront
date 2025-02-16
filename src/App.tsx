// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './pages/Layout';
import Login from './pages/Login';
import AlertsList from './pages/AlertsList';
import AlertDetail from './pages/AlertDetail';

const ProtectedRoutes: React.FC = () => {
    const { user } = useAuth();
    // Si user est null, redirige vers /login
    if (!user) {
        return <Navigate to="/login" />;
    }
    return (
        <Layout>
            <Routes>
                <Route path="/alerts" element={<AlertsList />} />
                <Route path="/alerts/:id" element={<AlertDetail />} />
                <Route path="*" element={<Navigate to="/alerts" />} />
            </Routes>
        </Layout>
    );
};

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
