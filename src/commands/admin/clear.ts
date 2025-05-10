import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    TextChannel, 
    PermissionFlagsBits,
    ApplicationCommandData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    MessageFlags
} from 'discord.js';
import { CommandOptions } from '../../interfaces/Command';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class ClearCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('clear')
            .setDescription('Supprime un nombre spécifié de messages')
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('Nombre de messages à supprimer (1-100)')
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100)
            );

        this.options = {
            name: 'clear',
            description: 'Supprime un nombre spécifié de messages',
            category: 'admin',
            ownerOnly: false,
            data: builder
        };
        
        this.data = {
            name: builder.name,
            description: builder.description,
            type: ApplicationCommandType.ChatInput,
            options: [{
                type: ApplicationCommandOptionType.Integer,
                name: 'amount',
                description: 'Nombre de messages à supprimer (1-100)',
                required: true,
                min_value: 1,
                max_value: 100
            }]
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`clear.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!this.hasPermission(interaction)) {
            await interaction.reply({
                content: this.client.locale.t('logs.interaction.notAllowed'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (!interaction.channel || !(interaction.channel instanceof TextChannel)) {
            await interaction.reply({
                content: this.t('wrongChannel'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (!interaction.channel.permissionsFor(this.client.user!)?.has(PermissionFlagsBits.ManageMessages)) {
            await interaction.reply({
                content: this.t('botNoPermission'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const amount = interaction.options.getInteger('amount', true);

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);

            await interaction.reply({
                content: this.t('success', deleted.size),
                flags: MessageFlags.Ephemeral
            });

            console.log(`${interaction.user.tag} a supprimé ${deleted.size} messages dans #${interaction.channel.name}`);
        } catch (error) {
            console.error('Erreur lors de la suppression des messages:', error);
            await interaction.reply({
                content: this.t('error', error),
                flags: MessageFlags.Ephemeral
            });
        }
    }
} 