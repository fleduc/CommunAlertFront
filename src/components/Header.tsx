// src/components/Header.tsx
/**
 * Header Component
 *
 * Displays the application's header, including the application name,
 * a back button (when applicable), and user controls for logout.
 *
 * @module Header
 */
import React, { useState, useRef, useEffect } from 'react';
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

    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Left Section: Back button */}
                <div className="flex items-center w-20">
                    {showBackButton ? (
                        <button onClick={handleBack} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                    ) : (
                        <div className="w-20"></div>
                    )}
                </div>

                {/* Center Section: App name */}
                <div className="flex-1 text-center">
                <h1 className="text-xl font-bold">CommunAlert</h1>
                </div>

                {/* Right Section: User info */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setUserMenuOpen(prev => !prev)}
                        className="flex items-center  p-1 bg-gray-700 hover:bg-gray-600 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-8 h-8 rounded-full bg-gray-600 p-1 mr-2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.969 9.969 0 0112 15c2.347 0 4.526.74 6.379 1.996M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {user && <span className="hidden sm:block">{user.username}</span>}
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                            {user ? (
                                <>
                                    <button
                                        className="w-full text-left px-4 py-2 rounded-none hover:bg-gray-200 disabled:opacity-50"
                                        disabled
                                    >
                                        User account
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 rounded-none hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="w-full text-left px-4 py-2 rounded-none hover:bg-gray-200 disabled:opacity-50"
                                        disabled
                                    >
                                        Create an account
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
