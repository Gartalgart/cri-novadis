
import 'dotenv/config'; // Load environment variables from .env
import { supabase } from './supabase.js';

async function testConnection() {
    try {
        console.log('🔌 Test de connexion à Supabase...');

        // Verify if environment variables are loaded
        if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
            console.error('❌ EXPO_PUBLIC_SUPABASE_URL non défini. Assurez-vous que le fichier .env existe à la racine.');
            return;
        }

        const { data, error } = await supabase
            .from('authorized_users')
            .select('*');

        if (error) {
            console.error('❌ Erreur Supabase:', error.message);
            return;
        }

        console.log('✅ Connexion réussie !');
        console.log(`👥 ${data.length} utilisateurs trouvés.`);
        console.table(data);

    } catch (err) {
        console.error('❌ Erreur inattendue:', err.message);
    }
}

testConnection();
