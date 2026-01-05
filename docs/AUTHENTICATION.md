
# 🔐 Système d'Authentification Novadis

## Vue d'ensemble
Le système d'authentification de l'application Compte Rendu d'Intervention (CRI) Novadis est conçu pour sécuriser l'accès aux employés internes. Il utilise une approche sans mot de passe (Passwordless) avec vérification par email et code à 6 chiffres.

## Architecture

### Base de Données (Supabase)
Deux tables principales gèrent la sécurité :
1. **`authorized_users`**: Liste blanche des employés autorisés.
   - Si un email n'est pas dans cette table, la connexion est refusée.
   - Les comptes peuvent être désactivés via le champ `is_active`.
2. **`login_logs`**: Trace toutes les tentatives de connexion (réussies ou échouées) pour audit.

### Flux de Connexion
1. **Saisie de l'Email**: L'utilisateur entre son email professionnel.
2. **Vérification**: 
   - L'application vérifie si l'email existe dans `authorized_users`.
   - Si "Oui" et `is_active=true`, un code est généré.
3. **Code de Vérification**:
   - Un code à 6 chiffres est généré (affiché à l'écran pour le MVP, par email en Prod).
   - Validité : 10 minutes.
4. **Validation**:
   - L'utilisateur entre le code.
   - 3 tentatives incorrectes bloquent le compte temporairement (15 min).
5. **Session**:
   - Une session persistante de 7 jours est stockée localement.

## Sécurité
- **Pas de mot de passe stocké**: Élimine les risques de vol de mot de passe.
- **Row Level Security (RLS)**: Activé sur Supabase pour protéger les données.
- **Rate Limiting**: Empêche les attaques par force brute sur le code.
- **Variables d'Environnement**: Clés API stockées dans `.env`.

## Instructions Développeur
Pour ajouter un nouvel utilisateur autorisé, utilisez l'écran Admin dans l'application ou exécutez une requête SQL sur Supabase :
```sql
INSERT INTO authorized_users (email, full_name, department)
VALUES ('nouveau.employe@novadis.com', 'Nom Prénom', 'Service');
```
