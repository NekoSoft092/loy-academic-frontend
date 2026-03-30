import './header-component.css';
import { useEffect } from 'react';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { useChatStore } from '@/stores/chat-store';
import { LOY_LOCAL_API } from '@/services/app-service';

export interface IHeaderComponentProps {
  name: string;
  available: boolean;
}

export function HeaderComponent(props: IHeaderComponentProps): JSX.Element {

  // Variables
  const [environment] = useAppStore((state) => [
    state.environment
  ])

  const [theme, nextTheme] = useUserStore((store) => [
    store.theme,
    store.nextTheme
  ])

  const [bot] = useChatStore((state) => [
    state.botSelected
  ])

  useEffect(() => {
  }, [props.available, environment])

  // Refactor a menu and items on array
  return (
    <header data-theme={theme} className='header-container bg-base-200 flex justify-between pl-5 pr-5' style={{ height: '70px', width: '80%' }} as="ConversationHeader">
      <nav className='flex flex-row justify-center content-center gap-4'>
        <button className="circle">

          <Avatar
            src={bot !== null ? LOY_LOCAL_API + "/bots/" + bot.id + "/image" : ""}
            name={bot !== null ? bot.name : ""}
            status={props.available ? "available" : "dnd"}
          />
        </button>
        <h5 className="cap pt-5" style={{ fontSize: '20px' }}>{props.name}</h5>
      </nav>

      <div className='flex gap-2 justify-center'>

        <button
          onClick={() => {
            nextTheme()
          }}
          style={{ display: 'flex', gap: '5px' }}
          className="pt-5">
          <p style={{ textTransform: 'capitalize' }}>{theme}</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
          </svg>

        </button>
      </div>
    </header>
  )
}
