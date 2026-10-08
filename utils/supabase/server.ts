import { createServerClient } from '@supabase/ssr';

export function createClient(cookieStore?: any) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://dgygaxatbjzjeumlvlgj.supabase.co';

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_z1i6DsLPE4O-UAqG4_XFxQ_h3X26SwJ';

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore?.getAll ? cookieStore.getAll() : [];
      },
      setAll(cookiesToSet) {
        try {
          if (cookieStore?.set) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          }
        } catch {
          // Can be ignored if handled by middleware refreshing user sessions.
        }
      },
    },
  });
}
