import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { RoutePath } from '@/router'
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import '@/components/organisms/header/header-component.css'
import { type IBot, useAppStore } from '@/stores/app-store';
import { LOY_LOCAL_API } from '@/services/app-service'

export function AssistantsView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);

    const navigate: NavigateFunction = useNavigate();

    const [theme, setTheme, name, getGeneralInformacion, nextTheme] = useUserStore((store) => [
        store.theme,
        store.setTheme,
        store.name,
        store.getGeneralInformacion,
        store.nextTheme
    ])

    const [setUserId] = useAuthStore((state) => [
        state.setUserId
    ])

    const [bots] = useAppStore((state) => [
        state.bots
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
                            <header className='header-container bg-base-200 flex justify-between pl-5 pr-5' style={{ height: '70px', width: '80%' }} as="ConversationHeader">
                                <div className='flex col justify-center'>
                                    <h2 className='text-center bold mt-4' style={{fontSize: 25}}></h2>
                                </div>

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

                            <div style={{ marginTop: '70px' }} className=' flex bg-base-100 p-4 gap-2'>
                                <label className="input flex justify-center items-center gap-2 border-spacing-5">
                                    <svg className="h-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                                    <input type="search" required placeholder="Buscar la materia" /> 
                                </label>
                                <p className='text-center text-sm mt-7 ' style={{opacity: 0.5}}>Por ejemplo: MATE1033 o Calculo Diferencial</p>
                            </div>

                            <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', marginTop: '10px' }}
                                className="grid grid-cols-1 gap-4 p-4">

                                {bots.map((bot: IBot, index: number) => (
                                    <div key={index} className="card card-side bg-base-100 shadow-sm p-4">
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
                                        <div className="card-body" style={{ width: '70%' }}>
                                            <h2 className="card-title">{bot.name}</h2>
                                            <p>{bot.description}</p>
                                            <div className="card-actions justify-between">
                                                <div className='bg-warning p-2 flex gap-2'>
                                                    <p className='text-warning-content text-xs'>experimental</p>
                                                </div>
                                                <button className="btn btn-primary">Comenzar</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}