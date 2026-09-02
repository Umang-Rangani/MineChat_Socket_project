// ! 2. Socket.IO setup function

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Send previous messages to the newly connected user
    Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .then((messages) => {
        // Reverse so oldest message appears first
        messages.reverse()

        socket.emit('previousMessages', messages)
      })
      .catch((error) => {
        console.error('Error fetching previous messages:', error)
      })

    // Listen for new messages
    socket.on('chatMessage', async (data) => {
      try {
        const msg = new Message({
          username: data.username,
          message: data.message,
        })

        await msg.save()

        // Send the new message to all connected clients
        io.emit('chatMessage', msg)
      } catch (error) {
        console.error('Error saving message:', error)

        socket.emit('messageError', {
          message: 'Failed to save message',
        })
      }
    })

    // User disconnected
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}


// ! 3. Expose Socket.IO setup function
app.setupSocket = setupSocket

