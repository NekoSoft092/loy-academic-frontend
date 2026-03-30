import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useUserStore } from '@/stores/user-store';
import { requestPasswordResetService, resetPasswordService, type IPasswordResetResponse, type IErrorResponse } from '@/services/auth-service';
import './forgot-password-view.css';

export function ForgotPasswordView(): JSX.Element {
  const store = useAppStore((state) => ({
    version: state.version,
    settings: state.settings,
    isDevBuild: state.isDevBuild,
  }));

  const navigate = useNavigate();

  // State management
  const [step, setStep] = useState<'email' | 'verification' | 'reset'>('email');
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [inputErrorMessage, setInputErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [theme, setTheme] = useUserStore((store) => [
    store.theme,
    store.setTheme
  ]);

  // Email validation
  const isValidEmail = (emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailToValidate);
  };

  // Password validation
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  };

  // Handle step 1: Request password reset
  const handleRequestReset = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setInputErrorMessage('');

    if (email.length === 0) {
      setInputErrorMessage('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!isValidEmail(email)) {
      setInputErrorMessage('Por favor ingresa un correo válido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestPasswordResetService(email);
      const data: IPasswordResetResponse | IErrorResponse = await response.json();

      if (response.ok && 'message' in data && data.message.length > 0) {
        setStep('verification');
        setSuccessMessage('Te hemos enviado un código a tu correo electrónico');
      } else {
        const errorData = data as IErrorResponse;
        const errorMessage = errorData.detail !== undefined && errorData.detail.length > 0 ? errorData.detail : 'Error al solicitar el restablecimiento';
        setInputErrorMessage(errorMessage);
      }
    } catch (error) {
      setInputErrorMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step 2: Verify code and reset password
  const handleResetPassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setInputErrorMessage('');

    if (code.length === 0) {
      setInputErrorMessage('Por favor ingresa el código');
      return;
    }

    if (code.length < 6) {
      setInputErrorMessage('El código debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword.length === 0) {
      setInputErrorMessage('Por favor ingresa la nueva contraseña');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setInputErrorMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    if (newPassword !== confirmPassword) {
      setInputErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPasswordService(email, code, newPassword);
      const data: IPasswordResetResponse | IErrorResponse = await response.json();

      if (response.ok && 'message' in data && data.message.length > 0) {
        setSuccessMessage('¡Contraseña actualizada exitosamente!');
        setStep('reset');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = data as IErrorResponse;
        const errorMessage = errorData.detail !== undefined && errorData.detail.length > 0 ? errorData.detail : 'Error al restablecer la contraseña';
        setInputErrorMessage(errorMessage);
      }
    } catch (error) {
      setInputErrorMessage('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme !== null) {
      setTheme(currentTheme);
    }
  }, []);

  return (
    <div data-theme={theme} className={'view bg-primary'}>
      <AnimatePresence>
        <motion.div
          style={{ width: '100%', height: '100%' }}
          className='bg-auth'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}>

          <div>
            <h1 className='text-white txt-title'>Recupera tu acceso</h1>
          </div>

          <main style={{ width: '100%', minWidth: '500px', maxWidth: '500px' }} className='main-container bg-base-100 rounded-md'>

            {/* Alert Messages */}
            {inputErrorMessage.length > 0 && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'fixed', minWidth: '500px', maxWidth: '500px' }}>
                <div role="alert" className="alert alert-error"
                  style={{ padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center' }}
                  onClick={() => { setInputErrorMessage('') }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p style={{ fontSize: '15px' }}>{inputErrorMessage}</p>
                </div>
              </div>
            )}

            {successMessage.length > 0 && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'fixed', minWidth: '500px', maxWidth: '500px' }}>
                <div role="alert" className="alert alert-success"
                  style={{ padding: '8px', gap: 2, marginTop: '40px', display: 'flex', width: '90%', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p style={{ fontSize: '15px' }}>{successMessage}</p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className='header-view-login'>
              <button onClick={() => {
                navigate('/login');
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className='text-lg font-semibold'>Recuperar contraseña</h2>
              <div style={{ width: '24px' }}></div>
            </div>

            <form className='form-forgot-password' onSubmit={step === 'email' ? handleRequestReset : handleResetPassword}>

              {/* Step 1: Request Reset */}
              {step === 'email' && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className='step-container'>
                  <p className='step-description'>
                    Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
                  </p>

                  <div className='form-group'>
                    <label htmlFor="email" className='form-label'>Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      className="input input-bordered w-full"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Verify Code and Reset Password */}
              {step === 'verification' && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className='step-container'>
                  <p className='step-description'>
                    Hemos enviado un código a <strong>{email}</strong>. Por favor ingresa el código e ingresa tu nueva contraseña.
                  </p>

                  {/* Code Input */}
                  <div className='form-group'>
                    <label htmlFor="code" className='form-label'>Código de verificación</label>
                    <input
                      id="code"
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Ingresa el código"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                      disabled={isLoading}
                      maxLength={6}
                    />
                    <small className='helper-text'>Revisa tu correo (incluyendo spam)</small>
                  </div>

                  {/* New Password Input */}
                  <div className='form-group'>
                    <label htmlFor="newPassword" className='form-label'>Nueva contraseña</label>
                    <div className='password-input-wrapper'>
                      <input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        className="input input-bordered w-full"
                        placeholder="Mínimo 8 caracteres"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className='password-toggle'
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c2.292 5.118 7.36 8.747 13.066 8.747a13.764 13.764 0 0 0 2.825-.28m5.858-2.908a11.52 11.52 0 0 0 3.141-5.513c-2.292-5.118-7.36-8.747-13.066-8.747a13.827 13.827 0 0 0-2.929.266m15.984 11.03a9.456 9.456 0 0 0 .773-4.741A9.456 9.456 0 0 0 12 2.25" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <small className='helper-text'>Debe contener mayúsculas, minúsculas y números</small>
                  </div>

                  {/* Confirm Password Input */}
                  <div className='form-group'>
                    <label htmlFor="confirmPassword" className='form-label'>Confirmar contraseña</label>
                    <div className='password-input-wrapper'>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input input-bordered w-full"
                        placeholder="Repite la contraseña"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className='password-toggle'
                        onClick={() => {
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c2.292 5.118 7.36 8.747 13.066 8.747a13.764 13.764 0 0 0 2.825-.28m5.858-2.908a11.52 11.52 0 0 0 3.141-5.513c-2.292-5.118-7.36-8.747-13.066-8.747a13.827 13.827 0 0 0-2.929.266m15.984 11.03a9.456 9.456 0 0 0 .773-4.741A9.456 9.456 0 0 0 12 2.25" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className='form-actions'>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Procesando...
                    </>
                  ) : step === 'email' ? 'Enviar código' : 'Restablecer contraseña'}
                </button>
              </div>

              {/* Help Links */}
              <div className='form-footer'>
                <button
                  type="button"
                  className='link-button'
                  onClick={() => {
                    navigate('/login');
                  }}
                >
                  Volver a iniciar sesión
                </button>
              </div>
            </form>

            <div className='version-container-register'>
              <p style={{ fontSize: '12px', opacity: '0.5' }}>v{store.version}</p>
              <p style={{ fontSize: '12px', opacity: '0.5' }}>{store.isDevBuild() && 'DEV'}</p>
            </div>

          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
