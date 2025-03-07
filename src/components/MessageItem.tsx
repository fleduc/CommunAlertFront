// src/pages/MessageItem.tsx
/**
 * MessageItem Component
 *
 * This component displays an individual message along with its aggregated reactions.
 * It shows the message content, sender information, and displays a reaction bubble if any reactions exist.
 * When the message block is clicked, it toggles an emoji selection panel (handled by the Reaction component)
 * that allows the user to add or update reactions.
 *
 * @module MessageItem
 */
import React from 'react';
import Reaction from './Reaction';
import { Message } from '../types/models';

/**
 * Props for the MessageItem component.
 *
 * @interface MessageItemProps
 * @property {Message} message - The message object to display.
 * @property {boolean} isMine - Indicates if the message was sent by the current user.
 * @property {boolean} isOpen - Indicates if the reaction panel is open for this message.
 * @property {(messageId: number) => void} onToggleReaction - Callback to toggle the reaction panel.
 * @property {(messageId: number, emoji: string) => void} onAddReaction - Callback to add a reaction to the message.
 */
interface MessageItemProps {
    message: Message;
    isMine: boolean;
    isOpen: boolean;
    onToggleReaction: (messageId: number) => void;
    onAddReaction: (messageId: number, emoji: string) => void;
}

/**
 * MessageItem component displays a single message along with its aggregated reactions,
 * and provides an interface to add new reactions via an emoji selection panel.
 *
 * @component
 * @param {MessageItemProps} props - The props for the component.
 * @returns {JSX.Element} The rendered MessageItem component.
 */
const MessageItem: React.FC<MessageItemProps> = ({ message, isMine, isOpen, onToggleReaction, onAddReaction }) => {
    // Aggregate reactions: e.g., { "👍": 2, "❤️": 1, ... }
    const aggregatedReactions = message.reactions.reduce((acc, reaction) => {
        acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
        return acc;
    }, {} as { [emoji: string]: number });

    const hasReactions = Object.keys(aggregatedReactions).length > 0;

    return (
        <li className="mb-8">
            <div
                className={`relative flex ${isMine ? 'justify-end ml-8' : 'justify-start mr-8'}`}
                onClick={() => onToggleReaction(message.id)}
            >
                {/* The message block */}
                <div className={`p-4 rounded-2xl min-w-[75%] ${isMine ? 'bg-blue-100 rounded-br-sm' : 'bg-gray-100 rounded-bl-sm'} relative`}>
                    <p>{message.content}</p>
                    <div className={isMine ? 'text-right' : 'text-left'}>
                        <span className="italic text-xs font-bold">{message.sender.username}</span>
                    </div>

                    {/* Reaction bubble if at least one reaction exists */}
                    {hasReactions && (
                        <div
                            className={`absolute bottom-[-20px] bg-gray-300 rounded-3xl p-1 pl-3 pr-3 flex items-center space-x-2
                            ${isMine ? 'left-2 justify-start' : 'right-2 justify-end'}`}
                        >
                            {Object.entries(aggregatedReactions).map(([emoji, count]) => (
                                <div key={emoji} className="relative text-lg">
                                    <span>{emoji}</span>
                                    {count > 1 && (
                                        <span className="absolute bottom-[-2px] right-[-5px] bg-red-500 text-white text-xs rounded-full px-1">
                                            {count}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Emoji selection panel (Reaction) */}
                {isOpen && (
                    <Reaction
                        onSelect={(emoji: string) => {
                            onAddReaction(message.id, emoji);
                            onToggleReaction(message.id);
                        }}
                        onClose={() => onToggleReaction(message.id)}
                        reactions={aggregatedReactions}
                    />
                )}
            </div>
        </li>
    );
};

export default MessageItem;
