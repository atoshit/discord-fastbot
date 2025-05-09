import { Client } from '../structures/Client';
import { readdirSync } from 'fs';
import { join } from 'path';

export class EventManager {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async loadEvents() {
        const eventsPath = join(__dirname, '..', 'events');
        const eventFolders = readdirSync(eventsPath);

        for (const folder of eventFolders) {
            const folderPath = join(eventsPath, folder);
            const eventFiles = readdirSync(folderPath).filter(file => file.endsWith('.ts'));

            for (const file of eventFiles) {
                const filePath = join(folderPath, file);
                const event = (await import(filePath)).default;

                if (event.once) {
                    this.client.once(event.name, (...args) => event.execute(...args, this.client));
                } else {
                    this.client.on(event.name, (...args) => event.execute(...args, this.client));
                }

                console.log(`📝 Événement chargé : ${file}`);
            }
        }
        console.log('\x1b[33m%s\x1b[0m', '✨ Tous les événements ont été chargés !');
    }
} 