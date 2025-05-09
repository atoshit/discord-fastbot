import { ActivityType } from 'discord.js';
import { CustomClient } from '../structures/CustomClient';
import { version } from '../../package.json';

export class PresenceManager {
    private client: CustomClient;
    private currentIndex: number = 0;
    private interval: NodeJS.Timeout | null = null;

    constructor(client: CustomClient) {
        this.client = client;
    }

    private t(key: string, ...args: any[]) {
        return this.client.locale.t(`presence.${key}`, undefined, ...args);
    }

    private formatUptime(): string {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor(uptime / 3600) % 24;
        const minutes = Math.floor(uptime / 60) % 60;
        return `${days}j ${hours}h ${minutes}m`;
    }

    private getNextPresence() {
        const presences = [
            {
                name: this.t('servers', this.client.guilds.cache.size),
                type: ActivityType.Watching
            },
            {
                name: this.t('members', this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
                type: ActivityType.Watching
            },
            {
                name: this.t('commands', this.client.commands.commands.size),
                type: ActivityType.Listening
            },
            {
                name: this.t('uptime', this.formatUptime()),
                type: ActivityType.Playing
            },
            {
                name: this.t('channels', this.client.channels.cache.size),
                type: ActivityType.Watching
            },
            {
                name: this.t('tickets', this.client.tickets.getOpenTickets().length),
                type: ActivityType.Watching
            },
            {
                name: this.t('version', version),
                type: ActivityType.Playing
            }
        ];

        this.currentIndex = (this.currentIndex + 1) % presences.length;
        return presences[this.currentIndex];
    }

    start() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        const presence = this.getNextPresence();
        this.client.user?.setPresence({
            activities: [presence],
            status: 'online'
        });

        this.interval = setInterval(() => {
            const presence = this.getNextPresence();
            this.client.user?.setPresence({
                activities: [presence],
                status: 'online'
            });
        }, 10000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
} 