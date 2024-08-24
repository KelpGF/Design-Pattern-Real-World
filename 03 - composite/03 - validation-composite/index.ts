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

const body = {
  name: 'John Doe',
  email: ''
}

controller.handle(body)
  .then(() => console.log('User inserted'))
  .catch(err => console.error(err.message))