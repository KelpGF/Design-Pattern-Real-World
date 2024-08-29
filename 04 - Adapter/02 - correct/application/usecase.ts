// Services/Usecase
class UseCase {
  constructor(private sendEvent: SendEventProtocol) {}

  async execute(message: string) {
    // business logic
    await this.sendEvent.send(message);
  }
}