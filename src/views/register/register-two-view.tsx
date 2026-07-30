import './register-view.css';
import { type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
import { useAppStore } from '@/stores/app-store';
import { useAuthStore } from '@/stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import { universitiesColombia } from '@/lib/universities';
import { RoutePath } from '@/router';
import {
   ArrowRightIcon,
   BuildingLibraryIcon,
   GiftIcon,
   SparklesIcon,
   SwatchIcon
} from '@heroicons/react/24/solid';

export function RegisterTwoView(): JSX.Element {

   const store = useAppStore((state) => ({
      version: state.version
   }));

   const [userEmail] = useAuthStore((store) => [store.userEmail]);

   const navigate = useNavigate();

   const [name, phoneNumber, theme, nextTheme, university, setUniversity, setTheme, setReferredCode] = useUserStore((store) => [
      store.name,
      store.phoneNumber,
      store.theme,
      store.nextTheme,
      store.university,
      store.setUniversity,
      store.setTheme,
      store.setReferredCode
   ]);

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

   const onSubmit = async (event: FormEvent): Promise<void> => {
      event.preventDefault();
      if (userEmail.length !== 0 && name.length !== 0) {
         navigate(RoutePath.REGISTER_THREE)
      }
   }

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
                              <SparklesIcon className='h-4 w-4' />
                              Paso 2 de 3
                           </div>
                           <div className='avatar'>
                              <div className='w-16 rounded-lg bg-base-100'>
                                 <img src='/assistants/elena-ia-assistant.svg' alt='Asistente académico' />
                              </div>
                           </div>
                        </div>

                        <div>
                           <h1 className='mt-6 text-4xl font-bold leading-tight'>Personaliza tu contexto académico</h1>
                           <p className='mt-3 text-base text-primary-content/80'>
                              Con tu universidad y código de referido podemos adaptar mejor tus beneficios y experiencia.
                           </p>
                        </div>

                        <div className='mt-5 rounded-lg bg-base-100/15 p-4 text-primary-content'>
                           <p className='text-sm font-semibold'>Puedes omitir este paso si quieres completar el registro más rápido.</p>
                        </div>
                     </div>

                     <div className='register-form-wrap'>
                        <div>
                           <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>Registro</p>
                           <h2 className='mt-2 text-3xl font-bold text-base-content'>Información académica</h2>
                           <p className='mt-3 text-base text-base-content/70'>
                              Para conocerte mejor, cuéntanos si estás estudiando y en qué universidad.
                           </p>
                        </div>

                        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                           <label className='form-control'>
                              <span className='label-text'>Universidad</span>
                              <div className='mt-2 flex flex-col gap-3 sm:flex-row'>
                                 <details className='dropdown'>
                                    <summary className='btn w-full sm:w-40'>Seleccionar</summary>

                                    <ul className='menu dropdown-content z-[1] h-72 w-96 overflow-auto rounded-box bg-base-100 shadow'>
                                       {universitiesColombia.map((item, index: number) => (
                                          <li key={index} onClick={() => {
                                             setUniversity(item.name)
                                          }}>
                                             <a>{item.name}</a>
                                          </li>
                                       ))}
                                    </ul>
                                 </details>

                                 <div className='input input-bordered flex grow items-center gap-2'>
                                    <BuildingLibraryIcon className='h-5 w-5 opacity-60' />
                                    <input className='grow' value={university} readOnly placeholder='Universidad seleccionada' />
                                 </div>
                              </div>
                           </label>

                           <label className='form-control'>
                              <span className='label-text'>Código de referido</span>
                              <div className='input input-bordered mt-2 flex items-center gap-2'>
                                 <GiftIcon className='h-5 w-5 opacity-60' />
                                 <input
                                    type='text'
                                    placeholder='Código de referido'
                                    className='grow'
                                    onChange={(event) => {
                                       setReferredCode(event.target.value)
                                    }}
                                 />
                              </div>
                           </label>

                           <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                              <button className='btn btn-primary gap-2' type='submit' disabled={false}>
                                 Siguiente
                                 <ArrowRightIcon className='h-5 w-5' />
                              </button>

                              <button
                                 type='button'
                                 className='btn btn-secondary'
                                 onClick={() => {
                                    setReferredCode('')
                                    setUniversity('')
                                    navigate(RoutePath.REGISTER_THREE)
                                 }}>
                                 Omitir
                              </button>
                           </div>
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
