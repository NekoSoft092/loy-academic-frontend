import './register-view.css';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';   
import { useAppStore } from '@/stores/app-store'; 
import { useAuthStore } from '@/stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import { universitiesColombia } from '@/lib/universities';

 export function RegisterTwoView(): JSX.Element {

   const store = useAppStore((state) => ({
      version: state.version, 
      settings: state.settings, 
      isDevBuild: state.isDevBuild
   }));
   
   const [ userEmail ] = useAuthStore((store) => [store.userEmail]);
   
   const navigate = useNavigate();

   const [ name, phoneNumber, theme, nextTheme, university, setUniversity, setTheme, setReferredCode ] = useUserStore((store) => [
      store.name, 
      store.phoneNumber, 
      store.theme, 
      store.nextTheme, 
      store.university, 
      store.setUniversity, 
      store.setTheme, 
      store.setReferredCode
   ]);


   useEffect(()=>{
      const theme = localStorage.getItem('theme')
      if (theme !== null) {
         setTheme(theme)
      }

      if(userEmail.length === 0) {
         navigate('/is-registered');
      } else if(name.length === 0 || phoneNumber === null) {
         navigate('/register');
      }
   }, [userEmail])

   const onSubmit = async (e: React.FormEvent): Promise<void> => {
           e.preventDefault();
           if(userEmail.length !== 0 && name.length !== 0) {
               navigate('/register-three')
           }
       }

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
                           Para conocerte mejor, cuéntanos si estás estudiando, y en caso afirmativo, tu universidad y carrera.
                           </p>
                        </div>

                        <p style={{ opacity: 0.6, marginTop: 10 }}>
                            Selecciona tu universidad:
                        </p>

                        <div className='flex flex-row justify-start content-center gap-5'>

                           <details className="dropdown">
                              
                              <summary className="btn">Seleccionar</summary>

                              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] shadow" style={{width: 400, height: 300}}>

                                 {universitiesColombia.map((item, index) => (
                                    <li key={index} onClick={() => {
                                       setUniversity(item.name)
                                    }}>
                                       <a>{item.name}</a>
                                    </li>
                                 ))}
                              </ul>
                           </details>

                           <p style={{paddingTop: 13}}>{university}</p>

                        </div>

                        <p style={{ opacity: 0.6, marginTop: 10 }}>
                            Has sido referido por un amigo?
                        </p>
                        
                        <input type="text" placeholder="Codigo de referido" className="input w-full max-w"
                           onChange={(e) => {
                              setReferredCode(e.target.value)
                           }}/>

                        <div style={{marginTop: '30px'}} className='flex flex-col gap-2'>
                           <button 
                              className="btn btn-primary reset"
                              type='submit'
                              disabled={false}>
                              Siguiente
                           </button>

                           <div className="btn btn-active btn-secondary" onClick={() => {
                              setReferredCode('')
                              setUniversity('')
                              navigate('/register-three')
                           }}>Omitir</div>
                        </div>
                        
                           

                     </form>


                     <div style={{width: '100%'}} className='version-container-register'>
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