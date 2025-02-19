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
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { SpotifyWidgetComponent} from '@/components/organisms/spotify-widget/spotify-widget-component';

export function ChatView(): JSX.Element {

  const [ initLoading, setInitLoading ] = useState<boolean>(false);

  const [ tokenSpotify, setTokenSpotify ] = useState<string | null | undefined>(null);

  const [ setUserId ] = useAuthStore((state) => [
    state.setUserId
  ])

  const [ theme, setTheme, name, getGeneralInformacion] = useUserStore((store)=> [
    store.theme, 
    store.setTheme, 
    store.name, 
    store.getGeneralInformacion
  ])

  const [ isAvailable, setAvailable ] = useAppStore((state)=> [
    state.isAvailable, 
    state.setAvailable
  ])

  const [isTyping, messages, error, closeMessageError, botName, loadMessages ] = useChatStore((state) => [
    state.isTyping,
    state.messages,
    state.error,
    state.closeMessageError,
    state.botName, 
    state.loadMessages
  ]);

  const navigate: NavigateFunction = useNavigate();
  
  const handleLogout = async (): Promise<void> => {
    try {
      navigate('/login')
    }
    catch (err) {
      console.log(err)
    }
  }

  const init = async (id: string): Promise<void> => {
    if (id.length > 0 && messages.length === 0) {
      console.log('init')
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

  const checkAvailable = async(): Promise<void> => {
    const health: boolean = await getHealth();
    setAvailable(health);
  }

  useEffect(()=> {
    const userId: string | null = localStorage.getItem('user-id') !== null? localStorage.getItem('user-id') as string: '';
    const spotifyToken: string | null | undefined = localStorage.getItem('spotify-token') !== undefined? localStorage.getItem('spotify-token') as string: null;
    console.log(spotifyToken)
    setTokenSpotify(spotifyToken)

    if (userId.length === 0) {
      if(localStorage.getItem('user-id') !== null) {
        setUserId(localStorage.getItem('user-id') as string )
      } else {
        setUserId(userId)
      }
    } 
    if(localStorage.getItem('theme') !== null) {
      setTheme(localStorage.getItem('theme') as string)
    }

    setAvailable(false)
    checkAvailable();
    init(userId).then(()=> {}).catch((err) => {
      console.log(err)
    });

    return () => {
      setAvailable(false);
    }
  }, [name])

  return (
    <div data-theme={theme} className={'view bg-primary'}>

    <AnimatePresence>
      <motion.div style={{ width: '100%', height: '100%' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className='flex'>

          <div className='bg-base-100 flex flex-col justify-between pb-4' style={{width: '20%', minWidth: '0px', maxWidth: '400px', paddingLeft: '10px', paddingRight: '10px'}}>
            <div className=''>
                <div className="flex-row justify-center align-end" style={{marginTop: '0rem'}}>
                    <h3 className="text-primary bold center-align" style={{fontFamily: 'Poppins-Medium', fontSize: '3rem'}}>Loy</h3>
                    <p style={{fontFamily: 'Poppins-Regular', fontSize: '1rem' }}>Academic</p>
                </div>

            <ul className="menu bg-base-300 rounded-box mt-6">
              <li>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p>Inicio</p>
                </a>
              </li>
              <li>
                <a>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                  <p>Tutorias</p>
                </a>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  <p>Chats Directos</p>
                </a>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <p>Trabajo en grupo</p>
                </a>
              </li>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p>Tienda</p>
                </a>
              </li>
            </ul>
          </div>

          <div className=''>
            {(tokenSpotify == null || tokenSpotify === undefined || tokenSpotify === '' || tokenSpotify === 'undefined') && (
              <>
              <ul className='menu rounded-box mb-4' style={{backgroundColor: '#1ED760'}} onClick={() => {
                window.location.href = 'http://localhost:8000/api/v1/auth/spotify-login'
              }}>
              <li className='rounded-box'>
                <a>
                  <img src="assets/imgs/icons/spotify-logo.svg" alt="spotify logo" style={{height: 30}}/>
                  <p style={{color: '#121212'}}>Ingreso Spotify</p>
                </a>
              </li>
            </ul>
              </>
            )} 

            {(tokenSpotify !== null && tokenSpotify !== undefined) && (
              <> 
              <SpotifyWidgetComponent token={tokenSpotify}/>
              </>
            )}
          
            <ul className='menu bg-base-300 rounded-box'>
              <li>
                <a>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>

                  <p>{name}</p>
                </a>
              </li>
            
              <li  onClick={handleLogout}>
                <a className='flex'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                  <p className=''>
                    Cerrar Sessión
                  </p>
                </a>
              </li>
            </ul>
          </div>

          </div>
          <main style={{width: '80%', minWidth: '0px', maxWidth: '2000px'}} className='bg-base-100 bg-register'>
     
            <MainContainer style={{ overflow: 'hidden', height: '100%'}}>
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

        <div style={{}}>
        
        <ChatContainer 
          style={{ position: 'fixed',  overflow: 'hidden', bottom: '70', width: '80%'}}>
          <MessageList
            autoScrollToBottomOnMount={true} 
            autoScrollToBottom={true} 
            loadingMore={false} 
            onYReachStart={async (element: HTMLDivElement): Promise<void> => {}} 
            loadingMorePosition="top"
            style={{height: '92%',  maxHeight: '800px',  minHeight: '200px', overflowX: 'auto', overflowY: 'scroll', marginTop: '70px', marginBottom: '80px'}}
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

        <ChatFormComponent />
        
        </div>
       
      </MainContainer>
      </main>
      </motion.div>
      </AnimatePresence>
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
