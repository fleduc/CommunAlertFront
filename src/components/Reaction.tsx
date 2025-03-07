// src/components/Reaction.tsx
/**
 * Reaction Component
 *
 * This component displays a panel of available emojis for reacting to a message.
 * When the user hovers out of the panel, it automatically closes.
 *
 * @module Reaction
 */
import React from 'react';

interface ReactionProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
    reactions: { [emoji: string]: number };
}

const availableEmojis = ["👍", "❤️", "🤗", "😂", "😮", "😢"];

/**
 * Reaction component displays a set of emojis for reacting to a message.
 * It calls the provided callbacks when an emoji is selected or when the panel should close.
 *
 * @component
 * @param {ReactionProps} props - The properties for the Reaction component.
 * @returns {JSX.Element} The rendered Reaction component.
 */
const Reaction: React.FC<ReactionProps> = ({ onSelect, onClose, reactions }) => {
    return (
        <div
            className="absolute bottom-full mb-[-15px] left-1/2 transform -translate-x-1/2 bg-gray-400 p-1 pl-3 pr-3 rounded-3xl shadow-lg flex space-x-2 transition-all duration-300"
            onMouseLeave={onClose}>
            {availableEmojis.map((emoji) => (
                <button
                    key={emoji}
                    onClick={() => {
                        onSelect(emoji);
                        onClose();
                    }}
                    className="text-xl relative p-1 bg-gray-400">

                    {emoji}
                    {reactions[emoji] && reactions[emoji] > 1 && (
                        <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                          {reactions[emoji]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default Reaction;
