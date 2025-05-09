import { CommandInteraction, ApplicationCommandData, PermissionResolvable } from 'discord.js';
import { Client } from '../structures/Client';

export interface CommandOptions {
    name: string;
    description: string;
    category: string;
    cooldown?: number;
    permissions?: PermissionResolvable[];
    ownerOnly?: boolean;
    data: ApplicationCommandData;
}

export interface Command {
    client: Client;
    options: CommandOptions;
    execute(interaction: CommandInteraction): Promise<void>;
} 