const LOY_LOCAL_API: string = 'http://localhost:8000/api/v1';

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