import type { IInit } from './init';
import { version } from '@/../package.json';

export class InitWeb implements IInit {

    getVersionWeb(): string {
       return version;
    }
}