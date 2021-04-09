export default function endpointMethods(request, endpointsMap) {
  const methods = {}
  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    methods[scope] = {}
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults] = endpoint
      const [method, url] = route.split(/ /)
      methods[scope][methodName] = request.defaults({
        method,
        url,
        ...defaults,
      })
    }
  }
  return methods
}
