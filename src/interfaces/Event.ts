import { ClientEvents } from 'discord.js';
import { CustomClient } from '../structures/CustomClient';

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    execute(...args: unknown[]): Promise<void>;
} 