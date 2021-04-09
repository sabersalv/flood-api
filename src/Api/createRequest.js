import { endpoint as Endpoint } from '@octokit/endpoint'
import { getUserAgent } from 'universal-user-agent'

export default function createRequest(fetchWrapper, middleware, api) {
  const endpoint = Endpoint.defaults({
    method: 'GET',
    baseUrl: 'http://localhost',
    headers: {
      accept: 'application/json',
      'user-agent': getUserAgent(),
    },
  })

  function withDefaults(oldEndpoint1, options1) {
    const endpoint1 = oldEndpoint1.defaults(options1)

    const request2 = function (route2, options2) {
      const endpointOptions2 = endpoint1.merge(route2, options2)
      const request3 = (route3, options3) => {
        return fetchWrapper(endpoint1(route3, options3))
      }
      Object.assign(request3, {
        endpoint: endpoint1,
        defaults: withDefaults.bind(null, endpoint1),
      })
      return middleware(request3, endpointOptions2, api)
    }

    return Object.assign(request2, {
      defaults: withDefaults.bind(null, endpoint1),
    })
  }

  return withDefaults(endpoint)
}
