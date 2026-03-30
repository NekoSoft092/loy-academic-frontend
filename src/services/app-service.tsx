import { type IBot } from "@/stores/app-store"

export const LOY_LOCAL_API: string = 'http://localhost:8000/api/v1'

export async function getHealth(): Promise<boolean> {
  const urlApi: string = LOY_LOCAL_API
  const response = await fetch(`${urlApi}/health`)
  return response.status === 200
}

export async function getAllBots(): Promise<Response> {
  const url: string = LOY_LOCAL_API + "/bots"
  const response: Response = await fetch(url, {method: 'GET'})
  return response
}

export async function talkWithIA(message: string, userId: string, bot: IBot, sessionId?: string): Promise<Response>{
  const talkUrl: string = LOY_LOCAL_API + "/messages"
  const body: any = {
    message,
    testing: false, 
    user_id: userId,
    bot_id: bot.id,
    require_execution: true
  }
  
  if (sessionId !== null && sessionId !== undefined) {
    body.session_id = sessionId
  }
  
  const response: Response = await fetch(
    talkUrl, 
    {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify(body)
    }
  );
  return response
}

export async function loadMessagesRequest(userId: string, skip: number, limit: number, botId: string): Promise<Response> {
  const baseURL: string = LOY_LOCAL_API
  const response: Response = await fetch(
    `${baseURL}/messages?first_index=${skip}&last_index=${limit}&user_id=${userId}&bot_id=${botId}`,
    {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return response
}

export interface ICreateBotRequest {
  name: string;
  description: string;
  context: string;
  gender_male: boolean;
  skills: string[];
}

export async function createBot(botData: ICreateBotRequest): Promise<Response> {
  const url: string = LOY_LOCAL_API + "/bots"
  const response: Response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(botData)
  })
  return response
}
