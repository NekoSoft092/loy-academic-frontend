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
import { SpotifyCallbackView } from './views/callback/spotify-callback-view';
import { AssistantsView } from './views/assistants/assistants-view';
import { HomeView } from './views/home/home-view';
import { MarketplaceView } from './views/marketplace/marketplace-view';
import { ForgotPasswordView } from './views/forgot-password/forgot-password-view';
import { AssistantDetailView } from './views/assistant-detail/assistant-detail-view';
import { WorkflowsView } from './views/workflows/workflows-view';
import { TutorialsView } from './views/tutorials/tutorials-view';
import { CreateBotView } from './views/create-bot/create-bot-view';
import { ProfileView } from './views/profile/profile-view';
import { CheckoutView } from './views/checkout/checkout-view';

export function AppRouter(): JSX.Element {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Protected>
                <HomeView />
              </Protected>
            }
          />
          <Route path="/is-registered" element={<ExistsEmailView />} />
          <Route path="/register-two" element={<RegisterTwoView/>} />
          <Route path='/register-three' element={<RegisterThreeView/>} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/forgot-password" element={<ForgotPasswordView />} />
          <Route path='/chat' element={ <ChatView />} />
          <Route path='/chat/:id' element={ <ChatView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/auth/spotifycallback" element={<SpotifyCallbackView />} />
          <Route path="/dev" element={<DevView />} />
          <Route path='/assistants' element={<AssistantsView />}/>
          <Route path='/assistants/:id' element={<AssistantDetailView />}/>
          <Route path='/home' element={<HomeView />}/>
          <Route path='/marketplace' element={<MarketplaceView />}/>
          <Route path='/workflows' element={<WorkflowsView />}/>
          <Route path='/tutorials' element={<TutorialsView />}/>
          <Route path='/create-bot' element={<CreateBotView />}/>
          <Route path='/profile' element={<ProfileView />}/>
          <Route path='/checkout' element={<CheckoutView />}/>
          <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
      </Router>
    </>
  )
}

export enum RoutePath {
  ROOT = '/',
  IS_REGISTERED = '/is-registered',
  REGISTER_TWO = '/register-two',
  REGISTER_THREE = '/register-three',
  LOGIN = '/login',
  FORGOT_PASSWORD = '/forgot-password',
  CHAT = '/chat',
  SETTINGS = '/settings',
  REGISTER = '/register',
  SPOTIFY_CALLBACK = '/auth/spotifycallback',
  DEV = '/dev', 
  ASSISTANS = '/assistants',
  HOME = '/home',
  MARKETPLACE = '/marketplace',
  WORKFLOWS = '/workflows',
  TUTORIALS = '/tutorials',
  CREATE_BOT = '/create-bot',
  PROFILE = '/profile',
  CHECKOUT = '/checkout'
}