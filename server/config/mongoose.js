import mongoose from 'mongoose'
import logger from '../utils/logger.js';


function mongooseConnect(mongoUri) {
  mongoose.set('strictQuery', false)
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info('mongoDB connected'))
    .catch(logger.error)

  mongoose.connection.on('disconnected', () => {
    logger.error('mongoDB disconnected')
  })
}

function mongooseDisconnect() {
  mongoose.connection
    .close()
    .then(() => logger.warn('mongoDB disconnected'))
    .catch(logger.error)
}

export {mongooseConnect, mongooseDisconnect}
