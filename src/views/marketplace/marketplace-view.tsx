import { type NavigateFunction, useNavigate } from 'react-router-dom';
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
    BoltIcon,
    CheckCircleIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';
import { type IPaymentPlan, usePaymentsStore } from '@/stores/payments-store';

type BillingCycle = 'monthly' | 'yearly'

export function MarketplaceView(): JSX.Element {

    const [initLoading, setInitLoading] = useState<boolean>(false);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

    const navigate: NavigateFunction = useNavigate();

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

    const [subscriptionPlans, isLoadingSubscriptionPlans, subscriptionPlansError, getSubscriptionPlans] = usePaymentsStore((state) => [
        state.subscriptionPlans,
        state.isLoadingSubscriptionPlans,
        state.subscriptionPlansError,
        state.getSubscriptionPlans
    ])

    const plansToRender: IPaymentPlan[] =  subscriptionPlans
    const init = async (id: string): Promise<void> => {
        if (id.length > 0) {

            await Promise.all([
                getGeneralInformacion(id),
                getSubscriptionPlans()
            ])
            setInitLoading(false)
        } else {
            navigate(RoutePath.IS_REGISTERED)
        }
    }

    const getPlanPrice = (plan: IPaymentPlan): number => {
        return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
    }

    const getPlanPeriod = (): string => {
        return billingCycle === 'monthly' ? '/mes' : '/año'
    }

    const getYearlySaving = (plan: IPaymentPlan): number => {
        if (plan.monthlyPrice === 0) return 0

        return (plan.monthlyPrice * 12) - plan.yearlyPrice
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
                        <SideBarComponent userName={name}/>
                        <main style={{ width: '80%', minWidth: '0px', maxWidth: '2000px' }} className='bg-base-100 bg-register'>
                            <section className='flex flex-row h-full'>
                                <div style={{ width: showNotificationsPanel ? '70%' : '100%', minWidth: '0px', maxWidth: '2000px' }} className='flex flex-col'>
                                    <HeaderComponent name={''} available={true} chatHeader={false} backbutton={false}/>
                                    <div style={{ overflow: 'scroll', scrollBehavior: 'smooth', height: '92%' }} className='mt-16 px-5 pb-8'>
                                        <div className='flex flex-col gap-6'>
                                            <section className='rounded-lg bg-base-200 p-6 shadow-sm'>
                                                <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
                                                    <div className='max-w-3xl'>
                                                        <div className='mb-3 flex items-center gap-2 text-primary'>
                                                            <span className='text-sm font-semibold uppercase tracking-wide'>Marketplace</span>
                                                        </div>
                                                        <h1 className='text-4xl font-bold text-base-content'>Planes de estudio</h1>
                                                        <p className='mt-3 text-base text-base-content/70'>
                                                            Elige la capacidad que necesitas para resolver dudas, preparar parciales, leer documentos y automatizar rutinas de aprendizaje.
                                                        </p>
                                                    </div>

                                                    <div className='join bg-base-100 p-1 shadow-sm'>
                                                        <button
                                                            className={`btn join-item ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
                                                            onClick={() => { setBillingCycle('monthly') }}
                                                        >
                                                            Mensual
                                                        </button>
                                                        <button
                                                            className={`btn join-item ${billingCycle === 'yearly' ? 'btn-primary' : 'btn-ghost'}`}
                                                            onClick={() => { setBillingCycle('yearly') }}
                                                        >
                                                            Anual
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>

                                            <section className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
                                                {plansToRender.map((plan: IPaymentPlan) => (
                                                    <article
                                                        key={plan.name}
                                                        className={`card rounded-lg border bg-base-100 shadow-sm ${plan.highlighted === true ? 'border-primary shadow-md' : 'border-base-300'}`}
                                                    >
                                                        <div className='card-body gap-5'>
                                                            <div className='flex items-start justify-between gap-3'>
                                                                <div>
                                                                    <h2 className='card-title text-2xl text-base-content'>{plan.name}</h2>
                                                                    <p className='mt-2 min-h-12 text-sm text-base-content/70'>{plan.description}</p>
                                                                </div>
                                                                {plan.badge != null && (
                                                                    <div className={`badge ${plan.highlighted === true ? 'badge-primary' : 'badge-secondary'} whitespace-nowrap`}>
                                                                        {plan.badge}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <div className='flex items-end gap-1'>
                                                                    <span className='text-4xl font-bold text-base-content'>${getPlanPrice(plan)}</span>
                                                                    <span className='pb-1 text-sm text-base-content/60'>{getPlanPeriod()}</span>
                                                                </div>
                                                                {billingCycle === 'yearly' && getYearlySaving(plan) > 0 && (
                                                                    <p className='mt-1 text-sm font-medium text-success'>Ahorras ${getYearlySaving(plan)} al año</p>
                                                                )}
                                                            </div>

                                                            <div className='divider my-0'></div>

                                                            <div className='grid gap-3'>
                                                                {plan.limits.map((limit: string) => (
                                                                    <div key={limit} className='flex items-center gap-3 rounded-lg bg-base-200 p-3'>
                                                                        <BoltIcon className='h-5 w-5 shrink-0 text-primary' />
                                                                        <span className='text-sm font-medium text-base-content'>{limit}</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <ul className='space-y-3'>
                                                                {plan.features.map((feature: string) => (
                                                                    <li key={feature} className='flex gap-3 text-sm text-base-content/75'>
                                                                        <CheckCircleIcon className='h-5 w-5 shrink-0 text-success' />
                                                                        <span>{feature}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            <div className='card-actions mt-auto'>
                                                                <button className={`btn w-full ${plan.highlighted === true ? 'btn-primary' : 'btn-primary'}`}
                                                                    onClick={() => {
                                                                        navigate(RoutePath.CHECKOUT, { state: { selectedPlan: plan.name, billingCycle } })
                                                                    }}
                                                                >
                                                                    {plan.cta}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </section>

                                            {(isLoadingSubscriptionPlans || subscriptionPlansError !== null) && (
                                                <div className='alert rounded-lg bg-base-200'>
                                                    {isLoadingSubscriptionPlans && <span className='loading loading-spinner loading-sm'></span>}
                                                    <span>
                                                        {isLoadingSubscriptionPlans ? 'Consultando planes disponibles...' : 'No se pudieron consultar los planes del servicio. Se muestran los planes locales.'}
                                                    </span>
                                                </div>
                                            )}

                                            <section className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                                                <div className='rounded-lg bg-base-200 p-5'>
                                                    <AcademicCapIcon className='mb-3 h-7 w-7 text-primary' />
                                                    <h3 className='text-lg font-semibold text-base-content'>Asistentes por materia</h3>
                                                    <p className='mt-2 text-sm text-base-content/70'>Crea asistentes para cálculo, derecho, medicina, programación o cualquier curso del semestre.</p>
                                                </div>
                                                <div className='rounded-lg bg-base-200 p-5'>
                                                    <BoltIcon className='mb-3 h-7 w-7 text-primary' />
                                                    <h3 className='text-lg font-semibold text-base-content'>Tokens claros</h3>
                                                    <p className='mt-2 text-sm text-base-content/70'>Los planes crecen según el volumen de lecturas, chats, análisis de documentos y preparación de entregas.</p>
                                                </div>
                                                <div className='rounded-lg bg-base-200 p-5'>
                                                    <SparklesIcon className='mb-3 h-7 w-7 text-primary' />
                                                    <h3 className='text-lg font-semibold text-base-content'>Workflows de aprendizaje</h3>
                                                    <p className='mt-2 text-sm text-base-content/70'>Automatiza pasos como investigar, resumir, generar preguntas, crear flashcards y preparar planes de estudio.</p>
                                                </div>
                                            </section>
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
