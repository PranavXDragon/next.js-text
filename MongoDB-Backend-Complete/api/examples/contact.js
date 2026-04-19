import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongodb';
import Contact from '@/app/lib/models/Contact';
import { ApiResponse } from '@/app/utils/response';

/**
 * POST /api/contact
 * Create a new contact message
 */
export async function POST(request) {
  try {
    await connectDB();

    const { name, email, message, phone, subject } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        ApiResponse.error('Please provide name, email, and message', 400),
        { status: 400 }
      );
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      message,
      phone: phone || '',
      subject: subject || 'No Subject',
    });

    return NextResponse.json(
      ApiResponse.success(contact, 'Thanks for reaching out! I\'ll review your message and get back to you soon.', 201),
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact creation error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to save contact', 500),
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Fetch all contacts (with optional pagination)
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Contact.countDocuments();

    return NextResponse.json(
      {
        success: true,
        data: contacts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact fetch error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to fetch contacts', 500),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contact
 * Delete a contact by ID
 */
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiResponse.error('Contact ID is required', 400),
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        ApiResponse.error('Contact not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponse.success(contact, 'Contact deleted successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact deletion error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to delete contact', 500),
      { status: 500 }
    );
  }
}
