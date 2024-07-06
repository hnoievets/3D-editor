export class UserEntity {
  constructor({ id, firstName, lastName, email, passwordSalt, passwordHash }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.passwordSalt = passwordSalt;
  }

  toObject() {
    const user = { ...this };

    delete user.passwordHash;
    delete user.passwordSalt;

    return user;
  }
}
