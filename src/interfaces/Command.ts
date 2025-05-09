import { CommandInteraction, ApplicationCommandData, PermissionResolvable } from 'discord.js';
import { CustomClient } from '../structures/CustomClient';

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
    client: CustomClient;
    options: CommandOptions;
    execute(interaction: CommandInteraction): Promise<void>;
} 