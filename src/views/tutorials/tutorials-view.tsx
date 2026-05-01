import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { type IBot, useAppStore } from '@/stores/app-store';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';
import { useChatStore } from '@/stores/chat-store';
import {
    AcademicCapIcon,
    BeakerIcon,
    BookOpenIcon,
    CalculatorIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

interface ITutorialSubject {
    id: string
    code: string
    name: string
    program: string
    area: string
    description: string
    keywords: string[]
    suggestedGoals: string[]
    accentClass: string
    icon: JSX.Element
}

interface ITutorialMatch extends ITutorialSubject {
    assignedBot: IBot | null
}

const tutorialSubjects: ITutorialSubject[] = [
    {
        id: 'calculus',
        code: 'MATE1033',
        name: 'Cálculo Diferencial',
        program: 'Ingeniería',
        area: 'Matemáticas',
        description: 'Límites, derivadas, optimización y ejercicios paso a paso.',
        keywords: ['matematica', 'calculo', 'derivada', 'limite', 'algebra', 'ingenieria'],
        suggestedGoals: ['Preparar parcial', 'Resolver taller', 'Repasar conceptos base'],
        accentClass: 'text-info bg-info/10',
        icon: <CalculatorIcon className='h-6 w-6' />
    },
    {
        id: 'physics',
        code: 'FISI1101',
        name: 'Física Mecánica',
        program: 'Ingeniería',
        area: 'Física',
        description: 'Movimiento, fuerzas, energía, momento y problemas aplicados.',
        keywords: ['fisica', 'mecanica', 'fuerza', 'energia', 'movimiento', 'ingenieria'],
        suggestedGoals: ['Modelar un problema', 'Entender fórmulas', 'Practicar ejercicios'],
        accentClass: 'text-primary bg-primary/10',
        icon: <BeakerIcon className='h-6 w-6' />
    },
    {
        id: 'history',
        code: 'HIST2040',
        name: 'Historia Contemporánea',
        program: 'Ciencias Sociales',
        area: 'Historia',
        description: 'Procesos políticos, sociales y económicos de los siglos XIX y XX.',
        keywords: ['historia', 'contemporanea', 'sociales', 'politica', 'guerra', 'revolucion'],
        suggestedGoals: ['Crear línea de tiempo', 'Analizar fuentes', 'Preparar ensayo'],
        accentClass: 'text-warning bg-warning/10',
        icon: <BookOpenIcon className='h-6 w-6' />
    },
    {
        id: 'research',
        code: 'INV3001',
        name: 'Metodología de Investigación',
        program: 'Todos los programas',
        area: 'Investigación',
        description: 'Pregunta, marco teórico, método, citación y estructura del proyecto.',
        keywords: ['investigacion', 'metodologia', 'tesis', 'proyecto', 'citas', 'apa'],
        suggestedGoals: ['Definir pregunta', 'Organizar marco teórico', 'Revisar metodología'],
        accentClass: 'text-success bg-success/10',
        icon: <AcademicCapIcon className='h-6 w-6' />
    },
    {
        id: 'social-theory',
        code: 'SOCL2102',
        name: 'Teoría Social',
        program: 'Ciencias Sociales',
        area: 'Ciencias sociales',
        description: 'Autores, escuelas, conceptos y comparación de teorías sociales.',
        keywords: ['social', 'sociales', 'sociologia', 'teoria', 'sociedad', 'cultura'],
        suggestedGoals: ['Comparar autores', 'Preparar exposición', 'Construir argumentos'],
        accentClass: 'text-accent bg-accent/10',
        icon: <ChatBubbleLeftRightIcon className='h-6 w-6' />
    }
]

const normalizeText = (value: string): string => {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const getSubjectSearchText = (subject: ITutorialSubject): string => {
    return normalizeText(`${subject.code} ${subject.name} ${subject.program} ${subject.area} ${subject.description} ${subject.keywords.join(' ')}`)
}

const getBotSearchText = (bot: IBot): string => {
    return normalizeText(`${bot.name} ${bot.description} ${bot.context}`)
}

const findAssignedBot = (subject: ITutorialSubject, bots: IBot[]): IBot | null => {
    const subjectKeywords: string[] = subject.keywords.map((keyword: string) => normalizeText(keyword))
    const foundBot: IBot | undefined = bots.find((bot: IBot) => {
        const botText: string = getBotSearchText(bot)
        return subjectKeywords.some((keyword: string) => botText.includes(keyword))
    })

    return foundBot ?? bots[0] ?? null
}

const filterTutorialSubjects = (subjects: ITutorialSubject[], query: string, program: string): ITutorialSubject[] => {
    const normalizedQuery: string = normalizeText(query.trim())
    const normalizedProgram: string = normalizeText(program)

    return subjects.filter((subject: ITutorialSubject) => {
        const matchesProgram: boolean = program === 'Todos' || normalizeText(subject.program).includes(normalizedProgram) || subject.program === 'Todos los programas'
        const matchesQuery: boolean = normalizedQuery.length === 0 || getSubjectSearchText(subject).includes(normalizedQuery)

        return matchesProgram && matchesQuery
    })
}

export function TutorialsView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedProgram, setSelectedProgram] = useState<string>('Todos');

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

    const [showNotificationsPanel, bots] = useAppStore((state) => [
        state.showNotificationsPanel,
        state.bots
    ])

    const [setBotSelected] = useChatStore((state) => [
        state.setBotSelected
    ])

    const programs: string[] = useMemo(() => {
        const subjectPrograms: string[] = tutorialSubjects.map((subject: ITutorialSubject) => subject.program)
        return ['Todos', ...Array.from(new Set(subjectPrograms))]
    }, [])

    const tutorialMatches: ITutorialMatch[] = useMemo(() => {
        return filterTutorialSubjects(tutorialSubjects, searchValue, selectedProgram)
            .map((subject: ITutorialSubject) => ({
                ...subject,
                assignedBot: findAssignedBot(subject, bots)
            }))
    }, [bots, searchValue, selectedProgram])

    const startTutorial = (bot: IBot | null): void => {
        if (bot !== null) {
            setBotSelected(bot as any)
            navigate(`/chat/${bot.id}`)
        } else {
            navigate(RoutePath.ASSISTANS)
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
                                    <HeaderComponent
                                        name={''}
                                        available={true}
                                        chatHeader={false}
                                        backbutton={false} />

                                    <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', height: '92%' }} className='mt-16 px-5 pb-8'>
                                        <div className='flex flex-col gap-6'>
                                            <section className='rounded-lg bg-base-200 p-6 shadow-sm'>
                                                <div className='flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between'>
                                                    <div className='max-w-3xl'>
                                                        <div className='mb-3 flex items-center gap-2 text-primary'>
                                                            <SparklesIcon className='h-6 w-6' />
                                                            <span className='text-sm font-semibold uppercase tracking-wide'>Tutorías con asistente asignado</span>
                                                        </div>
                                                        <h1 className='text-4xl font-bold text-base-content'>Busca una materia y empieza con el bot adecuado</h1>
                                                        <p className='mt-3 text-base text-base-content/70'>
                                                            Encuentra tutorías por programa, código o nombre de materia. Cada resultado propone un asistente para trabajar ese tema específico.
                                                        </p>
                                                    </div>

                                                    <div className='stats bg-base-100 shadow-sm'>
                                                        <div className='stat'>
                                                            <div className='stat-title'>Tutorías</div>
                                                            <div className='stat-value text-primary'>{tutorialMatches.length}</div>
                                                            <div className='stat-desc'>coincidencias</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mt-6 grid grid-cols-1 gap-3 xl:grid-cols-[1fr_260px]'>
                                                    <label className='input input-bordered flex items-center gap-2 bg-base-100'>
                                                        <MagnifyingGlassIcon className='h-5 w-5 opacity-50' />
                                                        <input
                                                            type='search'
                                                            className='grow'
                                                            value={searchValue}
                                                            onChange={(event) => {
                                                                setSearchValue(event.target.value)
                                                            }}
                                                            placeholder='Buscar por materia, código o tema'
                                                        />
                                                    </label>

                                                    <select
                                                        className='select select-bordered bg-base-100'
                                                        value={selectedProgram}
                                                        onChange={(event) => {
                                                            setSelectedProgram(event.target.value)
                                                        }}
                                                    >
                                                        {programs.map((program: string) => (
                                                            <option key={program} value={program}>{program}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </section>

                                            <section className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
                                                {tutorialMatches.map((tutorial: ITutorialMatch) => (
                                                    <article key={tutorial.id} className='rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm'>
                                                        <div className='flex h-full flex-col gap-5'>
                                                            <div className='flex items-start justify-between gap-3'>
                                                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${tutorial.accentClass}`}>
                                                                    {tutorial.icon}
                                                                </div>
                                                                <div className='badge badge-primary'>{tutorial.program}</div>
                                                            </div>

                                                            <div>
                                                                <p className='text-sm font-semibold uppercase tracking-wide text-primary'>{tutorial.code}</p>
                                                                <h2 className='mt-1 text-2xl font-bold text-base-content'>{tutorial.name}</h2>
                                                                <p className='mt-2 text-sm text-base-content/70'>{tutorial.description}</p>
                                                            </div>

                                                            <div className='rounded-lg bg-base-200 p-4'>
                                                                <p className='text-xs font-semibold uppercase tracking-wide text-base-content/50'>Bot asignado</p>
                                                                <h3 className='mt-1 text-lg font-bold text-base-content'>{tutorial.assignedBot !== null ? tutorial.assignedBot.name : 'Asignar asistente'}</h3>
                                                                <p className='mt-2 text-sm text-base-content/70'>
                                                                    {tutorial.assignedBot !== null ? tutorial.assignedBot.description : 'No hay asistentes cargados para enlazar esta tutoría.'}
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50'>Objetivos sugeridos</p>
                                                                <div className='flex flex-wrap gap-2'>
                                                                    {tutorial.suggestedGoals.map((goal: string) => (
                                                                        <span key={goal} className='badge badge-outline'>{goal}</span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className='mt-auto flex items-center justify-between gap-3'>
                                                                <span className='text-sm text-base-content/60'>{tutorial.area}</span>
                                                                <button
                                                                    className='btn btn-primary btn-sm'
                                                                    onClick={() => {
                                                                        startTutorial(tutorial.assignedBot)
                                                                    }}
                                                                >
                                                                    Iniciar tutoría
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </section>

                                            {tutorialMatches.length === 0 && (
                                                <div className='rounded-lg bg-base-200 p-8 text-center shadow-sm'>
                                                    <AcademicCapIcon className='mx-auto mb-4 h-10 w-10 text-primary' />
                                                    <h2 className='text-2xl font-bold text-base-content'>No encontramos tutorías para esa búsqueda</h2>
                                                    <p className='mt-2 text-base text-base-content/70'>Prueba con el código de materia, el nombre del curso o cambia el programa seleccionado.</p>
                                                </div>
                                            )}
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
