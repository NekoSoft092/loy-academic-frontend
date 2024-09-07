import { useState, useEffect } from 'react';
import { SettingsList } from '@/components/core/settings-list';
import { SettingsNav } from '@/components/core/settings-nav';
import { motion, AnimatePresence } from 'framer-motion';
import type { ISearchUpdateResponse } from '@/lib/update';
import { searchUpdate } from '@/lib/update';
import { onWeb } from '@/lib/windows';
import './settings-view.css';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { useChatStore } from '@/stores/chat-store';
import { useNavigate, type NavigateFunction, useMatch } from 'react-router-dom';

export function SettingsView(): JSX.Element {
  const isSettingsPath = (useMatch('/settings') ?? false) as boolean;

  const navigate: NavigateFunction = useNavigate();

  const [ updateResponse, setUpdateResponse] = useState<ISearchUpdateResponse | undefined>(undefined);
  const [ version, enable, name ] = useAppStore((store)=>[
    store.version, 
    store.settings[2].enabled, 
    store.settings[2].name
  ]);

  const [ userId, isAdmin] = useAuthStore((store) => [
    store.userId, 
    store.isAdmin
  ])

  
  const [ botName ] = useChatStore((store)=> [
    store.botName
  ])

  const handleSearchUpdate = async(): Promise<void> => {
    const searchResponse: ISearchUpdateResponse = await searchUpdate();
    setUpdateResponse(searchResponse);
  }

  const handleAcceptButton = (): void => {
    setUpdateResponse(undefined);
  }

  const [ admin, setAdmin] = useState<boolean>(false)

  useEffect(()=> {
    console.log(isAdmin)
    if(!isAdmin) {
      const email: string | null = localStorage.getItem('user-email');

      if(email?.includes('@wizzysage.com') === true) {
        setAdmin(true);
      }

    } else {
      setAdmin(true);
    }
    
  }, [isAdmin, userId])
  

  return (
    <div className="flex flex-col reset" style={onWeb(window)?{ }: {marginTop: '0px'}}>
      {isSettingsPath && (
        <AnimatePresence>
          <motion.div
            style={{ width: '100%'}}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <section className={onWeb(window)?'space-between': 'sage-view space-between'}>
              <div>
                <SettingsNav title='Ajustes' />
                <SettingsList />
              
                { (enable && !onWeb(window)) && (
                  <div className='developers-tools'>
                    <h3>{name} activo</h3>

                    <div className=''>
                      { userId !== '' && (
                        <p>Lookup_key: {userId}</p>
                      )}
                     
                      <p>Bot_name: {botName}</p>

                      { ( admin )  && (
                        <button onClick={()=>{
                          // setModalDevelopment(true);
                          navigate('/dev');
                        }}>Editar</button>
                      )}

                    </div>
                  </div>
                )}
              </div>
              { (!onWeb(window)) && (
                <div>
                  <div className='update-section'>
                    <p className='text-center'>Manténgase actualizado sobre nuestras últimas características</p>
                    <button onClick={handleSearchUpdate}>Buscar actualizaciones</button>
                    <p>v{version}</p>
                  </div>
                  
                  {(updateResponse !== undefined) && (
                    <div className='modal-section'>
                      <dialog className={(updateResponse !== undefined)? 'modal active': 'modal'}>
                        <h5>Buscar actualizaciones</h5>
                        <div className=''>{updateResponse.message}</div>
                        <nav className="right-align">
                          <button onClick={handleAcceptButton}>Aceptar</button>
                        </nav>
                      </dialog>
                    </div>
                  )}
                 </div>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
