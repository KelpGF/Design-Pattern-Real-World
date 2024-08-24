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