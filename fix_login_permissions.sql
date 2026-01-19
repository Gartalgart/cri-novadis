-- ACTIVEZ CES POLITIQUES DANS L'ÉDITEUR SQL SUPABASE

-- 1. Réparer les logs de connexion (Erreur 401)
-- Permettre à tout le monde (y compris les utilisateurs non connectés) d'insérer des logs
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for authentication" ON public.login_logs;
DROP POLICY IF EXISTS "Enable insert for all" ON public.login_logs;

CREATE POLICY "Enable insert for all" 
ON public.login_logs 
FOR INSERT 
WITH CHECK (true);

-- 2. Réparer la mise à jour de la date de connexion (Erreur 401/403 ou 204 vide)
-- Permettre la mise à jour de la table authorized_users
DROP POLICY IF EXISTS "Enable update for all" ON public.authorized_users;

CREATE POLICY "Enable update for all" 
ON public.authorized_users 
FOR UPDATE 
USING (true);

-- 3. Vérifier les lecture (déjà OK normalement mais au cas où)
DROP POLICY IF EXISTS "Enable read for all" ON public.authorized_users;
CREATE POLICY "Enable read for all" 
ON public.authorized_users 
FOR SELECT 
USING (true);
