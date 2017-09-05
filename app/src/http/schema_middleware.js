import Joi from 'joi'
const config = {abortEarly: false}

export default schema => async (ctx, next) => {
  let {error} = Joi.validate(ctx.request.body, schema, config)
  if (error) {
    ctx.status = 400
    ctx.body = {
      info: 'Invalid input',
      details: error.details
    }
    return
  }
  return next()
}