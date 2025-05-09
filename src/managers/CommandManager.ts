import { Collection } from 'discord.js';
import { BaseCommand } from '../structures/BaseCommand';
import { Client } from '../structures/Client';
import { readdirSync } from 'fs';
import { join } from 'path';

export class CommandManager {
    private client: Client;
    public commands: Collection<string, BaseCommand>;

    constructor(client: Client) {
        this.client = client;
        this.commands = new Collection();
    }

    async loadCommands() {
        const commandsPath = join(__dirname, '..', 'commands');
        // Logique de chargement des commandes
    }
} 