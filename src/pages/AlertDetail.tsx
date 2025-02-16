// src/pages/AlertDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
    id: number;
    content: string;
    reactions: { [emoji: string]: number };
    read: boolean;
    sender_id: number;
}

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

const AlertDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth(); // user contient les infos de l'utilisateur connecté
    const currentUserId = user ? user.id : 0; // Si user n'est pas défini, on peut définir 0 ou gérer le cas différemment
    const [alertData, setAlertData] = useState<Alert | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    const fetchAlertDetail = async () => {
        if (!id) {
            setError("Aucun ID d'alerte fourni.");
            return;
        }
        try {
            const resAlert = await fetch(`${API_URL}/alerts/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!resAlert.ok) throw new Error('Erreur lors de la récupération des détails de l’alerte');
            const alertInfo = await resAlert.json();

            const resMessages = await fetch(`${API_URL}/alerts/${id}/messages/`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!resMessages.ok) throw new Error('Erreur lors de la récupération des messages');
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
            if (!res.ok) throw new Error('Erreur lors de l’envoi du message');
            setNewMessage('');
            fetchAlertDetail();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleAddReaction = async (messageId: number, emoji: string) => {
        try {
            const res = await fetch(`${API_URL}/messages/${messageId}/reactions`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emoji }),
            });
            if (!res.ok) throw new Error('Erreur lors de l’ajout de la réaction');
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
                            const isMine = message.sender_id === currentUserId;
                            return (
                                <li key={message.id} className="mb-2">
                                    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className={`p-4 rounded ${isMine ? "bg-blue-100" : "bg-gray-100"}`}>
                                            <p>{message.content}</p>
                                            <div className="mt-2 flex items-center space-x-2">
                                                <button onClick={() => handleAddReaction(message.id, '👍')} className="p-1 border rounded">
                                                    👍
                                                </button>
                                                <button onClick={() => handleAddReaction(message.id, '❤️')} className="p-1 border rounded">
                                                    ❤️
                                                </button>
                                                <button onClick={() => handleAddReaction(message.id, '😂')} className="p-1 border rounded">
                                                    😂
                                                </button>
                                                <span className="text-sm">Réactions : {JSON.stringify(message.reactions)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <form onSubmit={handleSendMessage} className="mt-4">
                        <div className="mb-4">
                            <label className="block mb-1">Nouveau message</label>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                            Envoyer le message
                        </button>
                    </form>
                </>
            ) : (
                <p>Chargement…</p>
            )}
        </div>
    );
};

export default AlertDetail;
