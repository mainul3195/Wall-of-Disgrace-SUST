# Wall of Disgrace - SUST

A web application for documenting and exposing academic cheaters at Shahjalal University of Science and Technology (SUST).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Admin Panel](#admin-panel)
- [Program Flow](#program-flow)
- [Performance Considerations](#performance-considerations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 📝 Overview

Wall of Disgrace is a platform designed to document and expose instances of academic dishonesty at SUST. The application maintains a database of cheaters with evidence, allowing administrators to manage the records while providing public access to view the information.

### Purpose

This project aims to:
- Discourage academic dishonesty by exposing cheaters publicly
- Provide a central repository for documented cheating cases
- Allow administrators to manage and verify reported cases
- Maintain transparency in the academic discipline process

## ✨ Features

### Public Features
- View a list of documented cheaters
- View detailed information about specific cheaters, including evidence
- Search for cheaters by name, department, etc.
- Read the platform's privacy policy

### Admin Features
- Secure login to the admin dashboard
- Add new cheaters to the database
- Upload and manage evidence files
- Edit existing cheater information
- Delete cheater records
- Manage admin accounts

## 🛠️ Technology Stack

### Frontend
- **React 19.0.0**: UI library for building the user interface
- **Next.js 15.2.4**: React framework for server-side rendering and routing
- **TailwindCSS**: Utility-first CSS framework for styling

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database for storing cheater and evidence data
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB

### Authentication
- **Custom authentication system**: JWT-based authentication for admin access

### Hosting/Deployment
- **Vercel/Netlify**: For hosting the Next.js application (recommended)

## 📂 Project Structure

```
Wall-of-Disgrace-SUST/
├── app/                       # Next.js App Router directories
│   ├── api/                   # API endpoints
│   │   ├── auth/              # Authentication routes
│   │   │   └── route.js       # Login endpoint
│   │   └── cheaters/          # Cheater management endpoints
│   │       ├── [id]/          # Dynamic routes for specific cheaters
│   │       │   └── route.js   # GET, PUT, DELETE operations
│   │       └── route.js       # GET (list), POST operations
│   ├── admin/                 # Admin dashboard pages
│   │   └── page.js            # Admin interface
│   ├── components/            # Reusable React components
│   │   ├── CheaterCard.jsx    # Component to display cheater info
│   │   ├── EditCheaterModal.jsx # Modal for editing cheater info
│   │   └── ...
│   ├── policy/                # Privacy policy page
│   │   └── page.js
│   └── page.js                # Homepage
├── models/                    # MongoDB models
│   ├── Admin.js               # Admin user model
│   └── Cheater.js             # Cheater and Evidence models
├── public/                    # Static assets
│   └── ...
├── .env.local                 # Environment variables (not in repo)
├── next.config.js             # Next.js configuration
├── package.json               # NPM dependencies and scripts
└── README.md                  # Project documentation
```

## 🚀 Installation

### Prerequisites
- Node.js 16.x or later
- MongoDB instance (local or cloud-based like MongoDB Atlas)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Wall-of-Disgrace-SUST.git
   cd Wall-of-Disgrace-SUST
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=default_admin@example.com
   ADMIN_PASSWORD=default_admin_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## 💻 Usage

### Public Usage
- The homepage displays a list of cheaters with brief information
- Click on a cheater's card to view detailed information and evidence
- Use the search functionality to find specific cheaters

### Admin Usage
1. Navigate to `/admin` and log in with admin credentials
2. From the dashboard, you can:
   - View all cheaters in a management interface
   - Add new cheaters using the "Add Cheater" button
   - Edit existing cheaters by clicking the edit icon
   - Delete cheaters by clicking the delete icon
   - Manage evidence for each cheater

## 🔌 API Endpoints

### Authentication
- `POST /api/auth`: Admin login endpoint
  - Request body: `{ email, password }`
  - Response: JWT token for authentication

### Cheaters
- `GET /api/cheaters`: Get all cheaters
  - Query parameters: 
    - `page`: Page number (default: 1)
    - `limit`: Results per page (default: 10)
    - `search`: Search term for name/department
  - Response: List of cheaters with pagination metadata

- `POST /api/cheaters`: Create a new cheater (admin only)
  - Request body: Cheater and evidence information
  - Response: Created cheater object

- `GET /api/cheaters/[id]`: Get a specific cheater by ID
  - Response: Cheater object with evidence

- `PUT /api/cheaters/[id]`: Update a specific cheater (admin only)
  - Request body: Updated cheater and evidence information
  - Response: Updated cheater object

- `DELETE /api/cheaters/[id]`: Delete a specific cheater (admin only)
  - Response: Success message

## 🗄️ Database Schema

### Cheater Model
```javascript
{
  id: Number,               // Unique identifier
  name: String,             // Cheater's name
  regNo: String,            // Registration number
  department: String,       // Academic department
  batch: Number,            // Batch number
  session: String,          // Academic session
  cheatingType: String,     // Type of cheating
  course: String,           // Course in which cheating occurred
  courseTeacher: String,    // Course instructor
  date: Date,               // Date of incident
  description: String,      // Detailed description
  evidence: Number,         // Reference to Evidence
  createdAt: Date,          // Record creation date
  updatedAt: Date           // Record update date
}
```

### Evidence Model
```javascript
{
  id: Number,               // Unique identifier
  files: Array,             // Array of evidence file URLs
  screenshots: Array,       // Array of screenshot URLs
  description: String,      // Description of evidence
  createdAt: Date,          // Record creation date
  updatedAt: Date           // Record update date
}
```

### Admin Model
```javascript
{
  email: String,            // Admin email address
  password: String,         // Hashed password
  name: String,             // Admin name
  role: String,             // Admin role
  createdAt: Date,          // Record creation date
  lastLogin: Date           // Last login timestamp
}
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for admin authentication:

1. Admin users log in through the `/admin` page
2. Upon successful login, the server generates a JWT token
3. This token is stored in the browser's local storage
4. The token is included in the Authorization header for authenticated API requests
5. Routes requiring admin access verify the token before allowing operations

### Security Considerations
- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- All sensitive operations require authentication
- HTTPS is enforced in production

## 👩‍💼 Admin Panel

The admin panel at `/admin` provides a dashboard for managing all aspects of the application:

- **Dashboard Overview**: Shows statistics about the number of documented cheaters
- **Cheater Management**: Interface for adding, editing, and deleting cheater records
- **Evidence Management**: Tools for uploading and managing evidence files
- **Account Settings**: Admin account management

## 🔄 Program Flow

### Public User Flow
1. User visits the homepage
2. The application fetches cheater data from the MongoDB database via API
3. User can browse, search, and view detailed information about cheaters
4. When a specific cheater is selected, the application fetches the detailed information and evidence

### Admin User Flow
1. Admin navigates to the `/admin` page
2. Admin provides credentials for authentication
3. Upon successful login, the application stores the JWT token
4. Admin can now perform CRUD operations on cheater records
5. All admin actions are secured with the JWT token

### Data Flow
1. Client makes a request to an API endpoint
2. Next.js API route handler processes the request
3. For protected routes, the handler verifies the JWT token
4. The handler connects to MongoDB using Mongoose
5. Database operations are performed based on the request
6. The response is sent back to the client

## ⚡ Performance Considerations

### Database Optimization
- Indexes on frequently queried fields (name, department, regNo)
- Pagination implemented for large result sets
- MongoDB connection pooling for efficient resource usage

### Frontend Optimization
- Server-Side Rendering (SSR) for initial page load
- Client-side navigation for subsequent page transitions
- Image optimization using Next.js Image component
- Code splitting and lazy loading for improved performance

## 🚢 Deployment

### Requirements
- Node.js runtime environment
- MongoDB database (production instance)
- Environment variables properly configured

### Deployment Options

#### Vercel (Recommended)
1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy the application

#### Manual Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Technical Notes for Developers

### Next.js App Router

This project uses Next.js 15 with the App Router. Key technical considerations:

1. **Dynamic Route Parameters**: In Next.js 15, route parameters (`params`) in dynamic routes are promises and must be awaited:
   ```javascript
   // In app/api/cheaters/[id]/route.js
   export async function GET(request, props) {
     const params = await props.params;
     const id = params.id;
     // ...
   }
   ```

2. **API Routes**: API routes are implemented in the `app/api` directory using the Route Handlers pattern.

3. **MongoDB Connection**: A connection pooling pattern is used to maintain an efficient MongoDB connection:
   ```javascript
   let isConnected = false;
   
   const connectToDatabase = async () => {
     if (isConnected) return;
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       isConnected = true;
     } catch (error) {
       throw new Error('Failed to connect to MongoDB');
     }
   };
   ```

4. **Error Handling**: Comprehensive error handling is implemented in all API routes with appropriate HTTP status codes.

### Development Notes

- Use `npm run dev` for local development with hot reloading
- The application supports Turbopack for faster development builds
- All route parameters must be properly awaited as per Next.js 15 requirements
- MongoDB connection is established on-demand in API routes 