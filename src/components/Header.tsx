// src/components/Header.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Pour inclure le cookie HttpOnly
            });
            if (!res.ok) {
                throw new Error('Erreur lors du logout');
            }
            logout(); // Met à jour le contexte (met user à null)
            navigate('/login');
        } catch (error) {
            console.error("Erreur de logout :", error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Afficher le bouton back si l'URL courante n'est PAS exactement "/alerts"
    const showBackButton = location.pathname !== '/alerts';

    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <h1 className="text-xl font-bold">CommunAlert</h1>
                    {showBackButton && (
                        <button onClick={handleBack} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                            ← Back
                        </button>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                {user && (
                        <span className="hidden sm:block">Bonjour, {user.username}</span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
