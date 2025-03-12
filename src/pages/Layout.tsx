// src/components/Layout.tsx
/**
 * Layout Component
 *
 * Provides a consistent layout structure for the application,
 * including a fixed header and a main content area that fills the remaining
 * viewport height and scrolls when necessary.
 *
 * On larger screens, the content area is centered with a fixed width.
 *
 * @module Layout
 */
import React, { ReactNode } from 'react';
import Header from '../components/Header';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            {/* On medium screens and above, limit the width to 1/3 of the screen */}
            <div className="flex flex-col h-screen md:w-1/3 w-full">
                <Header />
                {/* The main content area takes up the remaining height and scrolls if needed */}
                <div className="app-body flex-1 w-full px-4 py-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
