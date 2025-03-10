import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { type IErrorResponse, type IsRegisteredResponse, useAuthStore } from '@/stores/auth-store';
import './exists-email-view.css';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';

export function ExistsEmailView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
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

    const handleSubmitFn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (email.length === 0) {
            return;
        } else if (email.length < 8 || !email.includes('@') || !email.includes('.')) {
            setInputErrorMessage('Correo electronico invalido')
            return;
        }

        const response: IsRegisteredResponse | IErrorResponse = await isRegistered(email);
        if ((response as IsRegisteredResponse).is_registered) {
            navigate('/login');
        } else if ((response as IErrorResponse).detail != null) {
            setInputErrorMessage((response as IErrorResponse).detail);
            setTimeout(() => {
                setInputErrorMessage('');
            }, 6000)
        } else {
            navigate('/register');
        }
    }
    useEffect(() => {
        const currentTheme = localStorage.getItem('theme')
        if (currentTheme !== null) {
            setTheme(currentTheme)
        }
    }, [inputErrorMessage])

    return (
        <div data-theme={theme} className={'view bg-primary'}>
            <AnimatePresence>
                <motion.div
                    style={{ width: '100%', height: '100%' }}
                    className='bg-auth'
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}>
                    <main style={{ width: '100%', minWidth: '500px', maxWidth: '500px' }} className='main-container bg-base-100 rounded-md'>

                        {(inputErrorMessage.length > 0) && (
                            <div style={{ width: '1000%', display: 'flex', justifyContent: 'center', position: 'fixed', minWidth: '500px', maxWidth: '500px' }}>
                                <div role="alert" className="alert alert-info"
                                    style={{ padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center' }}
                                    onClick={() => { setInputErrorMessage('') }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="h-6 w-6 shrink-0 stroke-current">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p style={{ fontSize: '15px' }}>{inputErrorMessage}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className='header-view'>
                                <button
                                    onClick={() => {
                                        nextTheme()
                                    }}
                                    style={{ display: 'flex', gap: '5px' }}
                                    className="">
                                    <p style={{ textTransform: 'capitalize' }}>{theme}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                                    </svg>

                                </button>
                            </div>


                            <div className=''>
                                <div className="flex-row justify-center align-end" style={{ marginTop: '6rem' }}>
                                    <h3 className="text-primary bold center-align" style={{ fontFamily: 'Poppins-Medium', fontSize: '4rem' }}>Loy</h3>
                                    <p style={{ fontFamily: 'Poppins-Regular', fontSize: '2rem' }}>Academic</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ paddingBottom: '10px' }}>
                            <form onSubmit={handleSubmitFn} className='auth-form'>
                                <label className={'input input-bordered flex items-center gap-2'} style={{ outlineStyle: "none", width: '100%' }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path
                                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                        <path
                                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                    </svg>
                                    <input
                                        style={{
                                            fontFamily: 'Open-Sans'
                                        }}
                                        autoComplete="off"
                                        placeholder='Correo electronico'
                                        type='text'
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </label>

                                <ul className='menu rounded-box mb-4' style={{ backgroundColor: '#1ED760', display: 'none' }} onClick={() => {
                                    window.location.href = 'http://localhost:8000/api/v1/auth/spotify-login'
                                }}>
                                    <li className='rounded-box'>
                                        <a>
                                            <img src="assets/imgs/icons/spotify-logo.svg" alt="spotify logo" style={{ height: 30 }} />
                                            <p style={{ color: '#121212' }}>Ingreso Spotify</p>
                                        </a>
                                    </li>
                                </ul>
                                <button
                                    className="btn btn-primary reset"
                                    type='submit'
                                    disabled={false}>
                                    Siguiente
                                </button>
                            </form>
                            <div className='version-container'>
                                <p className='version-text'>
                                    Ayuda
                                </p>

                                <p className='version-text'>
                                    version: {store.version}
                                </p>
                            </div>
                        </div>
                    </main>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}