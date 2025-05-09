COMMANDES DU BOT DISCORD
=======================

INSTALLATION
-----------
- Installation des dépendances : npm install
- Installation globale de PM2 : npm install -g pm2

DÉVELOPPEMENT
------------
- Lancer en mode dev : npm run dev
- Compiler en temps réel : npm run watch
- Vérifier le code : npm run lint
- Formater le code : npm run format

PRODUCTION
----------
- Compiler : npm run build
- Démarrer : npm start
- Démarrer avec PM2 : pm2 start dist/index.js --name discord-bot
- Redémarrer : pm2 restart discord-bot
- Voir les logs : pm2 logs discord-bot
- Arrêter : pm2 stop discord-bot

MISE À JOUR
-----------
1. Arrêter : pm2 stop discord-bot
2. Mettre à jour : git pull
3. Dépendances : npm install
4. Compiler : npm run build
5. Redémarrer : pm2 restart discord-bot

COMMANDES PM2
------------
- Liste des processus : pm2 list
- Monitorer : pm2 monit
- Logs détaillés : pm2 logs discord-bot --lines 100
- Nettoyer logs : pm2 flush
- Sauvegarder processus : pm2 save
- Supprimer bot : pm2 delete discord-bot

RÉSOLUTION PROBLÈMES
-------------------
Si le bot ne démarre pas :
1. Vérifier .env
2. Vérifier logs : pm2 logs
3. Recompiler : npm run build
4. Réinstaller : npm install

Si erreurs après mise à jour :
1. Supprimer node_modules
2. Supprimer dist
3. npm install
4. npm run build 