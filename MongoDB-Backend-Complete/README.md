# 📦 Complete MongoDB Backend Template for Next.js

A production-ready MongoDB backend setup that you can copy and paste into any Next.js project. Everything is configured and ready to use!

## 🚀 Quick Start

### 1. Copy to Your Project
```bash
# Copy the entire folder to your Next.js project root
cp -r MongoDB-Backend-Complete/* your-nextjs-project/
```

### 2. Install Dependencies
```bash
cd your-nextjs-project
npm install mongoose dotenv
```

### 3. Setup Environment Variables
```bash
# Create .env.local in your project root
cp .env.example .env.local
```

### 4. Add Your MongoDB Connection String
Edit `.env.local`:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
```

### 5. Start Using It!
You're done! Start building 🎉

---

## 📁 Folder Structure

```
MongoDB-Backend-Complete/
├── lib/
│   ├── db/
│   │   └── mongodb.js              # Connection with pooling
│   └── models/
│       ├── Contact.js              # Contact schema (example)
│       └── User.js                 # User schema (example)
├── api/
│   └── examples/
│       ├── contact.js              # Contact CRUD endpoints
│       └── users.js                # User CRUD endpoints
├── utils/
│   ├── response.js                 # Standardized API responses
│   └── validation.js               # Input validation helpers
├── jsconfig.json                   # Path aliases configuration
├── .env.example                    # Environment template
├── INSTALL.md                      # Installation guide
└── README.md                        # This file
```

---

## ✨ What's Included

### 1. **Connection Management** (`lib/db/mongodb.js`)
- ✅ Connection pooling for performance
- ✅ Global caching to prevent duplicate connections
- ✅ Optimized for serverless (Next.js Vercel)
- ✅ Automatic error handling
- ✅ Connection logging

### 2. **Models** (`lib/models/`)
- **Contact.js** - Contact form submission model
  - Fields: name, email, phone, subject, message, status
  - Indexes for fast queries
  - Timestamps
  
- **User.js** - User management model
  - Fields: username, email, firstName, lastName, avatar, bio
  - Unique constraints
  - Active status tracking
  - Timestamps

### 3. **API Routes** (`api/examples/`)
- **contact.js** - Full CRUD for contacts
  - POST: Create new contact
  - GET: Fetch contacts with pagination
  - DELETE: Remove a contact
  
- **users.js** - Full CRUD for users
  - POST: Create new user
  - GET: Fetch users with pagination
  - PUT: Update user information

### 4. **Utilities** (`utils/`)
- **response.js** - Standardized API responses
  - Success responses
  - Error responses
  - Paginated responses
  
- **validation.js** - Common validation functions
  - Email validation
  - Phone validation
  - URL validation
  - Pagination validation
  - Input sanitization

---

## 🔧 How to Use

### Using the Connection
```javascript
import connectDB from '@/app/lib/db/mongodb';

export async function POST(request) {
  try {
    await connectDB();
    // Your database operations here
  } catch (error) {
    console.error(error);
  }
}
```

### Using Models
```javascript
import Contact from '@/app/lib/models/Contact';
import User from '@/app/lib/models/User';

// Create
const contact = await Contact.create({
  name: 'John',
  email: 'john@example.com',
  message: 'Hello!',
});

// Read
const contacts = await Contact.find();

// Update
const updated = await Contact.findByIdAndUpdate(id, { status: 'replied' }, { new: true });

// Delete
await Contact.findByIdAndDelete(id);
```

### Using Response Handler
```javascript
import { ApiResponse } from '@/app/utils/response';

// Success response
return NextResponse.json(
  ApiResponse.success(data, 'Success message', 200),
  { status: 200 }
);

// Error response
return NextResponse.json(
  ApiResponse.error('Error message', 400),
  { status: 400 }
);

// Paginated response
return NextResponse.json(
  ApiResponse.paginated(data, total, page, limit),
  { status: 200 }
);
```

### Using Validation
```javascript
import { 
  validateEmail, 
  validatePhone, 
  validatePagination,
  sanitizeInput 
} from '@/app/utils/validation';

