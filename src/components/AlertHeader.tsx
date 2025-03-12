// src/components/AlertHeader.tsx
/**
 * AlertHeader Component
 *
 * Displays the alert header containing the title, background image, and details.
 * All alert data is passed via a single prop "data". By default, the details (description
 * and additional fields) are visible. Clicking the chevron toggles the visibility of the details.
 *
 * @module AlertHeader
 */
import React, { useState } from 'react';

export interface AlertData {
    alert_title: string;
    description: string;
    alert_type: number;
    status: string;
    severity_level?: 'low' | 'medium' | 'high';
    public_status: boolean;
    picture?: string;
    user: { username: string };
}

interface AlertHeaderProps {
    alert: AlertData;
}

/**
 * AlertHeader component displays the alert title and a toggle button that shows or hides
 * the alert description.
 *
 * @component
 * @param {AlertHeaderProps} props - The properties for the AlertHeader component.
 * @returns {JSX.Element} The rendered AlertHeader component.
 */
const AlertHeader: React.FC<AlertHeaderProps> = ({ alert }) => {
    // Details are visible by default
    const [showDetails, setShowDetails] = useState(true);

    return (
        <div className="relative">
            {/* Background image overlay */}
            {alert.picture && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 rounded-lg"
                    style={{ backgroundImage: `url(${alert.picture})` }}
                ></div>
            )}
            <div className="relative z-10 p-4">
                {/* Header: Title and Toggle Button */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{alert.alert_title}</h1>
                    <button
                        onClick={() => setShowDetails(prev => !prev)}
                        className="ml-4 bg-gray-700 hover:bg-gray-800 focus:outline-none p-1"
                        aria-label="Toggle details"
                    >
                        {showDetails ? (
                            // Up arrow indicates details are visible (click to collapse)
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                        ) : (
                            // Down arrow indicates details are collapsed (click to expand)
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" stroke="white" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        )}
                    </button>
                </div>
                {/* Details Section */}
                {showDetails && (
                    <div className="mt-2 text-base text-gray-700 transition-all duration-300">
                        <p>{alert.description}</p>
                        <div className="mt-4 text-xs text-gray-600 flex flex-wrap gap-2">
                            <span>Type: {alert.alert_type}</span>
                            <span>Status: {alert.status}</span>
                            <span>Severity: {alert.severity_level}</span>
                            <span>Public: {alert.public_status ? 'Yes' : 'No'}</span>
                            <span>By: {alert.user?.username || 'Unknown'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertHeader;
