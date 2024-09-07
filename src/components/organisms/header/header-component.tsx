import { useNavigate, type NavigateFunction } from 'react-router-dom';
import './header-component.css';
import { useEffect, useState } from 'react';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import { useAppStore } from '@/stores/app-store';

export interface IHeaderComponentProps {
    name: string;
    available: boolean;
}

export function HeaderComponent( props: IHeaderComponentProps ): JSX.Element {

    // Variables
    const navigate: NavigateFunction = useNavigate();
    const [ isOpenSettings, setIsOpenSettings ] = useState<boolean>(false);
    const [ environment ] = useAppStore((state)=> [
      state.environment
    ])


    // Funtions
    const toggleSetting = (): void => {
      isOpenSettings? setIsOpenSettings(false): setIsOpenSettings(true);
    } 

    const handleLogout = async (): Promise<void> => {
      try {
        // await logout()
        navigate('/login')
      }
      catch (err) {
        console.log(err)
      }
    }

    useEffect(()=> {
      
    }, [ props.available, environment])

      // Refactor a menu and items on array
    return (
        <header className={'header-container'} as="ConversationHeader">
            <nav>
              <button className="circle">
                <Avatar
                  src="/assistants/elena-ia-assistant.svg"
                  name={'Elena'}
                  status={ props.available ? "available": "dnd" }
                />
              </button>
              <h5 className="max left-align cap">{ props.name }</h5>
              <button
                onClick={toggleSetting}
                className="circle transparent"
              >
                <i>more_vert</i>
                { (isOpenSettings && window.__TAURI_METADATA__ === undefined) && (
                  <menu
                    style={{ fontSize: '1rem'}}
                    className={'left no-wrap'}
                  >
                    <a className='menu-link-sage'
                      onClick={() => {
                        navigate('/settings')
                      }}
                    >
                      <p className='menu-link-sage'>Ajustes</p>
                    </a>
                    <a onClick={handleLogout} className='menu-link-sage'>Salir</a>
                  </menu>
                )}

                {(window.__TAURI_METADATA__ !== undefined) && (
                  <menu
                    style={{ fontSize: '1rem' }}
                    className={'left no-wrap' + (isOpenSettings? ' active': '')}
                  >
                    <a className='menu-link-sage'
                      onClick={() => {
                        navigate('/settings')
                      }}
                    >
                      <p className='menu-link-sage'>Ajustes</p>
                   
                    </a>
                    <a onClick={handleLogout}>
                       <p className='menu-link-sage'>Salir</p>
                    </a>
                  </menu>
                )}
                
              </button>
            </nav>
          </header>
    )
}
