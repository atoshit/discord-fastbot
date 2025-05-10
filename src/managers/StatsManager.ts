import { Collection } from 'discord.js';
import { UserStats } from '../interfaces/UserStats';
import { formatDuration } from '../utils/formatters';

export class StatsManager {
    private stats: Collection<string, UserStats>;
    private voiceStates: Collection<string, number>; // Pour stocker les timestamps de début

    constructor() {
        this.stats = new Collection();
        this.voiceStates = new Collection();
    }

    private getKey(userId: string, guildId: string): string {
        return `${guildId}-${userId}`;
    }

    private getOrCreateStats(userId: string, guildId: string): UserStats {
        const key = this.getKey(userId, guildId);
        let stats = this.stats.get(key);

        if (!stats) {
            stats = {
                userId,
                guildId,
                messageCount: 0,
                voiceTime: 0,
                ticketsCreated: 0,
                ticketsHandled: 0
            };
            this.stats.set(key, stats);
        }

        return stats;
    }

    incrementMessages(userId: string, guildId: string): void {
        const stats = this.getOrCreateStats(userId, guildId);
        stats.messageCount++;
    }

    getStats(userId: string, guildId: string): UserStats {
        return this.getOrCreateStats(userId, guildId);
    }

    startVoiceTracking(userId: string, guildId: string): void {
        const key = this.getKey(userId, guildId);
        this.voiceStates.set(key, Date.now());
    }

    stopVoiceTracking(userId: string, guildId: string): void {
        const key = this.getKey(userId, guildId);
        const startTime = this.voiceStates.get(key);
        
        if (startTime) {
            const duration = Date.now() - startTime;
            const stats = this.getOrCreateStats(userId, guildId);
            stats.voiceTime += duration;
            this.voiceStates.delete(key);
        }
    }

    getFormattedVoiceTime(userId: string, guildId: string): string {
        const stats = this.getStats(userId, guildId);
        return formatDuration(stats.voiceTime);
    }
} 