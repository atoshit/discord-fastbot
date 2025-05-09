import { Events, Guild } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: CustomClient) {
        console.log('\x1b[32m%s\x1b[0m', '✅ Bot connecté avec succès !');
        console.log('\x1b[36m%s\x1b[0m', `📡 Connecté en tant que : ${client.user?.tag}`);
        console.log('\x1b[36m%s\x1b[0m', `🌐 Présent sur : ${client.guilds.cache.size} serveur(s)`);
        console.log('\x1b[36m%s\x1b[0m', `👥 Total membres : ${client.guilds.cache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0)}`);
        
        client.user?.setPresence({
            activities: [{ 
                name: `${client.guilds.cache.size} serveurs`,
                type: 3 // Watching
            }],
            status: 'online'
        });
    }
}; 