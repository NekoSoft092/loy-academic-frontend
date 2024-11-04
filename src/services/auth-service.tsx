// TODO: improve weak contracts
import {
  signUp as signUpST,
  signIn as signInST,
} from 'supertokens-web-js/recipe/emailpassword';


export interface AuthResponse {
  status:
    | 'OK'
    | 'WRONG_CREDENTIALS_ERROR'
    | 'EMAIL_ALREADY_EXISTS_ERROR'
    | 'FIELD_ERROR'
    | 'GENERAL_ERROR'
    | 'UNKNOWN_ERROR'
  user?: {
    id: string
    email: string
    timeJoined: number
  }
  formFields?: Array<{
    id: string
    error: string
  }>
  trace?: any
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await signInST({
      formFields: [
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    })
    return response
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      return { status: 'GENERAL_ERROR', trace: err }
    } else {
      return { status: 'UNKNOWN_ERROR', trace: err }
    }
  }
}

export async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await signUpST({
      formFields: [
        {
          id: 'first_name',
          value: firstName,
        },
        {
          id: 'last_name',
          value: lastName,
        },
        {
          id: 'email',
          value: email,
        },
        {
          id: 'password',
          value: password,
        },
      ],
    })
    return response
  } catch (err: any) {
    if (err.isSuperTokensGeneralError === true) {
      return { status: 'GENERAL_ERROR', trace: err }
    } else {
      return { status: 'UNKNOWN_ERROR', trace: err }
    }
  }
}

// ---- Sin supertokens

export interface IRegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  phone_number: number
  country_code: number
  birth_date: string
  user_type: string
  university: string
  career: string
  gender?: string
  referred_code?: string
}
const LOY_LOCAL_API: string = 'http://localhost:8000/api/v1';

export async function registerService(request: IRegisterRequest): Promise<Response> {
  const urlRegister: string = LOY_LOCAL_API + "/auth/register";

  const response: Response = await fetch(
    urlRegister, 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(request)
    }
  )
  return response;

} 

export async function loginService(email: string, password: string): Promise<Response> {
  const loginUrl: string = LOY_LOCAL_API + "/auth/login";

  const response: Response = await fetch(
    loginUrl, 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        email, 
        password
      })
    }
  );
  return response;
}

export async function isRegisteredService(email: string): Promise<Response> {
  const isRegisteredUrl: string = LOY_LOCAL_API + "/auth/is-registered";

  const response: Response = await fetch(
    isRegisteredUrl, 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }
  );
  return response;
}
