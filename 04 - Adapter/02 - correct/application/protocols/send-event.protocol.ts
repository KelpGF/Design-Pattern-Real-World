// PORT
interface SendEventProtocol {
  send(event: string): Promise<void>;
}