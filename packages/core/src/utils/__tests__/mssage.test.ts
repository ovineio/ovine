import { uniqueId, times, uniq } from 'lodash'

import * as message from '../message'

const mockMsgData = { hello: 'world' }
const waitTime = 50

const asyncExpect = (time?: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time || waitTime)
  })

describe('test message event mechanism.', () => {
  test('with single message', (done) => {
    const msgKey = uniqueId()
    message.subscribe(msgKey, (data) => {
      expect(data).toMatchObject(mockMsgData)
      done()
    })
    message.publish(msgKey, mockMsgData)
  })

  test('never receive msg', () => {
    const msgKey = uniqueId()

    // if you publish msg before you subscribe it, you should not receive msg.
    message.publish(msgKey, mockMsgData)

    message.subscribe(msgKey, () => {
      throw new Error('oh my god! It should never receive this msg. Check your code.')
    })

    // if you published msgKey do not match the key you subscribed, you should not receive msg.
    message.publish(`${msgKey}WrongKey`, mockMsgData)

    // wait for result within two seconds.
    return asyncExpect()
  })

  test('with message array', () => {
    const msgKeys = times(3, () => uniqueId())
    const receiveKeys: string[] = []

    message.subscribe(msgKeys, (_, key) => {
      receiveKeys.push(key)
    })

    message.publish(msgKeys, mockMsgData) // publish all msgs in array
    msgKeys.forEach((msgKey) => message.publish(msgKey, mockMsgData))

    return asyncExpect().then(() => {
      expect(receiveKeys.length).toBe(6)
      expect(uniq(receiveKeys).length).toBe(3)
    })
  })

  test('unsubscribe message with returned value', () => {
    const msgKey = uniqueId()
    const handler = jest.fn()

    const { unsubscribe } = message.subscribe(msgKey, handler)

    message.publish(msgKey, mockMsgData)
    unsubscribe()
    message.publish(msgKey, mockMsgData)

    return asyncExpect().then(() => {
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  test('unsubscribe message with "unsubscribe" api', () => {
    const msgKey = uniqueId()
    const handler = jest.fn()
    const extraHandler = jest.fn()
    const spacialHandler = jest.fn()

    // subscribe one key with different handlers
    message.subscribe(msgKey, handler)
    message.subscribe(msgKey, spacialHandler)
    message.subscribe(msgKey, extraHandler)

    // should fire two handles
    message.publish(msgKey, mockMsgData)

    // only unsubscribe msgKey with "spacialHandler"
    message.unsubscribe(msgKey, spacialHandler)

    // handler,extraHandler still works.
    message.publish(msgKey, mockMsgData)

    // remove all msgKey subscribers
    message.unsubscribe(msgKey)

    // do not fire any handler
    message.publish(msgKey, mockMsgData)

    return asyncExpect().then(() => {
      expect(spacialHandler).toHaveBeenCalledTimes(1)
      expect(handler).toHaveBeenCalledTimes(2)
      expect(extraHandler).toHaveBeenCalledTimes(2)
    })
  })

  test('subscribe message only once', () => {
    const msgKey = uniqueId()
    const handler = jest.fn()

    // handle only once
    message.subscribeOnce(msgKey, handler)

    // publish three times
    times(3, () => message.publish(msgKey, mockMsgData))

    return asyncExpect().then(() => {
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  test('observe store message key', () => {
    const observeKey = `$store/${uniqueId()}`
    const handler = jest.fn()
    const count = 3

    message.subscribe(observeKey, handler)

    times(count, (i) => {
      // it's the same with invoke "message.publish(observeKey, i)"
      message.observeStore[observeKey] = i
    })

    return asyncExpect().then(() => {
      times(count, (i) => {
        expect(handler).toHaveBeenCalledWith(i, observeKey)
      })
    })
  })
})
