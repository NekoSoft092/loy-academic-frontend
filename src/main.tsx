import React from 'react';
import ReactDOM from 'react-dom/client'
import { AppRouter } from './router';
import { useAppStore } from './stores/app-store';
import { useChatStore } from './stores/chat-store';
import './normalize.css';
import './styles.css';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    as?: string
  }
}

// Stores
useAppStore
  .getState()
  .init()
  .catch((err) => {
    console.error(err)
  });

useChatStore.getState().init()
  .catch((error)=> {
    console.error(error);
  });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <AppRouter />
  </React.StrictMode>
)
