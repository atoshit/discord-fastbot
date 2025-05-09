import { Client } from '../../structures/Client';
import { Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log('\x1b[32m%s\x1b[0m', '✅ Bot connecté avec succès !');
        console.log('\x1b[36m%s\x1b[0m', `📡 Connecté en tant que : ${client.user?.tag}`);
        console.log('\x1b[36m%s\x1b[0m', `🌐 Présent sur : ${client.guilds.cache.size} serveur(s)`);
        console.log('\x1b[36m%s\x1b[0m', `👥 Total membres : ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`);
        
        // Définir le statut du bot
        client.user?.setPresence({
            activities: [{ 
                name: `${client.guilds.cache.size} serveurs`,
                type: 3 // Watching
            }],
            status: 'online'
        });
    }
}; 