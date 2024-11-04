import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface ProtectedProps {
  children: JSX.Element
}

export function Protected({ children }: ProtectedProps): JSX.Element {
  const [ checkSignIn ] = useAuthStore((state) => [state.checkSignIn]);
  const navigate = useNavigate();

  useEffect(() => {
    checkSignIn()
      .then((data) => {
        if (!data) {
          console.log('llego')
          navigate('/');
        }
      })
      .catch((err) => {
        navigate('/is-registered');
        console.log('session', err);
      })
  }, [])

  return <>{children}</>
}
