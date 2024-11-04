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
         navigate('is-registered');
      } else if(name.length === 0 || phoneNumber === null) {
         navigate('register');
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

            </main>
         </motion.div>
      </AnimatePresence>
   </div>
    )
 }