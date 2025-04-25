# Wall of Disgrace SUST - A Complete Guide to Next.js

This document serves as a comprehensive guide to understanding this Next.js application from a non-technical perspective. It will walk you through every aspect of the codebase, from frontend to backend, to help you understand how modern web applications work.

## Table of Contents

1. [Introduction to the Application](#introduction-to-the-application)
2. [Web Application Fundamentals](#web-application-fundamentals)
3. [Next.js and the Technology Stack](#nextjs-and-the-technology-stack)
4. [Project Structure Explained](#project-structure-explained)
5. [Data Flow and Application Architecture](#data-flow-and-application-architecture)
6. [Detailed Frontend Explanation](#detailed-frontend-explanation)
7. [Detailed Backend Explanation](#detailed-backend-explanation)
8. [Database Design and Management](#database-design-and-management)
9. [API Routes and Data Exchange](#api-routes-and-data-exchange)
10. [User Journeys Through the Application](#user-journeys-through-the-application)
11. [Common Next.js Concepts](#common-nextjs-concepts)
12. [Learning Resources](#learning-resources)

## Introduction to the Application

The "Wall of Disgrace SUST" is a web application designed to track and display information about academic cheaters at Shahjalal University of Science and Technology (SUST). The application allows users to:

- View a list of all recorded cheaters
- See detailed information about individual cheaters
- View evidence associated with each cheater
- Add new cheaters to the database
- Update existing cheater information
- Delete cheater records

This application demonstrates many common patterns in modern web development, making it an excellent learning resource for understanding how Next.js applications work.

## Web Application Fundamentals

Before diving into the specifics of Next.js, let's understand the fundamental components of any web application:

### Frontend
- **What it is**: The user interface (UI) that users see and interact with in their browser
- **Technologies**: HTML, CSS, JavaScript, and frontend frameworks (like React)
- **Purpose**: Presents data and captures user input in an accessible, engaging way

### Backend
- **What it is**: Server-side code that processes data and implements business logic
- **Technologies**: Server-side languages and frameworks (Node.js, Express, Next.js API routes)
- **Purpose**: Processes requests, interacts with the database, enforces business rules

### Database
- **What it is**: Persistent storage for all application data
- **Technologies**: MongoDB (in this application), MySQL, PostgreSQL, etc.
- **Purpose**: Stores and retrieves data reliably and efficiently

### API (Application Programming Interface)
- **What it is**: The communication layer between frontend and backend
- **Technologies**: RESTful endpoints, GraphQL, etc.
- **Purpose**: Standardizes how data is exchanged between different parts of the application

## Next.js and the Technology Stack

### Next.js
Next.js is a React framework that enables functionality such as:
- Server-side rendering and static site generation
- Simplified routing based on file structure
- API routes to create backend endpoints
- Automatic code splitting for faster page loads

### React
- A JavaScript library for building user interfaces
- Based on reusable components
- Uses a virtual DOM for efficient updates

### MongoDB
- A NoSQL database that stores data in flexible, JSON-like documents
- Does not require a predefined schema
- Scales horizontally for large applications

### Mongoose
- An Object Data Modeling (ODM) library for MongoDB and Node.js
- Provides schema validation
- Makes it easier to interact with MongoDB using JavaScript

## Project Structure Explained

The Next.js project follows a specific structure that determines how different features work:

### `/app` Directory
This is the heart of the application in Next.js 13+ with the App Router:

```
/app
  /page.jsx        # Homepage
  /add
    /page.jsx      # Add new cheater page
  /[id]
    /page.jsx      # Individual cheater page
  /api
    /cheaters
      /route.js    # API for list operations (GET all, POST new)
      /[id]
        /route.js  # API for individual operations (GET, PUT, DELETE)
  /components      # Reusable UI components
    /CheaterCard.jsx
    /CheaterForm.jsx
    /Header.jsx
    # ...more components
```

### `/models` Directory
Contains Mongoose models that define database schemas:

```
/models
  /Cheater.js     # Defines Cheater and Evidence schemas
```

### Configuration Files
Various configuration files at the root:

```
next.config.js    # Next.js configuration
package.json      # Project dependencies and scripts
.env.local        # Environment variables (not in git repository)
```

## Data Flow and Application Architecture

Understanding how data flows through the application:

1. **Client Request Flow**:
   - User visits a URL in their browser
   - Next.js router matches the URL to a page component
   - The page component renders, potentially fetching data

2. **Data Fetching Flow**:
   - Component needs data
   - Makes a request to an API route
   - API route connects to the database
   - Database returns data
   - API formats and returns the response
   - Component receives and displays the data

3. **Data Mutation Flow**:
   - User submits a form (add/edit/delete)
   - Frontend validates the input
   - Sends data to appropriate API route
   - API validates the data
   - Database is updated
   - Confirmation is sent back to frontend
   - UI updates to reflect changes

## Detailed Frontend Explanation

### Page Components

#### Homepage (`/app/page.jsx`)
- Displays a list/grid of all cheaters
- Likely uses server components to fetch data during rendering
- Includes navigation to other parts of the application
- May include filtering or search functionality

#### Add Cheater Page (`/app/add/page.jsx`)
- Contains a form for adding new cheaters
- Includes fields for all necessary information
- Validates user input
- Submits data to API
- Provides feedback on submission status

#### Cheater Detail Page (`/app/[id]/page.jsx`)
- Shows comprehensive information about a specific cheater
- Displays associated evidence
- May include edit and delete options
- The `[id]` in the path is a dynamic segment that matches any value

### UI Components

#### CheaterCard Component
- Displays a summary of a cheater
- Used in lists/grids of cheaters
- Includes key information and maybe a thumbnail
- Links to the detailed view

#### Form Components
- Input fields, validation, and submission handling
- May be split into multiple smaller components
- Handles different input types (text, select, file uploads)

#### Layout Components
- Header, footer, navigation
- Consistent UI elements across pages
- Responsive design elements

## Detailed Backend Explanation

### API Routes

#### List Operations (`/app/api/cheaters/route.js`)

Handles operations on the entire collection:

- **GET**: Retrieves all cheaters
  - Connects to MongoDB
  - Queries the Cheater collection
  - Returns a list of cheaters
  - May include pagination, filtering, and sorting

- **POST**: Adds a new cheater
  - Validates the request body
  - Creates new Cheater and Evidence documents
  - Saves them to MongoDB
  - Returns the newly created data

#### Individual Operations (`/app/api/cheaters/[id]/route.js`)

Handles operations on a single cheater:

- **GET**: Retrieves a specific cheater
  - Extracts ID from the URL
  - Finds the cheater in the database
  - Also fetches associated evidence
  - Returns both in the response

- **PUT**: Updates a cheater
  - Validates the update data
  - Updates the cheater record
  - May also update associated evidence
  - Returns updated data

- **DELETE**: Removes a cheater
  - Deletes both the cheater and evidence records
  - Returns a success confirmation

### API Implementation Details

Each API route follows a similar pattern:

1. **Connection Management**:
   ```javascript
   let isConnected = false;
   const connectToDatabase = async () => {
     if (isConnected) return;
     try {
       await mongoose.connect(process.env.MONGODB_URI);
       isConnected = true;
     } catch (error) {
       console.error('MongoDB connection error:', error);
       throw new Error('Failed to connect to MongoDB');
     }
   };
   ```

2. **Request Handler**:
   ```javascript
   export async function GET(request, context) {
     try {
       await connectToDatabase();
       
       // Extract parameters
       const params = await context.params;
       const id = params.id;
       
       // Process the request
       const numericId = parseInt(id, 10);
       const cheater = await Cheater.findOne({ id: numericId }).lean();
       
       // Return the response
       return NextResponse.json({ cheater, /* other data */ });
     } catch (error) {
       // Handle errors
       return NextResponse.json(
         { error: 'Internal Server Error', message: error.message },
         { status: 500 }
       );
     }
   }
   ```

## Database Design and Management

### MongoDB with Mongoose

MongoDB stores data in collections of documents. In this application:

1. **Cheater Schema**:
   ```javascript
   const CheaterSchema = new mongoose.Schema({
     id: { type: Number, required: true, unique: true },
     name: { type: String, required: true },
     department: { type: String, required: true },
     batch: { type: String, required: true },
     evidence: { type: Number, required: true },
     // Additional fields...
   });
   ```

2. **Evidence Schema**:
   ```javascript
   const EvidenceSchema = new mongoose.Schema({
     id: { type: Number, required: true, unique: true },
     details: { type: String, required: true },
     images: [{ type: String }],
     // Additional fields...
   });
   ```

3. **Relationships**:
   - A cheater has one evidence record (one-to-one relationship)
   - The `evidence` field in the Cheater document references the ID of the related Evidence document

## API Routes and Data Exchange

### RESTful API Design

The application follows REST principles:

| HTTP Method | Endpoint                  | Action                              |
|-------------|---------------------------|-------------------------------------|
| GET         | /api/cheaters             | Retrieve all cheaters               |
| POST        | /api/cheaters             | Create a new cheater                |
| GET         | /api/cheaters/[id]        | Retrieve a specific cheater         |
| PUT         | /api/cheaters/[id]        | Update a specific cheater           |
| DELETE      | /api/cheaters/[id]        | Delete a specific cheater           |

### Response Format

API responses typically follow a consistent format:

```javascript
// Success response
{
  cheater: { /* cheater data */ },
  evidence: { /* evidence data */ }
}

// Error response
{
  error: 'Error Type',
  message: 'Detailed error message'
}
```

## User Journeys Through the Application

### Viewing Cheaters

1. User navigates to the homepage
2. Next.js renders the page component
3. During rendering, data is fetched from `/api/cheaters`
4. The API connects to MongoDB and retrieves all cheaters
5. The data is passed to the page component
6. React renders the list of cheaters
7. User sees the cheater list in their browser

### Adding a New Cheater

1. User navigates to the Add page
2. A form is displayed with fields for cheater information
3. User fills out the form and submits
4. Frontend JavaScript validates the form input
5. Form data is sent to `/api/cheaters` using POST
6. The API route validates the data
7. New Cheater and Evidence documents are created in MongoDB
8. Success response is sent back to the browser
9. User is redirected to the homepage or shown a success message

### Viewing a Single Cheater

1. User clicks on a cheater in the list
2. Browser navigates to `/[id]` (e.g., `/123`)
3. Next.js renders the detail page component
4. During rendering, data is fetched from `/api/cheaters/123`
5. The API retrieves the specific cheater and evidence
6. The data is passed to the page component
7. React renders the detailed view
8. User sees comprehensive information about the cheater

### Updating a Cheater

1. User navigates to a cheater's detail page
2. User activates edit mode (clicks Edit button)
3. Form is populated with existing cheater data
4. User modifies the data and submits
5. Updated data is sent to `/api/cheaters/123` using PUT
6. The API validates and updates the database records
7. Success response is sent back
8. UI refreshes to show the updated information

### Deleting a Cheater

1. User navigates to a cheater's detail page
2. User clicks the Delete button
3. Confirmation dialog is shown
4. User confirms deletion
5. Delete request is sent to `/api/cheaters/123`
6. API removes cheater and evidence from the database
7. Success response is sent back
8. User is redirected to the homepage

## Common Next.js Concepts

### Server Components vs. Client Components

Next.js 13+ introduces React Server Components:

- **Server Components** (default):
  - Rendered on the server
  - Don't include client-side JavaScript
  - Can't use hooks or browser APIs
  - Better for static content and initial loading

- **Client Components** (marked with `'use client'`):
  - Include client-side JavaScript
  - Can use React hooks and browser APIs
  - Interactive and dynamic
  - Example use case: form handling with validation

### File-based Routing

Next.js uses the file system for routing:

- Files in `/app` create routes based on their path
- `page.jsx` files define the content for each route
- Folders with square brackets (e.g., `[id]`) create dynamic routes
- Special files like `layout.jsx` and `loading.jsx` control page structure

### Data Fetching Methods

Several ways to fetch data in Next.js:

- **Server Components**:
  ```javascript
  // In a server component
  async function HomePage() {
    const res = await fetch('https://api.example.com/data');
    const data = await res.json();
    return <div>{data.title}</div>;
  }
  ```

- **Client Components**:
  ```javascript
  'use client'
  
  import { useState, useEffect } from 'react';
  
  function ClientComponent() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
      async function fetchData() {
        const res = await fetch('/api/data');
        const data = await res.json();
        setData(data);
      }
      
      fetchData();
    }, []);
    
    return data ? <div>{data.title}</div> : <div>Loading...</div>;
  }
  ```

### API Routes in Next.js

Next.js allows creating API endpoints within the application:

```javascript
// app/api/example/route.js
export async function GET(request) {
  return Response.json({ message: 'Hello from the API!' });
}

export async function POST(request) {
  const body = await request.json();
  // Process the data
  return Response.json({ success: true });
}
```

## Learning Resources

To deepen your understanding of Next.js and the technologies used in this application:

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)

### Tutorials and Courses
- [Next.js Learn Course](https://nextjs.org/learn)
- [MongoDB University](https://university.mongodb.com/)
- [React Beginner's Course](https://egghead.io/courses/the-beginner-s-guide-to-react)

### Books
- "Next.js in Action" by Scott Moss
- "Learning React" by Alex Banks and Eve Porcello
- "MongoDB: The Definitive Guide" by Shannon Bradshaw, Eoin Brazil, and Kristina Chodorow

## Conclusion

This guide has walked you through the entire structure and functionality of the "Wall of Disgrace SUST" Next.js application. By understanding this codebase, you've gained insight into:

- Modern web application architecture
- Next.js framework features and patterns
- React component design
- API route implementation
- MongoDB data modeling
- Full-stack JavaScript development

The best way to continue learning is by exploring the code yourself, making small changes, and seeing how they affect the application. Don't be afraid to experiment—that's how you'll truly understand how everything works together. 