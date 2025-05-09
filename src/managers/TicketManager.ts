import { CustomClient } from '../structures/CustomClient';

export class TicketManager {
    private client: CustomClient;
    private tickets: Set<string>; 

    constructor(client: CustomClient) {
        this.client = client;
        this.tickets = new Set();
    }

    private t(key: string, ...args: any[]) {
        return this.client.locale.t(`tickets.${key}`, undefined, ...args);
    }

    getOpenTickets(): string[] {
        return Array.from(this.tickets);
    }

    async createTicket() {
        try {
            console.log(this.t('create.success', 'id_ticket'));
        } catch (error) {
            console.error(this.t('create.error', error));
        }
    }

    async closeTicket() {
        try {
            console.log(this.t('close.success', 'id_ticket'));
        } catch (error) {
            console.error(this.t('close.error', error));
        }
    }

    async addUser() {
        try {
            console.log(this.t('addUser.success', 'user_id'));
        } catch (error) {
            console.error(this.t('addUser.error', error));
        }
    }

    async removeUser() {
        try {
            console.log(this.t('removeUser.success', 'user_id'));
        } catch (error) {
            console.error(this.t('removeUser.error', error));
        }
    }
} 