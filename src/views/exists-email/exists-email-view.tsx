import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { type IErrorResponse, type IsRegisteredResponse, useAuthStore } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    SparklesIcon,
    SwatchIcon
} from '@heroicons/react/24/solid';
import './exists-email-view.css';

export function ExistsEmailView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version
    }));

    const [isRegistered] = useAuthStore((store) => [
        store.isRegistered
    ])

    const [theme, nextTheme, setTheme] = useUserStore((store) => [
        store.theme,
        store.nextTheme,
        store.setTheme
    ])

    const navigate = useNavigate();

    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleSubmitFn = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        if (email.length === 0) {
            return;
        } else if (email.length < 8 || !email.includes('@') || !email.includes('.')) {
            setInputErrorMessage('Correo electrónico inválido')
            return;
        }

        const response: IsRegisteredResponse | IErrorResponse = await isRegistered(email);
        if ((response as IsRegisteredResponse).is_registered) {
            navigate(RoutePath.LOGIN);
        } else if ((response as IErrorResponse).detail != null) {
            setInputErrorMessage((response as IErrorResponse).detail);
            setTimeout(() => {
                setInputErrorMessage('');
            }, 6000)
        } else {
            navigate(RoutePath.REGISTER);
        }
    }

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme')
        if (currentTheme !== null) {
            setTheme(currentTheme)
        }
    }, [inputErrorMessage])

    return (
        <div data-theme={theme} className='view bg-base-200'>
            <AnimatePresence>
                <motion.div
                    style={{ width: '100%', height: '100%' }}
                    className='exists-email-view bg-base-100'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}>

                    <main className='exists-email-panel'>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    nextTheme()
                                }}
                                className='btn btn-ghost btn-sm gap-2'>
                                <SwatchIcon className='h-5 w-5' />
                                <span className='capitalize'>{theme}</span>
                            </button>
                        </div>

                        <section className='exists-email-card bg-base-100 shadow-lg'>
                            <div className='exists-email-card-visual bg-primary text-primary-content'>
                                <div className='flex items-center justify-between gap-4'>
                                    <div className='badge badge-neutral gap-2'>
                                        <SparklesIcon className='h-4 w-4' />
                                        Loy Academic
                                    </div>
                                    <div className='avatar'>
                                        <div className='w-16 rounded-lg bg-base-100'>
                                            <img src='/assistants/elena-ia-assistant.svg' alt='Asistente académico' />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h1 className='mt-6 text-4xl font-bold leading-tight'>Empieza una conversación para aprender mejor</h1>
                                    <p className='mt-3 text-base text-primary-content/80'>
                                        Entra con tu correo y conecta con asistentes, tutorías y workflows de estudio.
                                    </p>
                                </div>

                                <div className='mt-5 space-y-3'>
                                    <div className='chat chat-start'>
                                        <div className='chat-bubble bg-base-100 text-base-content'>¿Qué tema necesitas repasar hoy?</div>
                                    </div>
                                    <div className='chat chat-end'>
                                        <div className='chat-bubble chat-bubble-secondary'>Cálculo, historia o una entrega pendiente.</div>
                                    </div>
                                </div>

                                <div className='mt-5 grid grid-cols-3 gap-2'>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <AcademicCapIcon className='mb-1 h-5 w-5' />
                                        <p className='text-xs font-semibold'>Tutorías</p>
                                    </div>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <ChatBubbleLeftRightIcon className='mb-1 h-5 w-5' />
                                        <p className='text-xs font-semibold'>Chats</p>
                                    </div>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <SparklesIcon className='mb-1 h-5 w-5' />
                                        <p className='text-xs font-semibold'>Workflows</p>
                                    </div>
                                </div>
                            </div>

                            <div className='exists-email-form-wrap'>
                                <div>
                                    <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>Bienvenido</p>
                                    <h2 className='mt-2 text-3xl font-bold text-base-content'>Accede a Loy Academic</h2>
                                    <p className='mt-3 text-base text-base-content/70'>
                                        Usaremos tu correo para saber si ya tienes cuenta o para iniciar tu registro.
                                    </p>
                                </div>

                                {inputErrorMessage.length > 0 && (
                                    <div
                                        role='alert'
                                        className='alert alert-info rounded-lg'
                                        onClick={() => { setInputErrorMessage('') }}>
                                        <span>{inputErrorMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmitFn} className='flex flex-col gap-4'>
                                    <label className='form-control'>
                                        <span className='label-text'>Correo electrónico</span>
                                        <div className='input input-bordered mt-2 flex items-center gap-2'>
                                            <EnvelopeIcon className='h-5 w-5 opacity-60' />
                                            <input
                                                className='grow'
                                                autoComplete='off'
                                                placeholder='nombre@universidad.edu'
                                                type='email'
                                                value={email}
                                                onChange={(event) => { setEmail(event.target.value) }}
                                            />
                                        </div>
                                    </label>

                                    <button
                                        className='btn btn-primary w-full gap-2'
                                        type='submit'
                                        disabled={false}>
                                        Continuar
                                        <ArrowRightIcon className='h-5 w-5' />
                                    </button>
                                </form>

                                <div className='rounded-lg bg-base-200 p-4'>
                                    <p className='text-sm text-base-content/70'>
                                        Puedes entrar si ya tienes cuenta o crear una nueva en segundos.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className='version-container'>
                            <p className='version-text'>Ayuda</p>
                            <p className='version-text'>version: {store.version}</p>
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
