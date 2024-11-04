import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { type ILoginResponseError, useAuthStore, type ILoginResponse } from '@/stores/auth-store';
import './login-view.css';
import { useAppStore } from '@/stores/app-store';
import { onWeb } from '@/lib/windows';
import { useState } from 'react';

export function LoginView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
    }));

    const [ password, setPassword ] = useState<string>('');
    const [ inputErrorMessage, setInputErrorMessage ] = useState<string>('');

    const [ signIn, email] = useAuthStore((store) => [
      store.signIn, 
      store.userEmail
    ])
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent): Promise<void>  => {
      e.preventDefault();
      
      if (password.length === 0) {
        return;
      } 

      const response: ILoginResponse | ILoginResponseError = await signIn(email, password)
      if ((response as ILoginResponse).status === "success") {
        navigate('/')
      } else if ((response as ILoginResponseError).detail === 'invalid credentials') {
        setInputErrorMessage('Ups!!! Esta contraseña no es correcta. ¿Quieres volver a intentarlo?') 
      } else if ((response as ILoginResponseError).detail !== 'invalid credentials') {
        setInputErrorMessage('Error inesperado, vuelve a intentarlo más tarde')
      }
    }

    return (
        <div data-theme="cupcake" className={onWeb(window)?'view' : 'view desktop-view'}>
        <AnimatePresence>
        <motion.div
          style={{ width: '100%', height: '100%' }}
          className='login-view'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}>
            <main style={{width: '100%'}}>

            {(inputErrorMessage.length > 0) && (
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div role="alert" className="alert alert-error" 
                style={{position: 'fixed', padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center'}} 
                onClick={()=> {setInputErrorMessage('')}}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p style={{fontSize: '15px'}}>{inputErrorMessage}</p>
                </div>
              </div>
              )}

              <div className='header-view-login'>
                <button onClick={() => {
                  navigate('/is-registered')
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                    onClick={() => {
                        navigate('/settings')
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                    </svg>
                </button>
              </div>


              <div className=''>
                <div className="flex-row justify-center align-end" style={{marginTop: '6rem'}}>
                    <h3 className="text-primary bold center-align" style={{fontFamily: 'Poppins-Medium', fontSize: '4rem'}}>Loy</h3>
                    <p style={{fontFamily: 'Poppins-Regular', fontSize: '2rem' }}>Academic</p>
                </div>
              </div>
            </main>
            <div style={{width: '100%', paddingBottom: '10px'}}>
              <form onSubmit={onSubmit} className='auth-form'>
                <p className='flex flex-row justify-end forgot' style={{opacity: 0.6, fontSize: '14px'}}>¿Olvidaste tu contraseña?</p>
                
                  <label className={'input input-bordered flex items-center gap-2'} style={{outlineStyle: "none", width: '100%'}}>
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
                          onChange={(e)=> {setPassword(e.target.value)}}
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
        </motion.div>
        </AnimatePresence>
        </div>
    )
}