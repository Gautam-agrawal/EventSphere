const express = require('express');
const app = express();
const {infoLogger} = require('./logger/logger')
const config = require('./config/config');
const bodyParser = require('body-parser');
const {v4} = require('uuid')
const routeVersioning = require('./src/index');
const errors = require('./errors/errors');
const { default: mongoose } = require('mongoose');

app.use(express.raw({ type: 'application/json', limit: '100mb', inflate: true, strict: true }));

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    const contentType = req.get('content-type');
    if (!contentType || contentType != 'application/json'){
        return res.status(400).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId || v4(),
            info: {
                code: errors['004'].code,
                message: 'Invalid content type' || errors['004'].message,
                displayText: errors['004'].displayText
            },
        })
    }
    next();
})

app.use('/api', (req, res, next) => {
    req.custom = {id: v4()}
    next();
}, routeVersioning)

app.use((err, req, res, next) => {
    if (err){
        console.log(err)
        return res.status(400).json({
            statusCode: 1,
            timestamp: Date.now(),
            requestId: req.body.requestId || v4(),
            info: {
                code: errors['004'].code,
                message: err.message || errors['004'].message,
                displayText: errors['004'].displayText
            },
        })
    }
})

module.exports.app = (event, context, callback) => {
  const serverless = require('serverless-http');
  const server = serverless(app);
  server(event, context, callback);
};

mongoose.connect(config.dbConnectionString, {
    ssl: true,
    tlsCertificateKeyFile: config.dbSslCertPath,
    authMechanism: 'MONGODB-X509',
    authSource: '$external'
})

module.exports = app;