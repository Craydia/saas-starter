import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const user = await req.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: user.email.toLowerCase(),
      password: user.password,
      options: {
        data: {
          name: user.name,
        }
      }
    })

    if (signUpError) {
      throw signUpError
    }

    // Return a successful response with the created user data
    return NextResponse.json({
      status: 'success',
      message: 'User created successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata.name,
      }
    }, {
      status: 200
    })

  } catch (error: any) {
    console.error("Error creating user:", error)

    // Return an error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create user',
      error: error.message || 'Server error'
    }, {
      status: 500
    })
  }
}