import { create } from 'zustand';
import { SettingsList, type SettingOption } from '@/lib/settings';
import { createDataStorage } from '@/lib/data-storage';
import { registerShortcuts } from '@/lib/shortcuts';
import { InitWeb } from '@/lib/init/init-web';
import type { IInit } from '@/lib/init/init';
import { onWeb } from '@/lib/windows';
import { InitTauri } from '@/lib/init/init-tauri';
import { getHealth, getAllBots } from '@/services/app-service';

const store = createDataStorage<SettingData>();

// Constructores 
let initApp: IInit;
if(onWeb(window)){
  initApp = new InitWeb();
} else {
  initApp = new InitTauri();
}

export const useAppStore = create<AppStore>((set, get) => ({
  name: 'Loy App',
  version: '0.0.1',
  settings: SettingsList,
  isLoading: false,
  isAvailable: false,
  environment: process.env.NODE_ENV === 'production' ? 'prod' : 'local',
  bots: [],
  isDevBuild: () => {
    const version = get().version
    return version.includes('dev')
  },
  fetchAppData: async () => {
    let version: string = '';
    if(onWeb(window) && initApp.getVersionWeb !== undefined) {
      version = initApp.getVersionWeb();
    } else if(initApp.getVersionDesktop !== undefined) {
      version = await initApp.getVersionDesktop();
    }
    set({ version });
  },
  loadSettings: async () => {
    const settings = get().settings;
    for (const setting of settings) {
      const data = await store.get({ key: setting.id });
      if (data != null) {
        setting.enabled = data.enabled
        if (setting.id === 'dark-mode') {
          // const newMode = data.enabled ? 'dark' : 'light'
          // await ui('mode', newMode)
        }
      }
    }
    set({ settings })
  },
  getAllBots: async (): Promise<void> => {
    const response = await getAllBots();
    if (response.status === 200) {
      const data = await response.json();
      set({ bots: data.bots });
    }
  },
  toggleSetting: async (id: string): Promise<void> => {
    const settings = get().settings
    const index = settings.findIndex((option) => option.id === id)
    const option = settings[index]
    if (option.toggle != null) {
      await option.toggle()
    }
    option.enabled = !option.enabled
    settings[index] = option
    set({ settings })
    await store.set({ key: option.id, value: { enabled: option.enabled } })
    await store.save()
  },
  getBackendHealth: async (): Promise<void> => {
    const available = await getHealth();
    set({isAvailable: available})
  },
  setIsLoading: (pIsLoading: boolean): void=> {
    set({ isLoading: pIsLoading });
  },
  setEnvironment: (newEnvironment: 'stg' | 'prod' | 'local'): void => {
    set({environment: newEnvironment});
  },
  setAvailable: (pAvailable: boolean): void => {
    set({ isAvailable: pAvailable});
  },
  init: async () => {
    await get().fetchAppData();
    await get().loadSettings();
    await get().getBackendHealth();
    await get().getAllBots();

    if(!onWeb(window)) {
      await registerShortcuts()
    }
  },
  modalActive: false, 
  toggleModalActive: (): void => {
    if (get().modalActive) {
      set({modalActive: false})
    } else {
      set({modalActive: true})
    }
  }
}))

export interface SettingData {
  enabled: boolean
}

export interface IBot {
  id: string
  name: string
  context: string
  description: string
  image_url: string | null
}

export interface AppStore {
  name: string;
  version: string;
  isAvailable: boolean;
  settings: SettingOption[];
  environment: 'stg' | 'prod' | 'local'
  bots: IBot[]
  isDevBuild: () => boolean
  fetchAppData: () => Promise<void>
  toggleSetting: (id: string) => Promise<void>
  loadSettings: () => Promise<void>
  getBackendHealth: () => Promise<void>
  isLoading: boolean
  setIsLoading: (pIsLoading: boolean) => void
  setEnvironment: (newEnvironment: 'stg' | 'prod' | 'local') => void
  setAvailable: (pAvailable: boolean) => void 
  init: () => Promise<void>
  modalActive: boolean 
  toggleModalActive: () => void
  getAllBots: () => Promise<void>
}

