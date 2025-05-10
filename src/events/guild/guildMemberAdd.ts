import { Events, GuildMember } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember, client: CustomClient) {
        if (client.blacklist.isBlacklisted(member.id)) {
            client.blacklist.incrementRejoinAttempts(member.id);
            
            try {
                await member.ban({ reason: 'Utilisateur blacklisté' });
                console.log(`Re-banned blacklisted user ${member.user.tag} in ${member.guild.name}`);
            } catch (error) {
                console.error(`Failed to re-ban ${member.user.tag} in ${member.guild.name}:`, error);
            }
        }
    }
}; 