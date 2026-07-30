import { useUserStore } from '@/stores/user-store';
import { AnimatePresence, motion } from 'framer-motion';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { RoutePath } from '@/router'
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { type IBot, useAppStore } from '@/stores/app-store';
import { useChatStore } from '@/stores/chat-store';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import {
    AcademicCapIcon,
    BeakerIcon,
    BookOpenIcon,
    CalculatorIcon,
    GlobeAmericasIcon,
    PaintBrushIcon,
    UserGroupIcon
} from '@heroicons/react/24/solid';

interface IAssistantTopic {
    id: string
    name: string
    description: string
    keywords: string[]
    icon: JSX.Element
    accentClass: string
}

interface IAssistantTopicGroup {
    topic: IAssistantTopic
    bots: IBot[]
}

const assistantTopics: IAssistantTopic[] = [
    {
        id: 'math',
        name: 'Matemáticas',
        description: 'Cálculo, álgebra, estadística y solución paso a paso.',
        keywords: ['matematica', 'matematicas', 'calculo', 'algebra', 'estadistica', 'geometria', 'trigonometria'],
        icon: <CalculatorIcon className='h-6 w-6' />,
        accentClass: 'text-info bg-info/10'
    },
    {
        id: 'history',
        name: 'Historia',
        description: 'Procesos históricos, líneas de tiempo y análisis de fuentes.',
        keywords: ['historia', 'historico', 'historica', 'revolucion', 'guerra', 'civilizacion'],
        icon: <BookOpenIcon className='h-6 w-6' />,
        accentClass: 'text-warning bg-warning/10'
    },
    {
        id: 'geography',
        name: 'Geografía',
        description: 'Territorio, mapas, regiones, clima y geopolítica.',
        keywords: ['geografia', 'mapa', 'territorio', 'region', 'clima', 'geopolitica'],
        icon: <GlobeAmericasIcon className='h-6 w-6' />,
        accentClass: 'text-success bg-success/10'
    },
    {
        id: 'physics',
        name: 'Física',
        description: 'Mecánica, electricidad, ondas y ejercicios aplicados.',
        keywords: ['fisica', 'mecanica', 'electrica', 'electricidad', 'termodinamica', 'ondas', 'cuantica'],
        icon: <BeakerIcon className='h-6 w-6' />,
        accentClass: 'text-primary bg-primary/10'
    },
    {
        id: 'art',
        name: 'Arte',
        description: 'Historia del arte, composición, crítica y creatividad.',
        keywords: ['arte', 'artistico', 'artistica', 'pintura', 'diseno', 'musica', 'literatura', 'estetica'],
        icon: <PaintBrushIcon className='h-6 w-6' />,
        accentClass: 'text-secondary bg-secondary/10'
    },
    {
        id: 'social-sciences',
        name: 'Ciencias sociales',
        description: 'Sociedad, cultura, política, economía y comportamiento humano.',
        keywords: ['social', 'sociales', 'sociologia', 'politica', 'economia', 'psicologia', 'antropologia', 'derecho'],
        icon: <UserGroupIcon className='h-6 w-6' />,
        accentClass: 'text-accent bg-accent/10'
    },
    {
        id: 'general',
        name: 'Apoyo general',
        description: 'Lectura, escritura, estudio, investigación y organización académica.',
        keywords: [],
        icon: <AcademicCapIcon className='h-6 w-6' />,
        accentClass: 'text-neutral bg-base-200'
    }
]

