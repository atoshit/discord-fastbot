import { Events, Interaction } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        console.log('Interaction received:', interaction.type); 
        
        if (!interaction.isChatInputCommand()) return;
        console.log('Command interaction received:', interaction.commandName);  

        const client = interaction.client as CustomClient;

        try {
            await client.commands.handleCommand(interaction);
        } catch (error) {
            console.error('Error handling command:', error);
            await interaction.reply({
                content: client.locale.t('interaction.error', interaction.commandName, error),
                ephemeral: true
            });
        }
    }
}; 