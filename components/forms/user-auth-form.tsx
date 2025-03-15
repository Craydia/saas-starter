"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/shared/icons"
import { supabase } from "@/lib/supabase"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      if (type === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email.toLowerCase(),
          password: data.password,
        })

        if (signUpError) throw signUpError

        toast({
          title: "Signup Complete!",
          description: "Please check your email to verify your account.",
        })
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email.toLowerCase(),
          password: data.password,
        })

        if (signInError) throw signInError

        router.push('/dashboard')
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.message || "Your authentication request failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setIsGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.message || "Your Google sign in request failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
            />
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              placeholder="your-password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("password")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {type === "register"
              ? "Sign Up with Email"
              : "Sign In with Email"
            }
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}{" "}
        Google
      </button>
      {type !== "register" && <p className="text-muted-foreground px-8 text-center text-sm">
        <Link
          href="/register"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </p>}
    </div>
  )
}
