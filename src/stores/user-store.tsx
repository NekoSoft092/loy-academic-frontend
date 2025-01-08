import { countries, type ICountry } from '@/lib/countries';
import { create } from 'zustand';
import { themes } from '@/lib/themes';

export const useUserStore = create<UserStore>((set, get) => ({
    name: '', 
    setName: (name: string): void => {
        set({ name });
    },
    birthDate: new Date('2000-01-01'), 
    setBirthDate: (birthDate: Date): void => {
        set({ birthDate });
    }, 
    email: '', 
    setEmail: (email: string): void => {
        set({email})
    }, 
    phoneNumber: null, 
    setPhoneNumber: (phoneNumber: number): void => {
        set({phoneNumber})
    }, 
    country: countries[0], 
    setCountry: (country: ICountry): void => {
        set({country})
    }, 
    theme: themes[0],
    indexSelectedTheme: 0,
    setTheme: (theme: string): void => {
        set({theme})
        const newIndex: number = themes.indexOf(theme)
        set({indexSelectedTheme: newIndex})
    }, 
    nextTheme: (): void => {
        const index: number = get().indexSelectedTheme
        if (themes.length > index + 1) {
            const theme: string = themes[index + 1]
            set({theme})
            set({indexSelectedTheme: index + 1})
            localStorage.setItem('theme', theme)
        } else {
            set({theme: themes[0]})
            set({indexSelectedTheme: 0})
            localStorage.setItem('theme', themes[0])
        }
        
    },
    university: '', 
    setUniversity: (university: string): void => {
        set({university})
    }, 
    career: '', 
    setCareer: (career: string): void => {
        set({career})
    }, 
    referredCode: '', 
    setReferredCode: (code: string):void => {
        set({referredCode: code})
    }
}));

export interface UserStore {
    name: string
    setName: (name: string) => void
    birthDate: Date
    setBirthDate: (birthDate: Date) => void
    email: string
    setEmail: (email: string) => void, 
    phoneNumber: number | null
    setPhoneNumber: (phoneNumber: number) => void
    country: ICountry
    setCountry: (country: ICountry) => void
    theme: string
    indexSelectedTheme: number
    setTheme: (theme: string) => void
    nextTheme: () => void
    university: string
    setUniversity: (university: string) => void
    career: string
    setCareer: (career: string) => void
    referredCode: string
    setReferredCode: (code: string) => void
}