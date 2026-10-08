import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: any, response?: any) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://dgygaxatbjzjeumlvlgj.supabase.co';

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_z1i6DsLPE4O-UAqG4_XFxQ_h3X26SwJ';

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request?.cookies?.getAll ? request.cookies.getAll() : [];
      },
      setAll(cookiesToSet) {
        if (request?.cookies?.set) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
        }
        if (response?.cookies?.set) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      },
    },
  });

  // refreshing the auth token
  const user = await supabase.auth.getUser();

  return { supabase, user, response };
}
