import React, { createContext, useState, useEffect } from 'react';

export const TowerContext = createContext();

export const TowerProvider = ({ children }) => {
    const [tower, setTower] = useState(() => {
        // Retrieve the tower from local storage if it exists
        const savedTower = localStorage.getItem('selectedTower');
        try {
            return savedTower ? JSON.parse(savedTower) : null;
        } catch (e) {
            console.error("Error parsing saved tower from localStorage", e);
            return null;
        }
    });

    useEffect(() => {
        // Save the tower to local storage whenever it changes
        localStorage.setItem('selectedTower', JSON.stringify(tower));
    }, [tower]);

    return (
        <TowerContext.Provider value={{ tower, setTower }}>
            {children}
        </TowerContext.Provider>
    );
};