const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};
