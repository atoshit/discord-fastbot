import { Client as DiscordClient } from 'discord.js';
import { CommandManager } from '../managers/CommandManager';
import { EventManager } from '../managers/EventManager';
import { MusicManager } from '../managers/MusicManager';
import { TicketManager } from '../managers/TicketManager';
import { CacheManager } from '../managers/CacheManager';
import { LocaleManager } from '../managers/LocaleManager';
import { DataManager } from '../managers/DataManager';

declare module 'discord.js' {
    export interface Client {
        commands: CommandManager;
        events: EventManager;
        music: MusicManager;
        tickets: TicketManager;
        cache: CacheManager;
        locale: LocaleManager;
        data: DataManager;
    }
} 