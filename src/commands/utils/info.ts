import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { BaseCommand } from '../../structures/BaseCommand';
import { CustomClient } from '../../structures/CustomClient';
import { version } from '../../../package.json';
import os from 'os';

export default class InfoCommand extends BaseCommand {
    constructor(client: CustomClient) {
        super(client);

        const builder = new SlashCommandBuilder()
            .setName('info')
            .setDescription('Affiche les informations du bot');

        this.options = {
            name: 'info',
            description: 'Affiche les informations du bot',
            category: 'utils',
            ownerOnly: false,
            data: builder
        };

        this.data = {
            name: builder.name,
            description: builder.description,
            type: 1,
            options: []
        };
    }

    protected override t(key: string, ...args: any[]) {
        return this.client.locale.t(`info.${key}`, undefined, ...args);
    }

    async execute(interaction: CommandInteraction) {
        const totalMemory = Math.round(os.totalmem() / 1024 / 1024);
        const freeMemory = Math.round(os.freemem() / 1024 / 1024);
        const usedMemory = totalMemory - freeMemory;

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(this.t('title'))
            .addFields([
                {
                    name: this.t('bot.title'),
                    value: [
                        `${this.t('bot.name')}: ${this.client.user?.username}`,
                        `${this.t('bot.id')}: ${this.client.user?.id}`,
                        `${this.t('bot.version')}: ${version}`,
                        `${this.t('bot.uptime')}: ${this.t('bot.uptimeFormat', days, hours, minutes, seconds)}`,
                        `${this.t('bot.ping')}: ${Math.round(this.client.ws.ping)}ms`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: this.t('stats.title'),
                    value: [
                        `${this.t('stats.servers')}: ${this.client.guilds.cache.size}`,
                        `${this.t('stats.users')}: ${this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`,
                        `${this.t('stats.channels')}: ${this.client.channels.cache.size}`,
                        `${this.t('stats.tickets')}: ${this.client.tickets.getOpenTickets().length}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: this.t('system.title'),
                    value: [
                        `${this.t('system.nodejs')}: ${process.version}`,
                        `${this.t('system.discordjs')}: ${version}`,
                        `${this.t('system.os')}: ${os.platform()} ${os.release()}`,
                        `${this.t('system.cpu')}: ${os.cpus()[0].model}`,
                        `${this.t('system.ram')}: ${this.t('system.ramFormat', usedMemory, totalMemory)}`,
                        `${this.t('system.arch')}: ${os.arch()}`
                    ].join('\n'),
                    inline: false
                }
            ])
            .setFooter({ text: this.t('footer', 'discord.gg/support') })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
} 