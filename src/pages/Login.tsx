// src/pages/Login.tsx
/**
 * Login Page Component
 *
 * This component provides a login form for users to authenticate.
 * It handles user login and updates the authentication context upon a successful login.
 *
 * Note: The onLogin prop is no longer needed.
 *
 * @module Login
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

/**
 * Props for the Login component.
 *
 * @interface LoginProps
 */
interface LoginProps {}

/**
 * Interface representing the expected payload from the JWT.
 *
 * @interface TokenPayload
 * @property {number} user_id - The user's unique identifier.
 * @property {string} user_name - The user's username.
 */
interface TokenPayload {
    user_id: number;
    user_name: string;
}

/**
 * Login component that handles user authentication.
 *
 * @component
 * @returns {JSX.Element} The Login component.
 */
const Login: React.FC<LoginProps> = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Handles the login form submission.
     *
     * Sends a POST request to the authentication endpoint. If successful,
     * decodes the JWT to retrieve user information, updates the authentication context,
     * and navigates to the alerts page.
     *
     * @async
     * @function handleSubmit
     * @param {React.FormEvent} e - The form event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error('Authentication error');
            const data = await res.json();
            console.log("data:", data);
            // Use jwtDecode to extract user information from the token
            const decoded = jwtDecode<TokenPayload>(data.access_token);
            // Update the AuthContext with the user object.
            // For example, you can store { id: decoded.user_id, email: email }
            setUser({ id: decoded.user_id, username: decoded.user_name, email: email });
            console.log({ id: decoded.user_id, username: decoded.user_name, email: email });
            navigate('/alerts');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded">
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>
        </div>
    );
};

export default Login;
