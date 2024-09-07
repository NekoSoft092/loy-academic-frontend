import { loadMessagesRequest, talkWithIA } from '@/services/sage-service';
import { create } from 'zustand';

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  error: '',
  isLoadingMoreMessages: false,
  threadId: '',
  botName: 'elena',
  bots: [],
  loadMessages: async (userId: string, skip: number, limit: number): Promise<void> => {
    if (userId.length !== 0 && get().messages.length === 0) {
      const response: Response = await loadMessagesRequest(userId, skip, limit)
      
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

  addMessage: async (message: string) => {
    set({ isTyping: true })
    const messages = get().messages
    messages.push({
      id: 'temp',
      message,
      sender: 'user',
      sentTime: new Date().toString(),
      direction: 'outgoing',
      bot_id: ""
    })
    set({ messages })
    try {
      const response = await talkWithIA(message);
      const dataResponse = await response.json()
      messages.push({
        id: "id_bot",
        message: await dataResponse.message,
        sender: 'bot',
        sentTime: new Date().toString(),
        direction: 'incoming',
        bot_id: "bot_id"
      })
  
      set({ messages, isTyping: false })
    }
    catch(e: any) {
      set({ error: e.message })
      set({ isTyping: false })
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
  bot_id: string
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
  bots: IBot[];
  loadMessages: (userId: string, skip: number, limit: number) => Promise<void> 
  addMessage: (message: string) => void;
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
