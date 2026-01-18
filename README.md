# Superhero Database

Web application for managing superhero database with CRUD operations.

## Description

This application allows you to create, read, update, and delete superheroes. Each superhero can have multiple images, superpowers, and other details.

## Technologies Used

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- Cloudinary for image storage
- Multer for file uploads

### Frontend
- React
- TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- shadcn/ui components
- Axios for API calls

## Project Structure

```
superhero-app/
├── backend/          # Node.js backend
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   └── config/       # Configuration files
└── frontend/         # React frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── redux/       # Redux store and slices
    │   └── api/         # API configuration
```

## Prerequisites

- Node.js (v20 or higher)
- npm
- MongoDB database
- Cloudinary account (for image storage)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5501
DB_CONNECTION=your_mongodb_connection_string
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5501`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `frontend/src/api/axios.ts` if needed (default is `http://localhost:5501`)

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at the URL shown in the terminal (usually `http://localhost:5173`)

## Features

### Superhero Model

Each superhero contains:
- **nickname**: Superhero's nickname (e.g., "Superman")
- **real_name**: Real name (e.g., "Clark Kent")
- **origin_description**: Story of origin
- **superpowers**: Array of superpowers
- **catch_phrase**: Famous catchphrase
- **images**: Array of image URLs

### Available Operations

1. **Create Superhero**
   - Fill in the form with superhero details
   - Upload up to 5 images
   - All fields are required

2. **List Superheroes**
   - View all superheroes in card format
   - Each card shows one image and nickname
   - Pagination shows 5 items per page

3. **View Superhero Details**
   - See all information about a superhero
   - View all images in a carousel gallery
   - Access from the main list or context menu

4. **Edit Superhero**
   - Modify superhero information
   - Add new images (up to 5 additional)
   - Remove existing images

5. **Delete Superhero**
   - Remove superhero from database
   - Confirmation dialog before deletion

### User Interface

- **Main Page**: List of all superheroes with pagination
- **Detail Page**: Full information about a selected superhero
- **Context Menu**: Right-click on cards for quick actions (View, Edit, Delete)
- **Modals**: Forms for creating and editing superheroes

## API Endpoints

- `GET /superheros/all?page=1&limit=5` - Get paginated list of superheroes
- `GET /superheros/:id` - Get single superhero by ID
- `POST /superheros/` - Create new superhero (multipart/form-data)
- `PUT /superheros/:id` - Update superhero (multipart/form-data)
- `DELETE /superheros/:id` - Delete superhero
- `DELETE /superheros/:id/image?image=url` - Delete single image from superhero

## Assumptions Made

1. **Image Storage**: Images are stored in Cloudinary cloud service
2. **Pagination**: Default page size is 5 items per page
3. **Image Limits**: Maximum 5 images can be uploaded per superhero
4. **Required Fields**: All fields (nickname, real_name, origin_description, superpowers, catch_phrase) are required
5. **Superpowers Format**: Superpowers are entered as comma-separated values in forms, stored as array in database
6. **Port Configuration**: Backend runs on port 5501, frontend on default Vite port (5173)
7. **Database**: MongoDB is used as the database, connection string provided via environment variable

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## Development Notes

- Backend uses TypeScript with ts-node-dev for hot reloading
- Frontend uses Vite for fast development and building
- State management handled by Redux Toolkit with async thunks
- Image uploads processed through Multer middleware before Cloudinary upload
