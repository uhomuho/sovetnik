const express = require('express')
const forceSsl = require('force-ssl-heroku')
const history = require('connect-history-api-fallback')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()

app.use(forceSsl)

app.use(
  history({
    // OPTIONAL: Includes more verbose logging
    verbose: true
  })
)


app.use(serveStatic(path.join(__dirname, '/dist')))

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port)
})
