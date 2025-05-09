import { Client } from '../structures/Client';

export class MusicManager {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    // Méthodes à implémenter plus tard
    async play() {}
    async stop() {}
    async pause() {}
    async skip() {}
} 