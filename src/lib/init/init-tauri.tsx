import type { IInit } from './init';
import { getVersion } from '@tauri-apps/api/app'

export class InitTauri implements IInit {

    async getVersionDesktop(): Promise<string> {
        return await getVersion();
    }
}