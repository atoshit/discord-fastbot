import { Collection, REST, Routes } from 'discord.js';
import { BaseCommand } from '../structures/BaseCommand';
import { CustomClient } from '../structures/CustomClient';
import { readdirSync } from 'fs';
import { join } from 'path';
import { config } from '../config';

export class CommandManager {
    private client: CustomClient;
    public commands: Collection<string, BaseCommand>;

    constructor(client: CustomClient) {
        this.client = client;
        this.commands = new Collection();
    }

    async loadCommands() {
        const commandsPath = join(__dirname, '..', 'commands');
        const commandFolders = readdirSync(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = join(commandsPath, folder);
            const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.ts'));

            for (const file of commandFiles) {
                const filePath = join(folderPath, file);
                const CommandClass = (await import(filePath)).default;
                const command = new CommandClass(this.client);

                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    console.log(`📝 Commande chargée : ${file}`);
                } else {
                    console.log(`⚠️ La commande ${file} manque de propriétés requises`);
                }
            }
        }
        console.log('\x1b[33m%s\x1b[0m', '✨ Toutes les commandes ont été chargées !');
    }

    async deployCommands() {
        try {
            console.log('🔄 Déploiement des commandes slash...');

            const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
            const commandsData = Array.from(this.commands.values()).map(cmd => cmd.data);

            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commandsData }
            );

            console.log('\x1b[32m%s\x1b[0m', '✅ Commandes slash déployées avec succès !');
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors du déploiement des commandes :', error);
        }
    }
} 