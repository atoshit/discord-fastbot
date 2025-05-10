import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    ApplicationCommandType,
    MessageFlags
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';
import { formatTimestamp } from '../../utils/formatters';

export default class BlacklistListCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('bllist')
            .setDescription('Affiche la liste des utilisateurs blacklistés');

        this.options = {
            name: 'bllist',
            description: 'Affiche la liste des utilisateurs blacklistés',
            category: 'admin',
            ownerOnly: true,
            data: builder
        };

        this.data = {
            name: builder.name,
            description: builder.description,
            type: ApplicationCommandType.ChatInput,
            options: []
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`blacklist.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const entries = this.client.blacklist.getAllEntries();

        if (entries.size === 0) {
            await interaction.reply({
                content: this.t('noEntries'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(this.t('listTitle'))
            .setDescription(this.t('listDescription'))
            .setTimestamp();

        for (const [userId, entry] of entries) {
            try {
                const user = await this.client.users.fetch(userId);
                const author = await this.client.users.fetch(entry.authorId);

                embed.addFields({
                    name: user.tag,
                    value: this.t('entryDetails',
                        author.tag,
                        formatTimestamp(new Date(entry.date), 'F'),
                        entry.rejoinAttempts,
                        entry.reason
                    ),
                    inline: false
                });
            } catch (error) {
                console.error(`Erreur lors de la récupération des utilisateurs pour ${userId}:`, error);
                embed.addFields({
                    name: userId,
                    value: this.t('entryError'),
                    inline: false
                });
            }
        }

        embed.setFooter({ 
            text: this.t('listFooter', entries.size),
            iconURL: interaction.client.user.displayAvatarURL()
        });

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
} 