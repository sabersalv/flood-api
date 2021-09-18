import createRequest from './createRequest'
import endpointMethods from './endpointMethods'
import fetchWrapper from './fetchWrapper'

export default class Api {
  constructor(options = {}) {
    this.options = options
    const request = createRequest(
      fetchWrapper,
      this.constructor.middleware,
      this
    )
    this.request = request.defaults({
      baseUrl: options.baseUrl,
      request: options.request,
    })
    Object.assign(
      this,
      endpointMethods(this.request, this.constructor.endpoints)
    )
  }
}
