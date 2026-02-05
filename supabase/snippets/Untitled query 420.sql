CREATE TABLE IF NOT EXISTS public.staff_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES public.tables(id) ON DELETE CASCADE,
    note TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER PUBLICATION supabase_realtime ADD TABLE staff_calls;