import { Client as DiscordClient, Collection, IntentsBitField } from 'discord.js';
import { CommandManager } from '../managers/CommandManager';
import { EventManager } from '../managers/EventManager';
import { MusicManager } from '../managers/MusicManager';
import { TicketManager } from '../managers/TicketManager';
import { CacheManager } from '../managers/CacheManager';
import { LocaleManager } from '../managers/LocaleManager';
import { DataManager } from '../managers/DataManager';

export class Client extends DiscordClient {
    public commands: CommandManager;
    public events: EventManager;
    public music: MusicManager;
    public tickets: TicketManager;
    public cache: CacheManager;
    public locale: LocaleManager;
    public data: DataManager;

    constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildMembers,
                // ... autres intents nécessaires
            ]
        });

        this.commands = new CommandManager(this);
        this.events = new EventManager(this);
        this.music = new MusicManager(this);
        this.tickets = new TicketManager(this);
        this.cache = new CacheManager();
        this.locale = new LocaleManager();
        this.data = new DataManager();
    }

    async start() {
        console.log('\x1b[33m%s\x1b[0m', '🔄 Démarrage du bot...');
        
        try {
            console.log('\x1b[36m%s\x1b[0m', '📝 Chargement des commandes...');
            await this.commands.loadCommands();
            
            console.log('\x1b[36m%s\x1b[0m', '📝 Chargement des événements...');
            await this.events.loadEvents();
            
            console.log('\x1b[36m%s\x1b[0m', '🔑 Connexion à Discord...');
            await this.login(process.env.TOKEN);
        } catch (error) {
            console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors du démarrage :', error);
            process.exit(1);
        }
    }
} 