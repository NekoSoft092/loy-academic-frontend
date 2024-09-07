import { motion, AnimatePresence } from 'framer-motion';
import { AuthHeader } from '@/components/auth/shared/auth-header';
import { useNavigate } from 'react-router-dom';
import { type ILoginResponseError, useAuthStore, type ILoginResponse } from '@/stores/auth-store';
import './login-view.css';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useForm, type SubmitHandler, type FieldValues } from 'react-hook-form';
import { AuthInput } from '@/components/auth/shared/auth-input';
import { useAppStore } from '@/stores/app-store';
import { onWeb } from '@/lib/windows';

export function LoginView(): JSX.Element {

    const store = useAppStore((state) => ({
        version: state.version,
        settings: state.settings,
        isDevBuild: state.isDevBuild,
    }));

    const { register,
        handleSubmit,
        setError,
        formState: { isDirty, isSubmitting, isValid, errors },
      } = useForm({
        mode: 'onChange',
      })

    const [ signIn ] = useAuthStore((store) => [
      store.signIn, 
    ])
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const response: ILoginResponse | ILoginResponseError = await signIn(data.email, data.password)

        if ((response as ILoginResponse).status === "success") {
          navigate('/')
        }
        else if ((response as ILoginResponseError).detail === 'invalid credencial') {
          setError('password', {
            message: 'Wrong email or password. Please try again.',
          })
          setError('email', {
            message: 'Wrong email or password. Please try again.',
          })
        } else if ((response as ILoginResponseError).detail !== 'invalid credencial') {
            setError('email', {
              message: (response as ILoginResponseError).detail,
            })
          
        }
      }

    return (
        <>
        <AnimatePresence>
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}>
            <main className={onWeb(window)?'auth-view' : 'sage-view auth-view'}>
                <button
                    onClick={() => {
                        navigate('/settings')
                    }}
                    style={{ position: 'absolute', top: 0, right: 0, margin: 2 }}
                    className="transparent circle">
                    <i className="secondary-text">
                        <Cog6ToothIcon />
                    </i>
                </button>
                <AuthHeader isLogin={true}/>
                <form onSubmit={handleSubmit(onSubmit)} className='auth-form' style={{marginTop: '.5rem'}}>
                    <AuthInput
                        type="email"
                        placeholder="Email"
                        prefix={<i>email</i>}
                        formHandle={register('email', { required: true })}
                        errorMessage={errors.email?.message as string}/>

                    <AuthInput
                        type="password"
                        placeholder="Contraseña"
                        prefix={<i>lock</i>}
                        formHandle={register('password', { required: true })}
                        errorMessage={errors.password?.message as string}/>
                    
                    <button
                        type="submit"
                        className='reset'
                        disabled={!isDirty || !isValid || isSubmitting}
                        style={{
                        width: '100%',
                        boxSizing: 'inherit',
                        marginTop: '.5rem'
                        }}>
                          Ingresar
                    </button>
                </form>
            
                <p style={{ marginTop: '.5rem' }} className="center-align">
                    Todavia no tienes una cuenta?{' '}
                    <a className="primary-text" onClick={() => {
                        navigate('/register');
                    }}>
                        Registrate aquí
                    </a>
                </p>

                <span style={{marginTop: '10px'}}>
                    v{store.version}
                </span>
              
            </main>
        </motion.div>
        </AnimatePresence>
        </>
    )
}