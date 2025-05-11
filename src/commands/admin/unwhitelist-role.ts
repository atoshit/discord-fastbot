import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    MessageFlags,
    Role
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class UnwhitelistRoleCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('unwlrole')
            .setDescription('Retire un rôle de la whitelist')
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('Le rôle à retirer de la whitelist')
                    .setRequired(true)
            );

        this.options = {
            name: 'unwlrole',
            description: 'Retire un rôle de la whitelist',
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
                    description: 'Le rôle à retirer de la whitelist',
                    required: true
                }
            ]
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`whitelistRole.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const role = interaction.options.getRole('role', true) as Role;

        if (!this.client.cache.getWhitelistedRole(role.id, interaction.guildId!)) {
            await interaction.reply({
                content: this.t('notWhitelisted'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        this.client.cache.removeWhitelistedRole(role.id, interaction.guildId!);

        await interaction.reply({
            content: this.t('removed', `<@&${role.id}>`),
            flags: MessageFlags.Ephemeral
        });
    }
} 