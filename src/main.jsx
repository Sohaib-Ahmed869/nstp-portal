import React, { useEffect } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { TowerProvider } from './context/TowerContext';

const Root = () => {
    useEffect(() => {
        const theme = localStorage.getItem("data-theme") || "nstp";
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "nstpDark") {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    return (
        <StrictMode>
            <TowerProvider>
                <App />
            </TowerProvider>
        </StrictMode>
    );
};

createRoot(document.getElementById('root')).render(<Root />);