import { Collection } from 'discord.js';
import { BlacklistEntry } from '../interfaces/Blacklist';
import { CustomClient } from '../structures/CustomClient';

export class BlacklistManager {
    constructor(private client: CustomClient) {}

    addToBlacklist(userId: string, authorId: string, reason: string): void {
        this.client.cache.addBlacklistEntry(userId, authorId, reason);
    }

    removeFromBlacklist(userId: string): boolean {
        return this.client.cache.removeBlacklistEntry(userId);
    }

    isBlacklisted(userId: string): boolean {
        return this.client.cache.isBlacklisted(userId);
    }

    incrementRejoinAttempts(userId: string): void {
        this.client.cache.incrementBlacklistRejoinAttempts(userId);
    }

    getBlacklistEntry(userId: string): BlacklistEntry | undefined {
        return this.client.cache.getBlacklistEntry(userId);
    }

    getAllEntries(): Collection<string, BlacklistEntry> {
        return this.client.cache.getAllBlacklistEntries();
    }
} 