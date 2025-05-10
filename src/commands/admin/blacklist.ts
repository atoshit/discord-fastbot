import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    ApplicationCommandType,
    ApplicationCommandOptionType,
    MessageFlags,
    EmbedBuilder
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';
import { isOwner } from '../../config/owners';

export default class BlacklistCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('bl')
            .setDescription('Blacklist un utilisateur')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('L\'utilisateur à blacklist')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('reason')
                    .setDescription('Raison du blacklist')
                    .setRequired(true)
            );

        this.options = {
            name: 'bl',
            description: 'Blacklist un utilisateur',
            category: 'admin',
            ownerOnly: true,
            data: builder
        };

        this.data = {
            name: builder.name,
            description: builder.description,
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    type: ApplicationCommandOptionType.User,
                    name: 'user',
                    description: 'L\'utilisateur à blacklist',
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'reason',
                    description: 'Raison du blacklist',
                    required: true
                }
            ]
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`blacklist.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const targetUser = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);

        if (targetUser.id === interaction.user.id) {
            await interaction.reply({
                content: this.t('cannotBlacklistSelf'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (isOwner(targetUser.id)) {
            await interaction.reply({
                content: this.t('cannotBlacklistOwner'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        if (this.client.blacklist.isBlacklisted(targetUser.id)) {
            await interaction.reply({
                content: this.t('alreadyBlacklisted'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        this.client.blacklist.addToBlacklist(targetUser.id, interaction.user.id, reason);

        for (const guild of this.client.guilds.cache.values()) {
            try {
                await guild.members.ban(targetUser.id, { reason: `Blacklist: ${reason}` });
            } catch (error) {
                console.error(`Impossible de bannir ${targetUser.tag} de ${guild.name}:`, error);
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(this.t('successTitle'))
            .setDescription(this.t('successDescription', targetUser.tag))
            .addFields([
                {
                    name: this.t('userField'),
                    value: `${targetUser.tag} (<@${targetUser.id}>)`,
                    inline: true
                },
                {
                    name: this.t('authorField'),
                    value: `${interaction.user.tag}`,
                    inline: true
                },
                {
                    name: this.t('reasonField'),
                    value: reason,
                    inline: false
                }
            ])
            .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
} 