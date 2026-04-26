import { LOY_LOCAL_API } from "@/lib/urls";

export async function getWorkflowsByUser(userId: string, authToken: string): Promise<Response> {
    const url: string = LOY_LOCAL_API + `/workflows?user_id=${userId}&&auth_token=${authToken}`;
    const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response
}

export async function createWorkflow(userId: string, name: string, description: string): Promise<Response> {
    const url: string = LOY_LOCAL_API + "/workflows";
    const response: Response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
            user_id: userId, 
            name,
            description
        })
    })
    return response
}