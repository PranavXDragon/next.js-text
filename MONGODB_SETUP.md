# MongoDB Connection Instructions

## Setup

1. Create a `.env.local` file in the project root with your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/nextjs-contact-form?retryWrites=true&w=majority
```

### Getting MongoDB Connection String

#### Option 1: MongoDB Atlas (Cloud) - RECOMMENDED
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" on your cluster
4. Choose "Drivers" > "Node.js"
5. Copy the connection string and replace `<password>` with your database user password

#### Option 2: Local MongoDB
1. Install MongoDB locally from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/nextjs-contact-form`

## Database Configuration

- **Database Name**: `nextjs-contact-form`
- **Collection**: `contacts`
- **Connection Pool Size**: Optimized for Next.js (5 max, 1 min)
- **Timeouts**: 
  - Connection: 10s
  - Socket: 45s
  - Server selection: 5s

## API Endpoints

### Submit Contact Form
- **POST** `/api/contact`
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "This is a test message"
}
```

### Fetch Recent Contacts
- **GET** `/api/contact`
- **Returns**: Last 10 contacts sorted by newest first

## Development

The MongoDB connection is cached and reused for hot reloads in development. Connection is initialized on first API call.

## Deployment

When deploying to production:
1. Add `MONGODB_URI` to your hosting platform's environment variables
2. For serverless (Vercel, etc.), the connection is optimized for cold starts
3. Monitor connection pool usage in MongoDB Atlas dashboard
