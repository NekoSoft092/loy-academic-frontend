import './register-view.css';
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { countries, type ICountry } from '@/lib/countries';

export function RegisterView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
    }));
    
    const [ userEmail ] = useAuthStore((store) => [ store.userEmail ]);
    const navigate = useNavigate();
    const [ name, setName, setPhoneNumber, setCountry, country, setBirthDate, birthDate, theme ] = useUserStore((store) => [
        store.name,
        store.setName, 
        store.setPhoneNumber, 
        store.setCountry,
        store.country, 
        store.setBirthDate, 
        store.birthDate, 
        store.theme
    ]);

    // Functions
    const onSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if(userEmail.length !== 0 && name.length !== 0) {
            navigate('/register-two')
        }
    }

    useEffect(()=>{
        if(userEmail.length === 0) {
            navigate('/is-registered')
        }
    }, [userEmail])

    return (
        <div data-theme={theme} className={'view'}>
        <AnimatePresence>
            <motion.div style={{ width: '100%', height: '100%' }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className=''>
                <main style={{ width: '100%', height: '100%'}} className='register-view'>
                    <div>
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
            
                    <form onSubmit={onSubmit} className='auth-form'>

                        <div>
                            <p style={{ opacity: 0.6 }} className='text-center'>¡Bienvenido! Aún no te conocemos. Regístrate para disfrutar de todos nuestros beneficios.</p>
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

                        <p style={{ opacity: 0.6 }} className='text-center'>
                        Por favor, indica tu fecha de nacimiento, tu nombre y número de telefono:
                        </p>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DemoContainer components={[
                                    'DesktopDatePicker'
                                ]}>
                                    <DemoItem>
                                        <DesktopDatePicker defaultValue={birthDate} onChange={(e)=>{
                                            if (e !== null) {
                                                const month: number = e.getMonth();
                                                const year: number = e.getFullYear();
                                                setBirthDate(new Date(year, month, e.getDate()));
                                            }
                                        }}/> 
                                    </DemoItem>

                                </DemoContainer>
                        </LocalizationProvider>

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
                                placeholder='Ingresa tu nombre'
                                type='text'
                                onChange={(e)=> {setName(e.target.value)}}
                            />
                        </label>

                        <div className='flex gap-1'>
                            <div>
                                <div className="btn" style={{width: '100px'}} onClick={()=>{
                                        (document?.getElementById('my_modal_1') as HTMLDialogElement).showModal()
                                    }}
                                >
                                <img src={country.url} alt="default-flag" height='30px' width='30px'/>
                                <p style={{opacity: 0.6}}>+{country.country_code}</p>
                                </div>

                                <dialog id="my_modal_1" className="modal">
                                <div className="modal-box">
                                  
                                    <p className="py-4">Escoje el codigo de tu pais</p>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {countries.map((countryMap: ICountry, index: number)=>{
                                                return (
                                                <button key={index} className='capitalized flex content-center items-center gap-4 py-2 px-4' style={{width: '300px'}}
                                                    onClick={(e:  React.FormEvent) => {
                                                        
                                                        setCountry(countryMap);
                                                    }}
                                                >
                                                    <img src={countryMap.url} alt="" width={50}/>
                                                    <p>{countryMap.name} (+{countryMap.country_code})</p>
                                                </button>
                                                )
                                            })}
                                        </form>
                                    </div>
                                </div>
                                </dialog>
                            </div>
                            <input 
                                type="text"
                                onKeyDown={(event: any)=>{
                                    return (event.charCode >= 48 && event.charCode <= 57)
                                }}
                                placeholder="Número de teléfono" 
                                className="input input-bordered w-full max-w-xs" 
                                onChange={(e)=> {setPhoneNumber(Number(e.target.value))}}
                                />
                        </div>    
                
                        <div className='btn-next'>
                            <button 
                                className="btn btn-primary reset" style={{width: '100%'}}
                                type='submit'
                                disabled={false}>
                                Siguiente
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