class RabbitMQSendEventAdapter implements SendEventProtocol {
  private readonly channel: RabbitMQChannel
  constructor() {
    this.channel = new RabbitMQChannel();
  }

  async send(event: string): Promise<void> {
    await this.channel.send(event);
  }
}