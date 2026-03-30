import { create } from 'zustand';
import { loginService, isRegisteredService, registerService, type IRegisterRequest, validateLoginService } from '@/services/auth-service';
import { useChatStore } from './chat-store';

export class ApiErrorResponse implements IErrorResponse {
  detail: string;
  constructor(detail: string) {
    this.detail = detail;
  }
}


export const useAuthStore = create<AuthStore>((set, get) => ({
  token: '',
  userId: '',
  userEmail: '',
  isSignedIn: false,
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
    data:  IRegisterRequest 
  ): Promise<ILoginResponse|ILoginResponseError>  => {
    try {
      const response: Response = await registerService(data)

      if (response.status === 201) {
        const resp: ILoginResponse = await response.json()

        // Save user-id on localStorage
        if(resp.user_id !== undefined) {
          localStorage.setItem('user-id', resp.user_id);
          set({ userId: resp.user_id });
        }

        set({ isSignedIn: true });
        return resp
      } else {
        return await response.json()
      }
    }
    catch(error) {
      return new ApiErrorResponse('Estamos presentando inconvenientes en este momento. Vuelve a intentarlo más tarde');
    }
  },
  logout: async () => {
    set({ isSignedIn: false })
    set({ userId: '' })
    set({ userEmail: ''})
    localStorage.removeItem('user-id')
    localStorage.removeItem('user-email')
    useChatStore.getState().clearMessages()
  },
  checkSignIn: async (): Promise<boolean | ApiErrorResponse> => {
    const userToken: string | null = localStorage.getItem('token')
    const userId: string | null = localStorage.getItem('user-id')
    if (userToken !== null && userId !== null) {
      try {
        const response: Response = await validateLoginService(userId, userToken)
        if (response.status ===  200) {
          const resp = (await response.json()) as ValidateLoginResponse
          return resp.validate_login
        } else {
          const resp = (await response.json()) as IErrorResponse
          return new ApiErrorResponse(resp.detail)
        }

      } catch (error) {
        return new ApiErrorResponse('Estamos presentando inconvenientes en este momento. Vuelve a intentarlo más tarde');
      }
    }
    return false
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
    data:  IRegisterRequest 
  ) => Promise<ILoginResponse|ILoginResponseError> 
  logout: () => Promise<void>
  checkSignIn: () => Promise<boolean | ApiErrorResponse> 
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

export interface ValidateLoginResponse {
  validate_login: boolean 
}

// global
export interface IErrorResponse {
  detail: string;
}

