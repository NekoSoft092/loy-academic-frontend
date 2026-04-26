const API_VERSION: string = "v1";


export const LOY_LOCAL_API: string = `http://localhost:8000/api/${API_VERSION}`;

export const LOY_STAGING_API: string = `https://staging-api.loy.academy/api/${API_VERSION}`;

export const LOY_PRODUCTION_API: string = `https://api.loy.academy/api/${API_VERSION}`;

/**
 * Funtion to get the current API URL based on the environment variable. 
 * It checks the NODE_ENV variable and returns the corresponding API URL for 
 * production, staging, or local development.
 * @returns string - The API URL corresponding to the current environment.
 */
export const getCurrentApiUrl = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return LOY_PRODUCTION_API;
  } else if (process.env.NODE_ENV === 'staging') {
    return LOY_STAGING_API;
  } else {
    return LOY_LOCAL_API;
  }
}