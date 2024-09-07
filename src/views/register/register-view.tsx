import './register-view.css';
import { useState } from 'react';
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthHeader } from '@/components/auth/shared/auth-header';
import { AuthInput } from '@/components/auth/shared/auth-input';
import { useAppStore } from '@/stores/app-store';
import { onWeb } from '@/lib/windows';

export function RegisterView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
    }));

    const { register, handleSubmit,
        setError, formState: { 
            isDirty, isSubmitting, 
            isValid, errors 
        },
    } = useForm({
        mode: 'onChange',
    });
    
    const [signUp] = useAuthStore((store) => [store.signUp]);
    const [agree, setAgree] = useState<boolean>(false);
    const navigate = useNavigate();

    // Functions
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const response = await signUp(
          data.first_name,
          data.last_name,
          data.email,
          data.password
        )
        if (response.status === 'OK') {
          navigate('/')
        } else if (response.status === 'FIELD_ERROR') {
          const formFields = response.formFields ?? []
          formFields.forEach((field) => {
            setError(field.id, {
              message: field.error,
            })
          })
        }
    }

    return (
        <AnimatePresence>
            <motion.div style={{ width: '100%' }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}>
                <main className={onWeb(window)?'auth-view' : 'sage-view auth-view'}>
                    <AuthHeader isLogin={false} />
                    <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
                        <AuthInput
                            placeholder="Nombre"
                            type="text"
                            formHandle={register('first_name', { required: true })}
                            prefix={<i>person</i>}
                            errorMessage={errors.firstName?.message as string}/>
                        
                        <AuthInput
                            placeholder="Apellido"
                            type="text"
                            formHandle={register('last_name', { required: true })}
                            prefix={<i>person</i>}
                            errorMessage={errors.lastName?.message as string}/>

                        <AuthInput
                            type="email"
                            placeholder="Email"
                            formHandle={register('email', { required: true })}
                            prefix={<i>email</i>}
                            errorMessage={errors.email?.message as string}/>

                        <AuthInput
                            type="password"
                            placeholder="Contraseña"
                            formHandle={register('password', { required: true })}
                            prefix={<i>lock</i>}
                            errorMessage={errors.password?.message as string}/>


                        <label className="checkbox" onChange={() => {
                            agree? setAgree(false): setAgree(true);
                        }}>
                            <input type="checkbox"/>
                            <span><p>Aceptas los términos y condiciones?</p></span>
                        </label>
                        <button
                            type="submit"
                            className='reset'
                            disabled={!isDirty || !isValid || isSubmitting || !agree}
                            style={{
                            width: '100%',
                            boxSizing: 'inherit' }}>
                            Registrarte
                        </button>
                    </form>
                    <span style={{marginTop: '10px'}}>
                        v{store.version}
                    </span>
                </main>
            </motion.div>
        </AnimatePresence>
    )
}