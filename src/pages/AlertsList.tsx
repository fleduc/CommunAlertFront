// src/pages/AlertsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

interface Alert {
    id: number;
    title: string;
    description: string;
}

const AlertsList: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const fetchAlerts = async () => {
        try {
            //const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/alerts`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Erreur lors de la récupération des alertes');
            const data = await res.json();
            setAlerts(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleCreateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/alerts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ title, description }),
            });
            if (!res.ok) throw new Error('Erreur lors de la création de l’alerte');
            // Recharger la liste des alertes après création
            await fetchAlerts();
            setTitle('');
            setDescription('');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Liste des alertes</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul>
                {alerts.map((alert) => (
                    <li key={alert.id} className="border p-4 rounded mb-2 hover:bg-gray-100">
                        <Link to={`/alerts/${alert.id}`}>
                            <h2 className="text-xl font-semibold">{alert.title}</h2>
                            <p>{alert.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <h2 className="text-2xl font-bold mt-8">Créer une nouvelle alerte</h2>
            <form onSubmit={handleCreateAlert} className="mt-4">
                <div className="mb-4">
                    <label className="block mb-1">Titre</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Description</label>
                    <textarea
                        className="w-full border border-gray-300 p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Créer l’alerte
                </button>
            </form>
        </div>
    );
};

export default AlertsList;
