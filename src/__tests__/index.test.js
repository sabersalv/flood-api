import Api from '../index'

const api = new Api({
  baseUrl: process.env.FLOOD_URL,
  username: process.env.FLOOD_USERNAME,
  password: process.env.FLOOD_PASSWORD,
})

const USER = {
  level: 10,
  username: process.env.FLOOD_USERNAME,
}

describe('auth', () => {
  test('authenticate', async () => {
    expect(
      await api.auth.authenticate({
        username: process.env.FLOOD_USERNAME,
        password: process.env.FLOOD_PASSWORD,
      })
    ).toMatchObject({ success: true })
  })

  test('authenticate failed', async () => {
    try {
      await api.auth.authenticate({
        username: 'wrong',
        password: 'wrong',
      })
    } catch (err) {
      expect(err.message).toMatch(/Failed login/)
      expect({ ...err }).toEqual({
        status: 401,
      })
    }
  })

  test('verify', async () => {
    expect(await api.auth.verify()).toMatchObject({
      username: 'test',
    })
  })

  test('listUsers', async () => {
    expect(await api.auth.listUsers()).toContainEqual(USER)
  })
})

describe('client', () => {
  test('connectionTest', async () => {
    expect(await api.client.connectionTest()).toEqual({
      isConnected: true,
    })
  })

  test('getSettings', async () => {
    expect(await api.client.getSettings()).toMatchObject({ dht: true })
  })

  test('updateSettings', async () => {
    expect(
      await api.client.updateSettings({
        throttleGlobalUpSpeed: 1024 * 1024,
      })
    ).toEqual({})
  })
})

describe('feedMonitor', () => {
  const feed = {
    label: 'feed1',
    url: 'https://flood-api.netlify.app/rss.xml',
    interval: 1,
  }
  let addedFeed

  test('addFeed', async () => {
    addedFeed = await api.feedMonitor.addFeed({ data: feed })
    expect(addedFeed).toMatchObject(feed)
  })

  test('updateFeed', async () => {
    expect(
      await api.feedMonitor.updateFeed({ id: addedFeed._id, label: 'feed2' })
    ).toEqual({})
  })

  test('listFeedItems', async () => {
    expect(await api.feedMonitor.listFeedItems({ id: addedFeed._id })).toEqual(
      []
    )
  })

  test('remove', async () => {
    expect(await api.feedMonitor.delete({ id: addedFeed._id })).toEqual({})
  })

  test('list', async () => {
    expect(await api.feedMonitor.list()).toMatchObject({
      feeds: expect.any(Array),
      rules: expect.any(Array),
    })
  })
})

describe('torrents', () => {
  test('list', async () => {
    expect(await api.torrents.list()).toMatchObject({})
  })
})
