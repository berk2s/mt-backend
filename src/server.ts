import '@config/env.config'
import starter from '@app/app'

/**
 * Starts application with defined port in the env file
 */
starter.app.listen(process.env.PORT, () => {
  console.log('Server is available! at ' + process.env.PORT)
})

process.on('uncaughtException', (err) => {
  try {
    console.log('Handled an uncaughtException:', err)
  } catch (err) {
    console.log(err)
  }
})
