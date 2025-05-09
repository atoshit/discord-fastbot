import { CommandInteraction, ApplicationCommandData } from 'discord.js';
import { CustomClient } from './CustomClient';

export abstract class BaseCommand {
    protected client: CustomClient;
    public data: ApplicationCommandData;

    constructor(client: CustomClient, data: ApplicationCommandData) {
        this.client = client;
        this.data = data;
    }

    abstract execute(interaction: CommandInteraction): Promise<void>;
} 