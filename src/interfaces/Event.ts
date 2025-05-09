import { ClientEvents } from 'discord.js';
import { Client } from '../structures/Client';

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute(...args: any[]): Promise<void>;
} 