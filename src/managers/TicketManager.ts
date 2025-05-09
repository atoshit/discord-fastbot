import { Client } from '../structures/Client';

export class TicketManager {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    // Méthodes à implémenter plus tard
    async createTicket() {}
    async closeTicket() {}
    async addUser() {}
    async removeUser() {}
} 