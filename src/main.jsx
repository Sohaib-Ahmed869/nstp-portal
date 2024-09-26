import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { TowerProvider } from './context/TowerContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TowerProvider>
      <App />
    </TowerProvider>
  </StrictMode>
);