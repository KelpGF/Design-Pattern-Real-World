type InsertUserUseCaseInput = {
  name: string;
  email: string;
};

interface InsertUserUseCase {
  execute(user: InsertUserUseCaseInput): Promise<void>;
}

class InsertUserUseCaseImpl implements InsertUserUseCase {
  async execute(user: InsertUserUseCaseInput) {
    console.log('User inserted');
  }
}

class Handler {
  constructor(
    private useCase: InsertUserUseCase,
    private useCaseDTOValidation: Validation,
  ) {}

  async handle(body: any) {
    const bodyHasError = this.useCaseDTOValidation.validate(body);
    if (bodyHasError) {
      throw bodyHasError;
    }

    const insertUserDTO = {
      name: body.name,
      email: body.email,
    };

    await this.useCase.execute(insertUserDTO);
  }
}