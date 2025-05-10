import { Events, VoiceState } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.VoiceStateUpdate,
    execute(oldState: VoiceState, newState: VoiceState, client: CustomClient) {
        // Ignore les bots
        if (oldState.member?.user.bot) return;

        const userId = oldState.member?.id || newState.member?.id;
        const guildId = oldState.guild.id;

        if (!userId) return;

        // L'utilisateur rejoint un salon vocal
        if (!oldState.channelId && newState.channelId) {
            client.stats.startVoiceTracking(userId, guildId);
        }
        // L'utilisateur quitte un salon vocal
        else if (oldState.channelId && !newState.channelId) {
            client.stats.stopVoiceTracking(userId, guildId);
        }
        // L'utilisateur change de salon vocal
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            // On continue le tracking sans interruption
            // Pas besoin de faire quoi que ce soit ici
        }
    }
}; 