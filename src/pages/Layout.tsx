// src/components/Layout.tsx
/**
 * Layout Component
 *
 * Provides a consistent layout structure for the application,
 * including a header and a container for main content.
 *
 * @module Layout
 */
import React, { ReactNode } from 'react';
import Header from '../components/Header';

/**
 * Layout component that wraps its children with a header and provides consistent styling.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The content to be displayed within the layout.
 * @returns {JSX.Element} The Layout component.
 */
const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex flex-col h-screen md:w-1/3">
                <Header />
                <div className="app-body w-full px-4 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
