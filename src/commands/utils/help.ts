import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MessageFlags,
    ButtonInteraction,
    ApplicationCommandType
} from 'discord.js';
import { CustomClient } from '../../structures/CustomClient';
import { BaseCommand } from '../../structures/BaseCommand';

export default class HelpCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);
        
        const builder = new SlashCommandBuilder()
            .setName('help')
            .setDescription('Affiche la liste des commandes disponibles');

        this.options = {
            name: 'help',
            description: 'Affiche la liste des commandes disponibles',
            category: 'utils',
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
        return this.client.locale.t(`help.${key}`, undefined, ...args);
    }

    private createPageButtons(currentPage: number, maxPages: number) {
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev_page')
                    .setLabel('◀')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next_page')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === maxPages - 1)
            );
        return row;
    }

    private getPages(): EmbedBuilder[] {
        const pages: EmbedBuilder[] = [];
        
        const utilsEmbed = new EmbedBuilder()
            .setColor('#2F3136')
            .setTitle(this.t('utilsTitle'))
            .setDescription(this.t('utilsDescription'))
            .addFields([
                {
                    name: '`/help`',
                    value: this.t('helpDesc'),
                    inline: false
                },
                {
                    name: '`/info`',
                    value: this.t('infoDesc'),
                    inline: false
                },
                {
                    name: '`/profile [utilisateur]`',
                    value: this.t('profileDesc'),
                    inline: false
                }
            ])
            .setFooter({ text: this.t('pageFooter', 1, 2) });
        pages.push(utilsEmbed);

        const adminEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(this.t('adminTitle'))
            .setDescription(this.t('adminDescription'))
            .addFields([
                {
                    name: '`/clear <nombre>`',
                    value: this.t('clearDesc'),
                    inline: false
                },
                {
                    name: '`/bl <utilisateur> <raison>`',
                    value: this.t('blacklistDesc'),
                    inline: false
                },
                {
                    name: '`/unbl <utilisateur>`',
                    value: this.t('unblacklistDesc'),
                    inline: false
                },
                {
                    name: '`/bllist`',
                    value: this.t('blacklistListDesc'),
                    inline: false
                },
                {
                    name: '`/wlrole <role>`',
                    value: this.t('wlroleDesc'),
                    inline: false
                },
                {
                    name: '`/unwlrole <role>`',
                    value: this.t('unwlroleDesc'),
                    inline: false
                },
                {
                    name: '`/wlroleslist`',
                    value: this.t('wlroleslistDesc'),
                    inline: false
                }
            ])
            .setFooter({ text: this.t('pageFooter', 2, 2) });
        pages.push(adminEmbed);

        return pages;
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const pages = this.getPages();
        let currentPage = 0;

        const response = await interaction.reply({
            embeds: [pages[currentPage]],
            components: [this.createPageButtons(currentPage, pages.length)],
            flags: MessageFlags.Ephemeral,
            fetchReply: true
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 300000,
            filter: i => i.user.id === interaction.user.id
        });

        collector.on('collect', async (i: ButtonInteraction) => {
            if (i.customId === 'prev_page') {
                currentPage = Math.max(0, currentPage - 1);
            } else if (i.customId === 'next_page') {
                currentPage = Math.min(pages.length - 1, currentPage + 1);
            }

            await i.update({
                embeds: [pages[currentPage]],
                components: [this.createPageButtons(currentPage, pages.length)]
            });
        });

        collector.on('end', () => {
            interaction.editReply({
                components: []
            }).catch(() => {});
        });
    }
} 