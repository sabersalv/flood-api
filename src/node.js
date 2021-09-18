import { EventSource } from 'event-source-polyfill'

globalThis.EventSource = EventSource

export { default } from './index'
