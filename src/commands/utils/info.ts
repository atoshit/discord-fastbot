import { SlashCommandBuilder, EmbedBuilder, version as discordVersion, ChatInputCommandInteraction } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand';
import { CustomClient } from '../../structures/CustomClient';
import { config } from '../../config';
import { version as nodeVersion } from 'process';
import os from 'os';

export default class InfoCommand extends BaseCommand {
    constructor(client: CustomClient) {
        const data = new SlashCommandBuilder()
            .setName('info')
            .setDescription('Affiche les informations du bot')
            .toJSON();

        super(client, {
            name: data.name,
            description: data.description,
            type: 1,
            options: []
        });
    }

    async execute(interaction: ChatInputCommandInteraction) {
        const client = interaction.client as CustomClient;
        const t = (key: string, ...args: any[]) => client.locale.t(`info.${key}`, interaction.locale, ...args);
        
        if (!client.user) {
            await interaction.reply({ content: 'Une erreur est survenue', ephemeral: true });
            return;
        }

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);
        
        const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(t('title'))
            .setThumbnail(client.user.displayAvatarURL())
            .addFields([
                {
                    name: t('bot.title'),
                    value: [
                        `**${t('bot.name')}:** ${client.user.tag}`,
                        `**${t('bot.id')}:** ${client.user.id}`,
                        `**${t('bot.version')}:** 1.0.0`,
                        `**${t('bot.uptime')}:** ${t('bot.uptimeFormat', days, hours, minutes, seconds)}`,
                        `**${t('bot.ping')}:** ${client.ws.ping}ms`,
                        `**${t('bot.creator')}:** <@${config.ownersId[0]}>`,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: t('stats.title'),
                    value: [
                        `**${t('stats.servers')}:** ${client.guilds.cache.size}`,
                        `**${t('stats.users')}:** ${client.guilds.cache.reduce((a: number, g: any) => a + g.memberCount, 0)}`,
                        `**${t('stats.channels')}:** ${client.channels.cache.size}`,
                        `**${t('stats.roles')}:** ${client.guilds.cache.reduce((a: number, g: any) => a + g.roles.cache.size, 0)}`,
                        `**${t('stats.tickets')}:** ${client.tickets.getOpenTickets()?.length || 0}`,
                    ].join('\n'),
                    inline: true
                },
                {
                    name: t('system.title'),
                    value: [
                        `**${t('system.nodejs')}:** ${nodeVersion}`,
                        `**${t('system.discordjs')}:** v${discordVersion}`,
                        `**${t('system.os')}:** ${os.type()} ${os.release()}`,
                        `**${t('system.cpu')}:** ${os.cpus()[0].model}`,
                        `**${t('system.ram')}:** ${t('system.ramFormat', usedMemory.toFixed(2), totalMemory.toFixed(2))}`,
                        `**${t('system.arch')}:** ${os.arch()}`,
                    ].join('\n'),
                    inline: false
                }
            ])
            .setFooter({ 
                text: t('footer', config.supportServer),
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
} 