import { Collection } from 'discord.js';
import { BlacklistEntry } from '../interfaces/Blacklist';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export class CacheManager {
    private cache: Map<string, any>;
    private blacklist: Collection<string, BlacklistEntry>;
    private readonly dataPath: string;

    constructor() {
        this.cache = new Map();
        this.blacklist = new Collection();
        this.dataPath = join(__dirname, '..', '..', 'data');
        this.loadCache();
    }

    private loadCache(): void {
        this.loadBlacklist();
    }

    private loadBlacklist(): void {
        const filePath = join(this.dataPath, 'blacklist.json');

        try {
            if (!existsSync(this.dataPath)) {
                mkdirSync(this.dataPath, { recursive: true });
            }

            if (!existsSync(filePath)) {
                writeFileSync(filePath, '[]', 'utf-8');
                return;
            }

            const data = readFileSync(filePath, 'utf-8');
            const entries = JSON.parse(data);

            if (Array.isArray(entries)) {
                for (const entry of entries) {
                    if (this.isValidBlacklistEntry(entry)) {
                        this.blacklist.set(entry.userId, entry);
                    }
                }
            }

            console.log(`📝 Cache blacklist chargé : ${this.blacklist.size} entrée(s)`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement du cache blacklist:', error);
        }
    }

    private isValidBlacklistEntry(entry: any): entry is BlacklistEntry {
        return (
            typeof entry === 'object' &&
            typeof entry.userId === 'string' &&
            typeof entry.authorId === 'string' &&
            typeof entry.reason === 'string' &&
            typeof entry.date === 'number' &&
            typeof entry.rejoinAttempts === 'number'
        );
    }

    saveCache(): void {
        this.saveBlacklist();
    }

    private saveBlacklist(): void {
        const filePath = join(this.dataPath, 'blacklist.json');
        try {
            const data = JSON.stringify(Array.from(this.blacklist.values()), null, 2);
            writeFileSync(filePath, data, 'utf-8');
            console.log('💾 Cache blacklist sauvegardé');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde du cache blacklist:', error);
        }
    }

    addBlacklistEntry(userId: string, authorId: string, reason: string): void {
        this.blacklist.set(userId, {
            userId,
            authorId,
            reason,
            date: Date.now(),
            rejoinAttempts: 0
        });
    }

    removeBlacklistEntry(userId: string): boolean {
        return this.blacklist.delete(userId);
    }

    isBlacklisted(userId: string): boolean {
        return this.blacklist.has(userId);
    }

    getBlacklistEntry(userId: string): BlacklistEntry | undefined {
        return this.blacklist.get(userId);
    }

    getAllBlacklistEntries(): Collection<string, BlacklistEntry> {
        return this.blacklist;
    }

    incrementBlacklistRejoinAttempts(userId: string): void {
        const entry = this.blacklist.get(userId);
        if (entry) {
            entry.rejoinAttempts++;
            this.blacklist.set(userId, entry);
        }
    }

    set(key: string, value: any) {
        this.cache.set(key, value);
    }

    get(key: string) {
        return this.cache.get(key);
    }

    delete(key: string) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
} 