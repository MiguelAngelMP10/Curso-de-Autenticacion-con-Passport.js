const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

class UsersServices {
  constructor() {
    this.colletions = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    const [user] = await this.mongoDB.getAll(this.colletions, { email });
    return user;
  }

  async createUser({ user }) {
    const { name, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await this.mongoDB.create(this.colletions, {
      name,
      email,
      password: hashedPassword,
    });

    return createUserId;
  }
}

module.exports = UsersServices;
