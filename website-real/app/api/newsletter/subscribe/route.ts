import { subscribeToNewsletter } from '@/lib/email/newsletter'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, phone, signupType } = body

    // Validate input
    if (!email && !phone) {
      return Response.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      )
    }

    // Call newsletter subscription service
    const result = await subscribeToNewsletter(email, phone, signupType)

    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return Response.json(
      { success: true, message: result.message },
      { status: 200 }
    )
  } catch (error) {
    console.error('Newsletter API error:', error)
    return Response.json(
      { error: 'Failed to process newsletter signup' },
      { status: 500 }
    )
  }
}
