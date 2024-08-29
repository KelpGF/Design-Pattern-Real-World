// usecase.ts wrong implementation

// implementing every message broker because
// we don't know which one we will use
class UseCase {
  execute(message: string) {
    // business logic
  }

  kafkaSendMessage(message: string) {
    // kafka logic
  }

  rabbitSendMessage(message: string) {
    // rabbit logic
  }
}