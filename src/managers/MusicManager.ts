import { CustomClient } from '../structures/CustomClient';

export class MusicManager {
    private client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    private t(key: string, ...args: any[]) {
        return this.client.locale.t(`music.${key}`, undefined, ...args);
    }

    async play() {
        try {
            
            console.log(this.t('play.success', 'nom_musique'));
        } catch (error) {
            console.error(this.t('play.error', error));
        }
    }

    async stop() {
        try {
            
            console.log(this.t('stop.success'));
        } catch (error) {
            console.error(this.t('stop.error', error));
        }
    }

    async pause() {
        try {
            
            console.log(this.t('pause.success'));
        } catch (error) {
            console.error(this.t('pause.error', error));
        }
    }

    async skip() {
        try {
            
            console.log(this.t('skip.success'));
        } catch (error) {
            console.error(this.t('skip.error', error));
        }
    }
} 