import { CommandInteraction, SlashCommandBuilder, ChatInputApplicationCommandData } from 'discord.js';
import { CommandOptions } from '../interfaces/Command';
import { CustomClient } from './CustomClient';

export abstract class BaseCommand {
    public client: CustomClient;
    public options!: CommandOptions;
    public data!: ChatInputApplicationCommandData;

    constructor(client: CustomClient) {
        this.client = client;
    }

    abstract execute(interaction: CommandInteraction): Promise<void>;

    protected t(key: string, ...args: any[]) {
        return this.client.locale.t(key, undefined, ...args);
    }
} 