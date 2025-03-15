import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY')
}

// Create a Supabase client with the service role key for admin operations
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper functions

export async function getUserById(id: string) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return user
}

export async function getUserByEmail(email: string) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return user
}

export async function updateUser(id: string, data: Partial<Database['public']['Tables']['users']['Update']>) {
  const { error } = await supabaseAdmin
    .from('users')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

export async function createUser(data: Database['public']['Tables']['users']['Insert']) {
  const { error } = await supabaseAdmin
    .from('users')
    .insert(data)

  if (error) throw error
}

export async function deleteUser(id: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id)

  if (error) throw error
}
