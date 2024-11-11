import './register-view.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';   
import { useAppStore } from '@/stores/app-store'; 
import { useAuthStore } from '@/stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';

 export function RegisterTwoView(): JSX.Element {

   const store = useAppStore((state) => ({
      version: state.version, 
      settings: state.settings, 
      isDevBuild: state.isDevBuild
   }));
   
   const [ userEmail ] = useAuthStore((store) => [store.userEmail]);
   
   const navigate = useNavigate();

   const [ name, phoneNumber, theme ] = useUserStore((store) => [
      store.name, 
      store.phoneNumber, 
      store.theme
   ]);

   const [ referredCode, setReferredCode ] = useState<string>('');

   useEffect(()=>{
      if(userEmail.length === 0) {
         navigate('/is-registered');
      } else if(name.length === 0 || phoneNumber === null) {
         navigate('/register');
      }
   }, [userEmail])

   return (
   <div className='view' data-theme={theme}>
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


                    
                  
               </div>
            </main>
         </motion.div>
      </AnimatePresence>
   </div>
    )
 }