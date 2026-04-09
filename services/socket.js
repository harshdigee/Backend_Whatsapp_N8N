const { Server } = require('socket.io')

let io = null

/**
 * Initialize Socket.io with the HTTP server.
 * @param {import('http').Server} httpServer
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true)
        const allowedOrigins = [
          process.env.FRONTEND_URL || 'http://localhost:5173',
          'http://localhost:5173',
          'http://localhost:3000',
        ]
        if (allowedOrigins.includes(origin)) return callback(null, true)
        if (origin.endsWith('.vercel.app')) return callback(null, true)
        if (origin.endsWith('.ngrok-free.app') || origin.endsWith('.ngrok.io')) return callback(null, true)
        callback(new Error(`Socket.io CORS: origin ${origin} not allowed`))
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} — reason: ${reason}`)
    })
  })

  console.log('✅ Socket.io initialized')
  return io
}

/**
 * Get the active Socket.io instance.
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket() first.')
  }
  return io
}

/**
 * Emit a new_message event to all connected clients.
 * @param {object} message
 */
function emitNewMessage(message) {
  getIO().emit('new_message', message)
}

/**
 * Emit a chat_updated event to all connected clients.
 * @param {object} chat
 */
function emitChatUpdated(chat) {
  getIO().emit('chat_updated', chat)
}

module.exports = { initSocket, getIO, emitNewMessage, emitChatUpdated }
