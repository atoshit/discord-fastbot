import { Collection, REST, Routes, CommandInteraction, MessageFlags } from 'discord.js';
import { BaseCommand } from '../structures/BaseCommand';
import { CustomClient } from '../structures/CustomClient';
import { readdirSync } from 'fs';
import { join } from 'path';
import { config } from '../config';
import { isOwner } from '../config/owners';

export class CommandManager {
    private client: CustomClient;
    public commands: Collection<string, BaseCommand>;

    constructor(client: CustomClient) {
        this.client = client;
        this.commands = new Collection();
    }

    private t(key: string, ...args: any[]) {
        return this.client.locale.t(key, undefined, ...args);
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

    async handleCommand(interaction: CommandInteraction) {
        console.log('Handling command:', interaction.commandName, 'from user:', interaction.user.tag);

        const command = this.commands.get(interaction.commandName);
        
        console.log('Command executed:', interaction.commandName);
        console.log('Command options:', command?.options);
        console.log('Is owner only?', command?.options?.ownerOnly);
        
        if (!command) {
            return interaction.reply({
                content: this.client.locale.t('logs.interaction.commandNotFound', undefined, interaction.commandName),
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            if (command.options?.ownerOnly) {
                console.log('Command is owner only, checking user:', interaction.user.id);
                const isUserOwner = isOwner(interaction.user.id);
                console.log('Is user owner?', isUserOwner);

                if (!isUserOwner) {
                    await interaction.reply({
                        content: this.client.locale.t('logs.interaction.notOwner'),
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: this.client.locale.t('logs.interaction.error', undefined, interaction.commandName, error),
                flags: MessageFlags.Ephemeral
            });
        }
    }
} 