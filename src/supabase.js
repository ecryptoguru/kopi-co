import { createClient } from '@supabase/supabase-js'

// The publishable key is intentionally safe for browser delivery; database access is enforced by RLS.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://hzgivgufbbrsoasnlnfu.supabase.co'
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_l1BbX9hDQmzw1HsWGQR86A_JpKA-Zf3'

export const supabase = createClient(url, publishableKey)
