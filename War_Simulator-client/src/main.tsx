// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import { io } from 'socket.io-client'

const token = localStorage.getItem("token");

export const socket = io("http://localhost:3500", {
    auth: {
        token,
    },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
)