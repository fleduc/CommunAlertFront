// src/types/models.ts

/**
 * Interface representing a reaction to a message.
 *
 * @interface ReactionData
 * @property {number} id - Unique identifier for the reaction.
 * @property {number} message_id - Identifier of the message associated with this reaction.
 * @property {number} user_id - Identifier of the user who reacted.
 * @property {string} emoji - The emoji representing the reaction.
 * @property {string} created_at - The date and time when the reaction was created.
 */
export interface ReactionData {
    id: number;
    message_id: number;
    user_id: number;
    emoji: string;
    created_at: string;
}

/**
 * Interface representing a message.
 *
 * @interface Message
 * @property {number} id - Unique identifier for the message.
 * @property {string} content - Content of the message.
 * @property {object} sender - Information about the sender.
 * @property {number} sender.id - Unique identifier for the sender.
 * @property {string} sender.username - Username of the sender.
 * @property {ReactionData[]} reactions - An array of reactions associated with the message.
 * @property {boolean} read - Indicates whether the message has been read.
 * @property {number} sender_id - The sender's unique identifier (redundant with sender.id).
 */
export interface Message {
    id: number;
    content: string;
    sender: { id: number; username: string };
    reactions: ReactionData[];
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
export interface Alert {
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