const normalizeText = (value: string): string => {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const getAssistantTopic = (bot: IBot): IAssistantTopic => {
    const searchableText: string = normalizeText(`${bot.name} ${bot.description} ${bot.context}`)
    const foundTopic: IAssistantTopic | undefined = assistantTopics.find((topic: IAssistantTopic) => {
        return topic.id !== 'general' && topic.keywords.some((keyword: string) => searchableText.includes(keyword))
    })

    return foundTopic ?? assistantTopics[assistantTopics.length - 1]
}

const getAssistantGroups = (bots: IBot[]): IAssistantTopicGroup[] => {
    return assistantTopics
        .map((topic: IAssistantTopic) => ({
            topic,
            bots: bots.filter((bot: IBot) => getAssistantTopic(bot).id === topic.id)
        }))
        .filter((group: IAssistantTopicGroup) => group.bots.length > 0)
}

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

    const assistantGroups: IAssistantTopicGroup[] = useMemo(() => getAssistantGroups(bots), [bots])
    const featuredTopics: IAssistantTopicGroup[] = assistantGroups.slice(0, 4)

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
                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>
                            <HeaderComponent name={''} available={false} chatHeader={false} backbutton={false} />

                            <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', height: '92%' }} className='mt-16 px-5 pb-8'>
                                <div className='flex flex-col gap-6'>
                                    <section className='rounded-lg bg-base-200 p-6 shadow-sm'>
                                        <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                                            <div className='max-w-3xl'>
                                                <div className='mb-3 flex items-center gap-2 text-primary'>
                                                    <span className='text-sm font-semibold uppercase tracking-wide'>Asistentes por temática</span>
                                                </div>
                                                <h1 className='text-4xl font-bold text-base-content'>Encuentra el apoyo adecuado para cada materia</h1>
                                                <p className='mt-3 text-base text-base-content/70'>
                                                    Explora asistentes especializados por área de estudio
                                                </p>
                                            </div>

                                            <div className='stats bg-base-100 shadow-sm'>
                                                <div className='stat'>
                                                    <div className='stat-title'>Disponibles</div>
                                                    <div className='stat-value text-primary'>{bots.length}</div>
                                                    <div className='stat-desc'>asistentes activos</div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {featuredTopics.length > 0 && (
                                        <section className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
                                            {featuredTopics.map((group: IAssistantTopicGroup) => (
                                                <div key={group.topic.id} className='rounded-lg bg-base-200 p-5 shadow-sm'>
                                                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${group.topic.accentClass}`}>
                                                        {group.topic.icon}
                                                    </div>
                                                    <p className='text-sm text-base-content/60'>{group.bots.length} asistentes</p>
                                                    <h2 className='text-xl font-bold text-base-content'>{group.topic.name}</h2>
                                                    <p className='mt-2 text-sm text-base-content/70'>{group.topic.description}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {assistantGroups.length === 0 && (
                                        <div className='rounded-lg bg-base-200 p-8 text-center shadow-sm'>
                                            <AcademicCapIcon className='mx-auto mb-4 h-10 w-10 text-primary' />
                                            <h2 className='text-2xl font-bold text-base-content'>Aún no hay asistentes disponibles</h2>
                                            <p className='mt-2 text-base text-base-content/70'>Cuando se carguen asistentes, aparecerán organizados por temática.</p>
                                        </div>
                                    )}

                                    {assistantGroups.map((group: IAssistantTopicGroup) => (
                                        <section key={group.topic.id} className='rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm'>
                                            <div className='flex flex-col gap-3 border-b border-base-300 pb-4 lg:flex-row lg:items-center lg:justify-between'>
                                                <div className='flex items-center gap-3'>
                                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${group.topic.accentClass}`}>
                                                        {group.topic.icon}
                                                    </div>
                                                    <div>
                                                        <h2 className='text-2xl font-bold text-base-content'>{group.topic.name}</h2>
                                                        <p className='text-sm text-base-content/70'>{group.topic.description}</p>
                                                    </div>
                                                </div>
                                                <div className='badge badge-primary badge-lg'>{group.bots.length} asistentes</div>
                                            </div>

                                            <div className='mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2'>
                                                {group.bots.map((bot: IBot) => (
                                                    <article key={bot.id} className='rounded-lg bg-base-200 p-4'>
                                                        <div className='flex h-full flex-col gap-4'>
                                                            <div className='flex items-start justify-between gap-3'>
                                                                <div className='min-w-0'>
                                                                    <h3 className='truncate text-lg font-bold text-base-content'>{bot.name}</h3>
                                                                    <p className='mt-2 text-sm text-base-content/70' style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                        {bot.description}
                                                                    </p>
                                                                </div>
                                                                <div className='badge badge-warning whitespace-nowrap'>experimental</div>
                                                            </div>

                                                            <div className='mt-auto flex items-center justify-between gap-3'>
                                                                <span className='text-xs font-medium uppercase tracking-wide text-base-content/50'>Especializado</span>
                                                                <button
                                                                    onClick={() => {
                                                                        navigateToChat(bot.id)
                                                                    }}
                                                                    className='btn btn-primary btn-sm'
                                                                >
                                                                    Comenzar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        </section>
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
