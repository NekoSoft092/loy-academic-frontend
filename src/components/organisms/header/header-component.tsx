import './header-component.css';
import { useEffect } from 'react';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { useChatStore } from '@/stores/chat-store';
import { LOY_LOCAL_API } from '@/lib/urls';
import { type NavigateFunction, useNavigate, useLocation, type Location } from 'react-router-dom';
import { RoutePath } from '@/router';

export interface IHeaderComponentProps {
  name: string;
  available: boolean;
  chatHeader: boolean;
  backbutton: boolean;
}

export function HeaderComponent(props: IHeaderComponentProps): JSX.Element {

  // Variables
  const location: Location = useLocation();
  const [environment, toggleNotificationsPanel] = useAppStore((state) => [
    state.environment,
    state.toggleNotificationsPanel
  ])

  const [theme, nextTheme] = useUserStore((store) => [
    store.theme,
    store.nextTheme
  ])

  const navigate: NavigateFunction = useNavigate();

  const [bot] = useChatStore((state) => [
    state.botSelected
  ])

  const handleGoBack = (): void => {
    const currentPath: string = location.pathname;
    console.log(currentPath)
    if ( currentPath.includes(RoutePath.CHAT) ) {
      navigate(RoutePath.ASSISTANS);
    } else {
      navigate(-1);
    }
    
  };

  useEffect(() => {
  }, [props.available, environment])

  // Refactor a menu and items on array
  return (
    <header data-theme={theme} className='header-container bg-base-200 flex justify-between pl-5 pr-5' style={{ height: '70px', width: '80%' }} as="ConversationHeader">
      <nav className='flex flex-row justify-center content-center gap-3 items-center'>

        {props.backbutton && (
          <button
            onClick={handleGoBack}
            className="btn btn-ghost"
            title="Go back"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        )}

        {props.chatHeader && (
          <>

            <div className='flex flex-row justify-center content-center gap-2 items-center' onClick={() => {
              navigate(`/assistants/${bot !== null ? bot.id : ''}`)
            }}>
              <button className="circle">

                <Avatar
                  src={bot !== null ? LOY_LOCAL_API + "/bots/" + bot.id + "/image" : ""}
                  name={bot !== null ? bot.name : ""}
                  status={props.available ? "available" : "dnd"}
                />
              </button>
              <h5 className="cap" style={{ fontSize: '20px' }}>
                {props.name}
              </h5>
            </div>
          </>
        )}

      </nav>

      <div className='flex gap-2 justify-center items-center'>

        <button
          onClick={() => {
            nextTheme()
          }}
          style={{ display: 'flex', gap: '5px' }}
          className="">
          <p style={{ textTransform: 'capitalize' }}>{theme}</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
          </svg>

        </button>

        <button onClick={() => { toggleNotificationsPanel() }} className="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>
      </div>
    </header>
  )
}
