import { CommandInteraction, ApplicationCommandData } from 'discord.js';
import { Client } from './Client';

export abstract class BaseCommand {
    protected client: Client;
    public data: ApplicationCommandData;

    constructor(client: Client, data: ApplicationCommandData) {
        this.client = client;
        this.data = data;
    }

    abstract execute(interaction: CommandInteraction): Promise<void>;
} 