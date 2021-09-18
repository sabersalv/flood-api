import { isPlainObject } from 'is-plain-object'

export default async function fetchWrapper(options) {
  if (isPlainObject(options.body) || Array.isArray(options.body)) {
    options.body = JSON.stringify(options.body)
  }

  const response = await fetch(options.url, {
    method: options.method,
    body: options.body,
    headers: options.headers,
    redirect: options.redirect,
    ...options.request,
  })

  const headers = Object.fromEntries(response.headers.entries())

  let data
  const contentType = headers['content-type']
  if (/application\/json/.test(contentType)) {
    // Foold returns empty response
    // data = await response.json()
    data = await response.text()
    if (data === '') {
      data = {}
    } else {
      data = JSON.parse(data)
    }
  } else if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    data = await response.text()
  } else {
    data = await response.arrayBuffer()
  }

  return {
    status: response.status,
    url: response.url,
    headers,
    data,
  }
}
