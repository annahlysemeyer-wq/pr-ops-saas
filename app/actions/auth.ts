'use server'

import { createClient } from '@/src/lib/supabase/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'

// Zod schema for signup input validation
const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine(
      (val) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov|us|state|city|county|municipal)\b/.test(val),
      {
        message: 'Must use a valid government email',
      }
    ),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  organization: z.string().min(1, 'Organization name is required'),
  department: z.string().optional(),
  ip: z.string().optional(), // For audit log
})

// Helper to slugify organization name
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Server action: signUp
export async function createAccount(formData: unknown) {
  // Validate input
  const parsed = signupSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' }
  }
  const { email, password, fullName, organization, department, ip } = parsed.data

  const supabase = createClient()

  // 1. Create Supabase Auth user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organization,
        department: department || null,
      },
    },
  })

  if (signUpError) {
    return { success: false, error: signUpError.message }
  }

  const user = signUpData.user
  if (!user) {
    return { success: false, error: 'Signup failed. Please check your email for confirmation.' }
  }

  // 2. Create organization record
  const orgSlug = slugify(organization)
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert([
      {
        name: organization,
        slug: orgSlug,
        // Optionally: created_by: user.id
      },
    ])
    .select()
    .single()

  if (orgError) {
    // Rollback: delete user if org creation fails
    await supabase.auth.admin.deleteUser(user.id)
    return { success: false, error: 'Failed to create organization: ' + orgError.message }
  }

  // 3. Create profile record
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        email,
        full_name: fullName,
        department: department || null,
        organization_id: orgData.id,
        role: 'admin', // First user is admin
      },
    ])

  if (profileError) {
    // Rollback: delete user and org if profile creation fails
    await supabase.from('organizations').delete().eq('id', orgData.id)
    await supabase.auth.admin.deleteUser(user.id)
    return { success: false, error: 'Failed to create user profile: ' + profileError.message }
  }

  // 4. Add audit log entry (SOC 2)
  const { error: auditError } = await supabase
    .from('audit_logs')
    .insert([
      {
        id: randomUUID(),
        user_id: user.id,
        action: 'signup',
        table: 'auth',
        record_id: user.id,
        description: `User signed up with email ${email}`,
        ip_address: ip || null,
        created_at: new Date().toISOString(),
      },
    ])

  // Do not fail signup if audit log fails, but log error
  if (auditError) {
    // Optionally: send to error monitoring
    // console.error('Audit log error:', auditError)
  }

  return { success: true, message: 'Signup successful. Please check your email to verify your account.' }
}

// Placeholder for signIn action (to be implemented)
export async function signIn(formData: unknown) {
  return { success: false, error: 'Not implemented yet' }
}

// Placeholder for signOut action (to be implemented)
export async function signOut() {
  return { success: false, error: 'Not implemented yet' }
}
