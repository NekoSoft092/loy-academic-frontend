import './model-country-component.css'
import { useUserStore } from '@/stores/user-store';  
import { countries, type ICountry } from '@/lib/countries';
import { useAppStore } from '@/stores/app-store';
import { AnimatePresence, motion } from 'framer-motion';

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
            <div data-theme={theme} style={{ zIndex: 98, width: '100%', maxWidth: '900px', position: 'fixed', paddingTop: '300px', paddingBottom: '400px'}} className='modal-country flex justify-center'>
            
            <AnimatePresence>
            <motion.div style={{}}
                initial={{ opacity: 0, y: -30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { 
                        ease: ["linear"]
                    }, 
                    
                }}
                exit={{ opacity: 0, y: -50 }}
                className='bg-auth'>
            
            <div className="bg-base-100 reset rounded-md border border-primary" style={{ width: '400px', height: '180px'}}>
                <div className="reset" style={{ width: '100%'}}>
        
                    <div className='flex justify-end' style={{marginTop: '5px', marginRight: '5px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 modal-close" onClick={() => {
                            toggleModalActive()
                        }}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                    
                    <p className="text-center" style={{fontSize: '21px'}}>{props.title}</p>
                    <div className="flex justify-center pt-6">
                        <form method="dialog" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            {countries.map((countryMap: ICountry, index: number)=>{
                                return (
                                <button key={index} className='reset capitalized flex content-center items-center gap-4'
                                    type='button'
                                    onClick={(e:  React.FormEvent) => {
                                        setCountry(countryMap);
                                        toggleModalActive()
                                    }}
                                >
                                    <img src={countryMap.url} alt="" width={50}/>
                                    <p style={{ fontSize: '17px' }}>{countryMap.name} (+{countryMap.country_code})</p>
                                </button>
                                )
                            })}
                        </form>
                    </div>
                </div>
                </div>
                </motion.div>
                </AnimatePresence>
            </div>
        )}
        </>
    )
}