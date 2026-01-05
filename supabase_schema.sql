-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: authorized_users
CREATE TABLE IF NOT EXISTS public.authorized_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index for authorized_users
CREATE INDEX IF NOT EXISTS idx_authorized_users_email ON public.authorized_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.authorized_users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can check if email is authorized (needed for login check)
-- Note: In a stricter environment, you might use a stored procedure with security definer to hiding the table,
-- but the requirement specifies this policy.
CREATE POLICY "Anyone can check if email is authorized" 
ON public.authorized_users 
FOR SELECT 
USING (true);

-- Sample Data for authorized_users
INSERT INTO public.authorized_users (email, full_name, department)
VALUES 
    ('rdenimal@novadis.com', 'Denimal R.', 'Technique'),
    ('admin@novadis.com', 'Administrator', 'IT')
ON CONFLICT (email) DO NOTHING;

-- Table: login_logs
CREATE TABLE IF NOT EXISTS public.login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for login_logs
CREATE INDEX IF NOT EXISTS idx_login_logs_email ON public.login_logs(email);
CREATE INDEX IF NOT EXISTS idx_login_logs_created_at ON public.login_logs(created_at);

-- Enable RLS for logs (Good practice, though specific policy not requested, we allow insert for anon)
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert logs (needed for login attempts)
CREATE POLICY "Enable insert for authentication" 
ON public.login_logs 
FOR INSERT 
WITH CHECK (true);

-- Policy: Only authenticated users (admins) implies viewing, but we'll leave strict read policies for now 
-- as specific read access wasn't requested in the prompt's SQL section.
