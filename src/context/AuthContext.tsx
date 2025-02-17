// src/context/AuthContext.tsx
/**
 * AuthContext provides authentication state and functions for the application.
 *
 * This context stores the current logged-in user and provides methods to update the user and log out.
 *
 * @module AuthContext
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
 */
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

/**
 * React Context for authentication.
 *
 * @constant AuthContext
 * @type {React.Context<AuthContextType>}
 */
const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
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

    /**
     * Logs out the user by setting the user to null.
     * Optionally, you can redirect to a login page or let the parent component handle redirection.
     */
    const logout = () => {
        setUser(null);
        // Optionally redirect, or let the parent component handle redirection
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
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
