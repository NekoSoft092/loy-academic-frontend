import { Store } from 'tauri-plugin-store-api'
import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

export interface DataStorage<T> {
  get: (data: DataStorageRecord) => Promise<T | null>
  set: (data: DataStorageRecord) => Promise<void>
  remove: (data: DataStorageRecord) => Promise<void>
  save: () => Promise<void>
}

interface DataStorageRecord {
  key: string
  value?: unknown
}

class DesktopDataStorage<T> implements DataStorage<T> {
  #store: Store

  constructor(path: string) {
    this.#store = new Store(path)
  }

  set: (data: DataStorageRecord) => Promise<void> = async (data) => {
    await this.#store.set(data.key, data.value)
  }

  save: () => Promise<void> = async () => {
    await this.#store.save()
  }

  get: (data: DataStorageRecord) => Promise<T | null> = async (data) => {
    return await this.#store.get(data.key)
  }

  remove: (data: DataStorageRecord) => Promise<void> = async (data) => {
    await this.#store.delete(data.key)
  }
}

class MobileDataStorage<T> implements DataStorage<T> {
  set: (data: DataStorageRecord) => Promise<void> = async (data) => {
    const value = JSON.stringify(data.value)
    await Preferences.set({ key: data.key, value })
  }

  save: () => Promise<void> = async () => {
    // no-op
  }

  get: (data: DataStorageRecord) => Promise<T> = async (data) => {
    const { value } = await Preferences.get({ key: data.key })
    return JSON.parse(value ?? '{}')
  }

  remove: (data: DataStorageRecord) => Promise<void> = async (data) => {
    await Preferences.remove({ key: data.key })
  }
}

class LocalStorageDataStorage<T> implements DataStorage<T> {
  set: (data: DataStorageRecord) => Promise<void> = async (data) => {
    localStorage.setItem(data.key, JSON.stringify(data.value))
  }

  save: () => Promise<void> = async () => {
    // no-op
  }

  get: (data: DataStorageRecord) => Promise<T> = async (data) => {
    const value = localStorage.getItem(data.key)
    return JSON.parse(value ?? '{}')
  }

  remove: (data: DataStorageRecord) => Promise<void> = async (data) => {
    localStorage.removeItem(data.key)
  }
}

export function createDataStorage<T>(path: string = ''): DataStorage<T> {
  if (window.__TAURI_METADATA__ !== undefined) {
    if (path !== '') {
      return new DesktopDataStorage(path)
    }
    return new DesktopDataStorage('preferences.dat')
  } else if (Capacitor.isNativePlatform()) {
    return new MobileDataStorage()
  }
  return new LocalStorageDataStorage()
}
