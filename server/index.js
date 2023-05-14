import server from './server.js'
import logger from './utils/logger.js';
import { mongooseConnect } from './config/mongoose.js'
import { gracefulShutdown } from './utils/gracefulShutdown.js'
import {
  PORT,
  NODE_ENV,
  MONGO_DEVELOPMENT_URI,
  MONGO_PRODUCTION_URI,
} from './config/constants.js'


// Start server
const app = server.listen(PORT, () => {
  logger.info('connected to 8080')
})

if (NODE_ENV === 'development') {
  mongooseConnect(MONGO_DEVELOPMENT_URI)
}

if (NODE_ENV === 'production') {
  mongooseConnect(MONGO_PRODUCTION_URI)
  gracefulShutdown(app)
}

export default app
