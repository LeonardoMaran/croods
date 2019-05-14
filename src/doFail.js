import { responseLogger } from './logger'
import defaultParseError from './parseError'

export default (
  path,
  method,
  {
    after4xx,
    after5xx,
    afterFailure,
    afterResponse,
    debugRequests,
    parseError,
  },
) => error => {
  debugRequests && responseLogger(path, method, error)

  if (error.response && error.response.status) {
    const { status, statusMessage, data } = error.response
    const is4xx = status >= 400 && status < 500
    const is5xx = status >= 500 && status < 600
    is4xx && after4xx && after4xx(status, statusMessage, data)
    is5xx && after5xx && after5xx(status, statusMessage, data)
  }

  afterFailure && afterFailure(error)
  afterResponse && afterResponse(error)

  return (parseError || defaultParseError)(error)
}
