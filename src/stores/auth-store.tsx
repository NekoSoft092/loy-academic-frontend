import { create } from 'zustand';
import { doesSessionExist, getUserId } from 'supertokens-web-js/recipe/session';
import { signOut } from 'supertokens-web-js/recipe/emailpassword';
import { type AuthResponse, signUp, loginService } from '@/services/auth-service';
import { useChatStore } from './chat-store';

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: '',
  userId: '',
  userEmail: '',
  isSignedIn: true,
  isAdmin: false,
  signIn: async (email: string, password: string): Promise<ILoginResponse | ILoginResponseError> => {
    const response =  await loginService(email, password)
    if (response.status === 200) {
      const resp: ILoginResponse = await response.json()

      set({ userId: resp.user_id});
      localStorage.setItem('user-id', resp.user_id)
     
      set({ userEmail: email});
      localStorage.setItem('user-email', email);

      set({token: resp.auth_token})
      localStorage.setItem('token', resp.auth_token)

      set({ isSignedIn: true });
      return resp
    } else {
      const resp: ILoginResponseError = await response.json()
      return {
        detail: resp.detail
      }
    }
  },
  setToken: (token: string): void => {
    set({token})
  },
  setUserId: (userId: string): void => {
    set({userId})
  },
  setUserEmail: (email: string): void => {
    set({userEmail: email})
  },
  setIsAdmin: (admin: boolean) => {
    set({isAdmin: admin})
  },
  setIsSignedIn: (signed: boolean) => {
    set({isSignedIn: signed})
  },
  signUp: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const response = await signUp(firstName, lastName, email, password)
    if (response.status === 'OK') {
      set({ userId: response.user?.id ?? '' });

      // Save user-id on localStorage
      if(response.user?.id !== undefined) {
        localStorage.setItem('user-id', response.user.id);
      }
     
      set({ userEmail: response.user?.email});
      // Save user-email on localStorage
      if(response.user?.email !== undefined) {
        localStorage.setItem('user-email', response.user.email);
      }

      set({ isSignedIn: true });

      set({ isAdmin: response.user?.email.includes('@wizzysage.com') });
    }
    return response
  },
  logout: async () => {
    await signOut();
    set({ isSignedIn: false });
    set({ userId: '' });
    set({ isAdmin: false });
    set({ userEmail: ''});
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-email');
    useChatStore.getState().clearMessages()
  },
  checkSignIn: async () => {
    const isSignedIn = get().isSignedIn
    if (get().userId === '') {
      const userId = await getUserId()
      set({ userId })
    }
    if (!isSignedIn) {
      const sessionExists = await doesSessionExist()
      const userId = await getUserId()
      if (sessionExists) {
        set({ isSignedIn: true })
        set({ userId })
      }
      return sessionExists
    }
    return isSignedIn
  },
}))

export interface AuthStore {
  token: string
  userId: string;
  userEmail: string;
  isSignedIn: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) =>  Promise<ILoginResponse | ILoginResponseError> 
  setToken: (token: string) => void 
  setUserId: (userId: string) => void
  setUserEmail: (email: string) => void 
  setIsAdmin: (admin: boolean) => void
  setIsSignedIn: (signed: boolean) => void
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>
  logout: () => Promise<void>
  checkSignIn: () => Promise<boolean>
}

export interface ILoginResponse {
  status: string
  user_id: string
  auth_token: string
}

export interface ILoginResponseError {
  detail: string
}