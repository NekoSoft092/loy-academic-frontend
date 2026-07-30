import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ILoginResponseError, useAuthStore, type ILoginResponse } from '@/stores/auth-store';
import './login-view.css';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  LockClosedIcon,
  SparklesIcon,
  SwatchIcon
} from '@heroicons/react/24/solid';

export function LoginView(): JSX.Element {

  const store = useAppStore((state) => ({
    version: state.version
  }));

  const [password, setPassword] = useState<string>('');
  const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

  const [signIn, email] = useAuthStore((store) => [
    store.signIn,
    store.userEmail,
  ])
  const [theme, nextTheme, setTheme] = useUserStore((store) => [
    store.theme,
    store.nextTheme,
    store.setTheme
  ])

  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    if (password.length === 0) {
      return;
    }

    const response: ILoginResponse | ILoginResponseError = await signIn(email, password)
    if ((response as ILoginResponse).status === 'success') {
      navigate(RoutePath.HOME)
    } else if ((response as ILoginResponseError).detail === 'invalid credentials') {
      setInputErrorMessage('Esta contraseña no es correcta. Inténtalo nuevamente.')
    } else if ((response as ILoginResponseError).detail !== 'invalid credentials') {
      setInputErrorMessage('Error inesperado, vuelve a intentarlo más tarde')
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
          className='login-view bg-base-100'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}>

          <main className='login-panel'>
            <div className='flex justify-between'>
              <button
                onClick={() => {
                  navigate(RoutePath.IS_REGISTERED)
                }}
                className='btn btn-ghost btn-sm gap-2'>
                <ArrowLeftIcon className='h-5 w-5' />
                Volver
              </button>

              <button
                onClick={() => {
                  nextTheme()
                }}
                className='btn btn-ghost btn-sm gap-2'>
                <SwatchIcon className='h-5 w-5' />
                <span className='capitalize'>{theme}</span>
              </button>
            </div>

            <section className='login-card bg-base-100 shadow-lg'>
              <div className='login-card-visual bg-primary text-primary-content'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='badge badge-neutral gap-2'>
                    <LockClosedIcon className='h-4 w-4' />
                    Acceso seguro
                  </div>
                  <div className='avatar'>
                    <div className='w-16 rounded-lg bg-base-100'>
                      <img src='/assistants/elena-ia-assistant.svg' alt='Asistente académico' />
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className='mt-6 text-4xl font-bold leading-tight'>Continúa tu sesión de estudio</h1>
                  <p className='mt-3 text-base text-primary-content/80'>
                    Ingresa tu contraseña para volver a tus chats, tutorías y workflows académicos.
                  </p>
                </div>

                <div className='mt-5 space-y-3'>
                  <div className='chat chat-start'>
                    <div className='chat-bubble bg-base-100 text-base-content'>Listo para seguir donde quedaste.</div>
                  </div>
                  <div className='chat chat-end'>
                    <div className='chat-bubble chat-bubble-secondary'>Tengo una tutoría pendiente.</div>
                  </div>
                </div>

                <div className='mt-5 grid grid-cols-2 gap-2'>
                  <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                    <ChatBubbleLeftRightIcon className='mb-1 h-5 w-5' />
                    <p className='text-xs font-semibold'>Chats guardados</p>
                  </div>
                  <div className='rounded-lg bg-base-100/15 p-3 text-primary-content'>
                    <SparklesIcon className='mb-1 h-5 w-5' />
                    <p className='text-xs font-semibold'>Asistentes activos</p>
                  </div>
                </div>
              </div>

              <div className='login-form-wrap'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>Bienvenido de nuevo</p>
                  <h2 className='mt-2 text-3xl font-bold text-base-content'>Inicia sesión</h2>
                  <p className='mt-3 text-base text-base-content/70'>
                    {email.length > 0 ? email : 'Ingresa la contraseña asociada a tu cuenta.'}
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

                <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                  <label className='form-control'>
                    <span className='label-text'>Contraseña</span>
                    <div className='input input-bordered mt-2 flex items-center gap-2'>
                      <KeyIcon className='h-5 w-5 opacity-60' />
                      <input
                        className='grow'
                        autoComplete='off'
                        placeholder='Contraseña'
                        type='password'
                        value={password}
                        onChange={(event) => { setPassword(event.target.value) }}
                      />
                    </div>
                  </label>

                  <button
                    className='btn btn-primary w-full gap-2'
                    type='submit'
                    disabled={false}>
                    Iniciar sesión
                    <ArrowRightIcon className='h-5 w-5' />
                  </button>
                </form>

                <button
                  type='button'
                  onClick={() => { navigate(RoutePath.FORGOT_PASSWORD) }}
                  className='btn btn-ghost btn-sm w-fit px-0 text-base-content/70'>
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </section>

            <div className='version-container-login'>
              <p className='version-text-login'>Ayuda</p>
              <p className='version-text-login'>version: {store.version}</p>
            </div>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
