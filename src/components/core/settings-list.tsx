import { useAppStore } from '@/stores/app-store'
import { shallow } from 'zustand/shallow'

export function SettingsList(): JSX.Element {
  const store = useAppStore((state) => ({ settings: state.settings }), shallow)
  const { toggleSetting } = useAppStore()

  function handleToggle(id: string): void {
    void toggleSetting(id)
  }
  return (
    <ul className="divide-y divide-gray-300  bg-base-100">
      {store.settings.map((setting) => (
        <SettingsOption
          id={setting.id}
          title={setting.name}
          status={setting.enabled}
          key={setting.id}
          description={setting.description}
          toggle={handleToggle}
        />
      ))}
    </ul>
  )
}

interface SettingsOptionProps {
  id: string
  title: string
  status: boolean
  description: string
  toggle: (id: string) => void
}

export function SettingsOption({ ...props }: SettingsOptionProps): JSX.Element {
  function handleToggle(): void {
    props.toggle(props.id)
  }

  return (
    <div className="field middle-align small-divider">
      <nav>
        <div className="max">
          <h6 style={{
            fontSize: '17px', 
            fontFamily: ' Poppins-Medium'
          }}>{props.title}</h6>
          <p className="text-sm text-opacity-50" style={{
            fontFamily: ' Poppins-Regular'
          }}>{props.description}</p>
        </div>
        <label className="switch">
          <input
            onChange={handleToggle}
            checked={props.status}
            type="checkbox"
          />
          <span></span>
        </label>
      </nav>
    </div>
  )
}
