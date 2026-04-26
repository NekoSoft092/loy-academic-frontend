import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { type ILoginResponseError, useAuthStore, type ILoginResponse } from '@/stores/auth-store';
import './login-view.css';
import { useAppStore } from '@/stores/app-store';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';

export function LoginView(): JSX.Element {

  const store = useAppStore((state) => ({
    version: state.version,
    settings: state.settings,
    isDevBuild: state.isDevBuild,
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

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (password.length === 0) {
      return;
    }

    const response: ILoginResponse | ILoginResponseError = await signIn(email, password)
    if ((response as ILoginResponse).status === "success") {
      navigate(RoutePath.HOME)
    } else if ((response as ILoginResponseError).detail === 'invalid credentials') {
      setInputErrorMessage('Ups!!! Esta contraseña no es correcta. ¿Quieres volver a intentarlo?')
    } else if ((response as ILoginResponseError).detail !== 'invalid credentials') {
      setInputErrorMessage('Error inesperado, vuelve a intentarlo más tarde')
    }
  }

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme')
        if ( currentTheme !== null) {
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

          <div>
            <h1 className='text-white txt-title'>Tu camino hacia el éxito académico comienza aquí.</h1>
          </div>
          
          <main style={{width: '100%', minWidth: '500px', maxWidth: '500px'}} className='main-container bg-base-100 rounded-md'>

          {(inputErrorMessage.length > 0) && (
            <div style={{width: '1000%', display: 'flex', justifyContent: 'center', position: 'fixed', minWidth: '500px', maxWidth: '500px'}}>
                <div role="alert" className="alert alert-info" 
                style={{padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center'}} 
                onClick={()=> {setInputErrorMessage('')}}>
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
                    <p style={{fontSize: '15px'}}>{inputErrorMessage}</p>
                </div>
            </div>
            )}

            <div className='header-view-login'>
              <button onClick={() => {
                navigate(RoutePath.IS_REGISTERED)
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => {
                    nextTheme()
                }}
                style={{display: 'flex', gap: '5px'}}
                className="">
                <p style={{textTransform: 'capitalize'}}>{theme}</p>
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
          
          <div style={{ width: '100%', paddingBottom: '10px' }}>
            <form onSubmit={onSubmit} className='auth-form'>
              <button 
                type="button"
                onClick={() => { navigate('/forgot-password') } }
                className='flex flex-row justify-end forgot' 
                style={{ opacity: 0.6, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', textDecoration: 'underline' }}>
                ¿Olvidaste tu contraseña?
              </button>

              <label className={'input input-bordered flex items-center gap-2'} style={{ outlineStyle: "none", width: '100%' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input
                  style={{
                    fontFamily: 'Open-Sans'
                  }}
                  className='grow'
                  autoComplete="off"
                  placeholder='Contraseña'
                  type='password'
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </label>

              <button
                className="btn btn-primary reset"
                type='submit'
                disabled={false}>
                Iniciar sessión
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