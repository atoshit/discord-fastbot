import { CommandInteraction, SlashCommandBuilder, ChatInputApplicationCommandData } from 'discord.js';
import { CustomClient } from '../structures/CustomClient';

export interface CommandOptions {
    name: string;
    description: string;
    category: string;
    cooldown?: number;
    ownerOnly?: boolean;
    data: SlashCommandBuilder;
}

export interface Command {
    client: CustomClient;
    options: CommandOptions;
    data: ChatInputApplicationCommandData;
    execute(interaction: CommandInteraction): Promise<void>;
} 