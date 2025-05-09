import { Client as DiscordClient, ClientOptions } from 'discord.js';
import { CommandManager } from '../managers/CommandManager';
import { EventManager } from '../managers/EventManager';
import { MusicManager } from '../managers/MusicManager';
import { TicketManager } from '../managers/TicketManager';
import { CacheManager } from '../managers/CacheManager';
import { LocaleManager } from '../managers/LocaleManager';
import { DataManager } from '../managers/DataManager';

export class CustomClient extends DiscordClient {
    public commands: CommandManager;
    public events: EventManager;
    public music: MusicManager;
    public tickets: TicketManager;
    public cache: CacheManager;
    public locale: LocaleManager;
    public data: DataManager;

    constructor(options: ClientOptions) {
        super(options);
        this.locale = new LocaleManager();
        this.commands = new CommandManager(this);
        this.events = new EventManager(this);
        this.music = new MusicManager(this);
        this.tickets = new TicketManager(this);
        this.cache = new CacheManager();
        this.data = new DataManager();
    }

    private t(key: string, ...args: any[]) {
        return this.locale.t(`logs.startup.${key}`, undefined, ...args);
    }

    async start() {
        console.log('\x1b[33m%s\x1b[0m', this.t('starting'));
        
        try {
            console.log('\x1b[36m%s\x1b[0m', this.t('loadingCommands'));
            await this.commands.loadCommands();
            
            console.log('\x1b[36m%s\x1b[0m', this.t('loadingEvents'));
            await this.events.loadEvents();
            
            console.log('\x1b[36m%s\x1b[0m', this.t('connecting'));
            await this.login(process.env.TOKEN);

            console.log('\x1b[36m%s\x1b[0m', this.t('deployingCommands'));
            await this.commands.deployCommands();
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', this.t('error', error));
            process.exit(1);
        }
    }
} 