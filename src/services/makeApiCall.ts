
import axios, { AxiosError } from 'axios'


const apiCall = axios.create({ method: 'get' })

type ApiCallConfig = Partial<{
  errorHandling: 'throw' | 'log'
  body: Record<string, any>
}> & Parameters<typeof apiCall>[1]

export async function makeApiCall(ctx: Ctx, url: string, config?: ApiCallConfig) {

  const { errorHandling = 'throw', body, data: dta, ...axiosConf } = config || {}

  try {
    const { data } = await apiCall({
      url,
      data: body || dta,
      ...axiosConf,
    })
    return data
  } catch (err) {
    const axiosErr: AxiosError<any> = err




    const errMsg = err.response?.statusText
    const responseData = axiosErr.response?.data
    const respStatus = axiosErr.response?.status

    const err2 = ctx.error.applicationError(errMsg, {
      err,
      code: respStatus || 500,
      responseData,
    })

    if (errorHandling === 'throw') throw err2
    else return err2

  }
}