import { countries, type ICountry } from '@/lib/countries';
import { create } from 'zustand';

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
    theme: 'cupcake',
    setTheme: (theme: string): void => {
        set({theme})
    }, 
    university: '', 
    setUniversity: (university: string): void => {
        set({university})
    }, 
    career: '', 
    setCareer: (career: string): void => {
        set({career})
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
    setTheme: (theme: string) => void
    university: string
    setUniversity: (university: string) => void
    career: string
    setCareer: (career: string) => void
}