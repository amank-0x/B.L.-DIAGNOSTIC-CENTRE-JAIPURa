import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    'https://dgygaxatbjzjeumlvlgj.supabase.co';

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
    'sb_publishable_z1i6DsLPE4O-UAqG4_XFxQ_h3X26SwJ';

  return createBrowserClient(supabaseUrl, supabaseKey);
}
