import Joi from 'joi'

import validate from './validate_schema'

const schema = Joi.object().keys({
  name: Joi.string().required()
})

const validateReq = validate(schema)
const createCtx = (name = null) => ({
  request: {
    body: { name }
  }
})

describe('validate middleware', () => {
  it('should set ctx.body on invalid input', async () => {
    let ctx = createCtx()
    const nextMock = jest.fn()

    await validateReq(ctx, nextMock)

    const expectedContext = {
      status: 400,
      body: {
        info: 'Invalid input',
        details: [
          {
            context: {
              key: 'name',
              value: null
            },
            message: '"name" must be a string',
            path: 'name',
            type: 'string.base'
          }
        ]
      }
    }
    expect(ctx).toEqual(Object.assign(createCtx(), expectedContext))
    expect(nextMock).not.toBeCalled()
  })

  it('should call next when input is valid', async () => {
    let ctx = createCtx('chicocode.io')
    const nextMock = jest.fn()

    await validateReq(ctx, nextMock)

    expect(ctx.status).not.toBeDefined()
    expect(nextMock).toBeCalled()
  })
})
