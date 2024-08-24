// used to test in terminal: npx ts-node 03\ -\ composite/03\ -\ validation-composite/onefile.ts

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

interface Validation {
  validate(body: any): null | Error;
}

class IsRequiredValidation implements Validation {
  constructor(private field: string) {}

  validate(body: any): null | Error {
    if (!body[this.field]) {
      return new Error(`${this.field} is required`);
    }

    return null;
  }
}

class MinLengthValidation implements Validation {
  constructor(private field: string, private minLength: number) {}

  private get errorMessage() {
    return `${this.field} must have at least ${this.minLength} characters`;
  }

  validate(body: any): null | Error {
    if (body[this.field].length < this.minLength) {
      return new Error(this.errorMessage);
    }

    return null;
  }
}

class RegexMatchValidation implements Validation {
  constructor(private field: string, private regex: RegExp) {}

  validate(body: any): null | Error {
    if (this.regex.test(body[this.field]) === null) {
      return new Error(`${this.field} is invalid`);
    }

    return null;
  }
}

class ValidationComposite implements Validation {
  constructor(private validations: Validation[]) {}

  validate(body: any): null | Error {
    for (const validation of this.validations) {
      const error = validation.validate(body);
      if (error) {
        return error;
      }
    }

    return null;
  }
}

const nameIsRequired = new IsRequiredValidation('name')
const nameMinLength = new MinLengthValidation('name', 5)
const nameValidation = new ValidationComposite(
  [nameIsRequired, nameMinLength]
)

const emailIsRequired = new IsRequiredValidation('email')
const emailRegexMatch = new RegexMatchValidation('email', /.+@.+/)
const emailValidation = new ValidationComposite(
  [emailIsRequired, emailRegexMatch]
)

const userDTOValidation = new ValidationComposite(
  [nameValidation, emailValidation]
)

const usecase = new InsertUserUseCaseImpl()
const controller = new Handler(
  usecase,
  userDTOValidation
)

const body1 = {
  name: 'Joh',
  email: ''
}
const body2 = {
  name: 'John Doe',
  email: ''
}

controller.handle(body1).catch(err => console.error(err.message))
controller.handle(body2).catch(err => console.error(err.message))