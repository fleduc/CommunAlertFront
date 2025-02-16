// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

interface LoginProps {} // Ici, nous n'avons plus besoin de la prop onLogin

interface TokenPayload {
    user_id: number;
    user_name: string;
}

const Login: React.FC<LoginProps> = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({email, password }),
            });
            if (!res.ok) throw new Error('Erreur d’authentification');
            const data = await res.json();
            console.log("data:", data);
            // Utilisez jwt_decode pour extraire les infos utilisateur
            const decoded = jwtDecode<TokenPayload>(data.access_token);
            // Mettez à jour votre AuthContext avec l'objet utilisateur
            // Par exemple, vous pouvez stocker { id: decoded.user_id, email: email }
            setUser({ id: decoded.user_id, username: decoded.user_name, email: email });
            console.log({ id: decoded.user_id, username: decoded.user_name, email: email })
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
                <h2 className="text-2xl font-bold mb-4">Connexion</h2>
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
                    <label className="block mb-1">Mot de passe</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded">
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
};

export default Login;
