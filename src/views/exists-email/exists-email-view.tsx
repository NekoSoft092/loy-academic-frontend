import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { type IErrorResponse, type IsRegisteredResponse, useAuthStore } from '@/stores/auth-store';
import './exists-email-view.css';
import React, { useEffect, useState } from 'react';

export function ExistsEmailView() : JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
    }));

    const [ isRegistered ] = useAuthStore((store) => [
        store.isRegistered
    ])

    const navigate = useNavigate();

    const [ inputErrorMessage, setInputErrorMessage ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');

    const handleSubmitFn = async (e: React.FormEvent):Promise<void> => {
        e.preventDefault();
        if (email.length === 0) {
            return;
        } else if(email.length < 8 || !email.includes('@') || !email.includes('.') ) {
            setInputErrorMessage('Correo electronico invalido')
           return; 
        }

        const response: IsRegisteredResponse | IErrorResponse = await isRegistered(email);
        if((response as IsRegisteredResponse).is_registered) {
            navigate('/login');
        } else if((response as IErrorResponse).detail != null) {
            setInputErrorMessage((response as IErrorResponse).detail);
            setTimeout(()=>{
                setInputErrorMessage('');
            }, 6000)
        } else {
            navigate('/register');
        }
    }
    useEffect(()=>{}, [inputErrorMessage])
    
    return (
        <div data-theme="cupcake" className={'view'}>
        <AnimatePresence>
        <motion.div
          style={{ width: '100%', height: '100%'}}
          className='exists-email-view'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}>
            <main style={{width: '100%'}}>

            {(inputErrorMessage.length > 0) && (
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div role="alert" className="alert alert-info" 
                style={{position: 'fixed', padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center'}} 
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
    
                <div className='header-view'>
                    <button
                        onClick={() => {
                            navigate('/settings')
                        }}
                        style={{}}
                        className="">
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
                <form onSubmit={handleSubmitFn} className='auth-form'>
                    <label className={'input input-bordered flex items-center gap-2'} style={{outlineStyle: "none", width: '100%'}}>
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
                            onChange={(e)=> {setEmail(e.target.value)}}
                        />
                    </label>
                    
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
        </motion.div>
        </AnimatePresence>
        </div>
    )
}