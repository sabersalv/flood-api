# Flood API

[Documentation](https://flood-api.netlify.app/)

API Wrapper for [jesec/flood](https://github.com/jesec/flood)

## Usage

```shell
yarn add flood-api
```

```javascript
import Api from 'flood-api'

const api = new Api({
  baseUrl: 'http://localhost:3000/api',
  username: 'user',
  password: 'pass',
})
await api.client.connectionTest()
//-> { status, url, headers, data }
```
