import Base from './Api'
import endpoints from './generated/endpoints'
import middleware from './middleware'

export default class Api extends Base {
  static endpoints = endpoints
  static middleware = middleware

  // historySnapshot = 'FIVE_MINUTE', 'THIRTY_MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'
  async activityStream({ historySnapshot = 'FIVE_MINUTE' } = {}) {
    const { token } = await this.auth.authenticate({
      username: this.options.username,
      password: this.options.password,
    })
    const cookie = `jwt=${token}`
    const url = `${this.options.baseUrl}/activity-stream?historySnapshot=${historySnapshot}`
    return new EventSource(url, { headers: { cookie } })
  }
}
