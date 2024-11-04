import { create } from 'zustand';
import { doesSessionExist, getUserId } from 'supertokens-web-js/recipe/session';
import { signOut } from 'supertokens-web-js/recipe/emailpassword';
import { type AuthResponse, signUp, loginService, isRegisteredService } from '@/services/auth-service';
import { useChatStore } from './chat-store';

class ApiErrorResponse implements IErrorResponse {
  detail: string;
  constructor(detail: string) {
    this.detail = detail;
  }
}


export const useAuthStore = create<AuthStore>((set, get) => ({
  token: '',
  userId: '',
  userEmail: '',
  isSignedIn: true,
  signIn: async (email: string, password: string): Promise<ILoginResponse | ILoginResponseError> => {
    
    try {
      const response =  await loginService(email, password);

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


    } catch(error) {
      return new ApiErrorResponse('Estamos presentando inconvenientes en este momento. Vuelve a intentarlo más tarde');
    }
  },
  // Method to know if the email is already registered
  isRegistered: async (email: string): Promise<IsRegisteredResponse|IErrorResponse> => {
    try {
      const response = await isRegisteredService(email);
      if(response.status === 200) {
        const resp: IsRegisteredResponse = await response.json();
        set({ userEmail: email});
        localStorage.setItem('user-email', email);
        return resp;
      } else {
        return await response.json();
      }
    } catch(error) {
      return new ApiErrorResponse('Estamos presentando inconvenientes en este momento. Vuelve a intentarlo más tarde');
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
    }
    return response
  },
  logout: async () => {
    await signOut();
    set({ isSignedIn: false });
    set({ userId: '' });
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
  signIn: (email: string, password: string) =>  Promise<ILoginResponse|ILoginResponseError> 
  setToken: (token: string) => void 
  setUserId: (userId: string) => void
  setUserEmail: (email: string) => void 
  setIsSignedIn: (signed: boolean) => void
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>
  logout: () => Promise<void>
  checkSignIn: () => Promise<boolean>
  isRegistered: (email: string) => Promise<IsRegisteredResponse|IErrorResponse>
}

// Respose login
export interface ILoginResponse {
  status: string
  user_id: string
  auth_token: string
}

export interface ILoginResponseError {
  detail: string
}

export interface IsRegisteredResponse {
  is_registered: boolean
}

// global
export interface IErrorResponse {
  detail: string;
}