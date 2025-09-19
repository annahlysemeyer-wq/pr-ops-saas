'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAccount } from '@/app/actions/auth'

const passwordRequirements = [
  'At least 12 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 number',
]

const signupSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(12, { message: 'Password must be at least 12 characters' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Must include at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Must include at least one number' }),
  organization: z
    .string()
    .min(3, { message: 'Organization name must be at least 3 characters' })
    .max(100, { message: 'Organization name must be at most 100 characters' }),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  department: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null)
    setSuccessMessage(null)
    const res = await createAccount({
      email: data.email,
      password: data.password,
      organization: data.organization,
      fullName: data.fullName,
      department: data.department,
    })
    if (res.success) {
      setSuccessMessage(res.message || 'Signup successful. Please check your email to verify your account.')
      reset()
    } else {
      setServerError(res.error || 'An error occurred. Please try again.')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? 'border-danger' : 'border-gray-300'
          } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-danger text-xs">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className={`mt-1 block w-full rounded-md border ${
            errors.password ? 'border-danger' : 'border-gray-300'
          } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          disabled={isSubmitting}
        />
        <ul className="mt-2 text-xs text-gray-500 space-y-1">
          {passwordRequirements.map((req, i) => (
            <li key={i} className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
              {req}
            </li>
          ))}
        </ul>
        {errors.password && (
          <p className="mt-1 text-danger text-xs">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
          Organization Name
        </label>
        <input
          id="organization"
          type="text"
          autoComplete="organization"
          {...register('organization')}
          className={`mt-1 block w-full rounded-md border ${
            errors.organization ? 'border-danger' : 'border-gray-300'
          } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          disabled={isSubmitting}
        />
        {errors.organization && (
          <p className="mt-1 text-danger text-xs">{errors.organization.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          {...register('fullName')}
          className={`mt-1 block w-full rounded-md border ${
            errors.fullName ? 'border-danger' : 'border-gray-300'
          } shadow-sm focus:border-primary focus:ring-primary sm:text-sm`}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="mt-1 text-danger text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="department"
          type="text"
          autoComplete="organization-unit"
          {...register('department')}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          disabled={isSubmitting}
        />
        {errors.department && (
          <p className="mt-1 text-danger text-xs">{errors.department.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded bg-danger/10 border border-danger text-danger px-4 py-2 text-sm">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="rounded bg-success/10 border border-success text-success px-4 py-2 text-sm">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        ) : null}
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
