/**
 * Entry Point of the Application
 *
 * This file bootstraps the React application by rendering the main <App /> component
 * into the root DOM element. It uses React 18's createRoot API and wraps the app in <StrictMode>
 * to help identify potential problems in the application.
 *
 * @module index
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Render the App component inside the StrictMode wrapper
createRoot(rootElement!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
