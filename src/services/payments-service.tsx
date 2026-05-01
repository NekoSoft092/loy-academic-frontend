import { LOY_LOCAL_API } from "@/lib/urls";

export async function getSubscriptionPlans(): Promise<Response> {
    const url: string = LOY_LOCAL_API + "/subscription-plans";
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}
