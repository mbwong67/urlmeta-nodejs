const express = require('express')
const getUrlMetadata = require('./urlmeta')

const port = 3000
const app = express()

app.get('/url-parser', async (req, res, next) => {
  const url = req.query.target
  if (!url) {
      return next(new Error("Target url is not specified"))
  }
  try {
    res.send(await getUrlMetadata(url))
  } catch (e) {
    next(e)
  }
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({'error': err.message})
})

app.listen(
  port,
  () => console.log(`Example app listening on port ${port}!`)
)
