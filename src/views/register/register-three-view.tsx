import './register-view.css'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';
import { useAppStore } from '@/stores/app-store';
import { type ILoginResponse, type ILoginResponseError, useAuthStore } from '@/stores/auth-store';
import { type FormEvent, useEffect, useState } from 'react';
import { type IRegisterRequest } from '@/services/auth-service';
import { RoutePath } from '@/router';
import {
    ArrowRightIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    KeyIcon,
    LockClosedIcon,
    SwatchIcon
} from '@heroicons/react/24/solid';

export function RegisterThreeView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version
    }));

    const [userEmail, signUp] = useAuthStore((store) => [store.userEmail, store.signUp]);

    const navigate = useNavigate();

    const [name, phoneNumber, theme, nextTheme, setTheme, country] = useUserStore((store) => [
        store.name,
        store.phoneNumber,
        store.theme,
        store.nextTheme,
        store.setTheme,
        store.country
    ])

    const [password, setPassword] = useState<string>('')

    const onSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        if (userEmail.length !== 0 && name.length !== 0 && phoneNumber !== null && country !== null) {
            const req: IRegisterRequest = {
                name,
                email: userEmail,
                password,
                code_contry: String(country.country_code),
                phone_number: phoneNumber
            }
            const resp: ILoginResponse | ILoginResponseError = await signUp(req)
            if ((resp as ILoginResponse).status === 'success') {
                navigate(RoutePath.ASSISTANS)
            }
        }
    }

    useEffect(() => {
        const currentTheme: string | null = localStorage.getItem('theme')
        if (currentTheme !== null) {
            setTheme(currentTheme)
        }

        if (userEmail.length === 0) {
            navigate(RoutePath.IS_REGISTERED);
        } else if (name.length === 0 || phoneNumber === null) {
            navigate(RoutePath.REGISTER);
        }
    }, [userEmail])

    return (
        <div className='view bg-base-200' data-theme={theme}>
            <AnimatePresence>
                <motion.div style={{ width: '100%', height: '100%' }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className='register-screen bg-base-100'>
                    <main className='register-panel'>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    localStorage.setItem('theme', theme)
                                    nextTheme()
                                }}
                                className='btn btn-ghost btn-sm gap-2'>
                                <SwatchIcon className='h-5 w-5' />
                                <span className='capitalize'>{theme}</span>
                            </button>
                        </div>

                        <section className='register-card bg-base-100 shadow-lg'>
                            <div className='register-card-visual bg-primary text-primary-content'>
                                <div className='flex items-center justify-between gap-4'>
                                    <div className='badge badge-neutral gap-2'>
                                        <LockClosedIcon className='h-4 w-4' />
                                        Paso 3 de 3
                                    </div>
                                    <div className='avatar'>
                                        <div className='w-16 rounded-lg bg-base-100'>
                                            <img src='/assistants/elena-ia-assistant.svg' alt='Asistente académico' />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h1 className='mt-6 text-4xl font-bold leading-tight'>Protege tu cuenta</h1>
                                    <p className='mt-3 text-base text-primary-content/80'>
                                        Crea una contraseña para acceder a tus asistentes, tutorías y sesiones guardadas.
                                    </p>
                                </div>

                                <div className='mt-5 space-y-3'>
                                    <div className='flex items-center gap-3 rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <CheckCircleIcon className='h-5 w-5 shrink-0' />
                                        <span className='text-sm font-semibold'>Al menos 8 caracteres</span>
                                    </div>
                                    <div className='flex items-center gap-3 rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <CheckCircleIcon className='h-5 w-5 shrink-0' />
                                        <span className='text-sm font-semibold'>Una letra mayúscula</span>
                                    </div>
                                    <div className='flex items-center gap-3 rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <CheckCircleIcon className='h-5 w-5 shrink-0' />
                                        <span className='text-sm font-semibold'>Al menos un número</span>
                                    </div>
                                </div>
                            </div>

                            <div className='register-form-wrap'>
                                <div>
                                    <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>Registro</p>
                                    <h2 className='mt-2 text-3xl font-bold text-base-content'>Contraseña</h2>
                                    <p className='mt-3 text-base text-base-content/70'>
                                        ¡Estás a un paso! Crea una contraseña fácil de recordar para ti y difícil de adivinar para otros.
                                    </p>
                                </div>

                                <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                                    <label className='form-control'>
                                        <span className='label-text'>Correo electrónico</span>
                                        <div className='input input-bordered mt-2 flex items-center gap-2'>
                                            <EnvelopeIcon className='h-5 w-5 opacity-60' />
                                            <input className='grow' autoComplete='off' disabled={true} value={userEmail} type='text' />
                                        </div>
                                    </label>

                                    <label className='form-control'>
                                        <span className='label-text'>Contraseña</span>
                                        <div className='input input-bordered mt-2 flex items-center gap-2'>
                                            <KeyIcon className='h-5 w-5 opacity-60' />
                                            <input
                                                className='grow'
                                                autoComplete='off'
                                                placeholder='Ingresa tu contraseña'
                                                type='password'
                                                value={password}
                                                onChange={(event) => { setPassword(event.target.value) }}
                                            />
                                        </div>
                                    </label>

                                    <button className='btn btn-primary w-full gap-2' type='submit' disabled={false}>
                                        Regístrate
                                        <ArrowRightIcon className='h-5 w-5' />
                                    </button>
                                </form>
                            </div>
                        </section>

                        <div className='version-container-register'>
                            <p className='version-text-register'>Ayuda</p>
                            <p className='version-text-register'>version: {store.version}</p>
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
