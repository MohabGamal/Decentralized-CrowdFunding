import winston from 'winston'
import dotenv from 'dotenv'
dotenv.config()

const { combine, timestamp, printf } = winston.format

// Define the log format
const productionLogFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const devLogFormat = printf(info => {
  return `${info.level}: ${info.message}`
})

let logger

if (process.env.NODE_ENV === 'development') {
  logger = winston.createLogger({
    level: 'info', // info and above types like warn, error, etc. will be logged
    format: combine(winston.format.colorize(), devLogFormat),
    transports: [
      new winston.transports.Console({}),
      new winston.transports.File({
        filename: 'logs.log',
        level: 'warn',
      }),
    ],
  })
} else if (process.env.NODE_ENV === 'production') {
  logger = winston.createLogger({
    level: 'warn', // warn and above types like error will be logged
    format: combine(
      timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      productionLogFormat,
    ),
    transports: [
      new winston.transports.File({
        filename: './logs/logs.log',
      }),
    ],
  })
}
export default logger
