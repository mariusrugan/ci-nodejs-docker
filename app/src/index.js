import app from './app'

let port = process.env.PORT || 8080
app.listen(port, () => {
  console.info(`Running application on port ${port}`) //eslint-disable-line
})
