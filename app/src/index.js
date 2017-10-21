import app from './app'

let port = process.env.PORT || 8081
app.listen(port, () => {
  console.info(`Running application at port ${port}`) //eslint-disable-line
})
