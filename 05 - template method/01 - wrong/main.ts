type NotificationRepositoryInput = {
	type: 'email' | 'sms';
	message: string;
	status: 'pending' | 'sent' | 'error';
	id?: string;
};

interface NotificationRepository {
	upsert(input: NotificationRepositoryInput): Promise<string>;
}

interface SendNotification {
	send(message: string): Promise<boolean>;
}

class EmailNotification implements SendNotification {
	constructor(private notificationRepository: NotificationRepository) {}

	async send(message: string): Promise<boolean> {
    const repositoryInput: NotificationRepositoryInput = {
      type: 'email',
      message,
      status: 'pending',
      id: undefined,
    };

		const id = await this.notificationRepository.upsert(repositoryInput);
    repositoryInput.id = id;

		try {
			// Send email like nodemailer or sendgrid
			await new Promise((resolve) => {
        console.log(`Email: ${message}`)
        resolve(null);
      });

      repositoryInput.status = 'sent';
      this.notificationRepository.upsert(repositoryInput);
		} catch (error) {
      repositoryInput.status = 'error';
      this.notificationRepository.upsert(repositoryInput);

      return false;
		}

		return true;
	}
}

class SMSNotification implements SendNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async send(message: string): Promise<boolean> {
    const repositoryInput: NotificationRepositoryInput = {
      type: 'sms',
      message,
      status: 'pending',
      id: undefined,
    };

    const id = await this.notificationRepository.upsert(repositoryInput);
    repositoryInput.id = id;

    try {
      // Send SMS like twilio or nexmo
      await new Promise((resolve) => {
        console.log(`SMS: ${message}`)
        resolve(null);
      });

      repositoryInput.status = 'sent';
      this.notificationRepository.upsert(repositoryInput);
    } catch (error) {
      repositoryInput.status = 'error';
      this.notificationRepository.upsert(repositoryInput);

      return false;
    }

    return true;
  }
}