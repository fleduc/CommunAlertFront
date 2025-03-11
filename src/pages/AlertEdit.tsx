// src/pages/AlertEdit.tsx
/**
 * AlertEdit Page Component
 *
 * This component is used for both creating a new alert and editing an existing one.
 * When creating a new alert, it sends a POST request to the server.
 * When editing an alert, it sends a PUT request to update the alert.
 * It also supports image management via a file input.
 *
 * In edit mode, a "Delete Alert" button is provided with a confirmation prompt.
 * After saving or deleting, the user is redirected to the alerts list.
 *
 * @module AlertEdit
 */
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Interface representing an alert.
 */
export interface AlertData {
    id?: number;
    alert_title: string;
    description: string;
    alert_type: number;
    severity_level?: 'low' | 'medium' | 'high';
    starting_date?: string;
    closing_date?: string;
    planned_duration?: number;
    status?: 'open' | 'closed' | 'archived';
    public_status?: boolean;
    postal_code?: string;
    longitude?: number;
    latitude?: number;
    radius?: number;
    image?: File | null;
}

const AlertEdit: React.FC = () => {
    // Retrieve alert id from URL parameters (if any)
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    // Determine if we are editing an existing alert
    const isEditing = Boolean(id);

    // State for the alert form, with default values.
    const [alertData, setAlertData] = useState<AlertData>({
        alert_title: '',
        description: '',
        alert_type: 1, // Default value; adjust as needed
        severity_level: 'low',
        starting_date: '',
        closing_date: '',
        planned_duration: 0,
        public_status: false,
        postal_code: '',
        longitude: 0,
        latitude: 0,
        radius: 0,
        image: null,
    });
    const [error, setError] = useState('');

    // If editing, load the existing alert data from the server
    useEffect(() => {
        if (isEditing && id) {
            const fetchAlert = async () => {
                try {
                    const res = await fetch(`${API_URL}/alerts/${id}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (!res.ok) throw new Error('Error retrieving alert details');
                    const data = await res.json();
                    // Map the received data to our state; note that 'image' is not provided by the server.
                    setAlertData({
                        alert_title: data.alert_title,
                        description: data.description,
                        alert_type: data.alert_type,
                        severity_level: data.severity_level,
                        starting_date: data.starting_date ? data.starting_date.substring(0, 10) : '',
                        closing_date: data.closing_date ? data.closing_date.substring(0, 10) : '',
                        planned_duration: data.planned_duration,
                        status: data.status,
                        public_status: data.public_status,
                        postal_code: data.postal_code,
                        longitude: data.longitude,
                        latitude: data.latitude,
                        radius: data.radius,
                        image: null, // File input will be used if a new image is selected.
                    });
                } catch (err: any) {
                    setError(err.message);
                }
            };
            fetchAlert();
        }
    }, [id, isEditing]);

    // Handle changes for input and textarea fields.
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        setAlertData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle file input change for image uploads.
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAlertData((prev) => ({ ...prev, image: e.target.files[0] }));
        }
    };

    // Handle form submission for creating or editing an alert.
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            let res;
            const formData = new FormData();
            // Create a payload object with all alert fields (exclude "image" because that's handled separately)
            const payload = {
                alert_title: alertData.alert_title,
                description: alertData.description,
                alert_type: alertData.alert_type,
                severity_level: alertData.severity_level,
                starting_date: alertData.starting_date,
                closing_date: alertData.closing_date,
                planned_duration: alertData.planned_duration,
                public_status: alertData.public_status,
                postal_code: alertData.postal_code,
                longitude: alertData.longitude,
                latitude: alertData.latitude,
                radius: alertData.radius,
            };
            // Append the alert data as a JSON string under the key "alert"
            formData.append('alert', JSON.stringify(payload));

            // Append the image file only if provided
            if (alertData.image) {
                formData.append('file', alertData.image);
            }

            if (isEditing && id) {
                res = await fetch(`${API_URL}/alerts/${id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData,
                });
            } else {
                res = await fetch(`${API_URL}/alerts`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });
            }

            if (!res.ok) {
                throw new Error(isEditing ? 'Error updating alert' : 'Error creating alert');
            }
            navigate('/alerts');
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Handle deletion of an alert (only in edit mode).
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this alert? This action cannot be undone.")) {
            return;
        }
        try {
            const res = await fetch(`${API_URL}/alerts/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Error deleting alert');
            // After deletion, navigate back to alerts list.
            navigate('/alerts');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">{isEditing ? 'Edit Alert' : 'Create Alert'}</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block mb-1">Title</label>
                    <input
                        type="text"
                        name="alert_title"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.alert_title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/* Description */}
                <div className="mb-4">
                    <label className="block mb-1">Description</label>
                    <textarea
                        name="description"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
                {/* Alert Type */}
                <div className="mb-4">
                    <label className="block mb-1">Alert Type</label>
                    <input
                        type="number"
                        name="alert_type"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.alert_type}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/* Severity Level */}
                <div className="mb-4">
                    <label className="block mb-1">Severity Level</label>
                    <select
                        name="severity_level"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.severity_level}
                        onChange={handleInputChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                {/* Starting Date */}
                <div className="mb-4">
                    <label className="block mb-1">Starting Date</label>
                    <input
                        type="date"
                        name="starting_date"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.starting_date}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Closing Date */}
                <div className="mb-4">
                    <label className="block mb-1">Closing Date</label>
                    <input
                        type="date"
                        name="closing_date"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.closing_date}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Planned Duration */}
                <div className="mb-4">
                    <label className="block mb-1">Planned Duration (days)</label>
                    <input
                        type="number"
                        name="planned_duration"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.planned_duration || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Public Status */}
                <div className="mb-4 flex items-center">
                    <label className="mr-2">Public Alert:</label>
                    <input
                        type="checkbox"
                        name="public_status"
                        checked={alertData.public_status || false}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Postal Code */}
                <div className="mb-4">
                    <label className="block mb-1">Postal Code</label>
                    <input
                        type="text"
                        name="postal_code"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.postal_code}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Longitude */}
                <div className="mb-4">
                    <label className="block mb-1">Longitude</label>
                    <input
                        type="number"
                        name="longitude"
                        step="0.0001"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.longitude || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Latitude */}
                <div className="mb-4">
                    <label className="block mb-1">Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        step="0.0001"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.latitude || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Radius */}
                <div className="mb-4">
                    <label className="block mb-1">Radius (km)</label>
                    <input
                        type="number"
                        name="radius"
                        step="0.1"
                        className="w-full border border-gray-300 p-2 rounded"
                        value={alertData.radius || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* Picture */}
                <div className="mb-4">
                    <label className="block mb-1">Alert Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {alertData.image && (
                        <p className="mt-2 text-sm text-gray-600">Selected file: {alertData.image.name}</p>
                    )}
                </div>
                {/* Buttons container: Delete on the left, Edit/Create on the right */}
                <div className="flex justify-between items-center mt-4">
                    {isEditing ? (
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Delete Alert
                        </button>
                    ) : (
                        // If not editing, keep an empty div to reserve space.
                        <div className="w-32"></div>
                    )}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {isEditing ? 'Save Alert' : 'Create Alert'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AlertEdit;
