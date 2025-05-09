import { 
    CommandInteraction, 
    SlashCommandBuilder, 
    ChatInputApplicationCommandData, 
    ApplicationCommandData,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder
} from 'discord.js';
import { CustomClient } from '../structures/CustomClient';

export interface CommandOptions {
    name: string;
    description: string;
    category: string;
    cooldown?: number;
    ownerOnly?: boolean;
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
}

export interface Command {
    client: CustomClient;
    options: CommandOptions;
    data: ApplicationCommandData;
    execute(interaction: CommandInteraction): Promise<void>;
} 