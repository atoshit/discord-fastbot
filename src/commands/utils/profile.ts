import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    MessageFlags,
    UserManager,
    GuildMember
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';
import { isOwner } from '../../config/owners';
import { formatDuration, formatNumber } from '../../utils/formatters';

export default class ProfileCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('profile')
            .setDescription('Affiche le profil d\'un utilisateur')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('L\'utilisateur dont vous voulez voir le profil')
                    .setRequired(false)
            );

        this.options = {
            name: 'profile',
            description: 'Affiche le profil d\'un utilisateur',
            category: 'utils',
            ownerOnly: false,
            data: builder
        };
        
        this.data = {
            name: builder.name,
            description: builder.description,
            type: ApplicationCommandType.ChatInput,
            options: [{
                type: ApplicationCommandOptionType.User,
                name: 'user',
                description: 'L\'utilisateur dont vous voulez voir le profil',
                required: false
            }]
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`profile.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const member = await interaction.guild?.members.fetch(targetUser.id);

            if (!member) {
                await interaction.reply({
                    content: this.t('error'),
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            const userStats = this.client.stats.getStats(member.id, interaction.guildId!);

            const embed = new EmbedBuilder()
                .setColor(member.displayHexColor)
                .setTitle(this.t('title', member.displayName))
                .setThumbnail(member.displayAvatarURL({ size: 256 }))
                .addFields([
                    {
                        name: 'Statut',
                        value: isOwner(member.id) ? this.t('isOwner') : this.t('notOwner'),
                        inline: true
                    },
                    {
                        name: this.t('joinedAt'),
                        value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: this.t('messages'),
                        value: formatNumber(userStats.messageCount),
                        inline: true
                    },
                    {
                        name: this.t('voiceTime'),
                        value: this.client.stats.getFormattedVoiceTime(member.id, interaction.guildId!),
                        inline: true
                    },
                    {
                        name: this.t('tickets.created'),
                        value: '0', 
                        inline: true
                    },
                    {
                        name: this.t('tickets.handled'),
                        value: '0', 
                        inline: true
                    }
                ])
                .setFooter({ 
                    text: `ID: ${member.id}`,
                    iconURL: member.client.user.displayAvatarURL()
                })
                .setTimestamp();

            if (member.roles.cache.size > 1) { 
                const roles = member.roles.cache
                    .filter(role => role.id !== interaction.guild?.id)
                    .sort((a, b) => b.position - a.position)
                    .map(role => `<@&${role.id}>`)
                    .join(', ');

                embed.addFields({
                    name: '🎭 ' + this.t('roles'),
                    value: roles || 'Aucun rôle',
                    inline: false
                });
            }

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('Error in profile command:', error);
            await interaction.reply({
                content: this.t('error'),
                flags: MessageFlags.Ephemeral
            });
        }
    }
} 