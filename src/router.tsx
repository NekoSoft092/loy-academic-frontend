import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsView } from './views/core/settings-view';
import { ChatView } from './views/chat/chat-view';
import { Protected } from './components/auth/protected';
import { RegisterView } from './views/register/register-view';
import { ExistsEmailView } from '@/views/exists-email/exists-email-view';
import { DevView } from './views/dev/dev-view';
import { LoginView } from './views/login/login-view';
import { RegisterTwoView } from './views/register/register-two-view';
import { RegisterThreeView } from './views/register/register-three-view';

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
          <Route path="/is-registered" element={<ExistsEmailView />} />
          <Route path="/register-two" element={<RegisterTwoView/>} />
          <Route path='/register-three' element={<RegisterThreeView/>} />
          <Route path="/login" element={<LoginView />} />
          <Route path='/chat' element={ <ChatView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/dev" element={<DevView />} />        
          </Routes>
      </Router>
    </>
  )
}
