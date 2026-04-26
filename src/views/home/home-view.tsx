import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';

export function HomeView(): JSX.Element {

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

    const greetingsByHour = (): string => {
        const currentHour: number = new Date().getHours();
        let greeting: string = 'Hola';

        if (currentHour >= 5 && currentHour < 12) {
            greeting = '¡Buenos días';
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = '¡Buenas tardes';
        } else if (currentHour >= 18 || currentHour < 5) {
            greeting = '¡Buenas noches';
        }

        return greeting;
    }

    const userNameFirstName = name.split(' ')[0]

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
                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px', height: '100%'}} className='bg-base-100 bg-register'>

                            <HeaderComponent name={''} available={true} chatHeader={false} backbutton={false} />

                            <section className='flex flex-row h-full'>
                                <div className='flex pt-20 pl-4 pr-4 pb-4 bg-base-300 mt-10 flex-col gap-6' style={{ width: showNotificationsPanel ? '70%' : '100%', minWidth: '0px', maxWidth: '2000px' }}>
                                    <div className=''>
                                        <h1 className="text-3xl font-bold">{greetingsByHour()} {userNameFirstName}!</h1>
                                    </div>

                                    <div className='flex'>
                                        <h2 className='text-2xl font-bold'></h2>
                                        <div className='flex flex-row'>
                                            <div className=''>

                                            </div>
                                        </div>

                                    </div>
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
