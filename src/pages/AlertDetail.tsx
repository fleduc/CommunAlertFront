// src/pages/AlertDetail.tsx
/**
 * AlertDetail Page Component
 *
 * This component displays the detailed information of an alert,
 * including its messages, and provides a form to send a new message.
 *
 * @module AlertDetail
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Interface representing a message.
 *
 * @interface Message
 * @property {number} id - Unique identifier for the message.
 * @property {string} content - Content of the message.
 * @property {Object} sender - Information about the sender.
 * @property {number} sender.id - Unique identifier for the sender.
 * @property {string} sender.username - Username of the sender.
 * @property {Object.<string, number>} reactions - Reactions on the message, mapping emoji to count.
 * @property {boolean} read - Indicates whether the message has been read.
 * @property {number} sender_id - The sender's unique identifier (redundant with sender.id).
 */
interface Message {
    id: number;
    content: string;
    sender: { id: number; username: string };
    reactions: { [emoji: string]: number };
    read: boolean;
    sender_id: number;
}

/**
 * Interface representing an alert.
 *
 * @interface Alert
 * @property {number} id - Unique identifier for the alert.
 * @property {string} alert_title - Title of the alert.
 * @property {string} description - Description of the alert.
 * @property {number} alert_type - Type of the alert.
 * @property {string} [closing_date] - Optional closing date for the alert.
 * @property {string} [postal_code] - Optional postal code.
 * @property {string} created_at - Creation date of the alert.
 * @property {number} user_id - ID of the user who created the alert.
 * @property {Message[]} messages - List of messages associated with the alert.
 */
interface Alert {
    id: number;
    alert_title: string;
    description: string;
    alert_type: number;
    closing_date?: string;
    postal_code?: string;
    created_at: string;
    user_id: number;
    messages: Message[];
}

/**
 * AlertDetail component displays detailed information about an alert,
 * including its messages, and allows sending a new message.
 *
 * @component
 * @returns {JSX.Element} The AlertDetail component.
 */
const AlertDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // user contains the info of the logged-in user
    const { user } = useAuth();
    // If user is not defined, currentUserId defaults to 0 (or handle accordingly)
    const currentUserId = user ? user.id : 0;
    const [alertData, setAlertData] = useState<Alert | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    /**
     * Fetches the alert details and its messages from the API.
     *
     * @async
     * @function fetchAlertDetail
     * @throws Will throw an error if the API call fails.
     */
    const fetchAlertDetail = async () => {
        if (!id) {
            setError("No alert ID provided.");
            return;
        }
        try {
            const resAlert = await fetch(`${API_URL}/alerts/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!resAlert.ok) throw new Error('Error retrieving alert details');
            const alertInfo = await resAlert.json();

            const resMessages = await fetch(`${API_URL}/alerts/${id}/messages/`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!resMessages.ok) throw new Error('Error retrieving messages');
            const messages = await resMessages.json();

            setAlertData({
                ...alertInfo,
                messages,
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchAlertDetail();
    }, [id]);

    /**
     * Handles the form submission to send a new message.
     *
     * @async
     * @function handleSendMessage
     * @param {React.FormEvent} e - The form event.
     * @throws Will throw an error if the API call fails.
     */
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/alerts/${id}/messages/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newMessage }),
            });
            if (!res.ok) throw new Error('Error sending message');
            setNewMessage('');
            fetchAlertDetail();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}
            {alertData ? (
                <>
                    <h1 className="text-3xl font-bold mb-2">{alertData.alert_title}</h1>
                    <p className="mb-4">{alertData.description}</p>

                    <h2 className="text-2xl font-bold mt-8">Messages</h2>
                    <ul>
                        {alertData.messages?.map((message) => {
                            console.log("message", message);
                            const isMine = message.sender_id === currentUserId;
                            return (
                                <li key={message.id} className="mb-2">
                                    <div className={`flex ${isMine ? "justify-end ml-6" : "justify-start mr-6"}`}>
                                        <div className={`message p-4 rounded ${isMine ? "bg-blue-100" : "bg-gray-100"}`}>
                                            <p>{message.content}</p>
                                            <div className={`${isMine ? "text-right" : "text-left"}`}>
                                                <span className="italic text-xs font-bold">{message.sender.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <form onSubmit={handleSendMessage} className="mt-4">
                        <div className="mb-4">
                            <label className="block mb-1">New Message</label>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            Send Message
                        </button>
                    </form>
                </>
            ) : (
                <p>Loading…</p>
            )}
        </div>
    );
};

export default AlertDetail;
