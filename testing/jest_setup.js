import $ from 'jquery' // eslint-disable-line

global.$ = $
global.jQuery = $

global.console.warn = jest.fn() // ignore lib warning
