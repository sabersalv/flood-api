let cookie = ''

export default async function middleware(request, options, api) {
  // auth
  options.headers.cookie = cookie

  let response = await request(options)

  // save cookie from auth request
  if (options.url === '/auth/authenticate' && response.status === 200) {
    cookie = response.headers['set-cookie']
  }

  // do automatical auth
  if (options.url !== '/auth/authenticate' && response.status === 401) {
    const authRes = await request('POST /auth/authenticate', {
      username: api.options.username,
      password: api.options.password,
    })
    if (authRes.status !== 200) {
      throw new Error(authRes.data.message)
    }
    cookie = authRes.headers['set-cookie']
    options.headers.cookie = cookie
    response = await request(options)
  }

  const { status, data } = response
  if (status >= 400) {
    // 429, text response
    const message = typeof data === 'string' ? data : data.message
    const err = new Error(`${message}; ${response.url}`)
    Object.assign(err, {
      url: response.url,
      status,
      data,
    })
    throw err
  }

  // hack
  if (options.url === '/auth/authenticate') {
    data.token = response.headers['set-cookie'].match(/jwt=([^;]+)/)[1]
  }

  return data
}
