import {
  generateEventTargetSelector,
  isEventTarget,
  resolveEventTargetSelector,
} from '../src/util';

test('is an object an event target, an element', () => {
  expect(isEventTarget(window)).toBe(true);
  expect(isEventTarget(document)).toBe(true);
  expect(isEventTarget(document.body)).toBe(true);
  expect(isEventTarget({ fruit: 'banana' })).toBe(false);
});

test('query using an extended/custom selector for event targets', () => {
  expect(resolveEventTargetSelector('@window')).toContain(window);
  expect(resolveEventTargetSelector('@document')).toContain(document);
  expect(resolveEventTargetSelector('body')).toContain(document.body);
});

test('generate an extended/custom selector for event targets', () => {
  expect(generateEventTargetSelector(window)).toBe('@window');
  expect(generateEventTargetSelector(document)).toBe('@document');
  expect(generateEventTargetSelector(document.body)).toBe('body');
});
