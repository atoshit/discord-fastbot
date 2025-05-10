import { Events, Message } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.MessageCreate,
    execute(message: Message, client: CustomClient) {
        if (message.author.bot) return;
        
        client.stats.incrementMessages(message.author.id, message.guildId!);
    }
}; 