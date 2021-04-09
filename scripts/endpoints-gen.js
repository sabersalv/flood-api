const fs = require('fs')
const SwaggerParser = require('swagger-parser')
const { set } = require('lodash')

const METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]
const [input, output] = process.argv.slice(2)

async function main(file) {
  const spec = await SwaggerParser.validate(file)
  // { posts: { get: ['GET /posts/{id}'] } }
  const result = {}
  // { path: '/posts/{id}', method: 'get', operation: { operationId: 'posts.get' } }
  for (const [path, operations] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      if (!METHODS.includes(method)) {
        continue
      }
      const methodName = method.toUpperCase()
      set(result, operation.operationId, [`${methodName} ${path}`])
    }
  }
  const data = JSON.stringify(result, null, 2)
  fs.writeFileSync(output, data)
}

main(input)
