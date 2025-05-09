import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { config } from './config';
import { readdirSync } from 'fs';
import { join } from 'path';
import { LocaleManager } from './managers/LocaleManager';

const GUILD_ID = '1370200912861204592';
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);
const locale = new LocaleManager();
const t = (key: string, ...args: any[]) => locale.t(`logs.commands.${key}`, undefined, ...args);

async function clearCommands() {
    try {
        console.log('\x1b[33m%s\x1b[0m', t('clearing'));
        
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [] }
        );
        console.log('\x1b[32m%s\x1b[0m', t('globalCleared'));

        await rest.put(
            Routes.applicationGuildCommands(config.clientId, GUILD_ID),
            { body: [] }
        );
        console.log('\x1b[32m%s\x1b[0m', t('guildCleared'));
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', t('clearError', error));
    }
}

async function deployCommands() {
    try {
        await clearCommands();

        const commands = [];
        const commandsPath = join(__dirname, 'commands');
        
        console.log(t('folder', commandsPath));
        const commandFolders = readdirSync(commandsPath);
        console.log(t('subFolders', commandFolders.join(', ')));

        for (const folder of commandFolders) {
            const folderPath = join(commandsPath, folder);
            const commandFiles = readdirSync(folderPath).filter(file => file.endsWith('.ts'));
            console.log(t('filesIn', folder, commandFiles.join(', ')));

            for (const file of commandFiles) {
                const filePath = join(folderPath, file);
                const command = require(filePath).default;
                const cmd = new command({ intents: [] });
                commands.push(cmd.data);
                console.log(t('loaded', file));
            }
        }

        console.log(t('toBeDeployed', JSON.stringify(commands, null, 2)));
        console.log(t('clientId', config.clientId));

        console.log('\x1b[36m%s\x1b[0m', t('deploying'));
        const result = await rest.put(
            Routes.applicationGuildCommands(config.clientId, GUILD_ID),
            { body: commands }
        );

        console.log('\x1b[32m%s\x1b[0m', t('success'));
        console.log(t('result', JSON.stringify(result, null, 2)));

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', t('deployError', error));
    }
}

const action = process.argv[2];
if (action === 'clear') {
    clearCommands();
} else {
    deployCommands();
} 