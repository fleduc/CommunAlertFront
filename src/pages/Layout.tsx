// src/components/Layout.tsx
import React, {ReactNode} from 'react';
import Header from '../components/Header';

const Layout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex flex-col h-screen  md:w-1/3">
                <Header/>
                <div className="w-full px-4 py-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
