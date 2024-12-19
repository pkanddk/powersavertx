import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get alerts older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error } = await supabaseClient
      .from('user_plan_tracking')
      .update({ active: false })
      .lt('created_at', thirtyDaysAgo.toISOString())
      .eq('active', true)

    if (error) throw error

    return new Response(
      JSON.stringify({ message: 'Successfully cleaned up old alerts' }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})