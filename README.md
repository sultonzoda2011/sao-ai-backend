# SAO AI - AI Chat Backend

A professional Node.js backend for an AI chat application powered by Google Gemini 1.5 Flash.

## Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **AI Chat Management**: Create, update, and delete chat sessions.
- **Gemini Integration**: Seamless integration with Google's Gemini 1.5 Flash model with instruction support.
- **Paginated Chats**: Efficient retrieval of user chat history.
- **Swagger Documentation**: Fully documented API with interactive UI.
- **Error Handling**: Centralized error management for consistent API responses.
- **Validation**: Robust input validation using `express-validator`.

## Tech Stack

- **Node.js** & **Express**
- **MongoDB** & **Mongoose**
- **JSON Web Tokens (JWT)**
- **Google Generative AI SDK**
- **Swagger UI**

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB account/instance
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd sao-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables (see `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:5000/api-docs`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Profile
- `GET /api/profile` - Get current user profile (Requires Auth)
- `PUT /api/profile/update-profile` - Update profile info (Requires Auth)
- `PUT /api/profile/changepassword` - Change password (Requires Auth)

### Chats
- `GET /api/chats` - Get user chats (Paginated, Requires Auth)
- `POST /api/chats` - Create a new chat (Requires Auth)
- `GET /api/chats/:id` - Get specific chat with history (Requires Auth)
- `POST /api/chats/:id/messages` - Send a message and get AI response (Requires Auth)
- `PATCH /api/chats/:id` - Update chat title/instruction (Requires Auth)
- `DELETE /api/chats/:id` - Delete a chat (Requires Auth)

## Project Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Auth and Error middlewares
├── models/         # Mongoose schemas
├── routes/         # API routes and Swagger docs
├── services/       # External services (Gemini)
└── index.js        # Entry point
```

## License

ISC
