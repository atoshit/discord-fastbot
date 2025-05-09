import { Events, Guild } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: CustomClient) {
        const t = (key: string, ...args: any[]) => client.locale.t(`logs.ready.${key}`, undefined, ...args);

        console.log('\x1b[32m%s\x1b[0m', t('connected'));
        console.log('\x1b[36m%s\x1b[0m', t('loggedAs', client.user?.tag));
        console.log('\x1b[36m%s\x1b[0m', t('servers', client.guilds.cache.size));
        console.log('\x1b[36m%s\x1b[0m', t('members', client.guilds.cache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0)));
        
        client.activities.start();
    }
}; 