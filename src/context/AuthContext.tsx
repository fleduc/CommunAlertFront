// src/context/AuthContext.tsx
/**
 * AuthContext provides authentication state and functions for the application.
 *
 * This context stores the current logged-in user and provides methods to update the user and log out.
 *
 * @module AuthContext
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Interface representing a user.
 *
 * @interface User
 * @property {number} id - Unique identifier of the user.
 * @property {string} username - Username of the user.
 * @property {string} email - Email address of the user.
 */
export interface User {
    id: number;
    username: string;
    email: string;
}

/**
 * Interface for the authentication context.
 *
 * @interface AuthContextType
 * @property {User | null} user - The currently authenticated user, or null if not authenticated.
 * @property {(user: User | null) => void} setUser - Function to update the user.
 * @property {() => void} logout - Function to log out the user.
 * @property {boolean} loading - Indicates if the authentication status is being loaded.
 */
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    loading: boolean;
}

/**
 * Create the authentication context with default values.
 *
 * @constant AuthContext
 * @type {React.Context<AuthContextType>}
 */
const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
    loading: true,
});

/**
 * AuthProvider component to wrap the application and provide authentication context.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - The children components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    /**
     * Logs out the user by setting the user state to null.
     * Optionally, you may add additional redirect logic here.
     */
    const logout = () => {
        setUser(null);
        // Optionally, add redirect logic here.
    };

    /**
     * Rehydrates the authentication state by fetching the current user from the backend.
     *
     * This useEffect calls the /auth/me endpoint with credentials included so that the HttpOnly
     * cookie is automatically sent. If the token is valid, the user information is set into the context.
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextType} The current authentication context value.
 */
export const useAuth = () => useContext(AuthContext);
