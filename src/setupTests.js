// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// mock matchMedia for mc-components
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
}

// suppress React warnings from third-party libraries (mc-components)
const originalError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: Received `true` for a non-boolean attribute') ||
     args[0].includes('for a non-boolean attribute'))
  ) {
    return
  }
  originalError.call(console, ...args)
}
