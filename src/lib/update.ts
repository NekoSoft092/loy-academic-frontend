import {  checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import type { UpdateResult } from '@tauri-apps/api/updater';

export interface ISearchUpdateResponse {
    error: boolean;
    message: string;
    shouldUpdate?: boolean;
}

export const searchUpdate = async(): Promise<ISearchUpdateResponse> => {
    const messageShouldUpdate: string = 'La ultima version de Sage ya esta disponible';
    const messageNotShouldUpdate: string = 'Tu Sage ya se encuentra actualizado';

    try {
        const haveUpdate: UpdateResult = await checkUpdate();
        if(haveUpdate.shouldUpdate) {
            // await installUpdate();
            return {
                error: false, 
                message: messageShouldUpdate, 
                shouldUpdate: true
            }
        } else {
            return {
                error: false, 
                message: messageNotShouldUpdate, 
                shouldUpdate: false
            }
        }
    } 
    catch(error) {
        return {
            error: true, 
            message: (error as string)
        };
    }
} 

export const update = async(): Promise<void> => {
    const update: UpdateResult = await checkUpdate();
    if(update.shouldUpdate) {
        await installUpdate();
    }
}

export const checkProcess = async(): Promise<void> => {

}