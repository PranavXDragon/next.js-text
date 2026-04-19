import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create and save contact document
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          createdAt: contact.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Contact form error:', error)

    if (error instanceof Error) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(10)

    return NextResponse.json(
      {
        success: true,
        count: contacts.length,
        data: contacts,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching contacts' },
      { status: 500 }
    )
  }
}
