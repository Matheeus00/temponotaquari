import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento root não encontrado.');
}

const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);