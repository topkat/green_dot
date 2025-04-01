


import { svc, _ } from 'green_dot'


export const errorSimulator = svc({
  for: 'public',
  input: {
    errorCode: _.enum([400, 502, 503, 500, 422, 403, 409, 429, 418]).default(500)
  },
  forEnv: ['development', 'test'],
  async main(ctx, { errorCode }) {
    ctx.error.serverError('simulateError', { code: errorCode, notifyAdmins: false })
  },
})