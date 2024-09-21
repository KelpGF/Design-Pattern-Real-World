type NotificationRepositoryInput = {
	type: 'email' | 'sms';
	message: string;
	status: 'pending' | 'sent' | 'error';
	id?: string;
};

interface NotificationRepository {
	upsert(input: NotificationRepositoryInput): Promise<string>;
}

class NotificationRepositoryImpl implements NotificationRepository {
  async upsert(input: NotificationRepositoryInput): Promise<string> {
    console.log('Upserting notification', input);

    return 'id';
  }
}

interface SendNotification {
	send(message: string): Promise<boolean>;
}

abstract class NotificationTemplateAbstract {
	constructor(private notificationRepository: NotificationRepository) {}

	abstract get notificationType(): 'email' | 'sms';
	abstract sendNotification(message: string): Promise<void>;

	async send(message: string): Promise<boolean> {
    const repositoryInput: NotificationRepositoryInput = {
      type: this.notificationType,
      message,
      status: 'pending',
      id: undefined,
    };

		const id = await this.notificationRepository.upsert(repositoryInput);
    repositoryInput.id = id;

		try {
			await this.sendNotification(message);

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

class EmailNotification extends NotificationTemplateAbstract {
  get notificationType(): 'email' {
    return 'email';
  }

  async sendNotification(message: string): Promise<void> {
    console.log(`Email: ${message}`);

    if (message === 'error') {
      throw new Error('Error sending email');
    }
  }
}

class SMSNotification extends NotificationTemplateAbstract {
  get notificationType(): 'sms' {
    return 'sms';
  }

  async sendNotification(message: string): Promise<void> {
    console.log(`SMS: ${message}`);

    if (message === 'error') {
      throw new Error('Error sending SMS');
    }
  }
}

const notificationRepository = new NotificationRepositoryImpl();
const emailNotification = new EmailNotification(notificationRepository);
const smsNotification = new SMSNotification(notificationRepository);

async function main() {
  await emailNotification.send('Hello');
  console.log('---');
  await smsNotification.send('Hello');
  console.log('---');
  await emailNotification.send('error');
  console.log('---');
  await smsNotification.send('error');
}

main();
