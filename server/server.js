import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoose from 'mongoose'
import Joi from 'joi'

import campaignsRoute from './routes/campaigns.js'
import rewardsRoute from './routes/rewards.js'
import { shutdownMiddleware } from './utils/gracefulShutdown.js'
import { NODE_ENV } from './config/constants.js'

const server = express()

// Middlewares
server.use(shutdownMiddleware) // take no requests when shutting down
server.use(helmet())
server.use(cors({ origin: 'http://localhost:5173', credentials: true }))
server.use(express.urlencoded({ extended: true }))
server.use(express.json({ limit: '10mb' }))
server.use(compression())

// Routes
server.get('/', (req, res) => {
  res.send('hello')
})
server.use('/api/v1/campaigns', campaignsRoute)
server.use('/api/v1/rewards', rewardsRoute)

server.use((req, res) => {
  res.status(404).send('404: not found')
})


server.use((error, req, res, next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    error.message = Object.values(error.errors).map(err => err.message)
    error.status = 400
  }
  if (
    error.code === 'INVALID_ARGUMENT' ||
    error.code === 'MISSING_ARGUMENT' ||
    error.code === 'UNEXPECTED_ARGUMENT' ||
    error.code === 'INVALID_ADDRESS'
  ) {
    error.status = 400
  }
  if (error instanceof mongoose.Error.CastError) {
    error.status = 400
  }
  if (error instanceof Joi.ValidationError) {
    error.message = error.details.map(detail => detail.message)
    error.status = 400
  }
  if (error.code === 'QuotaExceeded') {
    error.status = 429
  }
  if (error.code === 11000 && error.name === 'MongoServerError') {
    error.message = 'Database duplicate key error'
    error.status = 409
  }
  if (error.code === 'ConnectionTimeout') {
    error.status = 503
  }

  // console.log(error)
  const status = error.status ?? 500
  const message = error.message ?? 'something went wrong'
  const stack = NODE_ENV === 'development' ? error.stack: undefined
  return res.status(error.status).json({
    success: false,
    status,
    message,
    stack
  })
})

export default server
