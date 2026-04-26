/* eslint-disable @typescript-eslint/no-floating-promises */
import { useAuthStore } from '@/stores/auth-store';
import './chat-view.css';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import { useChatStore } from '@/stores/chat-store';
import { useEffect, useState, useRef } from 'react';
import { getHealth } from '@/services/app-service';
import { LoaderComponent, LoaderSize } from '@/components/atoms/loader/loader-component';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { ChatFormComponent } from '@/components/organisms/chat-form/chat-form-component';
import { ErrorModalComponent } from '@/components/molecules/error-modal/error-modal-component';
import { onWeb } from '@/lib/windows';
import type { IMessage } from '@/stores/chat-store';
import { MessageComponent } from '@/components/atoms/message/message-component';
import { useAppStore } from '@/stores/app-store';
import { ModalPDFComponent } from '@/components/molecules/modal-pdf/modal-pdf-component';
import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';
import { RoutePath } from '@/router';

export function ChatView(): JSX.Element {

  const { bot_id: botId } = useParams<{ bot_id: string }>();
  const navigate = useNavigate();
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  const [setUserId] = useAuthStore((state) => [
    state.setUserId
  ])

  const [theme, setTheme, name, getGeneralInformacion] = useUserStore((store) => [
    store.theme,
    store.setTheme,
    store.name,
    store.getGeneralInformacion
  ])

  const [isAvailable, setAvailable, showNotificationsPanel] = useAppStore((state) => [
    state.isAvailable,
    state.setAvailable,
    state.showNotificationsPanel
  ])

  const [isTyping, messages, error, closeMessageError, botSelected, loadMessages, setMessages] = useChatStore((state) => [
    state.isTyping,
    state.messages,
    state.error,
    state.closeMessageError,
    state.botSelected,
    state.loadMessages,
    state.setMessages
  ]);

  const init = async (id: string): Promise<void> => {
    if (id.length > 0 && messages.length === 0) {
      setInitLoading(true)
      await getGeneralInformacion(id)
      await loadMessages(id, 0, 100)
      setInitLoading(false)
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

  const checkAvailable = async (): Promise<void> => {
    const health: boolean = await getHealth();
    setAvailable(health);
  }

  useEffect(() => {
    // Prevenir ejecución múltiple (React 18 Strict Mode, etc)
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    console.log(botId, botSelected)
    if (botId !== null && botSelected === null) {
      navigate(RoutePath.ASSISTANS);
      return;
    }

    const userId: string | null = localStorage.getItem('user-id') !== null ? localStorage.getItem('user-id') as string : '';
  
    if (userId.length === 0) {
      if (localStorage.getItem('user-id') !== null) {
        setUserId(localStorage.getItem('user-id') as string)
      } else {
        setUserId(userId)
      }
    }
    if (localStorage.getItem('theme') !== null) {
      setTheme(localStorage.getItem('theme') as string)
    }

    setAvailable(false)
    checkAvailable();
    init(userId).catch((err) => {
      console.log(err)
    });

    return () => {
      setAvailable(false);
      setMessages([]);
    }
  }, [])

  return (
    <div data-theme={theme} className={'view bg-primary'}>

      <AnimatePresence>
        <motion.div style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className='flex'>
          <SideBarComponent userName={name} />
          
          <main style={{ width: showNotificationsPanel ? '60%' : '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>

            <MainContainer style={{ overflow: 'hidden', height: '100%' }}>
              {(onWeb(window) || true) && (
                <ModalPDFComponent />
              )}
              {botSelected !== null && (
                <HeaderComponent
                  name={botSelected !== null ? botSelected.name : 'Sage'}
                  available={isAvailable}
                  chatHeader={true}
                  backbutton={true}
                />
              )}
              

              {initLoading && (
                <LoaderComponent
                  size={LoaderSize.MEDIUM}
                />
              )}

              {error.length > 0 && (
                <ErrorModalComponent
                  message={error}
                  closeModal={() => {
                    closeMessageError()
                  }}
                />
              )}

              <div style={{}}>

                <ChatContainer
                  style={{ position: 'fixed', overflow: 'hidden', bottom: '70', width: '80%' }}>
                  <MessageList
                    autoScrollToBottomOnMount={true}
                    autoScrollToBottom={true}
                    loadingMore={false}
                    onYReachStart={async (element: HTMLDivElement): Promise<void> => { }}
                    loadingMorePosition="top"
                    style={{ height: '92%', maxHeight: '800px', minHeight: '200px', overflowX: 'auto', overflowY: 'scroll', marginTop: '70px', marginBottom: '80px' }}
                    typingIndicator={
                      isTyping && (
                        <TypingIndicator
                          style={{ marginLeft: '10px' }}
                          content="Typing ... "
                        />
                      )}>
                    
                      {messageListComponent}
                    
                  </MessageList>
                </ChatContainer>

                <ChatFormComponent />

              </div>

            </MainContainer>
          </main>
          {showNotificationsPanel && <DetailSideBar type='notifications' />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
