
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { nome, email, senha } = await req.json()

    console.log('Creating user with email:', email)

    // Create user using admin client
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: senha,
      user_metadata: { nome: nome.trim() },
      email_confirm: true
    })

    if (userError) {
      console.error('Error creating user:', userError)
      return new Response(
        JSON.stringify({ error: userError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('User created successfully:', userData.user?.id)

    // The user profile and role should be created automatically by the handle_new_user trigger
    // Let's verify by fetching the profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    if (profileError) {
      console.error('Profile not found or error:', profileError)
    } else {
      console.log('Profile created:', profileData)
    }

    // Also check if role was created
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    if (roleError) {
      console.error('Role not found or error:', roleError)
    } else {
      console.log('Role created:', roleData)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: userData.user,
        profile: profileData,
        role: roleData
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Exception in create-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
