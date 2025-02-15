// src/components/Layout.tsx
import React, { ReactNode } from 'react';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="w-full max-w-4xl px-4 py-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
