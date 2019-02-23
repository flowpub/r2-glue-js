import { Message, MessageType } from './message';
import { MessageInstance } from './messageInstance';

interface MessageEventWithData extends MessageEvent {
  readonly data: MessageInstance;
}

export type SendMessageFunction = (type: MessageType, name: string, parameters: any[]) => void;

export abstract class Controller {
  private readonly _onMessage: (event: MessageEventWithData) => void;

  protected constructor(namespace: string) {
    this._onMessage = (event) => {
      const request = event.data;

      if (!MessageInstance.validate(request) || request.namespace !== namespace) {
        return;
      }

      this.processMessage(request, (type: MessageType, name: string, parameters: any[]) => {
        if (!event.source) {
          return;
        }

        const sourceWindow = <Window>event.source;

        sourceWindow.postMessage(
          new MessageInstance(namespace, type, name, parameters, request.correlationId),
          event.origin,
        );
      });
    };
    window.addEventListener('message', this._onMessage);
  }

  protected abstract processMessage(message: Message, sendMessage: SendMessageFunction): void;

  protected destroy(): void {
    window.removeEventListener('message', this._onMessage);
  }
}
