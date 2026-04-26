import { useAppStore } from '@/stores/app-store'
import { shallow } from 'zustand/shallow'
import { SettingsSection } from './settings-section'
import type { SettingSection } from '@/lib/settings'

export function SettingsList(): JSX.Element {
  const store = useAppStore((state) => ({ settings: state.settings }), shallow)
  const { toggleSetting, selectSettingValue } = useAppStore()

  function handleToggle(id: string): void {
    void toggleSetting(id)
  }

  function handleSelectValue(id: string, value: string): void {
    void selectSettingValue(id, value)
  }

  return (
    <div className="settings-list space-y-4 p-4">
      {(store.settings as SettingSection[]).map((section) => (
        <SettingsSection
          key={section.id}
          section={section}
          onToggleSetting={handleToggle}
          onSelectValue={handleSelectValue}
        />
      ))}
    </div>
  )
}

interface SettingsOptionProps {
  id: string
  title: string
  status: boolean
  description: string
  type?: 'toggle' | 'select' | 'text' | 'number'
  options?: { label: string; value: string }[]
  toggle: (id: string) => void
  onSelectValue?: (value: string) => void
}

export function SettingsOption({ ...props }: SettingsOptionProps): JSX.Element {
  function handleToggle(): void {
    props.toggle(props.id)
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    props.onSelectValue?.(e.target.value)
  }

  const isSelectType = props.type === 'select'

  return (
    <div className="field middle-align small-divider">
      <nav className='flex flex-row justify-between content-center gap-3 items-center p-4'>
        <div className="max flex flex-col gap-1 flex-grow">
          <h6 style={{
            fontSize: '17px', 
            fontFamily: 'Poppins-Medium'
          }}>{props.title}</h6>
          <p className="text-sm text-opacity-50" style={{
            fontFamily: 'Poppins-Regular'
          }}>{props.description}</p>
        </div>
        
        {isSelectType ? (
          <select 
            className="select select-bordered select-sm"
            onChange={handleSelectChange}
            defaultValue=""
          >
            <option value="">Seleccionar</option>
            {props.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <label className="switch">
            <input 
              type="checkbox" 
              className="toggle toggle-primary"  
              onChange={handleToggle}
              checked={props.status}
            />
            <span></span>
          </label>
        )}
      </nav>
    </div>
  )
}
