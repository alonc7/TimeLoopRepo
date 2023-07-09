const db = require('../DB/DB');
// const argon2 = require('argon2');
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

class User {
    static collection = 'users';
    constructor(email, firstName, lastName, password, birthdate) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.birthdate = birthdate;
    };

    // GET list of all users.
    static async getAllUsers() {
        try {
            return await new db().FindAll(User.collection);

        } catch (error) {
            throw new error('Failed to retrieve users')
        }
    };
    // insert user into users collection. 
    static async createUser(user) {
        try {
            return await new db().Insert(User.collection, user);
        } catch (error) {
            throw new Error('Failed to create user');
        }
    };
    // get user by its email if exists
    static async findUserByEmail(email) {
        try {
            const query = { email };
            const users = await new db().FindAll(User.collection, query);
            if (users.length === 0) {
                return null; // User not found
            }
            return users[0]; // Return the first user found
        } catch (error) {
            throw new Error('Failed to find user');
        }
    };
    // login user according to email and pass if match.
    static async LoginUser(email, password) {
        const existingUser = await new db().FindAll('users', { email }); // finding the user withthe matching email.
        if (existingUser) { // if such is existed tjhen - 
            let existPass = await new db().FindAll('users', { password }); // 
            return existPass;
        }
        else {
            throw new error('User not exists.');
        }
    }
    // validate passwords recieve with exists .
    static async comparePassword(password, hashedPassword) {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new Error('Failed to compare passwords');
        }
    }
    // change current password with new one.
    static async changePassword(email, newPassword) {
        try {
          const user = await User.findUserByEmail(email);
          if (!user) {
            throw new Error('User not found.');
          }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          user.hashedPassword = hashedPassword; // setting password as new hashed password. or at least it should it .
          return user;
        } catch (error) {
          throw new Error('Failed to change password');
        }
      }
}

module.exports = User;
