import { Events, Interaction } from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const client = interaction.client as CustomClient;
        const command = client.commands.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Commande ${interaction.commandName} non trouvée.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Erreur lors de l'exécution de la commande ${interaction.commandName}:`, error);
            
            const replyData = {
                content: 'Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(replyData);
            } else {
                await interaction.reply(replyData);
            }
        }
    }
}; 