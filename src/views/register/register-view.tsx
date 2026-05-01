import './register-view.css';
import { type FormEvent, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import {
    ArrowRightIcon,
    EnvelopeIcon,
    PhoneIcon,
    SparklesIcon,
    SwatchIcon,
    UserIcon
} from '@heroicons/react/24/solid';

export function RegisterView(): JSX.Element {

    const [toggleModalActive, version] = useAppStore((store) => [
        store.toggleModalActive,
        store.version
    ]);

    const [userEmail] = useAuthStore((store) => [store.userEmail]);
    const navigate = useNavigate();
    const [name, setName, setPhoneNumber, country, theme, nextTheme, phoneNumber, setTheme] = useUserStore((store) => [
        store.name,
        store.setName,
        store.setPhoneNumber,
        store.country,
        store.theme,
        store.nextTheme,
        store.phoneNumber,
        store.setTheme
    ]);

    const onSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        if (userEmail.length !== 0 && name.length !== 0 && phoneNumber !== null && phoneNumber > 0) {
            navigate(RoutePath.REGISTER_TWO)
        }
    }

    const handlePhoneChange = (value: string): void => {
        const digitsOnly: string = value.replace(/\D/g, '')
        setPhoneNumber(digitsOnly.length > 0 ? Number(digitsOnly) : 0)
    }

    useEffect(() => {
        const currentTheme: string | null = localStorage.getItem('theme')
        if (currentTheme !== null) {
            setTheme(currentTheme)
        }

        if (userEmail.length === 0) {
            navigate(RoutePath.IS_REGISTERED)
        }
    }, [userEmail])

    return (
        <div data-theme={theme} className='view bg-base-200'>
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
                                        <SparklesIcon className='h-4 w-4' />
                                        Paso 1 de 3
                                    </div>
                                    <div className='avatar'>
                                        <div className='w-16 rounded-lg bg-base-100'>
                                            <img src='/assistants/elena-ia-assistant.svg' alt='Asistente académico' />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h1 className='mt-6 text-4xl font-bold leading-tight'>Cuéntanos quién eres</h1>
                                    <p className='mt-3 text-base text-primary-content/80'>
                                        Tu camino hacia el éxito académico comienza con unos datos básicos para personalizar la experiencia.
                                    </p>
                                </div>

                                <div className='mt-5 grid grid-cols-3 gap-2'>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <p className='text-xs font-semibold'>Cuenta</p>
                                    </div>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <p className='text-xs font-semibold'>Perfil</p>
                                    </div>
                                    <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                                        <p className='text-xs font-semibold'>Estudio</p>
                                    </div>
                                </div>
                            </div>

                            <div className='register-form-wrap'>
                                <div>
                                    <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>Registro</p>
                                    <h2 className='mt-2 text-3xl font-bold text-base-content'>Datos personales</h2>
                                    <p className='mt-3 text-base text-base-content/70'>
                                        ¡Bienvenido! Aún no te conocemos. Regístrate para disfrutar de todos nuestros beneficios.
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
                                        <span className='label-text'>Nombre completo</span>
                                        <div className='input input-bordered mt-2 flex items-center gap-2'>
                                            <UserIcon className='h-5 w-5 opacity-60' />
                                            <input
                                                className='grow'
                                                autoComplete='off'
                                                placeholder='Ingresa tu nombre'
                                                type='text'
                                                value={name}
                                                onChange={(event) => { setName(event.target.value) }}
                                            />
                                        </div>
                                    </label>

                                    <label className='form-control'>
                                        <span className='label-text'>Número de teléfono</span>
                                        <div className='mt-2 flex gap-2'>
                                            <button
                                                type='button'
                                                className='btn w-28'
                                                onClick={() => {
                                                    toggleModalActive()
                                                }}>
                                                <img src={country.url} alt='default-flag' height='24px' width='24px' />
                                                +{country.country_code}
                                            </button>
                                            <div className='input input-bordered flex grow items-center gap-2'>
                                                <PhoneIcon className='h-5 w-5 opacity-60' />
                                                <input
                                                    className='grow'
                                                    inputMode='numeric'
                                                    pattern='[0-9]*'
                                                    placeholder='Número de teléfono'
                                                    type='text'
                                                    value={phoneNumber !== null && phoneNumber > 0 ? String(phoneNumber) : ''}
                                                    onChange={(event) => {
                                                        handlePhoneChange(event.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </label>

                                    <button className='btn btn-primary w-full gap-2' type='submit' disabled={false}>
                                        Siguiente
                                        <ArrowRightIcon className='h-5 w-5' />
                                    </button>
                                </form>
                            </div>
                        </section>

                        <div className='version-container-register'>
                            <p className='version-text-register'>Ayuda</p>
                            <p className='version-text-register'>version: {version}</p>
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
