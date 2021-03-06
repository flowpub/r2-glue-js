import { Callback, CallSource, marshalEvent, EventListenerService } from '@readium/glue-shared';

import { KeyHandlingMessage, IAddKeyListenerOptions, KeyEventType } from './interface';

const KEYBOARD_EVENT_PROPERTIES = [
  'key',
  'code',
  'location',
  'ctrlKey',
  'shiftKey',
  'altKey',
  'metaKey',
  'isComposing',
];

export class KeyHandling extends EventListenerService {
  constructor(messageSource: CallSource) {
    super(messageSource);

    messageSource.bind(KeyHandlingMessage.AddKeyEventListener, this._addKeyEventListener);
    messageSource.bind(KeyHandlingMessage.RemoveKeyEventListener, this._removeKeyEventListener);
  }

  private async _addKeyEventListener(
    callback: Callback,
    eventType: KeyEventType,
    options: IAddKeyListenerOptions = {},
  ): Promise<number> {
    const peekedId = this.peekId();
    const keyboardEventHandler = (event: Event) => {
      if (event.defaultPrevented) {
        // Skip if event is already handled
        return;
      }

      if (eventType !== event.type) {
        return;
      }

      if (options.preventDefault) {
        event.preventDefault();
      }

      if (options.once) {
        this.removeEventListeners(peekedId);
      }

      callback(marshalEvent(event, KEYBOARD_EVENT_PROPERTIES));
    };
    const target = options.target || '@window';
    return this.registerListenerForTargets(target, eventType, keyboardEventHandler);
  }

  private async _removeKeyEventListener(callback: Callback, id: number): Promise<void> {
    this.removeEventListeners(id);
  }
}
