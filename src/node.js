import fetch from 'node-fetch'
import { EventSource } from 'event-source-polyfill'

globalThis.fetch = fetch
globalThis.EventSource = EventSource

export { default } from './index'
