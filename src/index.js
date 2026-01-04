const express = require('express')
const dotenv = require('dotenv')
const dns = require('dns')

// Force use Google DNS to avoid ETIMEOUT issues with MongoDB SRV
dns.setServers(['8.8.8.8', '8.8.4.4'])

const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const chatRoutes = require('./routes/chatRoutes')
const errorHandler = require('./middleware/errorHandler')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Chat API',
      version: '1.0.0',
      description: 'API for AI chat application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/chats', chatRoutes)

// Error Handler
app.use(errorHandler)

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
