import { enable, isEnabled, disable } from 'tauri-plugin-autostart-api';

export interface SettingOption {
  id: string
  name: string
  enabled: boolean
  description: string
  toggle?: () => any | Promise<any>
}

export const SettingsList = [
  {
    id: 'notifications',
    name: 'Notificaciones',
    description: 'Habilitar notificaciones de escritorio',
    enabled: true,
  },
  {
    id: 'dark-mode',
    name: 'Modo oscuro',
    description: 'Habilitar el modo oscuro',
    enabled: false,
    toggle: async () => {
      // const newMode = ui('mode') === 'dark' ? 'light' : 'dark'
      // await ui('mode', newMode)
    },
  },
  {
    id: 'developer-mode',
    name: 'Modo desarrollador',
    description: 'Habilitar el modo desarollador',
    enabled: false,
  },
  {
    id: 'auto-start',
    name: 'Inicio automático',
    description: 'Habilitar el inicio automático',
    enabled: false,
    toggle: async () => {
      const isEnable = await isEnabled()
      if (isEnable) {
        await disable()
      } else {
        await enable()
      }
    },
  },
]
