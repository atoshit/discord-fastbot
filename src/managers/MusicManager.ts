import { CustomClient } from '../structures/CustomClient';

export class MusicManager {
    private client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async play() {}
    async stop() {}
    async pause() {}
    async skip() {}
} 