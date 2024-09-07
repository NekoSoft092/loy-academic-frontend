import 'beercss';
import 'material-dynamic-colors';
import React from 'react';
import ReactDOM from 'react-dom/client'
import './styles.css';
import { AppRouter } from './router';
import { useAppStore } from './stores/app-store';
import { TitleBarComponent } from './components/organisms/title-bar/title-bar';
import { onWeb } from './lib/windows';
import { useChatStore } from './stores/chat-store';

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
    {!onWeb(window) && (
      <TitleBarComponent />
    )}
    <AppRouter />
  </React.StrictMode>
)
