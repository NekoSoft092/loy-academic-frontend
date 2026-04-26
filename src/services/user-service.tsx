import { LOY_LOCAL_API } from "@/lib/urls";

export async function getGeneralUserInformation(userId: string): Promise<Response> {
    const url: string = LOY_LOCAL_API + "/users/general-info?user_id=" + userId;
    const response: Response = await fetch(
        url, 
        {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json'
          }
        }
    
      );
      return response;
}