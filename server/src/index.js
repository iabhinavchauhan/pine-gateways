import app from './app.js'

const port = Number(process.env.PORT || 3001)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port number.')
}

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Pine Getaways API listening on 0.0.0.0:${port}`)
})

server.on('error', (error) => {
  console.error('Pine Getaways API failed to start:', error)
  process.exitCode = 1
})
