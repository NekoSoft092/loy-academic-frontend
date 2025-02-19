import './register-view.css'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/user-store';   
import { useAppStore } from '@/stores/app-store'; 
import { type ILoginResponse, type ILoginResponseError, useAuthStore } from '@/stores/auth-store';
import { useEffect, useState } from 'react';
import { type IRegisterRequest } from '@/services/auth-service';

export function RegisterThreeView(): JSX.Element {

    const store = useAppStore((state) => ({
          version: state.version, 
          settings: state.settings, 
          isDevBuild: state.isDevBuild
    }));

    const [ userEmail, signUp ] = useAuthStore((store) => [store.userEmail, store.signUp]);

    const navigate = useNavigate();

    const [ name, phoneNumber, theme, nextTheme, university, setTheme, country] = useUserStore((store) => [
        store.name, 
        store.phoneNumber, 
        store.theme, 
        store.nextTheme, 
        store.university, 
        store.setTheme, 
        store.country
    ])

    const [ password, setPassword ] = useState<string>('')


    const onSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if(userEmail.length !== 0 && name.length !== 0 && phoneNumber !== null && country !== null) {
            const req: IRegisterRequest = {
                name, 
                email: userEmail, 
                password, 
                code_contry: String(country.country_code), 
                phone_number: phoneNumber
            }
            const resp: ILoginResponse | ILoginResponseError = await signUp(req)
            if ((resp as ILoginResponse).status === 'success') {
                navigate('/chat')
            }
            

        }
    }

    useEffect(() => {
        const theme: string | null = localStorage.getItem('theme')
        if (theme !== null) {
            setTheme(theme)
        }

        if(userEmail.length === 0) {
            navigate('/is-registered');
         } else if(name.length === 0 || phoneNumber === null) {
            navigate('/register');
         }

    }, [userEmail])


    return (
        <div className='view bg-primary' data-theme={theme}>
            <AnimatePresence>
                <motion.div style={{ width: '100%', height: '100%' }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className='bg-auth'>
                    <main style={{width: '100%', minWidth: '500px', maxWidth: '500px'}} className='main-container bg-base-100 rounded-md'>
                        <div>
                            <div className='header-view'>
                                <button
                                    onClick={() => {
                                    localStorage.setItem('theme', theme)
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
                                <div className="flex-row justify-center align-end" style={{marginTop: '0rem'}}>
                                    <h3 className="text-primary bold center-align" style={{fontFamily: 'Poppins-Medium', fontSize: '4rem'}}>Loy</h3>
                                    <p style={{fontFamily: 'Poppins-Regular', fontSize: '2rem' }}>Academic</p>
                                </div>
                            </div>  

                            <form onSubmit={onSubmit} className='auth-form'>

                                <div>
                                    <p style={{ opacity: 0.6 }} className='text-center'>
                                        ¡Estas a un paso! Crea una contraseña. Asegúrate de que sea fácil de recordar para ti, pero difícil de adivinar para otros..
                                    </p>
                                </div>

                                <label className={'input input-bordered flex items-center gap-4'} style={{outlineStyle: "none", width: '100%'}}>
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
                                        className='grow'
                                        autoComplete="off"
                                        disabled={true}
                                        value={userEmail}
                                        type='text'
                                    />
                                </label>

                                <p style={{ opacity: 0.6, paddingBottom: 10 }} className='text-center'>
                                Acuérdate de que: 
                                </p>

                                <p>
                                Debe tener al menos 8 caracteres.
                                </p>
                                <p>
                                Debe contener al menos una letra mayúscula.
                                </p>
                                <p>
                                Debe contener al menos un número.
                                </p>

                            

                                <label className={'input input-bordered flex items-center gap-2'} style={{outlineStyle: "none", width: '100%'}}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        className="h-4 w-4 opacity-70">
                                        <path
                                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                    </svg>
                                    <input
                                        style={{
                                            fontFamily: 'Open-Sans'
                                        }}
                                        className='grow'
                                        autoComplete="off"
                                        placeholder='Ingresa tu contraseña'
                                        type='password'
                                        onChange={(e)=> {setPassword(e.target.value)}}
                                    />
                                </label>

                                
                        
                                <div className='' style={{marginTop: '28px', width: '100%'}}>
                                    <button 
                                        className="btn btn-primary reset w-full"
                                        style={{}}
                                        type='submit'
                                        disabled={false}>
                                        Registrate
                                    </button>
                                </div>
                            </form>

                        </div>

                        <div style={{width: '100%'}} className='version-container-register'>
                    <p className='version-text'>
                        Ayuda
                    </p>

                    <p className='version-text'>
                        version: {store.version}
                    </p>
                </div>
                    </main>

               </motion.div>
            </AnimatePresence>
        </div>
    )
}