if (!validateEmail(email)) {
  return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
}

const { page, limit } = validatePagination(
  request.query.page,
  request.query.limit
);
```

---

## 📋 Creating New Models

Create a new file in `lib/models/YourModel.js`:

```javascript
import mongoose from 'mongoose';

const yourSchema = new mongoose.Schema(
  {
    field1: {
      type: String,
      required: [true, 'Field1 is required'],
      trim: true,
    },
    field2: {
      type: String,
      unique: true,
    },
    field3: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add indexes for frequently queried fields
yourSchema.index({ field1: 1 });

export default mongoose.models.YourModel || mongoose.model('YourModel', yourSchema);
```

---

## 📝 Creating New API Routes

Create in `app/api/yourroute/route.js`:

```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db/mongodb';
import YourModel from '@/app/lib/models/YourModel';
import { ApiResponse } from '@/app/utils/response';

export async function GET(request) {
  try {
    await connectDB();
    const data = await YourModel.find();
    return NextResponse.json(
      ApiResponse.success(data, 'Data fetched successfully'),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      ApiResponse.error(error.message, 500),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const data = await YourModel.create(body);
    return NextResponse.json(
      ApiResponse.success(data, 'Created successfully', 201),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      ApiResponse.error(error.message, 500),
      { status: 500 }
    );
  }
}
```

---

## ⚙️ MongoDB Atlas Setup

### 1. Create MongoDB Cluster
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Create a free cluster
- Create a database user
- Generate connection string

### 2. Whitelist IP Address
**IMPORTANT:** Before deploying:
- Go to **Network Access** in MongoDB Atlas
- Add your IP address OR use `0.0.0.0/0` (allows all IPs - for development only)

### 3. Get Connection String
- Click "Connect"
- Choose "Drivers"
- Copy the connection string
- Replace `<username>`, `<password>`, `<database>`

---

## 🔍 API Examples

### Contact API

**Create Contact:**
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services"
}
```

**Get Contacts:**
```bash
GET /api/contact?page=1&limit=10
```

**Delete Contact:**
```bash
DELETE /api/contact?id=<contact_id>
```

### User API

**Create User:**
```bash
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "A passionate developer"
}
```

**Get Users:**
```bash
GET /api/users?page=1&limit=10
```

**Update User:**
```bash
PUT /api/users?id=<user_id>
Content-Type: application/json

{
  "firstName": "Jane",
  "bio": "Updated bio"
}
```

---

## 🚀 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
4. Deploy!

**Important:** Whitelist Vercel IP in MongoDB Atlas Network Access

---

## 🐛 Troubleshooting

### "Cannot find module '@/app/lib/db/mongodb'"
- Make sure `jsconfig.json` is in your project root
- Verify file paths match your structure
- Restart dev server

### "MONGODB_URI not defined"
- Create `.env.local` file
- Add your connection string
- Restart dev server

### "Connection Refused"
- Add your IP to MongoDB Atlas Network Access
- Use `0.0.0.0/0` for development/testing
- Check connection string is correct

### "Duplicate Key Error"
- Fields marked `unique: true` can't have duplicates
- Check email/username aren't already in database

---

## 📚 Best Practices

1. **Always validate input** - Use utilities from `utils/validation.js`
2. **Use consistent response format** - Use `ApiResponse` helper
3. **Add database indexes** - Speed up queries on frequently used fields
4. **Implement pagination** - Prevent loading huge datasets
5. **Handle errors gracefully** - Always try/catch and return proper errors
6. **Cache connections** - Already done in `mongodb.js`
7. **Add timestamps** - Enable `{ timestamps: true }` in schemas

---

## 🎯 Ready to Use!

This template is production-ready. Just:
1. Copy the folder to your project
2. Add your MongoDB URI to `.env.local`
3. Start building! 🚀

---

**Need Help?** Check MongoDB docs: [https://docs.mongodb.com/](https://docs.mongodb.com/)
