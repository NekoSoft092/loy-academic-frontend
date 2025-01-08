
export interface IRegisterRequest {
  name: string
  email: string
  password: string
  code_contry: string
  phone_number: number
  university?: string
  referred_friend_code?: string
  pronoum?: string
  birth_date?: string
  career?: string
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

export async function validateLoginService(userId: string, token: string): Promise<Response> {
  const url: string = LOY_LOCAL_API + "/auth/validate-login";
  const response: Response = await fetch(
    url, 
    {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId, 
        auth_token: token
      })
    }
  );
  return response;
}