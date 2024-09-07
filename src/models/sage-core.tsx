export interface SageBotMessage {
  id: string
  role: string
  content: string
  name: string
  timestamp: string
  bot_id: string
  data: any
}

export interface SageBotThread {
  id: string
  lookup_key: string
  name: string
  is_visible: boolean
  context: any
  created_at: string
  updated_at: string
}

export interface SageThreadMessage {
  id: string
  role: string
  content: string
  name: string
  timestamp: string
  bot_id?: string
  data?: any
}
