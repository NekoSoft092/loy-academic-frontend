import './model-country-component.css'
import { useUserStore } from '@/stores/user-store';  
import { countries, type ICountry } from '@/lib/countries';
import { useAppStore } from '@/stores/app-store';
import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface IModalComponent {
    title: string
}

export const ModalCountryComponent = (props: IModalComponent): JSX.Element => {

    const [ theme, setCountry] = useUserStore((store) => [
        store.theme, 
        store.setCountry
    ])

    const [ toggleModalActive, modalActive ] = useAppStore((store) => [
        store.toggleModalActive,
        store.modalActive
    ]);


    return (
        <>
        { modalActive  && (
            <div data-theme={theme} className='modal-country'>
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                ease: ['linear']
                            },
                        }}
                        exit={{ opacity: 0, y: -50 }}
                        className='modal-country-card bg-base-100 shadow-lg'>

                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <p className='text-sm font-semibold uppercase tracking-wide text-base-content/60'>País</p>
                                <h2 className='mt-1 text-2xl font-bold text-base-content'>{props.title}</h2>
                            </div>

                            <button
                                type='button'
                                className='btn btn-ghost btn-sm btn-square'
                                onClick={() => {
                                    toggleModalActive()
                                }}>
                                <XMarkIcon className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='mt-5 grid gap-2'>
                            {countries.map((countryMap: ICountry, index: number) => {
                                return (
                                    <button
                                        key={index}
                                        className='btn btn-outline justify-start gap-3'
                                        type='button'
                                        onClick={() => {
                                            setCountry(countryMap);
                                            toggleModalActive()
                                        }}>
                                        <img src={countryMap.url} alt={countryMap.name} width={28} height={28} />
                                        <span className='capitalize'>{countryMap.name}</span>
                                        <span className='ml-auto text-base-content/60'>+{countryMap.country_code}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        )}
        </>
    )
}
