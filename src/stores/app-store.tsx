import { create } from 'zustand';
import { SettingsList, type SettingOption, type SettingSection } from '@/lib/settings';
import { createDataStorage } from '@/lib/data-storage';
import { registerShortcuts } from '@/lib/shortcuts';
import { InitWeb } from '@/lib/init/init-web';
import type { IInit } from '@/lib/init/init';
import { onWeb } from '@/lib/windows';
import { InitTauri } from '@/lib/init/init-tauri';
import { 
  getHealth, getAllBots, getBotDetailById, 
  getDailyNews as getDailyNewsService 
} from '@/services/app-service';

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
  currentBot: null,
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
    const settings = get().settings as SettingSection[];
    for (const section of settings) {
      for (const setting of section.settings) {
        const data = await store.get({ key: setting.id });
        if (data != null) {
          setting.enabled = data.enabled
          if (data.value != null) {
            setting.value = data.value
          }
          if (setting.id === 'dark-mode') {
            // const newMode = data.enabled ? 'dark' : 'light'
            // await ui('mode', newMode)
          }
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
  getBotDetailById: async (botId: string): Promise<void> => {
    const response = await getBotDetailById(botId);
    if (response.status === 200) {
      const data = await response.json();
      set({ currentBot: data });
    }
  },
  toggleSetting: async (id: string): Promise<void> => {
    const settings = get().settings as SettingSection[]
    let foundSetting: SettingOption | null = null
    let sectionIndex = -1
    let settingIndex = -1

    for (let i = 0; i < settings.length; i++) {
      const idx = settings[i].settings.findIndex((opt) => opt.id === id)
      if (idx !== -1) {
        sectionIndex = i
        settingIndex = idx
        foundSetting = settings[i].settings[idx]
        break
      }
    }

    if (foundSetting && sectionIndex !== -1 && settingIndex !== -1) {
      if (foundSetting.toggle != null) {
        await foundSetting.toggle()
      }
      foundSetting.enabled = !foundSetting.enabled
      settings[sectionIndex].settings[settingIndex] = foundSetting
      set({ settings })
      await store.set({ key: foundSetting.id, value: { enabled: foundSetting.enabled } })
      await store.save()
    }
  },
  selectSettingValue: async (id: string, value: string): Promise<void> => {
    const settings = get().settings as SettingSection[]
    let foundSetting: SettingOption | null = null
    let sectionIndex = -1
    let settingIndex = -1

    for (let i = 0; i < settings.length; i++) {
      const idx = settings[i].settings.findIndex((opt) => opt.id === id)
      if (idx !== -1) {
        sectionIndex = i
        settingIndex = idx
        foundSetting = settings[i].settings[idx]
        break
      }
    }

    if (foundSetting && sectionIndex !== -1 && settingIndex !== -1) {
      foundSetting.value = value
      settings[sectionIndex].settings[settingIndex] = foundSetting
      set({ settings })
      await store.set({ key: foundSetting.id, value: { enabled: foundSetting.enabled, value: value } })
      await store.save()
    }
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
  },
  showNotificationsPanel: false,
  toggleNotificationsPanel: (): void => {
    set({ showNotificationsPanel: !get().showNotificationsPanel })
  },
  setShowNotificationsPanel: (show: boolean): void => {
    set({ showNotificationsPanel: show })
  },
  dailyNews: {
    title: '',
    content: '',
    author_bot_id: ''
  },
  getDailyNews: async (): Promise<void> => {
    if (get().dailyNews.title.length === 0 && get().dailyNews.content.length === 0) {
      const dailyNewsResponse: Response = await getDailyNewsService()
      console.log('dailyNewsResponse', dailyNewsResponse)
      const dailyNews: IDailyNews = await dailyNewsResponse.json();
      console.log('dailyNews', dailyNews)
      set({ dailyNews })
    }
  },
}))

export interface IDailyNews {
  title: string
  content: string
  author_bot_id: string
}

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

export interface IBotDetail extends IBot {
  skills: string[]
}

export interface AppStore {
  name: string;
  version: string;
  isAvailable: boolean;
  settings: SettingOption[];
  environment: 'stg' | 'prod' | 'local'
  bots: IBot[]
  currentBot: IBotDetail | null
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
  getBotDetailById: (botId: string) => Promise<void>
  dailyNews: IDailyNews
  getDailyNews: () => Promise<void>
  showNotificationsPanel: boolean
  toggleNotificationsPanel: () => void
  setShowNotificationsPanel: (show: boolean) => void
}

