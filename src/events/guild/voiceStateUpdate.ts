import { Events, VoiceState } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.VoiceStateUpdate,
    execute(oldState: VoiceState, newState: VoiceState, client: CustomClient) {
        if (oldState.member?.user.bot) return;

        const userId = oldState.member?.id || newState.member?.id;
        const guildId = oldState.guild.id;

        if (!userId) return;

        if (!oldState.channelId && newState.channelId) {
            client.stats.startVoiceTracking(userId, guildId);
        }
        else if (oldState.channelId && !newState.channelId) {
            client.stats.stopVoiceTracking(userId, guildId);
        }
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        }
    }
}; 