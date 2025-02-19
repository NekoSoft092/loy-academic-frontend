
const LOY_LOCAL_API: string = 'http://localhost:8000/api/v1';

export async function getHealth(): Promise<boolean> {
  const urlApi: string = LOY_LOCAL_API;
  const response = await fetch(`${urlApi}/health`);
  return response.status === 200;
}

export async function talkWithIA(message: string, userId: string): Promise<Response>{
  const talkUrl: string = LOY_LOCAL_API + "/messages";
  const response: Response = await fetch(
    talkUrl, 
    {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        message,
        testing: false, 
        user_id: userId
      })
    }
  );
  return response
}

export async function loadMessagesRequest(userId: string, skip: number, limit: number): Promise<Response> {
  const baseURL: string = LOY_LOCAL_API
  const response: Response = await fetch(
    `${baseURL}/messages/${userId}?skip=${skip}&limit=${limit}`,
    {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return response
}
