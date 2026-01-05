
# 🛡️ Manuel de Sécurité Novadis CRI

## Bonnes Pratiques

### 1. Gestion des Clés API
- Ne jamais committer le fichier `.env` sur Git.
- Utiliser les variables d'environnement pour `SUPABASE_URL` et `ANON_KEY`.
- La clé `ANON_KEY` est publique (client-side) mais la `SERVICE_ROLE_KEY` ne doit **jamais** être utilisée dans l'application mobile.

### 2. Row Level Security (RLS)
La sécurité des données repose sur RLS dans Postgres.
- **authorized_users** : `SELECT` ouvert (pour vérifier l'auth), `INSERT/UPDATE/DELETE` restreint.
- **login_logs** : `INSERT` ouvert (pour logger les tentatives), `SELECT` restreint aux admins.

### 3. Session Management
- Les sessions sont stockées dans `AsyncStorage` du téléphone sécurisé.
- Une expiration de 7 jours est forcée par l'application pour obliger une ré-authentification périodique.

### 4. Protection contre les Attaques
- **Brute Force** : Le système bloque l'utilisateur pendant 15 minutes après 3 tentatives de code erroné.
- **Usurpation** : Seuls les emails explicitement whitelistés peuvent initier une connexion.

## Audit
Consultez régulièrement la table `login_logs` pour détecter :
- Des pics de tentatives échouées (attaque potentielle).
- Des tentatives de connexion depuis des emails inconnus.
