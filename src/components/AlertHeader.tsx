// src/components/AlertHeader.tsx
/**
 * AlertHeader Component
 *
 * This component displays an alert header containing the title and a toggle button.
 * The button allows the user to show or hide the alert description.
 *
 * @module AlertHeader
 */
import React, { useState } from 'react';

interface AlertHeaderProps {
    title: string;
    description: string;
}

/**
 * AlertHeader component displays the alert title and a toggle button that shows or hides
 * the alert description.
 *
 * @component
 * @param {AlertHeaderProps} props - The properties for the AlertHeader component.
 * @returns {JSX.Element} The rendered AlertHeader component.
 */
const AlertHeader: React.FC<AlertHeaderProps> = ({ title, description }) => {
    const [showDescription, setShowDescription] = useState(false);

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{title}</h1>
                <button
                    onClick={() => setShowDescription((prev) => !prev)}
                    className="ml-4 focus:outline-none p-1"
                    aria-label="Toggle description"
                >
                    {showDescription ? (
                        // Up arrow icon (to close)
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        // Down arrow icon (to show)
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </button>
            </div>
            {showDescription && (
                <p className="mt-2 text-base text-gray-700 transition-all duration-300">
                    {description}
                </p>
            )}
        </div>
    );
};

export default AlertHeader;
