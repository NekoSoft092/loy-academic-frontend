import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { RoutePath } from '@/router'
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { type IBot, useAppStore } from '@/stores/app-store';
import { LOY_LOCAL_API } from '@/lib/urls';
import { useChatStore } from '@/stores/chat-store';
import { HeaderComponent } from '@/components/organisms/header/header-component';

export function AssistantsView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);
    const hasInitialized = useRef(false);

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

    const [bots] = useAppStore((state) => [
        state.bots
    ])

    const [setBotSelected] = useChatStore((state) => [
        state.setBotSelected
    ])

    const navigateToChat = (botId: string): void => {
        const bot: IBot | undefined = bots.find((b: IBot) => b.id === botId);
        if (bot !== undefined && bot !== null) {
            setBotSelected(bot as any);
            navigate(`/chat/${botId}`)
        }

    }

    const init = async (id: string): Promise<void> => {
        if (id.length > 0) {

            await getGeneralInformacion(id)
            setInitLoading(false)
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }

    useEffect(() => {
        // Prevenir ejecución múltiple
        if (hasInitialized.current) return;
        hasInitialized.current = true;

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

        init(userId).catch((err) => {
            console.log(err)
        });

        return () => { }
    }, [])

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
                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-primary'>
                            <HeaderComponent name={''} available={false} chatHeader={false} backbutton={false} />

                            <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', height: '92%' }} className='mt-20'>

                                <div className='flex flex-row justify-between items-center px-5'>
                                    <h2 className='text-2xl font-bold text-base-100'>Asistentes</h2>
                                </div>


                                <div style={{}}
                                    className="grid grid-cols-2 gap-4 p-5 pb-0">

                                    {bots.map((bot: IBot, index: number) => (
                                        <div key={index} className="card card-side bg-base-100 shadow-sm p-4 h-60">
                                            <figure>
                                                {bot.image_url == null && (
                                                    <img
                                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1eq7oitrNeZF5a_cO6UoIr55ddmhuhGycg&s"
                                                        style={{ width: '200px', height: '200px' }}
                                                        className=''
                                                        alt="bot" />
                                                )}
                                                {bot.image_url != null && (
                                                    <img
                                                        src={LOY_LOCAL_API + "/bots/" + bot.id + "/image"}
                                                        style={{ width: '200px', height: '200px' }}
                                                        className=''
                                                        alt="bot" />
                                                )}

                                            </figure>
                                            <div className="card-body p-0" style={{ width: '70%' }}>
                                                <h2 className="card-title text-primary text-2xl p-0 m-0 pl-2">{bot.name}</h2>
                                                <p className='text-xs pl-2 overflow-hidden' style={{ display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical' }}>{bot.description}</p>
                                                <div className="card-actions justify-between">
                                                    <div className='bg-warning p-2 flex gap-2'>
                                                        <p className='text-warning-content text-xs'>experimental</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            navigateToChat(bot.id)
                                                        }}
                                                        className="btn btn-primary"
                                                    >
                                                        Comenzar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>


                            </div>



                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}