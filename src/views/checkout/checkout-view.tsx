import { type Location, type NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { SideBarComponent } from '@/components/organisms/side-bar/side-bar-component';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { RoutePath } from '@/router';
import { useAuthStore } from '@/stores/auth-store';
import { AnimatePresence, motion } from 'framer-motion';
import { HeaderComponent } from '@/components/organisms/header/header-component';
import { useAppStore } from '@/stores/app-store';
import { DetailSideBar } from '@/components/organisms/detail-side-bar/detail-side-bar';
import {
    AcademicCapIcon,
    CheckCircleIcon,
    CreditCardIcon,
    LockClosedIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

type BillingCycle = 'monthly' | 'yearly'

interface ICheckoutPlan {
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    tokens: string
    assistants: string
    workflows: string
    features: string[]
}

interface ICheckoutLocationState {
    selectedPlan?: string
    billingCycle?: BillingCycle
}

const checkoutPlans: ICheckoutPlan[] = [
    {
        name: 'Free',
        description: 'Para probar asistentes académicos y organizar tareas básicas de estudio.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        tokens: '50.000 tokens al mes',
        assistants: '3 asistentes activos',
        workflows: '2 workflows personales',
        features: [
            'Chats guiados para dudas puntuales',
            'Resumen de lecturas cortas',
            'Plantillas simples de estudio'
        ]
    },
    {
        name: 'Estudiante Pro',
        description: 'Para estudiantes que usan IA semanalmente en clases, proyectos y evaluaciones.',
        monthlyPrice: 12,
        yearlyPrice: 96,
        tokens: '500.000 tokens al mes',
        assistants: '20 asistentes activos',
        workflows: '25 workflows personales',
        features: [
            'Asistentes por materia y semestre',
            'Workflows para investigar, citar y repasar',
            'Análisis de PDFs y apuntes extensos'
        ]
    },
    {
        name: 'Campus',
        description: 'Para equipos académicos, monitores o grupos de investigación universitarios.',
        monthlyPrice: 29,
        yearlyPrice: 240,
        tokens: '2.000.000 tokens al mes',
        assistants: 'Asistentes ilimitados',
        workflows: 'Workflows ilimitados',
        features: [
            'Bibliotecas compartidas por curso',
            'Workflows colaborativos reutilizables',
            'Prioridad en nuevas funciones académicas'
        ]
    }
]

export function CheckoutView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);

    const navigate: NavigateFunction = useNavigate();
    const location: Location = useLocation();

    const [theme, setTheme, name, getGeneralInformacion] = useUserStore((store) => [
        store.theme,
        store.setTheme,
        store.name,
        store.getGeneralInformacion
    ])

    const [setUserId] = useAuthStore((state) => [
        state.setUserId
    ])

    const [showNotificationsPanel] = useAppStore((state) => [
        state.showNotificationsPanel
    ])

    const isBillingCycle = (value: unknown): value is BillingCycle => {
        return value === 'monthly' || value === 'yearly'
    }

    const getCheckoutState = (): Required<ICheckoutLocationState> => {
        if (location.state !== null && typeof location.state === 'object') {
            const checkoutState: ICheckoutLocationState = location.state as ICheckoutLocationState

            return {
                selectedPlan: checkoutState.selectedPlan !== undefined ? checkoutState.selectedPlan : 'Estudiante Pro',
                billingCycle: isBillingCycle(checkoutState.billingCycle) ? checkoutState.billingCycle : 'monthly'
            }
        }

        return {
            selectedPlan: 'Estudiante Pro',
            billingCycle: 'monthly'
        }
    }

    const checkoutState: Required<ICheckoutLocationState> = getCheckoutState()
    const selectedPlan: ICheckoutPlan = checkoutPlans.find((plan: ICheckoutPlan) => plan.name === checkoutState.selectedPlan) ?? checkoutPlans[1]
    const planPrice: number = checkoutState.billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice
    const subtotal: number = planPrice
    const taxes: number = selectedPlan.name === 'Free' ? 0 : Math.round(subtotal * 0.19)
    const total: number = subtotal + taxes
    const billingLabel: string = checkoutState.billingCycle === 'monthly' ? 'Mensual' : 'Anual'
    const periodLabel: string = checkoutState.billingCycle === 'monthly' ? '/mes' : '/año'
    const yearlySaving: number = selectedPlan.monthlyPrice > 0 ? (selectedPlan.monthlyPrice * 12) - selectedPlan.yearlyPrice : 0
    const isFreePlan: boolean = selectedPlan.name === 'Free'

    const init = async (id: string): Promise<void> => {
        if (id.length > 0) {

            await getGeneralInformacion(id)
            setInitLoading(false)
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }

    useEffect(() => {
        setInitLoading(true)
        const userId: string | null = localStorage.getItem('user-id') !== null ? localStorage.getItem('user-id') as string : '';

        if (userId.length === 0) {
            if (localStorage.getItem('user-id') !== null) {
                setUserId(localStorage.getItem('user-id') as string)
            } else {
                setUserId(userId)
            }
        }
        if (localStorage.getItem('theme') !== null) {
            setTheme(localStorage.getItem('theme') as string)
        }

        init(userId).then(() => { }).catch((err) => {
            console.log(err)
        });

        return () => { }
    }, [name])

    return (
        <div data-theme={theme} className={'view bg-primary'}>
            {initLoading && <span className="loading loading-spinner loading-xl"></span>}
            {!initLoading && (
                <AnimatePresence>
                    <motion.div style={{ width: '100%', height: '100%' }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className='flex'>
                        <SideBarComponent userName={name} />

                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>
                            <section className='flex flex-row h-full'>
                                <div style={{ width: showNotificationsPanel ? '70%' : '100%', minWidth: '0px', maxWidth: '2000px' }} className='flex flex-col'>
                                    <HeaderComponent
                                        name={''}
                                        available={true}
                                        chatHeader={false}
                                        backbutton={true} />
                                    <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', height: '92%' }} className='mt-16 px-5 pb-8'>
                                        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]'>
                                            <section className='flex flex-col gap-6'>
                                                <div className='rounded-lg bg-base-200 p-6 shadow-sm'>
                                                    

                                                    <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                                                        <div className='max-w-3xl'>
                                                            <div className='mb-3 flex items-center gap-2 text-primary'>
                                                                <LockClosedIcon className='h-6 w-6' />
                                                                <span className='text-sm font-semibold uppercase tracking-wide'>Checkout seguro</span>
                                                            </div>
                                                            <h1 className='text-4xl font-bold text-base-content'>Completa tu suscripción</h1>
                                                            <p className='mt-3 text-base text-base-content/70'>
                                                                Activa tu plan para usar asistentes, tokens y workflows enfocados en tus actividades universitarias.
                                                            </p>
                                                        </div>

                                                        <ul className='steps steps-vertical'>
                                                            <li className='step step-primary text-sm'>Plan</li>
                                                            <li className='step step-primary text-sm'>Datos</li>
                                                            <li className='step text-sm'>Confirmar</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                                                    <div className='rounded-lg bg-base-200 p-5'>
                                                        <AcademicCapIcon className='mb-3 h-7 w-7 text-primary' />
                                                        <p className='text-sm text-base-content/60'>Asistentes</p>
                                                        <h2 className='text-lg font-semibold text-base-content'>{selectedPlan.assistants}</h2>
                                                    </div>
                                                    <div className='rounded-lg bg-base-200 p-5'>
                                                        <SparklesIcon className='mb-3 h-7 w-7 text-primary' />
                                                        <p className='text-sm text-base-content/60'>Tokens</p>
                                                        <h2 className='text-lg font-semibold text-base-content'>{selectedPlan.tokens}</h2>
                                                    </div>
                                                    <div className='rounded-lg bg-base-200 p-5'>
                                                        <CheckCircleIcon className='mb-3 h-7 w-7 text-primary' />
                                                        <p className='text-sm text-base-content/60'>Workflows</p>
                                                        <h2 className='text-lg font-semibold text-base-content'>{selectedPlan.workflows}</h2>
                                                    </div>
                                                </div>

                                                <div className='rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm'>
                                                    <h2 className='text-2xl font-bold text-base-content'>Datos de facturación</h2>
                                                    <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                        <label className='form-control'>
                                                            <span className='label-text'>Nombre completo</span>
                                                            <input className='input input-bordered mt-2' placeholder='Nombre del estudiante' />
                                                        </label>
                                                        <label className='form-control'>
                                                            <span className='label-text'>Correo electrónico</span>
                                                            <input className='input input-bordered mt-2' placeholder='nombre@universidad.edu' />
                                                        </label>
                                                    </div>
                                                </div>

                                                {!isFreePlan && (
                                                    <div className='rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm'>
                                                        <div className='flex items-center gap-3'>
                                                            <CreditCardIcon className='h-7 w-7 text-primary' />
                                                            <h2 className='text-2xl font-bold text-base-content'>Método de pago</h2>
                                                        </div>

                                                        <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                            <label className='rounded-lg border border-primary bg-primary/10 p-4'>
                                                                <div className='flex items-center gap-3'>
                                                                    <input type='radio' name='payment-method' className='radio radio-primary' defaultChecked />
                                                                    <span className='font-semibold text-base-content'>Tarjeta</span>
                                                                </div>
                                                            </label>
                                                            <label className='rounded-lg border border-base-300 p-4'>
                                                                <div className='flex items-center gap-3'>
                                                                    <input type='radio' name='payment-method' className='radio radio-primary' />
                                                                    <span className='font-semibold text-base-content'>Nequi</span>
                                                                </div>
                                                            </label>
                                                        </div>

                                                        <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
                                                            <label className='form-control md:col-span-2'>
                                                                <span className='label-text'>Número de tarjeta</span>
                                                                <input className='input input-bordered mt-2' placeholder='1234 1234 1234 1234' />
                                                            </label>
                                                            <label className='form-control'>
                                                                <span className='label-text'>Vencimiento</span>
                                                                <input className='input input-bordered mt-2' placeholder='MM/AA' />
                                                            </label>
                                                            <label className='form-control'>
                                                                <span className='label-text'>CVC</span>
                                                                <input className='input input-bordered mt-2' placeholder='123' />
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </section>

                                            <aside className='h-fit rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm xl:sticky xl:top-24'>
                                                <div className='flex items-start justify-between gap-3'>
                                                    <div>
                                                        <p className='text-sm font-semibold uppercase tracking-wide text-primary'>Plan seleccionado</p>
                                                        <h2 className='mt-2 text-3xl font-bold text-base-content'>{selectedPlan.name}</h2>
                                                        <p className='mt-2 text-sm text-base-content/70'>{selectedPlan.description}</p>
                                                    </div>
                                                    <div className='badge badge-primary'>{billingLabel}</div>
                                                </div>

                                                <div className='my-6 rounded-lg bg-base-200 p-5'>
                                                    <div className='flex items-end gap-1'>
                                                        <span className='text-4xl font-bold text-base-content'>${planPrice}</span>
                                                        <span className='pb-1 text-sm text-base-content/60'>{periodLabel}</span>
                                                    </div>
                                                    {checkoutState.billingCycle === 'yearly' && yearlySaving > 0 && (
                                                        <p className='mt-1 text-sm font-medium text-success'>Ahorras ${yearlySaving} al año</p>
                                                    )}
                                                </div>

                                                <ul className='space-y-3'>
                                                    {selectedPlan.features.map((feature: string) => (
                                                        <li key={feature} className='flex gap-3 text-sm text-base-content/75'>
                                                            <CheckCircleIcon className='h-5 w-5 shrink-0 text-success' />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className='divider'></div>

                                                <div className='space-y-3 text-sm'>
                                                    <div className='flex justify-between'>
                                                        <span className='text-base-content/70'>Subtotal</span>
                                                        <span className='font-medium text-base-content'>${subtotal}</span>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <span className='text-base-content/70'>Impuestos estimados</span>
                                                        <span className='font-medium text-base-content'>${taxes}</span>
                                                    </div>
                                                    <div className='flex justify-between text-lg font-bold'>
                                                        <span>Total</span>
                                                        <span>${total}</span>
                                                    </div>
                                                </div>

                                                <label className='mt-5 flex items-start gap-3 text-sm text-base-content/70'>
                                                    <input type='checkbox' className='checkbox checkbox-primary checkbox-sm mt-1' />
                                                    <span>Acepto los términos de suscripción y autorizo la activación del plan para mi cuenta.</span>
                                                </label>

                                                <button className='btn btn-primary mt-5 w-full'>
                                                    {isFreePlan ? 'Activar plan gratis' : 'Confirmar suscripción'}
                                                </button>
                                                <p className='mt-3 text-center text-xs text-base-content/60'>
                                                    Puedes cambiar o cancelar tu plan desde marketplace cuando lo necesites.
                                                </p>
                                            </aside>
                                        </div>
                                    </div>
                                </div>
                                {showNotificationsPanel && <DetailSideBar type='notifications' />}
                            </section>
                        </main>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}
