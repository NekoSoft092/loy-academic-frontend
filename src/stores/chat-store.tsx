import { loadMessagesRequest, talkWithIA } from '@/services/app-service';
import { create } from 'zustand';

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  error: '',
  isLoadingMoreMessages: false,
  threadId: '',
  botName: 'elena',
  botSelected: null,
  bots: [],
  botSessions: {},
  setBotSelected: (bot: IBot | null): void => {
    set({botSelected: bot});
    localStorage.setItem('bot-selected', bot !== null ? bot.id : '');
  },
  findBotById: (id: string): IBot | null => {
    const bots = get().bots;
    const botFound = bots.find((bot: IBot) => bot.id === id);
    return botFound !== undefined ? botFound : null;
  },
  loadBotSelected: (): IBot | null => {
    const botId = localStorage.getItem('bot-selected');
    if(botId !== null) {
      const bot = get().findBotById(botId);
      return bot;
    }
    return null;
  },
  loadMessages: async (userId: string, skip: number, limit: number): Promise<void> => {
    if (userId.length !== 0 && get().messages.length === 0) {
      const botSelected = get().botSelected;
      if (botSelected === null) throw new Error('No bot selected');
      const botId = botSelected.id;
      const response: Response = await loadMessagesRequest(userId, skip, limit, botId)
      
      try {
        const messagesResponse: IMessageResponse = await response.json()
        console.log(messagesResponse)

        const oldMessages: IMessage[] = messagesResponse.messages
        set({messages: oldMessages})

      } catch(error) {
        console.log(error)
      }
    }
  },

  loadMoreMessages: async () => {
    set({ isLoadingMoreMessages: true })
  },

  setSessionId: (botId: string, sessionId: string): void => {
    const botSessions = get().botSessions;
    botSessions[botId] = sessionId;
    set({ botSessions });
  },

  getSessionId: (botId: string): string | undefined => {
    return get().botSessions[botId];
  },

  addMessage: async (message: string, userId: string, botId: string) => {
    let userIdFallback: string | null = userId
    if(userId === '') {
      userIdFallback = localStorage.getItem('user-id') !== null? localStorage.getItem('user-id'): ''
    }
    if (userIdFallback !== null) {
      set({ isTyping: true })
      const messages = get().messages
      messages.push({
        id: userIdFallback,
        message,
        sender: 'user',
        sentTime: new Date().toString(),
        direction: 'outgoing',
        bot_id: botId
      })
      set({ messages })
      try {
        const botSelected = get().botSelected;
        if (botSelected === null) throw new Error('No bot selected');
        
        // Obtener el session_id si existe
        const sessionId = get().getSessionId(botId);
        
        const response = await talkWithIA(message, userIdFallback, botSelected as any, sessionId);
        const dataResponse = await response.json()
        
        // Si la respuesta contiene session_id, guardarlo para futuras interacciones
        if (dataResponse.session_id !== undefined && dataResponse.session_id !== null) {
          get().setSessionId(botId, dataResponse.session_id);
        }
        
        messages.push({
          id: botSelected.id,
          message: await dataResponse.message,
          sender: 'bot',
          sentTime: new Date().toString(),
          direction: 'incoming',
          bot_id: botSelected.id
        })
    
        set({ messages, isTyping: false })
      }
      catch(e: any) {
        set({ error: e.message })
        set({ isTyping: false })
      }
    }
  },
  clearMessages: () => {
    set({ messages: [] })
  },
  closeMessageError: (): void => {
    set({ error: ''})
  }, 
  setMessages: (pMessages: IMessage[]): void => {
    set({messages: pMessages})
  }, 
  setBotName: (name: string): void => {
    set({botName: name});
  },
  
  generatedPDFMessage: null,
  setGeneratedPDFMessage: (pMessage: null | IMessage): void => {
    set({generatedPDFMessage: pMessage});
  },

  init: async(): Promise<void> => {
  }

}))

export interface IMessage {
  id: string
  message: string;
  sender: 'user' | 'bot';
  sentTime: string;
  direction: 'incoming' | 'outgoing';
  bot_id: string | undefined;
}

export interface IMessageResponse {
  messages: IMessage[]
}

export interface IBot {
  id: string;
  name: string;
  description: string;
  personality: string;
  instructions: string;
  plugins: IPlugin[];
  profile_picture: string;
  createdAt: string;
  updateAt: string;
  input_transformers: any[]
  llm_settings: any;
}

export interface IPlugin{
  name: string;
  description: string;
  discriminator: string
}

export interface ChatStore {
  messages: IMessage[];
  isTyping: boolean;
  isLoadingMoreMessages: boolean;
  botSelected: IBot | null;
  setBotSelected: (bot: IBot | null) => void;
  loadBotSelected: () => IBot | null;
  bots: IBot[];
  findBotById: (id: string) => IBot | null;
  botSessions: { [botId: string]: string };
  setSessionId: (botId: string, sessionId: string) => void;
  getSessionId: (botId: string) => string | undefined;

  loadMessages: (userId: string, skip: number, limit: number) => Promise<void> 
  addMessage: (message: string, userId: string, botId: string) => void;
  clearMessages: () => void;
  error: string;
  closeMessageError: () => void;
  loadMoreMessages: (key: string) => void
  threadId: string
  setMessages: (pMessage: IMessage[]) => void
  botName: string;
  setBotName: (name: string) => void;

  generatedPDFMessage: null | IMessage;
  setGeneratedPDFMessage: (pMessage: null | IMessage) => void ;
  init: () => Promise<void>;
}
