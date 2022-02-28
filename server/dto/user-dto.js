class UserDto {
  email
  id
  isActivated

  constructor (model) {
    this.email = model.email
    this.isActivated = model.isActivated
    this.id = model._id
  }
}

module.exports = UserDto