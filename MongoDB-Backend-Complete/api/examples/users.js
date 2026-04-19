import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongodb';
import User from '@/app/lib/models/User';
import { ApiResponse } from '@/app/utils/response';
import { validateEmail, validatePagination } from '@/app/utils/validation';

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request) {
  try {
    await connectDB();

    const { username, email, firstName, lastName, bio, avatar } = await request.json();

    // Validation
    if (!username || !email || !firstName) {
      return NextResponse.json(
        ApiResponse.error('Username, email, and first name are required', 400),
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        ApiResponse.error('Invalid email format', 400),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        ApiResponse.error('User with this email or username already exists', 409),
        { status: 409 }
      );
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      firstName,
      lastName: lastName || '',
      bio: bio || '',
      avatar: avatar || null,
    });

    return NextResponse.json(
      ApiResponse.success(user, 'User created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to create user', 500),
      { status: 500 }
    );
  }
}

/**
 * GET /api/users
 * Fetch all users with pagination
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const { page: validPage, limit: validLimit } = validatePagination(page, limit);
    const skip = (validPage - 1) * validLimit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(validLimit)
      .skip(skip);

    const total = await User.countDocuments({ isActive: true });

    return NextResponse.json(
      ApiResponse.paginated(users, total, validPage, validLimit),
      { status: 200 }
    );
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to fetch users', 500),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users
 * Update a user
 */
export async function PUT(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiResponse.error('User ID is required', 400),
        { status: 400 }
      );
    }

    const { firstName, lastName, bio, avatar } = await request.json();

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, bio, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        ApiResponse.error('User not found', 404),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponse.success(user, 'User updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      ApiResponse.error(error.message || 'Failed to update user', 500),
      { status: 500 }
    );
  }
}
