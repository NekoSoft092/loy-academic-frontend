import { useNavigate } from "react-router-dom";

interface AuthHeaderProps {
  isLogin: boolean
  isDevMode?: boolean
  toggle?: () => void
}

export function AuthHeader(props: AuthHeaderProps): JSX.Element {

  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingBottom: '.3rem' }}>

      <div className="flex-row justify-center align-end" style={{marginTop: '.5rem'}}>
        <h3 className="primary-text bold center-align" style={{fontFamily: 'Poppins-Medium', fontSize: '3rem'}}>Loy</h3>
        <p style={{fontFamily: 'Poppins-Regular', fontSize: '1.5rem' }} className="primary">Academic</p>
      </div>
      
      {props.isLogin && !(props.isDevMode ?? false) && (
        <div style={{ marginTop: '1.5rem', lineHeight: 0 }}>
          <h5 className="center-align" style={{
            lineHeight: 1.3333, 
            fontSize: 23
          }}>Ingresa a tu cuenta</h5>
        </div>
      )}
      {!props.isLogin && !(props.isDevMode ?? false) && (
        <div style={{ marginTop: '0.7rem' }}>
          <h5 className="center-align">Registrate</h5>
          <p>
            Ya tienes una cuenta?{' '}
            <a className="primary-text" onClick={() => {
              navigate('/login')
            }}>
              Ingresa aquí
            </a>
          </p>
        </div>
      )}
      {(props.isDevMode ?? false) && (
        <div style={{ marginTop: '1.5rem' }}>
          <h5 className="center-align">Developer Mode</h5>
        </div>
      )}
    </div>
  )
}
