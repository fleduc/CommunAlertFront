// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './pages/Login';
import AlertsList from './pages/AlertsList';
import AlertDetail from './pages/AlertDetail';

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const isAuthenticated = !!token;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={(newToken) => setToken(newToken)} />} />
                {isAuthenticated ? (
                    <Route
                        path="/*"
                        element={
                            <Layout>
                                <Routes>
                                    <Route path="/alerts" element={<AlertsList />} />
                                    <Route path="/alerts/:id" element={<AlertDetail />} />
                                    <Route path="*" element={<Navigate to="/alerts" />} />
                                </Routes>
                            </Layout>
                        }
                    />
                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
};

export default App;
