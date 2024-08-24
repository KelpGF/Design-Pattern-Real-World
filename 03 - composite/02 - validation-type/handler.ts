type InsertUserUseCaseInput = {
  name: string;
  email: string;
};

interface InsertUserUseCase {
  execute(user: InsertUserUseCaseInput): Promise<void>;
}
class Handler {
  constructor(
    private useCase: InsertUserUseCase,
    private nameRequiredValidation: Validation,
    private nameMinLengthValidation: Validation,
    private emailRequiredValidation: Validation,
    private emailRegexValidation: Validation,
  ) {}

  async handle(body: any) {
    const nameValidation = this.nameRequiredValidation.validate(body);
    if (nameValidation) {
      throw nameValidation;
    }

    const nameMinLengthValidation = this.nameMinLengthValidation.validate(body);
    if (nameMinLengthValidation) {
      throw nameMinLengthValidation;
    }

    const emailRequiredValidation = this.emailRequiredValidation.validate(body);
    if (emailRequiredValidation) {
      throw emailRequiredValidation;
    }

    const emailRegexValidation = this.emailRegexValidation.validate(body);
    if (emailRegexValidation) {
      throw emailRegexValidation;
    }

    const insertUserDTO = {
      name: body.name,
      email: body.email,
    };

    await this.useCase.execute(insertUserDTO);
  }
}