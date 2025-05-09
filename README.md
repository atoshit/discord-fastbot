# 🛠️ **Cahier des charges**

## 🔓 **Commandes accessibles à tous les utilisateurs**

- **/help**  
  Affiche une documentation complète (embed) expliquant toutes les fonctionnalités du bot et les commandes disponibles.

- **/info**  
  Renvoie un embed avec toutes les informations du bot :  
  **Uptime**, **ping**, **nombre de tickets ouverts**, **nombre de salons**, **membres**, **rôles**, **créateur du bot**, **version de Node.js**, **version de Discord.js**, **version du bot**, **ressources système**, etc.

- **/play**  
  Fait rejoindre un salon vocal au bot et lance une musique.

- **/stop**  
  Déconnecte le bot du salon vocal et arrête la musique.

- **/break**  
  Met la musique en pause sans déconnecter le bot.

- **/skip**  
  Passe à la prochaine musique dans la file d’attente.

- **/myinfo**  
  Affiche des informations sur l’utilisateur :  
  **Nombre de messages envoyés**, **heures passées en vocal**, **date d’arrivée sur le serveur**, **avatar**, **nom**, **statut owner**, **tickets créés/pris**.

- **/leaderboard**  
  Classement des membres les plus actifs du serveur (messages, vocaux, tickets...).

- **/remind**  
  Permet de se créer un rappel personnel ou pour un autre utilisateur (ex: "dans 1h", "demain à 20h").

---

## 🔐 **Commandes réservées aux owners du bot**

- **/bl**  
  Blacklist un utilisateur (ban permanent, auto-reban s’il rejoint à nouveau).

- **/unbl**  
  Retire un utilisateur de la blacklist.

- **/bllist**  
  Affiche la liste des blacklistés avec :  
  **Qui a blacklist**, **date**, **tentatives de retour**, etc.

- **/setup-panel**  
  Crée un **panel de ticket** configurable :  
  **Rôles autorisés**, **catégories de tickets**, **contenu et image de l’embed**, **boutons**...

- **/logs**  
  Gère tous les types de logs et leurs canaux d’envoi (ou canal par défaut défini dans la config).

- **/wlroles**  
  Whitelist un rôle staff avec gestion des permissions spécifiques au bot.

---

## ⚙️ **Commandes accessibles aux rôles whitelists (staff)**

- **/warn**  
  Ajoute un avertissement à un utilisateur.

- **/warns**  
  Affiche et permet de supprimer les warns (par l’émetteur ou un owner).

- **/warnslist**  
  Liste complète des warns avec pagination dans un embed.

- **/mute**  
  Mute un utilisateur dans tous les salons textuels et vocaux.

- **/unmute**  
  Demute un utilisateur (par le muteur ou un owner uniquement).

- **/dm**  
  Envoie un message privé via le bot à un utilisateur.

- **/embed**  
  Permet d’envoyer un embed personnalisé via le bot.

- **/domains**  
  Gère les liens autorisés pour l’anti-lien (ajout/suppression).

- **/antispam**  
  Active ou désactive le système antispam du bot.

- **/clean**  
  Supprime et recrée le salon avec les mêmes permissions.

- **/lock**  
  Bloque un salon pour tous sauf les utilisateurs autorisés.

---

## 🎫 **Commandes disponibles dans les salons de ticket**

- **/close**  
  Ferme le ticket.

- **/rename**  
  Renomme le salon du ticket.

- **/add**  
  Ajoute un utilisateur au ticket.

- **/remove**  
  Retire un utilisateur du ticket.

- **/recall**  
  Envoie un message privé à l’auteur du ticket pour lui rappeler de répondre.

---

## 🔧 **Systèmes intégrés**

### 🎟️ **Système de ticket avancé**
- Ouverture via panel avec **modal** pour entrer la raison.
- Création automatique du salon avec embed de gestion.
- Boutons intégrés : **Prendre en charge**, **Renommer**, **Fermer**.
- **Fermeture automatique** pour inactivité.
- Message privé avec **transcript** et **notation par étoiles** à la fermeture.
- Historique complet des tickets.

### 📊 **Statistiques de support**
- Calcul du **temps moyen de prise en charge**.
- **Note moyenne** laissée par les utilisateurs.
- **Leaderboard des staffs** les plus actifs et les mieux notés.

### 🌍 **Système multilingue (locale)**
- Fichiers de traduction personnalisables.
- Choix de la langue dans la configuration.

### ⚡ **Système de cache optimisé**
- Chargement des données en mémoire au lancement.
- Sauvegarde dans les fichiers `.json` à l’arrêt du bot.

### 🔖 **Système de tags**
- Messages pré-enregistrés pouvant être envoyés via une commande rapide.

### 💡 **Système de suggestions**
- Les membres peuvent proposer des idées.
- Statut : **Acceptée**, **Refusée**, **En cours**.
- Système de votes intégré.

### 🆘 **Système "Besoin d’Aide" (BDA)**
- Création automatique d’un salon privé quand un utilisateur entre dans un salon d’attente.
- Il est automatiquement déplacé.
- Les staffs peuvent rejoindre ces salons.
- Le salon est supprimé automatiquement quand il devient vide.

### 👋 **Système de bienvenue**
- Envoie automatique d’un message de bienvenue personnalisé :
  - Dans un salon spécifique ou en message privé.
  - Avec image/texte personnalisable.
  - Peut afficher les règles ou infos utiles pour les nouveaux membres.

---

## ✅ **Autres idées intégrées**

- **Commandes contextuelles Discord (clic droit)** pour actions rapides (mute, warn, dm...).
- **Système d'annonces planifiées** : messages automatiques à horaires définis.
- **Système de parrainage** : suivi des membres invités et leaderboard des meilleurs recruteurs.
