const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'What do we call you',
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: 'Please enter a valid email address',
      validate: {
        validator(validEmail) {
          return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})(\.[a-z]{2,6})?$/.test(
            validEmail
          );
        },
        message: 'Please enter a valid email address',
      },
    },
    thoughts: {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
    friends: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

const User = model('User', userSchema);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

module.exports = User;
