import { useAuthStore, type ApiErrorResponse } from '@/stores/auth-store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/router';

interface ProtectedProps {
  children: JSX.Element
}

export function Protected({ children }: ProtectedProps): JSX.Element {
  const [ checkSignIn ] = useAuthStore((state) => [
    state.checkSignIn
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    checkSignIn()
      .then((data: boolean | ApiErrorResponse) => {
      
        if (typeof data === 'boolean' && data) {
          navigate(RoutePath.HOME);
        } else {
          navigate(RoutePath.IS_REGISTERED)
        }
      })
      .catch((err) => {
        navigate(RoutePath.IS_REGISTERED);
        console.log('session', err);
      })
  }, [])

  return <>{children}</>
}
