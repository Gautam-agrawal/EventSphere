require('node:tls').DEFAULT_MIN_VERSION = 'TLSv1.2'

const config = require('./config/config')
const app = require('./app')
const { infoLogger } = require('./logger/logger')

app.listen(config.port, () => {
    // mongoose.connect(config.dbConnectionString, {
    //     ssl: true,
    //     tlsCertificateKeyFile: config.dbSslCertPath,
    //     authMechanism: 'MONGODB-X509',
    //     authSource: '$external'
    // })
    infoLogger(undefined, undefined, `API server has started on port ${config.port}`)
})

