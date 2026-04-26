import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { useAppStore } from '@/stores/app-store';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';

export function TutorialsView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);

    const navigate: NavigateFunction = useNavigate();

    const [theme, setTheme, name, getGeneralInformacion] = useUserStore((store) => [
        store.theme,
        store.setTheme,
        store.name,
        store.getGeneralInformacion
    ])

    const [setUserId] = useAuthStore((state) => [
        state.setUserId
    ])

    const [showNotificationsPanel] = useAppStore((state) => [
        state.showNotificationsPanel
    ])

    const init = async (id: string): Promise<void> => {
        if (id.length > 0) {

            await getGeneralInformacion(id)
            setInitLoading(false)
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }

    useEffect(() => {
        setInitLoading(true)
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

        init(userId).then(() => { }).catch((err) => {
            console.log(err)
        });

        return () => { }
    }, [name])

    return (
        <div data-theme={theme} className={'view bg-primary'}>
            {initLoading && <span className="loading loading-spinner loading-xl"></span>}
            {!initLoading && (
                <AnimatePresence>
                    <motion.div style={{ width: '100%', height: '100%' }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className='flex'>
                        <SideBarComponent userName={name} />

                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>
                            <section className='flex flex-row h-full'>
                                <div style={{ width: showNotificationsPanel ? '70%' : '100%', minWidth: '0px', maxWidth: '2000px' }} className='flex flex-col'>
                                    <div style={{ marginTop: '70px' }} className=' flex bg-base-100 p-4 gap-2'>
                                        <label className="input flex justify-center items-center gap-2 border-spacing-5">
                                            <svg className="h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                            <input type="search" required placeholder="Buscar la materia" />
                                        </label>
                                        <p className='text-center text-sm mt-7 ' style={{ opacity: 0.5 }}>Por ejemplo: MATE1033 o Calculo Diferencial</p>
                                    </div>
                                    <HeaderComponent
                                        name={''}
                                        available={true}
                                        chatHeader={false}
                                        backbutton={false} />
                                </div>
                                {showNotificationsPanel && <DetailSideBar type='notifications' />}
                            </section>
                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
