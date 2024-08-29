// Kafka Implementation
class KafkaProducerAdapter implements SendEventProtocol {
  private producer: KafkaProducer;
  private topic = 'events';

  constructor() {
    this.producer = new KafkaProducer();
  }

  async send(message: string): Promise<void> {
    await this.producer.send(this.topic, message);
  }
}