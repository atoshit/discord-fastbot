import { Collection } from 'discord.js';
import { BlacklistEntry } from '../interfaces/Blacklist';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { WhitelistedRole } from '../interfaces/WhitelistedRole';

export class CacheManager {
    private cache: Map<string, any>;
    private blacklist: Collection<string, BlacklistEntry>;
    private readonly dataPath: string;
    private whitelistedRoles: Collection<string, WhitelistedRole>;

    constructor() {
        this.cache = new Map();
        this.blacklist = new Collection();
        this.dataPath = join(__dirname, '..', '..', 'data');
        this.whitelistedRoles = new Collection();
        this.loadCache();
    }

    private loadCache(): void {
        this.loadBlacklist();
        this.loadWhitelistedRoles();
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

    private loadWhitelistedRoles(): void {
        const filePath = join(this.dataPath, 'whitelisted-roles.json');

        try {
            if (!existsSync(filePath)) {
                writeFileSync(filePath, '[]', 'utf-8');
                return;
            }

            const data = readFileSync(filePath, 'utf-8');
            const roles = JSON.parse(data);

            if (Array.isArray(roles)) {
                for (const role of roles) {
                    if (this.isValidWhitelistedRole(role)) {
                        const key = `${role.guildId}-${role.roleId}`;
                        this.whitelistedRoles.set(key, role);
                    }
                }
            }

            console.log(`📝 Cache rôles whitelistés chargé : ${this.whitelistedRoles.size} entrée(s)`);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des rôles whitelistés:', error);
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

    private isValidWhitelistedRole(role: any): role is WhitelistedRole {
        return (
            typeof role === 'object' &&
            typeof role.roleId === 'string' &&
            typeof role.guildId === 'string' &&
            Array.isArray(role.allowedCommands) &&
            typeof role.addedBy === 'string' &&
            typeof role.addedAt === 'number'
        );
    }

    saveCache(): void {
        this.saveBlacklist();
        this.saveWhitelistedRoles();
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

    private saveWhitelistedRoles(): void {
        const filePath = join(this.dataPath, 'whitelisted-roles.json');
        try {
            const data = JSON.stringify(Array.from(this.whitelistedRoles.values()), null, 2);
            writeFileSync(filePath, data, 'utf-8');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde des rôles whitelistés:', error);
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

    addWhitelistedRole(roleId: string, guildId: string, allowedCommands: string[], addedBy: string): void {
        const key = `${guildId}-${roleId}`;
        this.whitelistedRoles.set(key, {
            roleId,
            guildId,
            allowedCommands,
            addedBy,
            addedAt: Date.now()
        });
    }

    removeWhitelistedRole(roleId: string, guildId: string): boolean {
        const key = `${guildId}-${roleId}`;
        return this.whitelistedRoles.delete(key);
    }

    updateWhitelistedRoleCommands(roleId: string, guildId: string, allowedCommands: string[]): boolean {
        const key = `${guildId}-${roleId}`;
        const role = this.whitelistedRoles.get(key);
        if (role) {
            role.allowedCommands = allowedCommands;
            this.whitelistedRoles.set(key, role);
            return true;
        }
        return false;
    }

    isCommandAllowedForRole(roleId: string, guildId: string, commandName: string): boolean {
        const key = `${guildId}-${roleId}`;
        const role = this.whitelistedRoles.get(key);
        return role?.allowedCommands.includes(commandName) ?? false;
    }

    getWhitelistedRole(roleId: string, guildId: string): WhitelistedRole | undefined {
        const key = `${guildId}-${roleId}`;
        return this.whitelistedRoles.get(key);
    }

    getAllWhitelistedRoles(guildId: string): Collection<string, WhitelistedRole> {
        return this.whitelistedRoles.filter(role => role.guildId === guildId);
    }
} 