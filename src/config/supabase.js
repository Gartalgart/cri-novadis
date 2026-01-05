
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Variables Supabase manquantes ou non chargées via Expo.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

console.log('✅ Supabase client créé');