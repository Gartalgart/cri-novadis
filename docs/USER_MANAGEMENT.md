
# 👥 Gestion des Utilisateurs

## Ajouter un Utilisateur
Il existe deux méthodes pour autoriser un nouvel employé :

### 1. Via l'Application (Recommandé)
Un administrateur peut accéder à l'interface de gestion via le bouton caché ou la route directe (voir documentation technique).
1. Cliquez sur le bouton "+"
2. Remplissez l'email, le nom, et le service.
3. Validez.

### 2. Via Supabase (SQL)
Exécutez la requête suivante dans l'éditeur SQL de Supabase :

```sql
INSERT INTO public.authorized_users (email, full_name, department)
VALUES 
    ('email@novadis.com', 'Nom Complet', 'Département');
```

## Désactiver un Utilisateur
Pour révoquer un accès sans supprimer l'historique :
passer le champ `is_active` à `false`.

```sql
UPDATE public.authorized_users 
SET is_active = false 
WHERE email = 'email@novadis.com';
```

## Supprimer un Utilisateur
**Attention :** Cette action est définitive.

```sql
DELETE FROM public.authorized_users 
WHERE email = 'email@novadis.com';
```
