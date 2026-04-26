import { type NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { useAppStore } from '@/stores/app-store';
import { RoutePath } from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatePresence, motion } from 'framer-motion';
import '@/components/organisms/header/header-component.css'
import './assistant-detail-view.css';
import { LOY_LOCAL_API } from '@/lib/urls';

export function AssistantDetailView(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [initLoading, setInitLoading] = useState<boolean>(false);
    const [detailType, setDetailType] = useState<'user' | 'bot' | null>(null);

    const navigate: NavigateFunction = useNavigate();

    const [theme, setTheme, userName, getGeneralInformacion, nextTheme] = useUserStore((store) => [
        store.theme,
        store.setTheme,
        store.name,
        store.getGeneralInformacion,
        store.nextTheme
    ])

    const [getBotDetailById, currentBot] = useAppStore((store) => [
        store.getBotDetailById,
        store.currentBot,
    ])

    const [setUserId] = useAuthStore((state) => [
        state.setUserId
    ])

    const init = async (id: string): Promise<void> => {
        if (id.length > 0) {
            await getGeneralInformacion(id)
            setDetailType('user')
            setInitLoading(false)
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }

    const initBotDetail = async (botId: string): Promise<void> => {
        if (botId.length > 0) {
            await getBotDetailById(botId)
            setDetailType('bot')
            setInitLoading(false)
        } else {
            navigate(-1)
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

        // Check if it's a bot detail view (bot ID format) or user detail
        if (id !== null && id !== undefined && id.length > 0) {
            // Try to determine if it's a bot by calling getBotDetailById
            // If no currentBot is set, treat as user detail
            initBotDetail(id).then(() => { }).catch((err) => {
                console.log('Not a bot, trying as user...', err)
                init(userId).then(() => { }).catch((err) => {
                    console.log(err)
                });
            });
        } else {
            init(userId).then(() => { }).catch((err) => {
                console.log(err)
            });
        }

        return () => { }
    }, [userName, id])

    const handleGoBack = (): void => {
        if (currentBot !== null) {
            navigate(`${RoutePath.CHAT}/${currentBot.id}`);
        } else {
            navigate(-1);
        }
    };

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
                        <SideBarComponent userName={userName}/>
                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px'}} className='bg-base-100'>
                            <header className='header-container bg-base-200 flex justify-between pl-5 pr-5 items-center' style={{ height: '70px', width: '80%' }}>
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

                                <div className='flex gap-2 justify-center'>
                                    <button
                                        onClick={() => {
                                            nextTheme()
                                        }}
                                        style={{ display: 'flex', gap: '5px' }}
                                        className="pt-2">
                                        <p style={{ textTransform: 'capitalize' }}>{theme}</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                        </svg>
                                    </button>
                                </div>
                            </header>

                            {/* Bot Detail Content */}
                            {detailType === 'bot' && currentBot !== null && (
                                <div className="bot-detail-container bg-secondary"
                                style={{overflow: 'scroll', height: '80%', scrollBehavior: 'smooth'}}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bot-detail-content"
                                    >
                                        {/* Bot Image */}
                                        <div className="bot-image-section" style={{overflow: 'scroll'}}>
                                            <img
                                                src={
                                                    LOY_LOCAL_API + "/bots/" + currentBot.id + "/image"
                                                }
                                                alt={currentBot.name}
                                                className="bot-image"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.src = '/assets/imgs/icons/user-default.png';
                                                }}
                                            />
                                        </div>

                                        {/* Bot Information */}
                                        <div className="bot-info-section">
                                            <div className="bot-header">
                                                <h1 className="bot-name text-secondary-content">{currentBot.name}</h1> <p>s</p>
                                            </div>

                                            {/* Description */}
                                            <div className="bot-description-card">
                                                <h2 className="card-title text-secondary">Descripción</h2>
                                                <p className="card-content">{currentBot.description}</p>
                                            </div>

                                            {/* Context */}
                                            {(currentBot.context !== null && currentBot.context !== '' || true) && (
                                                <div className="bot-context-card">
                                                    <h2 className="card-title text-secondary">Contexto</h2>
                                                    <p className="card-content">{currentBot.context}</p>
                                                </div>
                                            )}

                                            {/* Skills */}
                                            {(currentBot.skills !== null && currentBot.skills.length > 0) && (
                                                <div className="bot-skills-card">
                                                    <h2 className="card-title text-secondary">Habilidades</h2>
                                                    <ul className="skills-list">
                                                        {currentBot.skills.map((skill, index) => (
                                                            <li key={index} className="skill-item">
                                                                <span className="skill-badge bg-primary-content"></span>
                                                                <span className="skill-text">{skill}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}