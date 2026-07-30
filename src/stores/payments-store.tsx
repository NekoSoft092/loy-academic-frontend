import { create } from 'zustand';
import { getSubscriptionPlans as getSubscriptionPlansService } from '@/services/payments-service';

export interface IPaymentPlan {
    id?: string
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
    badge?: string
    highlighted?: boolean
    limits: string[]
    features: string[]
    cta: string
}

export interface PaymentsStore {
    subscriptionPlans: IPaymentPlan[]
    isLoadingSubscriptionPlans: boolean
    subscriptionPlansError: string | null
    getSubscriptionPlans: () => Promise<void>
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const getStringValue = (record: Record<string, unknown>, keys: string[], fallback: string = ''): string => {
    for (const key of keys) {
        const value: unknown = record[key]
        if (typeof value === 'string') {
            return value
        }
    }

    return fallback
}

const getOptionalStringValue = (record: Record<string, unknown>, keys: string[]): string | undefined => {
    const value: string = getStringValue(record, keys)

    return value.length > 0 ? value : undefined
}

const getNumberValue = (record: Record<string, unknown>, keys: string[], fallback: number = 0): number => {
    for (const key of keys) {
        const value: unknown = record[key]
        if (typeof value === 'number') {
            return value
        }
        if (typeof value === 'string' && value.trim().length > 0) {
            const parsedValue: number = Number(value)
            if (!Number.isNaN(parsedValue)) {
                return parsedValue
            }
        }
    }

    return fallback
}

const getBooleanValue = (record: Record<string, unknown>, keys: string[], fallback: boolean = false): boolean => {
    for (const key of keys) {
        const value: unknown = record[key]
        if (typeof value === 'boolean') {
            return value
        }
    }

    return fallback
}

const getStringArrayValue = (record: Record<string, unknown>, keys: string[]): string[] => {
    for (const key of keys) {
        const value: unknown = record[key]
        if (Array.isArray(value)) {
            return value.filter((item: unknown): item is string => typeof item === 'string')
        }
    }

    return []
}

const getPlansPayload = (payload: unknown): unknown[] => {
    if (Array.isArray(payload)) {
        return payload
    }

    if (isRecord(payload)) {
        const plansPayload: unknown = payload.subscription_plans ?? payload.subscriptionPlans ?? payload.plans
        if (Array.isArray(plansPayload)) {
            return plansPayload
        }
    }

    return []
}

const getPlanLimits = (plan: Record<string, unknown>): string[] => {
    const limits: string[] = getStringArrayValue(plan, ['limits', 'plan_limits'])
    if (limits.length > 0) {
        return limits
    }

    const assistantsLimit: number = getNumberValue(plan, ['assistants', 'assistant_limit', 'max_assistants'], -1)
    const tokenLimit: number = getNumberValue(plan, ['tokens', 'token_limit', 'monthly_tokens'], -1)
    const workflowLimit: number = getNumberValue(plan, ['workflows', 'workflow_limit', 'max_workflows'], -1)
    const inferredLimits: string[] = []

    if (assistantsLimit >= 0) {
        inferredLimits.push(assistantsLimit === 0 ? 'Sin asistentes activos' : `${assistantsLimit} asistentes activos`)
    }
    if (tokenLimit >= 0) {
        inferredLimits.push(`${tokenLimit.toLocaleString('es-CO')} tokens al mes`)
    }
    if (workflowLimit >= 0) {
        inferredLimits.push(workflowLimit === 0 ? 'Sin workflows personales' : `${workflowLimit} workflows personales`)
    }

    return inferredLimits
}

const normalizePlan = (plan: unknown): IPaymentPlan | null => {
    if (!isRecord(plan)) {
        return null
    }

    const name: string = getStringValue(plan, ['name', 'title'])
    if (name.length === 0) {
        return null
    }

    const features: string[] = getStringArrayValue(plan, ['features', 'benefits'])

    return {
        id: getOptionalStringValue(plan, ['id', '_id']),
        name,
        description: getStringValue(plan, ['description', 'subtitle']),
        monthlyPrice: getNumberValue(plan, ['monthlyPrice', 'monthly_price', 'month_price', 'price_monthly']),
        yearlyPrice: getNumberValue(plan, ['yearlyPrice', 'yearly_price', 'annual_price', 'price_yearly']),
        badge: getOptionalStringValue(plan, ['badge', 'label']),
        highlighted: getBooleanValue(plan, ['highlighted', 'recommended', 'is_recommended']),
        limits: getPlanLimits(plan),
        features,
        cta: getStringValue(plan, ['cta', 'button_text'], 'Elegir plan')
    }
}

export const usePaymentsStore = create<PaymentsStore>((set) => ({
    subscriptionPlans: [],
    isLoadingSubscriptionPlans: false,
    subscriptionPlansError: null,
    getSubscriptionPlans: async (): Promise<void> => {
        set({
            isLoadingSubscriptionPlans: true,
            subscriptionPlansError: null
        })

        try {
            const response: Response = await getSubscriptionPlansService()
            if (response.status === 200) {
                const payload: unknown = await response.json()
                const subscriptionPlans: IPaymentPlan[] = getPlansPayload(payload)
                    .map((plan: unknown) => normalizePlan(plan))
                    .filter((plan: IPaymentPlan | null): plan is IPaymentPlan => plan !== null)

                set({ subscriptionPlans })
            } else {
                set({ subscriptionPlansError: `Error ${response.status} consultando planes` })
            }
        } catch (error: unknown) {
            const message: string = error instanceof Error ? error.message : 'No fue posible consultar los planes'
            set({ subscriptionPlansError: message })
        } finally {
            set({ isLoadingSubscriptionPlans: false })
        }
    }
}))
