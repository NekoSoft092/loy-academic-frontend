import { useState, useEffect } from 'react';
import { SettingsList } from '@/components/core/settings-list';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { motion, AnimatePresence } from 'framer-motion';
import type { ISearchUpdateResponse } from '@/lib/update';
import { searchUpdate } from '@/lib/update';
import { onWeb } from '@/lib/windows';
import './settings-view.css';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { useChatStore } from '@/stores/chat-store';
import { useUserStore } from '@/stores/user-store';
import { useNavigate, type NavigateFunction, useMatch } from 'react-router-dom';
import '@/components/organisms/header/header-component.css'
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';

export function SettingsView(): JSX.Element {
  const isSettingsPath = (useMatch('/settings') ?? false) as boolean;

  const navigate: NavigateFunction = useNavigate();
  const [initLoading, setInitLoading] = useState<boolean>(false);

  const [updateResponse, setUpdateResponse] = useState<ISearchUpdateResponse | undefined>(undefined);
  const [version, enable, appSettingsName] = useAppStore((store) => [
    store.version,
    store.settings[2]?.settings[0]?.enabled ?? false,
    store.settings[2]?.settings[0]?.name ?? ''
  ]);

  const [userId] = useAuthStore((store) => [
    store.userId,
  ])

  const [showNotificationsPanel] = useAppStore((store) => [
    store.showNotificationsPanel
  ])

  const [botName] = useChatStore((store) => [
    store.botName
  ])

  const handleSearchUpdate = async(): Promise<void> => {
    const searchResponse: ISearchUpdateResponse = await searchUpdate();
    setUpdateResponse(searchResponse);
  }

  const handleAcceptButton = (): void => {
    setUpdateResponse(undefined);
  }

  return (
    <div data-theme={theme} className={'view bg-primary'}>
      {initLoading && <span className="loading loading-spinner loading-xl"></span>}
      {!initLoading && isSettingsPath && (
        <AnimatePresence>
          <motion.div style={{ width: '100%', height: '100%' }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className='flex'>
            <SideBarComponent userName={userName} />
            <main style={{ width: showNotificationsPanel ? '60%' : '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>
              <HeaderComponent name={''} available={true} chatHeader={false} backbutton={false} />
              <section className='bg-base-200' style={{ marginTop: 80 }}>
                <div>
                  <SettingsList />
                </div>
                {(!onWeb(window)) && (
                  <div>
                    <div className='update-section'>
                      <p className='text-center'>Manténgase actualizado sobre nuestras últimas características</p>
                      <button onClick={handleSearchUpdate}>Buscar actualizaciones</button>
                      <p>v{version}</p>
                    </div>

                    {(updateResponse !== undefined) && (
                      <div className='modal-section'>
                        <dialog className={(updateResponse !== undefined) ? 'modal active' : 'modal'}>
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
            </main>
            {showNotificationsPanel && <DetailSideBar type='notifications' />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
