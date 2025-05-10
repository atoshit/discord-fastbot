import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    MessageFlags,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType,
    Role,
    StringSelectMenuInteraction,
    MessageComponentInteraction
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class WhitelistRoleCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('wlrole')
            .setDescription('Whitelist un rôle avec des permissions spécifiques')
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('Le rôle à whitelist')
                    .setRequired(true)
            );

        this.options = {
            name: 'wlrole',
            description: 'Whitelist un rôle avec des permissions spécifiques',
            category: 'admin',
            ownerOnly: false,
            data: builder
        };

        this.data = {
            name: builder.name,
            description: builder.description,
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    type: ApplicationCommandOptionType.Role,
                    name: 'role',
                    description: 'Le rôle à whitelist',
                    required: true
                }
            ]
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`whitelistRole.${key}`, undefined, ...args);
    }

    private getAvailableCommands(): string[] {
        return [
            'clear',
            'blacklist',
            'unblacklist',
            'bllist',
            'wlrole',
            'unwlrole',
            'wlroleslist'
        ];
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const role = interaction.options.getRole('role', true) as Role;

        if (this.client.cache.getWhitelistedRole(role.id, interaction.guildId!)) {
            await interaction.reply({
                content: this.t('alreadyWhitelisted'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const availableCommands = this.getAvailableCommands();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_commands')
            .setPlaceholder(this.t('selectCommands'))
            .setMinValues(1)
            .setMaxValues(availableCommands.length)
            .addOptions(availableCommands.map(cmd => ({
                label: cmd,
                value: cmd,
                description: this.t(`commandDesc.${cmd}`)
            })));

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        const embed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle(this.t('selectTitle'))
            .setDescription(this.t('selectDescription', role.name))
            .setTimestamp();

        const response = await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
            fetchReply: true
        });

        try {
            const selectInteraction = await response.awaitMessageComponent({
                filter: (i: MessageComponentInteraction) => 
                    i.user.id === interaction.user.id && 
                    i.customId === 'select_commands',
                time: 60000,
                componentType: ComponentType.StringSelect
            }) as StringSelectMenuInteraction;

            const selectedCommands = selectInteraction.values;

            this.client.cache.addWhitelistedRole(
                role.id,
                interaction.guildId!,
                selectedCommands,
                interaction.user.id
            );

            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(this.t('successTitle'))
                .setDescription(this.t('successDescription', role.name))
                .addFields([
                    {
                        name: this.t('allowedCommands'),
                        value: selectedCommands.map((cmd: string) => `\`${cmd}\``).join(', '),
                        inline: false
                    }
                ])
                .setTimestamp();

            await selectInteraction.update({
                embeds: [successEmbed],
                components: []
            });

        } catch (error) {
            await interaction.editReply({
                content: this.t('timeout'),
                components: []
            });
        }
    }
} 