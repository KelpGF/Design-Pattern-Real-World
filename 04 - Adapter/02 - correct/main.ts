const kafkaProducerAdapter = new KafkaProducerAdapter();
const rabbitMQSendEventAdapter = new RabbitMQSendEventAdapter();

const usecase = new UseCase(kafkaProducerAdapter);
const usecase2 = new UseCase(rabbitMQSendEventAdapter);
