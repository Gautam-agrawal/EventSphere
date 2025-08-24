require('node:tls').DEFAULT_MIN_VERSION = 'TLSv1.2'

const app = require('./app')

app.listen(process.env.PORT || 4000, async () => {
    console.log(`Server started on port: ${process.env.PORT || 4000}`)
})