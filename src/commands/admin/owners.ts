import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    ApplicationCommandData,
    ApplicationCommandType,
    MessageFlags,
    EmbedBuilder 
} from 'discord.js';
import { CommandOptions } from '../../interfaces/Command';
import { owners } from '../../config/owners';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class OwnersCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('owners')
            .setDescription('Affiche la liste des propriétaires du bot');

        this.options = {
            name: 'owners',
            description: 'Affiche la liste des propriétaires du bot',
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
        return this.client.locale.t(`owners.${key}`, undefined, ...args);
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const ownerUsers = await Promise.all(
            owners.map(async id => {
                try {
                    return await this.client.users.fetch(id);
                } catch {
                    return null;
                }
            })
        );

        const validOwners = ownerUsers.filter(user => user !== null);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(this.t('title'))
            .setDescription(this.t('description'))
            .addFields({
                name: this.t('list'),
                value: validOwners.length > 0
                    ? validOwners.map(user => `• <@${user?.id}>`).join('\n')
                    : this.t('notFound')
            })
            .setFooter({ text: this.t('footer', validOwners.length) })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
} 