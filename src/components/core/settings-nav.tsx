import { useNavigate, type NavigateFunction } from 'react-router-dom';

export interface SettingsNavProps {
  title: string;
}

export function SettingsNav(props: SettingsNavProps): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  return (
    <header>
      <nav>
        <button
          onClick={() => {
            navigate(-1)
          }}
          className="circle transparent"
        >
          <i>arrow_back</i>
        </button>
        <h5>Ajustes</h5>
        
      </nav>
    </header>
  )
}
