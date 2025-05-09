import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export class DataManager {
    private dataPath: string;

    constructor() {
        this.dataPath = join(__dirname, '..', 'data');
    }

    async getData<T>(file: string): Promise<T> {
        const path = join(this.dataPath, `${file}.json`);
        try {
            const data = await readFile(path, 'utf-8');
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Erreur lors de la lecture du fichier ${file}:`, error);
            throw error;
        }
    }

    async saveData<T>(file: string, data: T): Promise<void> {
        const path = join(this.dataPath, `${file}.json`);
        try {
            await writeFile(path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Erreur lors de l'écriture du fichier ${file}:`, error);
            throw error;
        }
    }

    async updateData<T>(file: string, updateFn: (data: T) => T): Promise<void> {
        const data = await this.getData<T>(file);
        const updatedData = updateFn(data);
        await this.saveData(file, updatedData);
    }
} 