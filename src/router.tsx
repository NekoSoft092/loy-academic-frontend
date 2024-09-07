import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsView } from './views/core/settings-view';
import { ChatView } from './views/chat/chat-view';
import { Protected } from './components/auth/protected';
import { RegisterView } from './views/register/register-view';
import { LoginView } from '@/views/login/login-view';
import { DevView } from './views/dev/dev-view';

export function AppRouter(): JSX.Element {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <ChatView />
              </Protected>
            }
          />
          <Route path="/login" element={<LoginView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/dev" element={<DevView />} />        
          </Routes>
      </Router>
    </>
  )
}
