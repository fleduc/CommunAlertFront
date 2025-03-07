// src/pages/AlertDetail.tsx
/**
 * AlertDetail Page Component
 *
 * This component displays the detailed information of an alert,
 * including its messages, and provides a form to send a new message.
 *
 * @module AlertDetail
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MessageItem from '../components/MessageItem';
import { Alert } from '../types/models';

const API_URL = import.meta.env.VITE_API_URL;

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
    const [openReactionMessageId, setOpenReactionMessageId] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
     * Toggles the reaction popup for a given message.
     *
     * If the popup for the specified message is already open, it will be closed.
     * Otherwise, it opens the popup for that message and closes any other open popup.
     *
     * @function handleToggleReaction
     * @param {number} messageId - The ID of the message for which to toggle the reaction popup.
     */
    const handleToggleReaction = (messageId: number) => {
         if (openReactionMessageId === messageId) {
             // Close the popup if it is already open
            setOpenReactionMessageId(null);
        } else {
             // Open the popup for this message and close others
            setOpenReactionMessageId(messageId);
        }
    };

    /**
     * Adds a reaction (emoji) to a specific message.
     *
     * @async
     * @function handleAddReaction
     * @param {number} messageId - The ID of the message to which the reaction is added.
     * @param {string} emoji - The emoji representing the reaction.
     * @throws Will throw an error if the API call fails.
     */
    const handleAddReaction = async (messageId: number, emoji: string) => {
        try {
            const res = await fetch(`${API_URL}/alerts/${id}/messages/${messageId}/reaction`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emoji }),
            });
            if (!res.ok) throw new Error('Error adding reaction');
            fetchAlertDetail();
        } catch (err: any) {
            setError(err.message);
        }
    };

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

    /**
     * Handles changes in the textarea, updates the message content,
     * and dynamically adjusts the height of the textarea.
     *
     * @function handleTextareaChange
     * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event from the textarea.
     */
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    isMine={isMine}
                                    isOpen={openReactionMessageId === message.id}
                                    onToggleReaction={(id: number) => handleToggleReaction(id)}
                                    onAddReaction={handleAddReaction}
                                />
                            );
                        })}
                    </ul>
                    <form onSubmit={handleSendMessage} className="mt-4">
                        <div className="flex items-end">
                            <div className="flex-1 pr-2">
                                <textarea
                                    ref={textareaRef}
                                    className="w-full border border-gray-300 p-2 rounded
                                           resize-y overflow-auto"
                                    rows={1}
                                    value={newMessage}
                                    onChange={handleTextareaChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="bg-blue-500 text-white p-2 mb-2 rounded">
                                Send
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                <p>Loading…</p>
            )}
        </div>
    );
};

export default AlertDetail;
