import { CustomClient } from '../structures/CustomClient';

export class TicketManager {
    private client: CustomClient;
    private tickets: Set<string>; 

    constructor(client: CustomClient) {
        this.client = client;
        this.tickets = new Set();
    }

    getOpenTickets(): string[] {
        return Array.from(this.tickets);
    }

    async createTicket() {}
    async closeTicket() {}
    async addUser() {}
    async removeUser() {}
} 