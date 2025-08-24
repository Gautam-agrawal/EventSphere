const pino = require('pino');
const config = require('../config/config')

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: 'pid,hostname'
        }
    },
    level: config.logLevel
})

module.exports.infoLogger = function(id, requestId, message, data){
    const logString = `${id || ''} ${requestId || ''} ${message} ${data || ''}`.trim()
    logger.info(logString)
}

module.exports.debugLogger = function(id, requestId, message, data){
    const logString = `${id || ''} ${requestId || ''} ${message} ${data || ''}`.trim()
    logger.debug(logString)
}

module.exports.warningLogger = function(id, requestId, message, data){
    const logString = `${id || ''} ${requestId || ''} ${message} ${data || ''}`.trim()
    logger.warn(logString)
}

module.exports.errorLogger = function(id, requestId, message, error){
    const logString = `${id || ''} ${requestId || ''} ${message} ${error.message || ''} ${error}`.trim()
    logger.error(logString)
}

