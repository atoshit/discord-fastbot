import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    ApplicationCommandType,
    ApplicationCommandOptionType,
    MessageFlags
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class UnblacklistCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('unbl')
            .setDescription('Retire un utilisateur de la blacklist')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('L\'utilisateur à retirer de la blacklist')
                    .setRequired(true)
            );

        this.options = {
            name: 'unbl',
            description: 'Retire un utilisateur de la blacklist',
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
                    description: 'L\'utilisateur à retirer de la blacklist',
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

        if (!this.client.blacklist.isBlacklisted(targetUser.id)) {
            await interaction.reply({
                content: this.t('notBlacklisted'),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        this.client.blacklist.removeFromBlacklist(targetUser.id);

        for (const guild of this.client.guilds.cache.values()) {
            try {
                await guild.members.unban(targetUser.id, 'Retiré de la blacklist');
            } catch (error) {
                console.error(`Impossible de débannir ${targetUser.tag} de ${guild.name}:`, error);
            }
        }

        await interaction.reply({
            content: this.t('unblacklisted', targetUser.tag),
            flags: MessageFlags.Ephemeral
        });
    }
} 