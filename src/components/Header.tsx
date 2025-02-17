// src/components/Header.tsx
/**
 * Header Component
 *
 * Displays the application's header, including the application name,
 * a back button (when applicable), and user controls for logout.
 *
 * @module Header
 */
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Header component for the application.
 *
 * @component
 * @returns {JSX.Element} The Header component.
 */
const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    /**
     * Handles the logout process.
     *
     * Sends a logout request to the API, updates the authentication context,
     * and navigates the user to the login page.
     *
     * @async
     * @function handleLogout
     */
    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // To include the HttpOnly cookie
            });
            if (!res.ok) {
                throw new Error('Error during logout');
            }
            logout(); // Updates the context (sets user to null)
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    /**
     * Navigates back to the previous page.
     *
     * @function handleBack
     */
    const handleBack = () => {
        navigate(-1);
    };

    // Show the back button if the current URL is NOT exactly "/alerts"
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
                        <span className="hidden sm:block">Hello, {user.username}</span>
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
