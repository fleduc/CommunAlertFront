// src/pages/AlertsList.tsx
/**
 * AlertsList Page Component
 *
 * This component displays a list of alerts retrieved from an API
 * in fixed-height cards (h-32) that show a background image,
 * the alert title, a snippet of the description (up to 3 lines with ellipsis),
 * and key fields: alert type, status, severity_level, public_status, and the creator's username.
 * If the logged-in user is the alert's creator, an edit button (pencil icon) is shown at the bottom-right.
 *
 * A footer is provided with location, a radius in kilometers, and a button to add a new alert.
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
 * @property {number} alert_type - Numeric value representing the alert type.
 * @property {string} status - Current status of the alert.
 * @property {string} severity_level - Severity level (e.g., "low", "medium", "high").
 * @property {boolean} public_status - Whether the alert is public.
 * @property {string} [picture] - URL for the alert's picture.
 * @property {number} user_id - ID of the user who created the alert.
 * @property {{ username: string }} user - Creator's user object.
 */
interface Alert {
    id: number;
    alert_title: string;
    description: string;
    alert_type: number;
    status: string;
    severity_level: string;
    public_status: boolean;
    picture?: string;
    user_id: number;
    user: { username: string };
}

/**
 * AlertsList component displays a list of alerts in fixed-height cards,
 * and a footer with location, radius, and an "Add Alert" button.
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

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        // Assume the Layout already sets a fixed viewport height and provides a scrollable container.
        <div className="flex flex-col h-full -mr-2">
            <h1 className="text-3xl font-bold mb-4">List of alerts in your region</h1>
            {error && <p className="text-red-500">{error}</p>}
            {/* Alerts list area (scrollable) */}
            <ul className="flex-1 space-y-4 overflow-y-auto">
                {alerts.map((alert) => (
                    <li
                        key={alert.id}
                        className="relative h-32 overflow-hidden bg-cover bg-center rounded-lg mr-2"
                        style={{ backgroundImage: alert.picture ? `url(${alert.picture})` : undefined }}
                    >
                        <Link to={`/alerts/${alert.id}`} className="block h-full w-full">
                            {/* Overlay for readability */}
                            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                            {/* Card content */}
                            <div className="relative h-full p-2 text-white flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold line-clamp-1">
                                        {alert.alert_title}
                                    </h2>
                                    <p className="text-sm line-clamp-3">
                                        {alert.description}
                                    </p>
                                </div>
                                <div className="text-[10px] flex flex-wrap gap-1">
                                    <span>Type: {alert.alert_type}</span>
                                    <span>|</span>
                                    <span>Status: {alert.status}</span>
                                    <span>|</span>
                                    <span>Severity: {alert.severity_level}</span>
                                    <span>|</span>
                                    <span>Public: {alert.public_status ? 'Yes' : 'No'}</span>
                                    <span>|</span>
                                    <span>By: {alert.user?.username || 'Unknown'}</span>
                                </div>
                            </div>
                        </Link>
                        {user && user.id === alert.user_id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/alerts/edit/${alert.id}`);
                                }}
                                className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                title="Edit Alert"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    {/* Right Section: Add Alert button */}
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
