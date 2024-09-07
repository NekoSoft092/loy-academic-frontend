/* eslint-disable @typescript-eslint/no-floating-promises */
import { useAuthStore } from '@/stores/auth-store';
import './chat-view.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import { useChatStore } from '@/stores/chat-store';
import { useEffect, useState } from 'react';
import { getHealth } from '@/services/sage-service';
import { LoaderComponent, LoaderSize } from '@/components/atoms/loader/loader-component';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { ChatFormComponent } from '@/components/organisms/chat-form/chat-form-component';
import { ErrorModalComponent } from '@/components/molecules/error-modal/error-modal-component';
import { onWeb } from '@/lib/windows';
import type { IMessage } from '@/stores/chat-store';
import { MessageComponent } from '@/components/atoms/message/message-component';
import { useAppStore } from '@/stores/app-store';
import { ModalPDFComponent } from '@/components/molecules/modal-pdf/modal-pdf-component';

export function ChatView(): JSX.Element {
  /// const MESSAGES_PER_LOAD: number = 100;

  const [ initLoading, setInitLoading ] = useState<boolean>(false);

  const [ loadingMore, setLoadingMore ] = useState<boolean>(false);

  const [ mounted, setMounted ] = useState<boolean>(false);

  // const [ offsetVar, setOffSetVar ] = useState<number>(0);

  // const [ isLoadedAllMessages, setIsLoadedAllMessages ] = useState<boolean>(false);

  const [ userId ] = useAuthStore<string[]>((state) => [
    state.userId
  ]);

  const [ environment, isAvailable, setAvailable ] = useAppStore((state)=> [
    state.environment, 
    state.isAvailable, 
    state.setAvailable
  ]);

  const [ height ] = useState<number>(window.innerHeight); 

  const [isTyping, messages, error, closeMessageError, setMessages, botName, loadMessages ] = useChatStore((state) => [
    state.isTyping,
    state.messages,
    state.error,
    state.closeMessageError,
    state.setMessages, 
    state.botName, 
    state.loadMessages
  ]);

  // Functions
  const onYReachStart = async (element: HTMLDivElement): Promise<void> => {
    if(loadingMore) {
      return ;
    } else if(userId.length === 0) {
      return ;
    }
    
    // eslint-disable-next-line no-constant-condition
    if(false) {
      setLoadingMore(true);
      const height: number = element.scrollHeight;

      element.scroll({
        top: (height)/10, 
        left: 0
      });
      // await loadMoreMessages(userId);
      setLoadingMore(false);
    }
  }

  const init = async (userId: string): Promise<void> => {
    if (userId.length > 0 && messages.length === 0 && !initLoading && !mounted && !loadingMore) {
      setInitLoading(true)
      await loadMessages(userId, 0, 100)
      setInitLoading(false)
      setMounted(true)
    }
  } 

  
  // TODO: Refactor on compponent /components/chat/message-component.tsx
  const messageListComponent = messages.map((message: IMessage, index: number) => {

    return (
      <MessageComponent
        key={index} 
        id={message.id}
        message={message.message}
        sender={message.sender}
        sentTime={message.sentTime}
        direction={message.direction}
        bot_id={message.bot_id}
      />
    )
  });

  const checkAvailable = async(): Promise<void> => {
    const health: boolean = await getHealth();
    setAvailable(health);
  }

  useEffect(()=> {
    setMessages([]);
    // setOffSetVar(0);
    setAvailable(false)
    checkAvailable();
    init(userId);

    return () => {
      
      setMessages([]);
      // setOffSetVar(0);
      setAvailable(false);
    }
  }, [environment, userId])

  return (
    <div className={onWeb(window)? '' : 'sage-view'}>
     

      <MainContainer style={{ overflow: 'hidden', height: '100%' }}>
        { (onWeb(window) || true)  && (
          <ModalPDFComponent />
        )}
      
        <HeaderComponent
          name={botName}
          available={isAvailable}
        />

        { initLoading && (
          <LoaderComponent 
            size={LoaderSize.MEDIUM}
          />
        )}

        { error.length > 0 && (
          <ErrorModalComponent 
            message={error}
            closeModal={() => {
              closeMessageError()
            }}
          />
        )}

        <div style={ onWeb(window)? {height: height-50 }: {height: '550px'}}>
        <ChatContainer 
          style={{ position: 'relative', height: '100%' ,overflow: 'hidden'}}>
          <MessageList
            autoScrollToBottomOnMount={true} 
            autoScrollToBottom={true} 
            loadingMore={loadingMore} 
            onYReachStart={onYReachStart} 
            loadingMorePosition="top"
            typingIndicator={
              isTyping && (
                <TypingIndicator
                  style={{ marginLeft: '10px' }}
                  content="Elena is typing"
                />
              )}>
            {messageListComponent}
          </MessageList>
        </ChatContainer>
        
        </div>
        <ChatFormComponent />
      </MainContainer>
    </div>
  )
}

// EsLint Refactor 

export interface SageThreadMessage {
  id: string
  role: string
  content: string
  name: string
  timestamp: string
  bot_id?: string
  data?: any
}
