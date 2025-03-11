// src/pages/AlertsList.tsx
/**
 * AlertsList Page Component
 *
 * This component displays a list of alerts retrieved from an API
 * and provides a footer with location, a radius in kilometers,
 * and a button to add a new alert.
 *
 * @module AlertsList
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Interface representing an alert object.
 *
 * @interface Alert
 * @property {number} id - Unique identifier for the alert.
 * @property {string} alert_title - Title of the alert.
 * @property {string} description - Description of the alert.
 * @property {number} user_id - The ID of the user who created the alert.
 */
interface Alert {
    id: number;
    alert_title: string;
    description: string;
    user_id: number;
}

/**
 * AlertsList component displays a list of alerts and allows navigation
 * to create a new alert.
 *
 * @component
 * @returns {JSX.Element} The AlertsList component.
 */
const AlertsList: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    /**
     * Fetches alerts from the API and updates the state.
     *
     * @async
     * @function fetchAlerts
     * @throws Will throw an error if the API call fails.
     */
    const fetchAlerts = async () => {
        try {
            const res = await fetch(`${API_URL}/alerts`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!res.ok) throw new Error('Error retrieving alerts');
            const data = await res.json();
            setAlerts(data);
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Fetch alerts when the component mounts
    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="p-4 flex flex-col min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Alerts List</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="flex-1">
                {alerts.map((alert) => (
                    <li key={alert.id} className="border p-4 rounded mb-2 hover:bg-gray-100 flex justify-between items-center">
                        <div>
                            <Link to={`/alerts/${alert.id}`}>
                                <h2 className="text-xl font-semibold">{alert.alert_title}</h2>
                                <p>{alert.description}</p>
                            </Link>
                        </div>
                        {user && user.id === alert.user_id && (
                            <button
                                onClick={() => navigate(`/alerts/edit/${alert.id}`)}
                                className="ml-4 p-2 bg-gray-200 hover:bg-gray-300 rounded"
                                title="Edit Alert"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            {/* Footer */}
            <footer className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                    {/* Left Section: Location */}
                    <div className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" />
                        </svg>
                        <span className="text-sm text-gray-700">Your Location</span>
                    </div>
                    {/* Center Section: Radius */}
                    <div>
                        <span className="text-sm text-gray-700">Radius: 10 km</span>
                    </div>
                    {/* Right Section: Button to add a new alert */}
                    <div>
                        <button
                            onClick={() => navigate('/alerts/create')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Alert
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AlertsList;
