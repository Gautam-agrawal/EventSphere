require('node:tls').DEFAULT_MIN_VERSION = 'TLSv1.2'

const app = require('./app')
const config = require('./config/config')
const { infoLogger } = require('./logger/logger')

app.listen(config.port, () => {
    infoLogger(undefined, undefined, `API server has started on port ${config.port}`)
})