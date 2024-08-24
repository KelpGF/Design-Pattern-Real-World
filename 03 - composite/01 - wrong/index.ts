type InsertUserUseCaseInput = {
  name: string;
  email: string;
};

interface InsertUserUseCase {
  execute(user: InsertUserUseCaseInput): Promise<void>;
}

class Handler {
  constructor(private useCase: InsertUserUseCase) {}

  async handle(body: any) {
    if (!body.name) {
      throw new Error('Name is required');
    }

    if (body.name.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    if (!body.email) {
      throw new Error('Email is required');
    }

    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(body.email) === null) {
      throw new Error('Email is invalid');
    }

    const insertUserDTO = {
      name: body.name,
      email: body.email,
    };

    await this.useCase.execute(insertUserDTO);
  }
}