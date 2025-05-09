import 'dotenv/config';
import { Client } from './structures/Client';
import { config } from './config';

const client = new Client();
client.start(); 