'use strict'

const { EventEmitter } = require('events')
const { app, deprecate } = require('electron')
const { fromPartition, Session, Cookies, NetLog, Protocol } = process.electronBinding('session')
const { preventDefaultInSecureMode } = require('@electron/internal/browser/secure-mode')

// Public API.
Object.defineProperties(exports, {
  defaultSession: {
    enumerable: true,
    get () { return fromPartition('') }
  },
  fromPartition: {
    enumerable: true,
    value: fromPartition
  }
})

Object.setPrototypeOf(Session.prototype, EventEmitter.prototype)
Object.setPrototypeOf(Cookies.prototype, EventEmitter.prototype)

Session.prototype._init = function () {
  this.on('-will-download', (event, ...args) => {
    preventDefaultInSecureMode(this, event, 'will-download')
    this.emit('will-download', event, ...args)
  })

  app.emit('session-created', this)
}
