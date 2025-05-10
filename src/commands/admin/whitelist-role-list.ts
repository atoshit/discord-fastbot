import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    ApplicationCommandType
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';
import { formatTimestamp } from '../../utils/formatters';

export default class WhitelistRoleListCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('wlroleslist')
            .setDescription('Affiche la liste des rôles whitelistés');

        this.options = {
            name: 'wlroleslist',
            description: 'Affiche la liste des rôles whitelistés',
            category: 'admin',
            ownerOnly: false,
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
        return this.client.locale.t(`whitelistRole.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const roles = this.client.cache.getAllWhitelistedRoles(interaction.guildId!);

        if (roles.size === 0) {
            await interaction.reply({
                content: this.t('noRoles'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle(this.t('listTitle'))
            .setDescription(this.t('listDescription'))
            .setTimestamp();

        for (const [_, entry] of roles) {
            try {
                const role = await interaction.guild!.roles.fetch(entry.roleId);
                const author = await this.client.users.fetch(entry.addedBy);

                if (role) {
                    embed.addFields({
                        name: role.name,
                        value: this.t('entryDetails',
                            author.tag,
                            formatTimestamp(new Date(entry.addedAt), 'F'),
                            entry.allowedCommands.map(cmd => `\`${cmd}\``).join(', ')
                        ),
                        inline: false
                    });
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération du rôle ${entry.roleId}:`, error);
            }
        }

        embed.setFooter({ 
            text: this.t('listFooter', roles.size),
            iconURL: interaction.client.user.displayAvatarURL()
        });

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
} 